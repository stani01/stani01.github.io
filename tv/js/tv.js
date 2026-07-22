(function () {
    'use strict';

    // TV Time GDPR export filenames we care about. Each user imports their own
    // export (a .zip downloaded from TV Time), so there is no shared data folder.
    var TVTIME_FILES = {
        userShows: 'user_tv_show_data.csv',
        followed: 'followed_tv_show.csv',
        latestSeenByShow: 'seen_episode_latest.csv'
    };

    var STORE_KEYS = {
        localOverrides: 'tvTrackerLocalOverridesV1',
        watchHistory: 'tvTrackerWatchHistoryV1',
        metadataCache: 'tvTrackerMetadataCacheV1',
        manualLinks: 'tvTrackerManualLinksV1',
        unfixableShows: 'tvTrackerUnfixableShowsV1',
        omdbApiKey: 'tvTrackerOmdbApiKey',
        sessionUser: 'tvTrackerSessionUserV1',
        customShows: 'tvTrackerCustomShowsV1',
        importedData: 'tvTrackerImportedDataV1',
        profileSettings: 'tvTrackerProfileSettingsV1',
        cloudSession: 'tvTrackerCloudSessionV1',
        sortPreference: 'tvTrackerSortPreference',
        filterPreference: 'tvTrackerFilterPreference',
        controlsCollapsed: 'tvTrackerControlsCollapsedV1',
        sectionCollapse: 'tvTrackerSectionCollapseV1',
        cloudSyncMeta: 'tvTrackerCloudSyncMetaV1',
        // Settings clock (scoped) + device-level stable id for cloud sync push.
        syncMeta: 'tvTrackerSyncMetaV1',
        syncDeviceId: 'tvTrackerSyncDeviceIdV1'
    };

    // Fallback per-episode length (minutes) used for the "Hours watched" estimate
    // when a show's metadata has no runtime yet.
    var DEFAULT_EPISODE_MINUTES = 40;
    var STALE_DAYS_THRESHOLD = 30;
    var WATCH_HISTORY_MAX = 800;

    var FALLBACK_POSTER = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(
        '<svg xmlns="http://www.w3.org/2000/svg" width="320" height="480" viewBox="0 0 320 480">'
        + '<rect width="320" height="480" fill="#d8e7ff"/>'
        + '<rect x="18" y="18" width="284" height="444" rx="20" fill="#f6f9ff" stroke="#aec5e6"/>'
        + '<text x="50%" y="48%" dominant-baseline="middle" text-anchor="middle" font-family="Segoe UI" font-size="20" fill="#486587">No Poster</text>'
        + '</svg>'
    );

    var state = {
        shows: [],
        filtered: [],
        overrides: {},
        watchHistory: [],
        metadataCache: {},
        manualLinks: {},
        unfixableShows: {},
        customShows: [],
        importedData: null,
        profileSettings: { useImportedData: true, debugMessages: false },
        metadataFetchQueue: [],
        episodeCache: {},
        activeFetches: 0,
        currentUser: '',
        currentEmail: '',
        modalShowId: '',
        modalRequestId: 0,
        modalEpisodes: [],
        modalOpenSeasons: null,
        upcomingTab: '',
        // Add-Show live search: debounce timer + a sequence counter so a slow
        // earlier response can't overwrite the results of a newer keystroke.
        addShowTimer: null,
        addShowSeq: 0,
        pendingConfirm: null,
        refreshMode: false,
        importMode: false,
        refreshTotal: 0,
        refreshDone: 0,
        loginInFlight: false,
        search: '',
        sortBy: 'recent',
        filterBy: 'all',
        controlsCollapsed: true,
        // Watch Next/Up-to-date/Paused expanded; the long lists start collapsed.
        collapsedSections: { watchnext: false, uptodate: false, history: true, stale: true, paused: false, completed: true },
        mobileGreetingDone: false,
        brokenPosters: {},
        cloud: {
            inFlight: false,
            timer: null,
            stuckDetectorTimer: null,
            pendingLocalChanges: false,
            forceFullPullOnce: false,
            startupRefreshDone: false,
            version: 0,
            token: '',
            retryAt: 0,
            lastErrorAt: 0,
            lastActivityAt: 0,
            lastRefreshSyncAt: 0,
            syncStartedAt: 0,
            applyingRemote: false
        }
    };

    // --- Persistent storage adapter ---------------------------------------
    // App logic stays synchronous while IndexedDB persists data in the
    // background; first run imports existing localStorage keys.
    var STORAGE_DB_NAME = 'tvTrackerStorageV1';
    var STORAGE_STORE_NAME = 'kv';
    var CLOUD_SYNC_BASE_PATH = resolveCloudSyncBasePath();
    var CLOUD_SYNC_READONLY = isLocalCloudReadOnlyMode();
    var CLOUD_SYNC_TIMEOUT_MS = 12000;
    var CLOUD_SYNC_RETRY_MS = 15000;
    var storageState = {
        mode: 'local', // 'idb' | 'local'
        db: null,
        cache: {}
    };

    function openStorageDb() {
        return new Promise(function (resolve, reject) {
            try {
                var req = indexedDB.open(STORAGE_DB_NAME, 1);
                req.onupgradeneeded = function (event) {
                    var db = event && event.target ? event.target.result : null;
                    if (!db) return;
                    if (!db.objectStoreNames.contains(STORAGE_STORE_NAME)) {
                        db.createObjectStore(STORAGE_STORE_NAME);
                    }
                };
                req.onsuccess = function () { resolve(req.result); };
                req.onerror = function () { reject(req.error || new Error('Failed to open IndexedDB')); };
            } catch (error) {
                reject(error);
            }
        });
    }

    function storageReadAllIdb() {
        if (!storageState.db) return Promise.resolve({});
        return new Promise(function (resolve, reject) {
            var out = {};
            try {
                var tx = storageState.db.transaction(STORAGE_STORE_NAME, 'readonly');
                var store = tx.objectStore(STORAGE_STORE_NAME);
                var req = store.openCursor();

                req.onsuccess = function (event) {
                    var cursor = event && event.target ? event.target.result : null;
                    if (!cursor) return;
                    var raw = cursor.value;
                    var val = (raw && typeof raw === 'object' && Object.prototype.hasOwnProperty.call(raw, 'value'))
                        ? raw.value
                        : raw;
                    out[String(cursor.key)] = String(val == null ? '' : val);
                    cursor.continue();
                };
                req.onerror = function () { reject(req.error || new Error('Failed to read IndexedDB')); };
                tx.oncomplete = function () { resolve(out); };
                tx.onerror = function () { reject(tx.error || new Error('IndexedDB transaction failed')); };
            } catch (error) {
                reject(error);
            }
        });
    }

    function storageWriteIdb(mode, key, value) {
        if (!storageState.db) return Promise.resolve();
        return new Promise(function (resolve, reject) {
            try {
                var tx = storageState.db.transaction(STORAGE_STORE_NAME, 'readwrite');
                var store = tx.objectStore(STORAGE_STORE_NAME);
                if (mode === 'delete') store.delete(key);
                else {
                    var keyPath = store.keyPath;
                    if (typeof keyPath === 'string' && keyPath) {
                        var row = {};
                        row[keyPath] = key;
                        row.value = String(value);
                        store.put(row);
                    } else {
                        store.put(String(value), key);
                    }
                }
                tx.oncomplete = function () { resolve(); };
                tx.onerror = function () { reject(tx.error || new Error('IndexedDB write failed')); };
            } catch (error) {
                reject(error);
            }
        });
    }

    function initSiteFooter() {
        // Footer/header injection lives in assets/js/site-common.js. Keep this
        // as a safe no-op so TV still boots if that script is unavailable.
        return;
    }

    var pwaUpdateUi = {
        reg: null,
        waiting: null,
        banner: null,
        reloadOnControllerChange: false
    };

    function isLocalHost() {
        var host = String(window.location.hostname || '').toLowerCase();
        return host === 'localhost' || host === '127.0.0.1' || host === '::1';
    }

    function isLocalCloudReadOnlyMode() {
        // On localhost we use cloud auth + pull for realistic testing, but we
        // never push test edits back to production cloud data.
        return isLocalHost();
    }

    function resolveCloudSyncBasePath() {
        if (isLocalHost()) {
            // Use local worker on localhost to avoid browser CORS limits.
            // Run it with `wrangler dev --remote` to use cloud accounts/data.
            return 'http://127.0.0.1:8787/tv-sync';
        }
        return '/tv-sync';
    }

    function randomHex(nBytes) {
        var arr = new Uint8Array(nBytes);
        crypto.getRandomValues(arr);
        var s = '';
        for (var i = 0; i < arr.length; i++) s += ('0' + arr[i].toString(16)).slice(-2);
        return s;
    }

    function getDeviceId() {
        var id = storageGetItem(STORE_KEYS.syncDeviceId);
        if (!id) {
            id = 'tvcloud-' + randomHex(16);
            try { storageSetItem(STORE_KEYS.syncDeviceId, id); } catch (e) { /* ignore */ }
        }
        return id;
    }

    var els = {
        statusText: document.getElementById('status-text'),
        statsCards: document.getElementById('stats-cards'),
        pausedShowsGrid: document.getElementById('paused-shows-grid'),
        completedShowsGrid: document.getElementById('completed-shows-grid'),
        watchNextGrid: document.getElementById('watchnext-shows-grid'),
        upToDateGrid: document.getElementById('uptodate-shows-grid'),
        historyGrid: document.getElementById('history-shows-grid'),
        staleGrid: document.getElementById('stale-shows-grid'),
        pausedShowsCount: document.getElementById('paused-shows-count'),
        completedShowsCount: document.getElementById('completed-shows-count'),
        watchNextCount: document.getElementById('watchnext-shows-count'),
        upToDateCount: document.getElementById('uptodate-shows-count'),
        historyCount: document.getElementById('history-shows-count'),
        staleCount: document.getElementById('stale-shows-count'),
        watchNextSection: document.getElementById('section-watchnext'),
        sectionToggles: Array.prototype.slice.call(document.querySelectorAll('.section-toggle')),
        controlsSection: document.querySelector('.controls'),
        controlsBody: document.getElementById('controls-body'),
        controlsToggle: document.getElementById('controls-toggle'),
        searchInput: document.getElementById('search-input'),
        sortSelect: document.getElementById('sort-select'),
        filterSelect: document.getElementById('filter-select'),
        upcomingBoard: document.getElementById('upcoming-board'),
        cardTemplate: document.getElementById('show-card-template'),
        importButton: document.getElementById('import-data'),
        importInput: document.getElementById('import-file'),
        refreshMetaButton: document.getElementById('refresh-meta'),
        pageRefreshButton: document.getElementById('page-refresh'),
        setOmdbKeyButton: document.getElementById('set-omdb-key'),
        addShowButton: document.getElementById('add-show'),
        installAppButton: document.getElementById('install-app'),
        installPrompt: document.getElementById('install-prompt'),
        authUser: document.getElementById('auth-user'),
        authUsername: document.getElementById('auth-username'),
        authPassword: document.getElementById('auth-password'),
        authLogin: document.getElementById('auth-login'),
        authSignedOut: document.getElementById('auth-signed-out'),
        authSignedIn: document.getElementById('auth-signed-in'),
        authSettings: document.getElementById('auth-settings'),
        authLogout: document.getElementById('auth-logout'),
        showModal: document.getElementById('show-modal'),
        showModalBackdrop: document.getElementById('show-modal-backdrop'),
        showModalClose: document.getElementById('show-modal-close'),
        showModalMenu: document.getElementById('show-modal-menu'),
        pushWatchLaterBtn: document.getElementById('push-watch-later-btn'),
        removeShowBtn: document.getElementById('remove-show-btn'),
        showModalTitle: document.getElementById('show-modal-title'),
        showModalSubtitle: document.getElementById('show-modal-subtitle'),
        modalPoster: document.getElementById('modal-poster'),
        posterBtn: document.getElementById('modal-poster-btn'),
        posterLightbox: document.getElementById('poster-lightbox'),
        posterLightboxImg: document.getElementById('poster-lightbox-img'),
        posterLightboxClose: document.getElementById('poster-lightbox-close'),
        posterLightboxBackdrop: document.getElementById('poster-lightbox-backdrop'),
        modalFactsText: document.getElementById('modal-facts-text'),
        modalLinks: document.getElementById('modal-links'),
        modalSummary: document.getElementById('modal-summary'),
        modalNotes: document.getElementById('modal-notes'),
        modalDecrease: document.getElementById('modal-decrease'),
        modalIncrease: document.getElementById('modal-increase'),
        modalWatchSeason: document.getElementById('modal-watch-season'),
        modalRefreshMeta: document.getElementById('modal-refresh-meta'),
        modalPreferTvmaze: document.getElementById('modal-prefer-tvmaze'),
        modalPauseShow: document.getElementById('modal-pause-show'),
        fixLink: document.getElementById('modal-fix-link'),
        fixLinkNote: document.getElementById('modal-fix-link-note'),
        fixLinkToggle: document.getElementById('modal-fix-link-toggle'),
        markUnfixableBtn: document.getElementById('modal-mark-unfixable-btn'),
        fixLinkForm: document.getElementById('modal-fix-link-form'),
        fixLinkInput: document.getElementById('modal-fix-link-input'),
        fixLinkSubmit: document.getElementById('modal-fix-link-submit'),
        fixLinkCancel: document.getElementById('modal-fix-link-cancel'),
        fixLinkMsg: document.getElementById('modal-fix-link-msg'),
        fixLinkPasteTab: document.getElementById('modal-fix-link-paste-tab'),
        fixLinkSearchTab: document.getElementById('modal-fix-link-search-tab'),
        fixLinkPasteMode: document.getElementById('modal-fix-link-paste-mode'),
        fixLinkSearchMode: document.getElementById('modal-fix-link-search-mode'),
        fixLinkSearchInput: document.getElementById('modal-fix-link-search-input'),
        fixLinkSearchCancel: document.getElementById('modal-fix-link-search-cancel'),
        fixLinkSearchResults: document.getElementById('modal-fix-link-search-results'),
        modalProgress: document.getElementById('modal-progress'),
        modalSeasons: document.getElementById('modal-seasons'),
        upcomingTabs: document.getElementById('upcoming-tabs'),
        accountModal: document.getElementById('account-modal'),
        accountModalBackdrop: document.getElementById('account-modal-backdrop'),
        accountModalClose: document.getElementById('account-modal-close'),
        accountUsernameDisplay: document.getElementById('account-username-display'),
        accountEmailDisplay: document.getElementById('account-email-display'),
        debugMessagesToggle: document.getElementById('debug-messages-toggle'),
        debugMessagesHint: document.getElementById('debug-messages-hint'),
        editEmailBtn: document.getElementById('edit-email-btn'),
        emailEditForm: document.getElementById('email-edit-form'),
        newEmail: document.getElementById('new-email'),
        saveEmailBtn: document.getElementById('save-email-btn'),
        cancelEmailBtn: document.getElementById('cancel-email-btn'),
        currentPasswordInput: document.getElementById('current-password'),
        newPasswordInput: document.getElementById('new-password'),
        confirmPasswordInput: document.getElementById('confirm-password'),
        changePasswordBtn: document.getElementById('change-password-btn'),
        passwordMessage: document.getElementById('password-message'),
        deleteAccountBtn: document.getElementById('delete-account-btn'),
        deleteMessage: document.getElementById('delete-message'),
        omdbModal: document.getElementById('omdb-modal'),
        omdbModalBackdrop: document.getElementById('omdb-modal-backdrop'),
        omdbModalClose: document.getElementById('omdb-modal-close'),
        omdbKeyInput: document.getElementById('omdb-key-input'),
        omdbSaveBtn: document.getElementById('omdb-save-btn'),
        omdbRemoveBtn: document.getElementById('omdb-remove-btn'),
        omdbMessage: document.getElementById('omdb-message'),
        omdbStatus: document.getElementById('omdb-status'),
        omdbUsage: document.getElementById('omdb-usage'),
        addShowModal: document.getElementById('addshow-modal'),
        addShowModalBackdrop: document.getElementById('addshow-modal-backdrop'),
        addShowModalClose: document.getElementById('addshow-modal-close'),
        addShowInput: document.getElementById('addshow-input'),
        addShowMessage: document.getElementById('addshow-message'),
        addShowResults: document.getElementById('addshow-results'),
        unresolvedWrap: document.getElementById('unresolved-wrap'),
        unresolvedToggle: document.getElementById('unresolved-toggle'),
        unresolvedCount: document.getElementById('unresolved-count'),
        unresolvedPanel: document.getElementById('unresolved-panel'),
        unresolvedList: document.getElementById('unresolved-list'),
        deleteConfirmPassword: document.getElementById('delete-confirm-password'),
        helpBtn: document.getElementById('help-btn'),
        helpModal: document.getElementById('help-modal'),
        helpModalBackdrop: document.getElementById('help-modal-backdrop'),
        helpModalClose: document.getElementById('help-modal-close'),
        loadingOverlay: document.getElementById('loading-overlay'),
        loadingMessage: document.getElementById('loading-message'),
        loadingSub: document.getElementById('loading-sub'),
        confirmModal: document.getElementById('confirm-modal'),
        confirmModalBackdrop: document.getElementById('confirm-modal-backdrop'),
        confirmTitle: document.getElementById('confirm-title'),
        confirmMessage: document.getElementById('confirm-message'),
        confirmOk: document.getElementById('confirm-ok'),
        confirmCancel: document.getElementById('confirm-cancel'),
        authForgot: document.getElementById('auth-forgot'),
        authRestore: document.getElementById('auth-restore'),
        restoreFile: document.getElementById('restore-file'),
        recoverModal: document.getElementById('recover-modal'),
        recoverModalBackdrop: document.getElementById('recover-modal-backdrop'),
        recoverModalClose: document.getElementById('recover-modal-close'),
        recoverUsername: document.getElementById('recover-username'),
        recoverEmail: document.getElementById('recover-email'),
        recoverNewPassword: document.getElementById('recover-new-password'),
        recoverConfirmPassword: document.getElementById('recover-confirm-password'),
        recoverSubmit: document.getElementById('recover-submit'),
        recoverMessage: document.getElementById('recover-message'),
        exportDataBtn: document.getElementById('export-data-btn'),
        restoreDataBtn: document.getElementById('restore-data-btn'),
        restoreCloudPrevBtn: document.getElementById('restore-cloud-prev-btn'),
        backupMessage: document.getElementById('backup-message')
    };

    startApp();

    async function startApp() {
        await initializeStorage();
        initAuth();
        try {
            bindEvents();
        } catch (error) {
            console.error('[AUTH] Error binding events:', error);
        }
        initSiteFooter();
        initControlsCollapseUi();
        refreshForCurrentUser();
        setupCloudSync();
        setupPWA();
    }

    function storageGetItem(key) {
        key = String(key || '');
        if (!key) return null;
        if (storageState.mode === 'idb') {
            if (Object.prototype.hasOwnProperty.call(storageState.cache, key)) {
                return storageState.cache[key];
            }
            // Resilience fallback: if cache missed a key (e.g. interrupted IDB
            // startup/write), read direct localStorage so auth/settings survive.
            try {
                var lsVal = localStorage.getItem(key);
                if (lsVal != null) return lsVal;
            } catch (error) { /* ignore */ }
            return null;
        }
        try { return localStorage.getItem(key); } catch (error) { return null; }
    }

    function storageSetItem(key, value) {
        key = String(key || '');
        if (!key) return;
        var text = String(value);
        if (storageState.mode === 'idb') {
            storageState.cache[key] = text;
            storageWriteIdb('put', key, text).catch(function (error) {
                console.warn('Could not persist IndexedDB key', key, error);
            });
            try { localStorage.setItem(key, text); } catch (error) { /* ignore */ }
            return;
        }
        try { localStorage.setItem(key, text); } catch (error) { /* ignore */ }
    }

    function storageRemoveItem(key) {
        key = String(key || '');
        if (!key) return;
        if (storageState.mode === 'idb') {
            delete storageState.cache[key];
            storageWriteIdb('delete', key, '').catch(function (error) {
                console.warn('Could not delete IndexedDB key', key, error);
            });
            try { localStorage.removeItem(key); } catch (error) { /* ignore */ }
            return;
        }
        try { localStorage.removeItem(key); } catch (error) { /* ignore */ }
    }

    function storageKeys() {
        if (storageState.mode === 'idb') return Object.keys(storageState.cache);
        var keys = [];
        try {
            for (var i = 0; i < localStorage.length; i++) {
                var k = localStorage.key(i);
                if (k) keys.push(k);
            }
        } catch (error) { /* ignore */ }
        return keys;
    }

    async function initializeStorage() {
        if (typeof indexedDB === 'undefined') {
            storageState.mode = 'local';
            return;
        }

        try {
            var db = await openStorageDb();
            storageState.db = db;
            storageState.mode = 'idb';

            var existing = await storageReadAllIdb();
            storageState.cache = existing;

            // One-time migration + safety merge from localStorage into IndexedDB.
            var writes = [];
            try {
                for (var i = 0; i < localStorage.length; i++) {
                    var key = localStorage.key(i);
                    if (!key) continue;
                    if (Object.prototype.hasOwnProperty.call(storageState.cache, key)) continue;
                    var val = localStorage.getItem(key);
                    if (val == null) continue;
                    storageState.cache[key] = val;
                    writes.push(storageWriteIdb('put', key, val));
                }
            } catch (error) {
                console.warn('localStorage import scan failed', error);
            }
            if (writes.length) await Promise.all(writes);
        } catch (error) {
            console.warn('IndexedDB unavailable, falling back to localStorage', error);
            storageState.mode = 'local';
            storageState.db = null;
            storageState.cache = {};
        }
    }

    function initAuth() {
        loadCloudSession();
        updateAuthUi();
    }

    function loadCloudSession() {
        var lastUser = '';
        var lastEmail = '';
        var token = '';
        try {
            var session = loadJson(STORE_KEYS.cloudSession, null);
            if (session && typeof session === 'object') {
                lastUser = normalizeUsername(session.username || '');
                lastEmail = String(session.email || '');
                token = String(session.token || '');
            }

            if (!lastUser) {
                var raw = storageGetItem(STORE_KEYS.sessionUser);
                if (raw) {
                    var parsed = JSON.parse(raw);
                    if (typeof parsed === 'string') lastUser = normalizeUsername(parsed);
                }
            }
        } catch (error) {
            lastUser = '';
            lastEmail = '';
            token = '';
        }

        if (lastUser && token) {
            state.currentUser = String(lastUser);
            state.currentEmail = String(lastEmail || '');
            state.cloud.token = String(token || '');
        } else if (lastUser && !token) {
            clearCloudSession();
        }
    }

    function persistCloudSession() {
        if (!state.currentUser || !state.cloud.token) return;
        persistJson(STORE_KEYS.cloudSession, {
            username: state.currentUser,
            email: state.currentEmail || '',
            token: state.cloud.token
        });
        persistJson(STORE_KEYS.sessionUser, state.currentUser);
    }

    function clearCloudSession() {
        storageRemoveItem(STORE_KEYS.cloudSession);
        persistJson(STORE_KEYS.sessionUser, '');
        state.cloud.token = '';
        state.currentEmail = '';
    }

    function isScriptMimeType(contentType) {
        var t = String(contentType || '').toLowerCase();
        return t.indexOf('javascript') !== -1 || t.indexOf('ecmascript') !== -1;
    }

    async function preflightServiceWorkerScript(swPath) {
        try {
            var resp = await fetch(swPath, { method: 'GET', cache: 'no-store' });
            if (!resp.ok) {
                console.log('[PWA] Skipping service worker registration; fetch failed with HTTP ' + resp.status + '.');
                return false;
            }
            var ct = resp.headers ? (resp.headers.get('content-type') || '') : '';
            if (!isScriptMimeType(ct)) {
                console.log('[PWA] Skipping service worker registration; unsupported MIME type: ' + (ct || 'unknown'));
                return false;
            }
            return true;
        } catch (error) {
            console.log('[PWA] Skipping service worker registration; script preflight failed.', error);
            return false;
        }
    }

    function setupPWA() {
        // Register service worker for offline support and caching
        if ('serviceWorker' in navigator) {
            preflightServiceWorkerScript('sw.js').then(function (ok) {
                if (!ok) return null;
                return navigator.serviceWorker.register('sw.js');
            }).then(function (reg) {
                if (!reg) return;
                pwaUpdateUi.reg = reg;
                if (reg.waiting && navigator.serviceWorker.controller) {
                    showPwaUpdateBanner(reg.waiting);
                }
                reg.addEventListener('updatefound', function () {
                    var installing = reg.installing;
                    if (!installing) return;
                    installing.addEventListener('statechange', function () {
                        if (installing.state === 'installed' && navigator.serviceWorker.controller) {
                            showPwaUpdateBanner(installing);
                        }
                    });
                });
                console.log('[PWA] Service worker registered:', reg);
            }).catch(function (err) {
                console.log('[PWA] Service worker registration failed:', err);
            });

            navigator.serviceWorker.addEventListener('controllerchange', function () {
                if (!pwaUpdateUi.reloadOnControllerChange) return;
                window.location.reload();
            });
        }

        // Handle PWA install prompt (beforeinstallprompt event)
        window.addEventListener('beforeinstallprompt', function (e) {
            e.preventDefault();
            window.deferredPrompt = e;
            
            // Show install button and prompt hint
            els.installAppButton.hidden = false;
            els.installPrompt.style.display = 'block';
            
            console.log('[PWA] Install prompt deferred');
        });

        // Hide install UI if app is already installed
        window.addEventListener('appinstalled', function () {
            console.log('[PWA] App installed');
            els.installAppButton.hidden = true;
            els.installPrompt.style.display = 'none';
            window.deferredPrompt = null;
        });

        // Check if running in standalone mode (installed on home screen)
        if (isStandaloneApp()) {
            console.log('[PWA] Running in standalone/installed mode');
            els.installAppButton.hidden = true;
            els.installPrompt.style.display = 'none';
        } else if (isIosInstallDevice() || window.matchMedia('(max-width: 680px)').matches) {
            // Keep install CTA visible on mobile; iOS never fires beforeinstallprompt.
            els.installAppButton.hidden = false;
            if (isIosInstallDevice()) els.installPrompt.style.display = 'block';
        }

        // Notify user about periodic updates from service worker
        if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
            navigator.serviceWorker.controller.postMessage({ type: 'CLIENTS_CLAIM' });
        }
    }

    function ensurePwaUpdateBanner() {
        if (pwaUpdateUi.banner) return pwaUpdateUi.banner;
        var banner = document.createElement('section');
        banner.className = 'pwa-update-banner';
        banner.hidden = true;

        var text = document.createElement('p');
        text.className = 'pwa-update-text';
        text.textContent = 'Update ready: a newer TV Tracker version is available.';

        var actions = document.createElement('div');
        actions.className = 'pwa-update-actions';

        var updateBtn = document.createElement('button');
        updateBtn.type = 'button';
        updateBtn.className = 'btn btn-primary btn-sm';
        updateBtn.textContent = 'Update now';
        updateBtn.addEventListener('click', requestPwaUpdateNow);

        var laterBtn = document.createElement('button');
        laterBtn.type = 'button';
        laterBtn.className = 'btn btn-sm';
        laterBtn.textContent = 'Later';
        laterBtn.addEventListener('click', hidePwaUpdateBanner);

        actions.appendChild(updateBtn);
        actions.appendChild(laterBtn);
        banner.appendChild(text);
        banner.appendChild(actions);
        document.body.appendChild(banner);
        pwaUpdateUi.banner = banner;
        return banner;
    }

    function showPwaUpdateBanner(waitingWorker) {
        var banner = ensurePwaUpdateBanner();
        pwaUpdateUi.waiting = waitingWorker || (pwaUpdateUi.reg && pwaUpdateUi.reg.waiting) || null;
        banner.hidden = false;
    }

    function hidePwaUpdateBanner() {
        if (pwaUpdateUi.banner) pwaUpdateUi.banner.hidden = true;
    }

    function requestPwaUpdateNow() {
        var worker = pwaUpdateUi.waiting || (pwaUpdateUi.reg && pwaUpdateUi.reg.waiting) || null;
        pwaUpdateUi.reloadOnControllerChange = true;
        hidePwaUpdateBanner();

        if (worker) {
            try {
                worker.postMessage({ type: 'SKIP_WAITING' });
                window.setTimeout(function () {
                    if (pwaUpdateUi.reloadOnControllerChange) window.location.reload();
                }, 1800);
                return;
            } catch (error) {
                console.warn('[PWA] Could not activate waiting worker:', error);
            }
        }

        window.location.reload();
    }

    function bindEvents() {
        function on(el, eventName, handler) {
            if (el) el.addEventListener(eventName, handler);
        }

        // Header / auth actions
        on(els.authLogin, 'click', loginUser);
        on(els.authPassword, 'keydown', function (event) {
            if (event.key === 'Enter') loginUser();
        });
        on(els.authUsername, 'keydown', function (event) {
            if (event.key === 'Enter') loginUser();
        });
        on(els.authLogout, 'click', logoutUser);
        on(els.authSettings, 'click', openAccountModal);
        on(els.authForgot, 'click', openRecoverModal);
        on(els.authRestore, 'click', function () {
            if (els.restoreFile) els.restoreFile.click();
        });
        on(els.restoreFile, 'change', function (event) {
            var file = event && event.target && event.target.files ? event.target.files[0] : null;
            if (file) importUserData(file);
            if (els.restoreFile) els.restoreFile.value = '';
        });

        // Header tools
        on(els.addShowButton, 'click', openAddShowModal);
        on(els.importButton, 'click', triggerImport);
        on(els.refreshMetaButton, 'click', startMetadataRefresh);
        on(els.pageRefreshButton, 'click', function () {
            softPageRefresh();
        });
        on(els.setOmdbKeyButton, 'click', openOmdbModal);
        on(els.helpBtn, 'click', openHelpModal);
        on(els.installAppButton, 'click', function () {
            var prompt = window.deferredPrompt;
            if (!prompt) {
                setStatus('Use your browser menu to install this app on your device.');
                return;
            }
            prompt.prompt();
            prompt.userChoice.then(function () {
                window.deferredPrompt = null;
            });
        });

        // Core list controls
        on(els.searchInput, 'input', function () {
            state.search = String(els.searchInput ? els.searchInput.value : '');
            applyFilters();
            render();
        });
        on(els.sortSelect, 'change', function () {
            state.sortBy = String(els.sortSelect ? els.sortSelect.value : 'recent') || 'recent';
            persistJson(STORE_KEYS.sortPreference, state.sortBy);
            applyFilters();
            render();
        });
        on(els.filterSelect, 'change', function () {
            state.filterBy = String(els.filterSelect ? els.filterSelect.value : 'all') || 'all';
            persistJson(STORE_KEYS.filterPreference, state.filterBy);
            applyFilters();
            render();
        });
        on(els.controlsToggle, 'click', function () {
            setControlsCollapsed(!state.controlsCollapsed, true);
        });
        (els.sectionToggles || []).forEach(function (toggle) {
            on(toggle, 'click', function () {
                var key = toggle.getAttribute('data-section');
                if (key) toggleSection(key);
            });
        });

        // Main modal close controls
        on(els.showModalClose, 'click', closeShowModal);
        on(els.showModalBackdrop, 'click', closeShowModal);
        on(els.pushWatchLaterBtn, 'click', togglePushToWatchLater);
        on(els.removeShowBtn, 'click', requestRemoveShow);
        on(els.posterBtn, 'click', function () {
            if (!els.modalPoster || !els.modalPoster.src) return;
            openPosterLightbox(els.modalPoster.src, els.modalPoster.alt || 'Poster');
        });
        on(els.posterLightboxClose, 'click', closePosterLightbox);
        on(els.posterLightboxBackdrop, 'click', closePosterLightbox);
        on(els.modalNotes, 'blur', saveModalNotes);
        on(els.modalNotes, 'change', saveModalNotes);

        // Fix-link / unresolved helpers
        on(els.fixLinkToggle, 'click', function () {
            if (!els.fixLinkForm) return;
            var opening = !!els.fixLinkForm.hidden;
            els.fixLinkForm.hidden = !opening;
            if (els.fixLinkToggle) els.fixLinkToggle.hidden = opening;
            if (opening) switchFixLinkMode('paste');
        });
        on(els.fixLinkForm, 'submit', function (event) {
            event.preventDefault();
            submitFixLink();
        });
        on(els.fixLinkCancel, 'click', function () {
            if (els.fixLinkForm) els.fixLinkForm.hidden = true;
            if (els.fixLinkToggle) els.fixLinkToggle.hidden = false;
        });
        on(els.fixLinkPasteTab, 'click', function () { switchFixLinkMode('paste'); });
        on(els.fixLinkSearchTab, 'click', function () { switchFixLinkMode('search'); });
        on(els.fixLinkSearchCancel, 'click', function () {
            if (els.fixLinkForm) els.fixLinkForm.hidden = true;
            if (els.fixLinkToggle) els.fixLinkToggle.hidden = false;
        });
        on(els.fixLinkSearchInput, 'input', runFixLinkSearch);
        on(els.fixLinkSearchInput, 'keydown', function (event) {
            if (event.key === 'Enter') {
                event.preventDefault();
                runFixLinkSearch();
            }
        });
        on(els.markUnfixableBtn, 'click', toggleUnfixable);
        on(els.unresolvedToggle, 'click', toggleUnresolvedPanel);

        // Add-show modal
        on(els.addShowModalClose, 'click', closeAddShowModal);
        on(els.addShowModalBackdrop, 'click', closeAddShowModal);
        on(els.addShowInput, 'input', scheduleAddShowSearch);
        on(els.addShowInput, 'keydown', function (event) {
            if (event.key === 'Enter') {
                event.preventDefault();
                runAddShowSearch();
            }
            if (event.key === 'Escape') closeAddShowModal();
        });

        // Account + confirm + info modals
        on(els.accountModalClose, 'click', closeAccountModal);
        on(els.accountModalBackdrop, 'click', closeAccountModal);
        on(els.editEmailBtn, 'click', function () {
            if (!els.emailEditForm) return;
            els.emailEditForm.hidden = false;
            if (els.newEmail) {
                els.newEmail.value = state.currentEmail || '';
                try { els.newEmail.focus(); } catch (e) { /* ignore */ }
            }
        });
        on(els.cancelEmailBtn, 'click', function () {
            if (els.emailEditForm) els.emailEditForm.hidden = true;
            if (els.newEmail) els.newEmail.value = '';
        });
        on(els.saveEmailBtn, 'click', updateEmail);
        on(els.debugMessagesToggle, 'change', function () {
            setDebugMessagesEnabled(!!(els.debugMessagesToggle && els.debugMessagesToggle.checked));
        });
        on(els.changePasswordBtn, 'click', changePassword);
        on(els.deleteAccountBtn, 'click', requestDeleteAccount);
        on(els.exportDataBtn, 'click', exportUserData);
        on(els.restoreDataBtn, 'click', function () {
            if (els.restoreFile) els.restoreFile.click();
        });
        on(els.restoreCloudPrevBtn, 'click', requestRestorePreviousCloudSave);

        on(els.omdbModalClose, 'click', closeOmdbModal);
        on(els.omdbModalBackdrop, 'click', closeOmdbModal);
        on(els.omdbSaveBtn, 'click', saveOmdbKey);
        on(els.omdbRemoveBtn, 'click', removeOmdbKey);

        on(els.helpModalClose, 'click', closeHelpModal);
        on(els.helpModalBackdrop, 'click', closeHelpModal);

        on(els.recoverModalClose, 'click', closeRecoverModal);
        on(els.recoverModalBackdrop, 'click', closeRecoverModal);
        on(els.recoverSubmit, 'click', resetPasswordViaRecovery);

        on(els.confirmCancel, 'click', closeConfirm);
        on(els.confirmModalBackdrop, 'click', closeConfirm);
        on(els.confirmOk, 'click', function () {
            var fn = state.pendingConfirm;
            closeConfirm();
            if (typeof fn === 'function') fn();
        });

        on(els.importInput, 'change', function (event) {
            var files = event && event.target ? event.target.files : null;
            if (files && files.length) importTvTimeExport(files);
            if (els.importInput) els.importInput.value = '';
        });

        window.addEventListener('resize', applyControlsCollapseUi);
        window.addEventListener('keydown', function (event) {
            if (document.body && document.body.classList.contains('tv-busy')) return;
            if (event.key !== 'Escape') return;
            if (els.posterLightbox && !els.posterLightbox.hidden) { closePosterLightbox(); return; }
            if (els.confirmModal && !els.confirmModal.hidden) { closeConfirm(); return; }
            if (els.showModal && !els.showModal.hidden) { closeShowModal(); return; }
            if (els.addShowModal && !els.addShowModal.hidden) { closeAddShowModal(); return; }
            if (els.omdbModal && !els.omdbModal.hidden) { closeOmdbModal(); return; }
            if (els.recoverModal && !els.recoverModal.hidden) { closeRecoverModal(); return; }
            if (els.accountModal && !els.accountModal.hidden) { closeAccountModal(); return; }
            if (els.helpModal && !els.helpModal.hidden) { closeHelpModal(); }
        });
    }

    function updateAuthUi() {
        var signedIn = !!state.currentUser;
        els.authUser.textContent = signedIn ? ('Signed in as ' + state.currentUser) : 'Not signed in';
        if (els.authSignedOut) els.authSignedOut.hidden = signedIn;
        if (els.authSignedIn) els.authSignedIn.hidden = !signedIn;
        if (els.authSettings) els.authSettings.hidden = !signedIn;
        if (els.authLogout) els.authLogout.hidden = !signedIn;
    }

    function refreshForCurrentUser() {
        if (!state.currentUser) {
            clearUiForSignedOut();
            setStatus('Log in or register to use your own TV tracker data.');
            return;
        }
        setStatus('Loading your tracker data...');
        try {
            // Load user-scoped data from localStorage
            state.overrides = loadUserScopedJson(STORE_KEYS.localOverrides, {});
            state.watchHistory = loadUserScopedJson(STORE_KEYS.watchHistory, []);
            state.metadataCache = loadUserScopedJson(STORE_KEYS.metadataCache, {});
            state.manualLinks = loadUserScopedJson(STORE_KEYS.manualLinks, {});
            state.unfixableShows = loadUserScopedJson(STORE_KEYS.unfixableShows, {});
            state.customShows = loadUserScopedJson(STORE_KEYS.customShows, []);
            state.importedData = loadUserScopedJson(STORE_KEYS.importedData, null);
            state.profileSettings = normalizeProfileSettings(loadUserScopedJson(STORE_KEYS.profileSettings, { useImportedData: true, debugMessages: false }));
            state.episodeCache = {};
            state.modalShowId = '';
            loadPreferences();
            loadControlsCollapsedPreference();
            applyControlsCollapseUi();

            // Build the shows model from this user's own imported export + custom shows
            bootstrap();
        } catch (error) {
            console.error('[USER] Error refreshing current user data:', error);
        }
    }


    async function loginUser() {
        if (state.loginInFlight) return;

        var username = normalizeUsername(els.authUsername.value);
        var password = String(els.authPassword.value || '');
        if (!username || !password) {
            setStatus('Enter username and password to log in.');
            return;
        }
        if (!cloudSyncAvailable()) {
            setStatus('Cloud login is not configured.', true);
            return;
        }

        state.loginInFlight = true;
        setAuthLoginBusy(true);
        setStatus('Signing in...');

        var payload;
        try {
            payload = await cloudFetch('/v1/login', {
                username: username,
                password: password
            });
        } catch (error) {
            setStatus(error && error.message ? error.message : 'Could not log in right now.', true);
            state.loginInFlight = false;
            setAuthLoginBusy(false);
            return;
        }
        
        state.currentUser = username;
        state.currentEmail = payload && payload.email ? String(payload.email) : '';
        state.cloud.token = payload && payload.token ? String(payload.token) : '';
        persistCloudSession();
        els.authPassword.value = '';
        updateAuthUi();
        refreshForCurrentUser();
        initCloudSyncForUser();
        showLoadingOverlay('Syncing from cloud\u2026', 'Loading your tracker data');
        try {
            await cloudRunSyncWithTimeout(false);
        } finally {
            if (!state.cloud.applyingRemote) hideLoadingOverlay();
        }
        setStatus('Logged in as ' + username + '.', false, true);
        state.loginInFlight = false;
        setAuthLoginBusy(false);
    }

    function setAuthLoginBusy(isBusy) {
        var busy = !!isBusy;
        if (els.authLogin) {
            els.authLogin.disabled = busy;
            els.authLogin.textContent = busy ? 'Logging in...' : 'Login';
            els.authLogin.setAttribute('aria-busy', busy ? 'true' : 'false');
        }
        if (els.authUsername) els.authUsername.disabled = busy;
        if (els.authPassword) els.authPassword.disabled = busy;
    }

    function logoutUser() {
        var token = state.cloud && state.cloud.token ? state.cloud.token : '';
        try { teardownCloudSync(); } catch (e) { /* ignore */ }
        if (token) {
            cloudFetch('/v1/logout', { token: token }).catch(function () { /* ignore */ });
        }
        state.currentUser = '';
        clearCloudSession();
        updateAuthUi();
        clearUiForSignedOut();
        setStatus('Signed out. Log in to access your tracker data.');
    }

    function openAccountModal() {
        if (!state.currentUser) return;
        
        var account = { email: state.currentEmail || '' };
        
        els.accountUsernameDisplay.textContent = state.currentUser;
        els.accountEmailDisplay.textContent = account && account.email ? escapeHtml(account.email) : 'Not set';
        els.emailEditForm.hidden = true;
        els.newEmail.value = '';
        els.currentPasswordInput.value = '';
        els.newPasswordInput.value = '';
        els.confirmPasswordInput.value = '';
        els.passwordMessage.textContent = '';
        els.deleteMessage.textContent = '';
        if (els.debugMessagesToggle) els.debugMessagesToggle.checked = !!(state.profileSettings && state.profileSettings.debugMessages);
        
        if (els.cloudHistoryDepth) els.cloudHistoryDepth.textContent = 'Checking cloud history...';
        fetchCloudHistoryDepth();
        
        els.accountModal.hidden = false;
    }

    function fetchCloudHistoryDepth() {
        if (!state.currentUser || !state.cloud.token) return;
        cloudFetch('/v1/history-depth', { token: state.cloud.token }).then(function (result) {
            var depth = result && typeof result.historyDepth === 'number' ? result.historyDepth : 0;
            if (els.cloudHistoryDepth) {
                els.cloudHistoryDepth.textContent = depth > 0
                    ? 'Previous saves available: ' + depth
                    : 'No previous saves yet (first restore point will be created on next change).';
            }
        }).catch(function () {
            if (els.cloudHistoryDepth) els.cloudHistoryDepth.textContent = '';
        });
    }

    function normalizeProfileSettings(raw) {
        var src = (raw && typeof raw === 'object') ? raw : {};
        return {
            useImportedData: src.useImportedData !== false,
            debugMessages: !!src.debugMessages
        };
    }

    function setDebugMessagesEnabled(enabled) {
        state.profileSettings = normalizeProfileSettings(state.profileSettings);
        state.profileSettings.debugMessages = !!enabled;
        persistUserScopedJson(STORE_KEYS.profileSettings, state.profileSettings);
        if (els.debugMessagesToggle) els.debugMessagesToggle.checked = !!enabled;
        if (enabled) {
            setStatus('Debug messages enabled.', false, true);
        } else {
            setStatus('', false, true);
        }
    }

    function softPageRefresh() {
        if (!state.currentUser) {
            setStatus('Log in first to refresh your data.', true);
            return;
        }
        if (!cloudSyncAvailable() || !state.cloud.token) {
            setStatus('Cloud sync is not configured.', true);
            return;
        }

        // Close all open modals
        closeAllModals();

        // Reload the UI from storage and sync from cloud
        setStatus('Refreshing from cloud...');
        showLoadingOverlay('Syncing from cloud\u2026', 'Loading your tracker data');
        
        try {
            refreshForCurrentUser();
            runLifecycleCloudRefresh('manual-refresh', true).finally(function () {
                if (!state.cloud.applyingRemote) hideLoadingOverlay();
                setStatus('Refreshed from cloud.', false, true);
            });
        } catch (error) {
            hideLoadingOverlay();
            console.error('[REFRESH] Error during soft refresh:', error);
            setStatus('Could not refresh from cloud. Please try again.', true);
        }
    }

    function closeAllModals() {
        if (els.accountModal) els.accountModal.hidden = true;
        if (els.addShowModal) els.addShowModal.hidden = true;
        if (els.showModal) els.showModal.hidden = true;
        if (els.omdbModal) els.omdbModal.hidden = true;
        if (els.helpModal) els.helpModal.hidden = true;
        if (els.recoverModal) els.recoverModal.hidden = true;
    }

    function closeAccountModal() {
        if (els.accountModal) els.accountModal.hidden = true;
    }

    function openOmdbModal() {
        if (!els.omdbModal) return;
        var hasKey = false;
        if (state.currentUser) {
            var current = loadUserScopedValue(STORE_KEYS.omdbApiKey) || '';
            if (els.omdbKeyInput) els.omdbKeyInput.value = current;
            hasKey = !!current;
        } else {
            if (els.omdbKeyInput) els.omdbKeyInput.value = '';
        }
        if (els.omdbMessage) els.omdbMessage.textContent = '';
        if (els.omdbStatus) {
            if (!state.currentUser) {
                els.omdbStatus.textContent = 'Log in to save a key to your account.';
            } else if (hasKey) {
                els.omdbStatus.textContent = 'A key is currently saved. Metadata prefers OMDb (IMDb source).';
            } else {
                els.omdbStatus.textContent = 'No key saved. Metadata currently uses TVMaze.';
            }
        }
        if (els.omdbUsage) {
            if (state.currentUser && hasKey) {
                var used = getOmdbUsageToday();
                var remaining = Math.max(0, OMDB_DAILY_LIMIT - used);
                els.omdbUsage.textContent = 'Requests today (this device): ' + used.toLocaleString() + ' / ' +
                    OMDB_DAILY_LIMIT.toLocaleString() + ' \u00b7 ' + remaining.toLocaleString() + ' left';
                els.omdbUsage.hidden = false;
            } else {
                els.omdbUsage.hidden = true;
            }
        }
        els.omdbModal.hidden = false;
    }

    function closeOmdbModal() {
        if (els.omdbModal) els.omdbModal.hidden = true;
    }

    function saveOmdbKey() {
        if (!state.currentUser) {
            if (els.omdbMessage) els.omdbMessage.textContent = 'Please log in first to save a key to your account.';
            return;
        }
        var value = els.omdbKeyInput ? String(els.omdbKeyInput.value || '').trim() : '';
        if (!value) {
            if (els.omdbMessage) els.omdbMessage.textContent = 'Enter a key, or use Remove to clear it.';
            return;
        }
        persistUserScopedValue(STORE_KEYS.omdbApiKey, value);
        if (els.omdbMessage) els.omdbMessage.textContent = 'Key saved. Refresh metadata to pull OMDb data.';
        setStatus('OMDb API key saved. Metadata fetch now prefers OMDb (IMDb source).');
    }

    function removeOmdbKey() {
        if (!state.currentUser) {
            closeOmdbModal();
            return;
        }
        clearUserScopedValue(STORE_KEYS.omdbApiKey);
        if (els.omdbKeyInput) els.omdbKeyInput.value = '';
        if (els.omdbMessage) els.omdbMessage.textContent = 'Key removed. Metadata falls back to TVMaze.';
        if (els.omdbStatus) els.omdbStatus.textContent = 'No key saved. Metadata currently uses TVMaze.';
        setStatus('OMDb API key removed. Metadata fetch falls back to TVMaze.');
    }

    // --- Lost-password reset ----------------------------------------------

    function openRecoverModal() {
        setRecoverMessage('', false);
        if (els.recoverUsername) els.recoverUsername.value = normalizeUsername(els.authUsername ? els.authUsername.value : '');
        if (els.recoverEmail) els.recoverEmail.value = '';
        if (els.recoverNewPassword) els.recoverNewPassword.value = '';
        if (els.recoverConfirmPassword) els.recoverConfirmPassword.value = '';
        if (els.recoverModal) els.recoverModal.hidden = false;
    }

    function closeRecoverModal() {
        if (els.recoverModal) els.recoverModal.hidden = true;
    }

    function setRecoverMessage(text, isError) {
        if (!els.recoverMessage) return;
        els.recoverMessage.textContent = text || '';
        els.recoverMessage.style.color = isError ? 'var(--danger)' : 'var(--mint)';
    }

    async function resetPasswordViaRecovery() {
        var username = normalizeUsername(els.recoverUsername ? els.recoverUsername.value : '');
        var email = String(els.recoverEmail ? els.recoverEmail.value : '').trim();
        var newPassword = String(els.recoverNewPassword ? els.recoverNewPassword.value : '');
        var confirmPassword = String(els.recoverConfirmPassword ? els.recoverConfirmPassword.value : '');

        if (!username || !email) {
            setRecoverMessage('Enter your username and registered email.', true);
            return;
        }
        if (newPassword.length < 6) {
            setRecoverMessage('New password must be at least 6 characters long.', true);
            return;
        }
        if (newPassword !== confirmPassword) {
            setRecoverMessage('New passwords do not match.', true);
            return;
        }

        try {
            await cloudFetch('/v1/recover', {
                username: username,
                email: email,
                newPassword: newPassword
            });
        } catch (error) {
            setRecoverMessage(error && error.message ? error.message : 'Password reset failed.', true);
            return;
        }

        setRecoverMessage('Password updated! You can now log in with your new password.', false);
        if (els.authUsername) els.authUsername.value = username;
        window.setTimeout(closeRecoverModal, 1200);
    }

    // --- Account backup: export / restore (manual cross-device sync) ------
    // The app has no server, so "use the same account on two devices" is done
    // by exporting a JSON backup (account + all user-scoped data) and restoring
    // it on the other device.

    function exportUserData() {
        if (!state.currentUser) {
            if (els.backupMessage) els.backupMessage.textContent = 'Log in first to export your data.';
            return;
        }
        var payload = {
            type: 'tvtracker-backup',
            version: 1,
            exportedAt: new Date().toISOString(),
            username: state.currentUser,
            data: {}
        };
        var suffix = '::' + state.currentUser;
        var keys = storageKeys();
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            if (key && key.length > suffix.length && key.slice(-suffix.length) === suffix) {
                payload.data[key.slice(0, key.length - suffix.length)] = storageGetItem(key);
            }
        }
        try {
            var blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
            var url = URL.createObjectURL(blob);
            var link = document.createElement('a');
            link.href = url;
            link.download = 'tvtracker-backup-' + state.currentUser + '.json';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            if (els.backupMessage) els.backupMessage.textContent = 'Backup downloaded.';
            setStatus('Downloaded a backup of your account and data.');
        } catch (error) {
            console.error('[BACKUP] Export failed:', error);
            if (els.backupMessage) els.backupMessage.textContent = 'Could not create the backup file.';
        }
    }

    function importUserData(file) {
        var reader = new FileReader();
        reader.onload = function () {
            var payload;
            try {
                payload = JSON.parse(String(reader.result || ''));
            } catch (error) {
                setStatus('That backup file could not be read (invalid JSON).');
                return;
            }
            if (!payload || payload.type !== 'tvtracker-backup' || !payload.username) {
                setStatus('That file is not a valid TV Tracker backup.');
                return;
            }
            var username = normalizeUsername(payload.username);
            if (!username) {
                setStatus('That backup has an invalid username.');
                return;
            }
            var applyRestore = function () {
                if (state.currentUser && state.currentUser !== username) {
                    setStatus('That backup belongs to a different username. Log in as ' + username + ' first.');
                    return;
                }
                var data = payload.data || {};
                Object.keys(data).forEach(function (base) {
                    try { storageSetItem(base + '::' + username, data[base]); } catch (e) { /* ignore */ }
                });
                setStatus('Backup restored. Log in as ' + username + ' to load it from cloud session.');
                window.setTimeout(function () { window.location.reload(); }, 500);
            };
            applyRestore();
        };
        reader.onerror = function () {
            setStatus('Could not read that backup file.');
        };
        reader.readAsText(file);
    }

    function requestRestorePreviousCloudSave() {
        if (!state.currentUser || !state.cloud.token) {
            if (els.backupMessage) els.backupMessage.textContent = 'Log in first to restore a cloud save.';
            return;
        }
        openConfirm(
            'Restore previous cloud save?',
            'This reverts your account cloud snapshot to the previous saved version, then reloads this device from cloud. Current cloud state will be preserved in history as a fail-safe.',
            'Restore previous save',
            function () { restorePreviousCloudSave(); }
        );
    }

    async function restorePreviousCloudSave() {
        if (!state.currentUser || !state.cloud.token) {
            if (els.backupMessage) els.backupMessage.textContent = 'Log in first to restore a cloud save.';
            return;
        }

        if (els.restoreCloudPrevBtn) {
            els.restoreCloudPrevBtn.disabled = true;
            els.restoreCloudPrevBtn.textContent = 'Restoring...';
        }

        showLoadingOverlay('Restoring cloud save\u2026', 'Rolling back to previous cloud snapshot');
        try {
            var restore = await cloudFetch('/v1/restore-last', {
                token: state.cloud.token,
                deviceId: getDeviceId()
            });

            state.cloud.pendingLocalChanges = false;
            state.cloud.forceFullPullOnce = true;
            await cloudRunSyncWithTimeout(false);

            var fromVersion = restore && typeof restore.restoredFromVersion === 'number'
                ? restore.restoredFromVersion
                : null;
            if (els.backupMessage) {
                els.backupMessage.textContent = fromVersion != null
                    ? ('Cloud save restored from version ' + fromVersion + '.')
                    : 'Cloud save restored.';
            }
            setStatus('Restored the previous cloud save and synced this device.', false, true);
        } catch (error) {
            var message = error && error.message ? error.message : 'Could not restore previous cloud save.';
            if (els.backupMessage) els.backupMessage.textContent = message;
            setStatus(message, true, true);
        } finally {
            hideLoadingOverlay();
            if (els.restoreCloudPrevBtn) {
                els.restoreCloudPrevBtn.disabled = false;
                els.restoreCloudPrevBtn.textContent = '⏮️ Restore previous cloud save';
            }
        }
    }

    // --- Generic confirm modal, help modal, loading overlay ---------------

    function openConfirm(title, message, confirmLabel, onConfirm) {
        state.pendingConfirm = onConfirm || null;
        if (els.confirmTitle) els.confirmTitle.textContent = title || 'Are you sure?';
        if (els.confirmMessage) els.confirmMessage.textContent = message || '';
        if (els.confirmOk) els.confirmOk.textContent = confirmLabel || 'Confirm';
        if (els.confirmModal) els.confirmModal.hidden = false;
    }

    function closeConfirm() {
        state.pendingConfirm = null;
        if (els.confirmModal) els.confirmModal.hidden = true;
    }

    function openHelpModal() {
        if (els.helpModal) els.helpModal.hidden = false;
    }

    function closeHelpModal() {
        if (els.helpModal) els.helpModal.hidden = true;
    }

    function showLoadingOverlay(message, sub) {
        if (els.loadingMessage) els.loadingMessage.textContent = message || 'Working…';
        if (els.loadingSub) els.loadingSub.textContent = sub || '';
        try {
            document.documentElement.classList.add('tv-busy');
            document.body.classList.add('tv-busy');
        } catch (e) { /* ignore */ }
        if (els.loadingOverlay) els.loadingOverlay.hidden = false;
    }

    function updateLoadingSub(sub) {
        if (els.loadingSub) els.loadingSub.textContent = sub || '';
    }

    function hideLoadingOverlay() {
        try {
            document.documentElement.classList.remove('tv-busy');
            document.body.classList.remove('tv-busy');
        } catch (e) { /* ignore */ }
        if (els.loadingOverlay) els.loadingOverlay.hidden = true;
    }

    // Full metadata refresh: cover the page with a spinner, refetch everything,
    // then reload so the UI rebuilds cleanly instead of flashing per item.
    function startMetadataRefresh() {
        if (!state.currentUser || !state.shows.length) return;
        state.refreshMode = true;
        state.refreshTotal = state.shows.length;
        state.refreshDone = 0;
        showLoadingOverlay('Refreshing metadata…', '0 / ' + state.refreshTotal + ' shows');

        state.metadataCache = {};
        state.episodeCache = {};
        persistUserScopedJson(STORE_KEYS.metadataCache, state.metadataCache);
        state.shows.forEach(function (show) {
            var manual = state.manualLinks[show.id];
            show.meta = manual ? mergeManualLinkMeta(null, manual) : null;
        });

        queueMetadataFetches(state.shows, true);
    }

    async function finishMetadataRefresh() {
        updateLoadingSub('Checking ended-show completion…');
        try {
            var changed = await reconcileEndedShowCompletionFromCatalog();
            if (changed > 0) {
                applyFilters();
                render();
            }
        } catch (error) {
            console.warn('Post-refresh completion check failed', error);
        }

        updateLoadingSub('Done! Reloading…');
        window.setTimeout(function () { window.location.reload(); }, 600);
    }

    // Build the imported show list behind the loading overlay and fetch its
    // metadata without per-item re-renders, so importing never flashes the grid.
    function startImportBuild() {
        var imported = state.importedData || { userShows: [], followed: [], latestSeenByShow: [] };
        try {
            state.shows = buildShowsModel(imported);
        } catch (error) {
            console.error(error);
            hideLoadingOverlay();
            setStatus('Could not build your show list from the imported data.', true);
            return;
        }

        // Shows whose posters/details still need fetching (rest come from cache).
        var toFetch = state.shows.filter(function (show) { return !show.meta; }).length;
        if (!state.shows.length || !toFetch) {
            applyFilters();
            render();
            hideLoadingOverlay();
            finishImportStatus();
            return;
        }

        state.importMode = true;
        state.refreshTotal = toFetch;
        state.refreshDone = 0;
        showLoadingOverlay('Importing your shows…', '0 / ' + toFetch + ' shows');
        queueMetadataFetches(state.shows, false);
    }

    function finishImport() {
        autoCompleteEndedShows();
        applyFilters();
        render();
        hideLoadingOverlay();
        finishImportStatus();
    }

    function finishImportStatus() {
        var imported = state.importedData || {};
        var when = imported.importedAt ? new Date(imported.importedAt).toLocaleDateString() : '';
        setStatus('Loaded ' + state.shows.length + ' shows from your TV Time export' + (when ? ' (imported ' + when + ')' : '') + '.');
    }

    function requestDeleteAccount() {
        if (!state.currentUser) return;
        var password = els.deleteConfirmPassword ? String(els.deleteConfirmPassword.value || '') : '';
        if (!password) {
            if (els.deleteMessage) els.deleteMessage.textContent = 'Enter your password above to confirm deletion.';
            return;
        }
        openConfirm(
            'Delete your account?',
            'This permanently removes your cloud account and synced tracker data. It cannot be undone.',
            'Delete forever',
            function () { confirmDeleteAccount(password); }
        );
    }

    async function confirmDeleteAccount(password) {
        try {
            await cloudFetch('/v1/account/delete', {
                token: state.cloud.token,
                password: password
            });
        } catch (error) {
            if (els.deleteMessage) els.deleteMessage.textContent = 'Incorrect password. Your account was not deleted.';
            return;
        }
        deleteAccount();
    }

    async function updateEmail() {
        if (!state.currentUser) return;
        
        var newEmail = String(els.newEmail.value || '').trim();
        if (!newEmail) {
            setStatus('Email cannot be empty.');
            return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail)) {
            setStatus('Please enter a valid email address.');
            return;
        }
        
        try {
            var payload = await cloudFetch('/v1/account/email', {
                token: state.cloud.token,
                email: newEmail
            });
            state.currentEmail = payload && payload.email ? String(payload.email) : newEmail;
            persistCloudSession();
            els.accountEmailDisplay.textContent = escapeHtml(state.currentEmail);
            els.emailEditForm.hidden = true;
            els.newEmail.value = '';
            setStatus('Email updated successfully.');
        } catch (error) {
            setStatus(error && error.message ? error.message : 'Could not update email.', true);
        }
    }

    async function changePassword() {
        if (!state.currentUser) return;
        
        var currentPassword = String(els.currentPasswordInput.value || '');
        var newPassword = String(els.newPasswordInput.value || '');
        var confirmPassword = String(els.confirmPasswordInput.value || '');
        
        if (!currentPassword || !newPassword || !confirmPassword) {
            els.passwordMessage.textContent = 'All fields are required.';
            return;
        }
        
        if (newPassword.length < 6) {
            els.passwordMessage.textContent = 'New password must be at least 6 characters long.';
            return;
        }
        
        if (newPassword !== confirmPassword) {
            els.passwordMessage.textContent = 'New passwords do not match.';
            return;
        }
        
        if (currentPassword === newPassword) {
            els.passwordMessage.textContent = 'New password must be different from current password.';
            return;
        }
        
        try {
            await cloudFetch('/v1/account/password', {
                token: state.cloud.token,
                currentPassword: currentPassword,
                newPassword: newPassword
            });
        } catch (error) {
            els.passwordMessage.textContent = error && error.message ? error.message : 'Could not change password.';
            return;
        }
        
        els.passwordMessage.textContent = '✅ Password changed successfully!';
        els.currentPasswordInput.value = '';
        els.newPasswordInput.value = '';
        els.confirmPasswordInput.value = '';
        setStatus('Password changed successfully.');
        
        setTimeout(function () {
            els.passwordMessage.textContent = '';
        }, 3000);
    }

    function deleteAccount() {
        if (!state.currentUser) return;
        
        // Delete user-scoped data
        var userScopedKeys = [
            STORE_KEYS.localOverrides,
            STORE_KEYS.watchHistory,
            STORE_KEYS.metadataCache,
            STORE_KEYS.manualLinks,
            STORE_KEYS.omdbApiKey,
            STORE_KEYS.customShows,
            STORE_KEYS.importedData,
            STORE_KEYS.profileSettings
        ];
        
        userScopedKeys.forEach(function (key) {
            storageRemoveItem(key + '::' + state.currentUser);
        });
        
        // Logout
        logoutUser();
        closeAccountModal();
        setStatus('Account deleted permanently.');
    }

    function loadPreferences() {
        var savedSort = loadJson(STORE_KEYS.sortPreference, 'recent');
        var savedFilter = loadJson(STORE_KEYS.filterPreference, 'all');
        state.sortBy = String(savedSort) || 'recent';
        state.filterBy = String(savedFilter) || 'all';
        els.sortSelect.value = state.sortBy;
        els.filterSelect.value = state.filterBy;

        var savedCollapse = loadJson(STORE_KEYS.sectionCollapse, null);
        if (savedCollapse && typeof savedCollapse === 'object') {
            ['watchnext', 'uptodate', 'history', 'stale', 'paused', 'completed'].forEach(function (key) {
                if (typeof savedCollapse[key] === 'boolean') state.collapsedSections[key] = savedCollapse[key];
            });
        }
        applySectionCollapseUi();
    }

    function applySectionCollapseUi() {
        (els.sectionToggles || []).forEach(function (toggle) {
            var key = toggle.getAttribute('data-section');
            var collapsed = !!state.collapsedSections[key];
            var section = toggle.closest('.collapsible-section');
            if (section) section.classList.toggle('collapsed', collapsed);
            toggle.setAttribute('aria-expanded', collapsed ? 'false' : 'true');
        });
    }

    function isCompactMobileViewport() {
        return window.matchMedia('(max-width: 680px)').matches;
    }

    function loadControlsCollapsedPreference() {
        var saved = loadJson(STORE_KEYS.controlsCollapsed, null);
        // Default to collapsed when user has no saved preference yet.
        state.controlsCollapsed = saved == null ? true : !!saved;
    }

    function setControlsCollapsed(collapsed, persist) {
        state.controlsCollapsed = !!collapsed;
        if (persist) persistJson(STORE_KEYS.controlsCollapsed, state.controlsCollapsed);
        applyControlsCollapseUi();
    }

    function applyControlsCollapseUi() {
        if (!els.controlsSection || !els.controlsBody) return;
        var collapsed = !!state.controlsCollapsed && isCompactMobileViewport();
        els.controlsSection.classList.toggle('is-collapsed', collapsed);
        els.controlsBody.hidden = collapsed;
        if (els.controlsToggle) {
            els.controlsToggle.hidden = !isCompactMobileViewport();
            els.controlsToggle.setAttribute('aria-expanded', collapsed ? 'false' : 'true');
            els.controlsToggle.textContent = collapsed ? 'Show filters' : 'Hide filters';
        }
    }

    function initControlsCollapseUi() {
        loadControlsCollapsedPreference();
        applyControlsCollapseUi();
    }

    function toggleSection(key) {
        state.collapsedSections[key] = !state.collapsedSections[key];
        persistJson(STORE_KEYS.sectionCollapse, state.collapsedSections);
        applySectionCollapseUi();
    }

    function clearUiForSignedOut() {
        state.shows = [];
        state.filtered = [];
        state.watchHistory = [];
        state.metadataCache = {};
        state.manualLinks = {};
        state.unfixableShows = {};
        state.importedData = null;
        state.customShows = [];
        els.statsCards.innerHTML = '';
        els.watchNextGrid.innerHTML = '<div class="empty">Sign in to load your personal tracker.</div>';
        if (els.upToDateGrid) els.upToDateGrid.innerHTML = '';
        els.historyGrid.innerHTML = '';
        els.staleGrid.innerHTML = '';
        els.pausedShowsGrid.innerHTML = '';
        els.completedShowsGrid.innerHTML = '';
        els.watchNextCount.textContent = '';
        if (els.upToDateCount) els.upToDateCount.textContent = '';
        els.historyCount.textContent = '';
        els.staleCount.textContent = '';
        els.pausedShowsCount.textContent = '';
        els.completedShowsCount.textContent = '';
        els.upcomingBoard.innerHTML = '<div class="empty">Sign in to load upcoming episodes.</div>';
        closeShowModal();
    }

    /* ====== DATA PERSISTENCE (CLOUD ACCOUNT + LOCAL CACHE) ======
     * Per-user tracker data is cached locally under scoped keys for speed/offline.
     * Cloudflare Worker + D1 is the source of truth for account auth and sync.
     * This includes:
     * - Watched episodes and counts
     * - Show metadata cache (posters, descriptions, genres, next episode)
     * - Custom shows added by the user
     * - User profile settings (whether to use imported data)
     * - Cloud sync session token (stored locally to keep you signed in)
     * 
    * Local cached keys use the format: "baseKey::username"
     * 
    * This approach means:
    * ✓ One cloud account works on every device
    * ✓ Local cache keeps the UI fast and resilient
    * ✓ Works offline with cached data
    * ⚠ If cache is cleared, local offline copy is lost (cloud copy remains)
     * 
     * PWA (Progressive Web App) support enabled for:
     * - Installing the app on your home screen
     * - Offline access to cached data
     * - Service worker caching for network-first performance
     */

    function scopedKey(baseKey) {
        return baseKey + '::' + (state.currentUser || 'anonymous');
    }

    function scopedKeyForUser(username, baseKey) {
        return baseKey + '::' + username;
    }

    function loadUserScopedJson(baseKey, fallback) {
        return loadJson(scopedKey(baseKey), fallback);
    }

    function persistUserScopedJson(baseKey, value) {
        persistJson(scopedKey(baseKey), value);
        afterUserScopedWrite(baseKey);
    }

    function loadUserScopedValue(baseKey) {
        return storageGetItem(scopedKey(baseKey));
    }

    function persistUserScopedValue(baseKey, value) {
        storageSetItem(scopedKey(baseKey), value);
        afterUserScopedWrite(baseKey);
    }

    function clearUserScopedValue(baseKey) {
        storageRemoveItem(scopedKey(baseKey));
        afterUserScopedWrite(baseKey);
    }

    // Central choke point: whenever synced user data changes, keep the settings
    // clock current and schedule a cloud sync push.
    function afterUserScopedWrite(baseKey) {
        if (state.cloud && state.cloud.applyingRemote) {
            if (!CLOUD_SYNC_READONLY) state.cloud.pendingLocalChanges = true;
            return;
        }
        if (baseKey === STORE_KEYS.profileSettings || baseKey === STORE_KEYS.omdbApiKey) {
            bumpSyncSettingsAt();
        }
        if (CLOUD_SYNC_READONLY) {
            state.cloud.pendingLocalChanges = false;
            return;
        }
        state.cloud.pendingLocalChanges = true;
        cloudScheduleSync(1500);
    }

    // --- Cloud sync (Cloudflare Worker + D1) -----------------------------
    function cloudSyncAvailable() {
        return !!CLOUD_SYNC_BASE_PATH;
    }

    function setupCloudSync() {
        if (!cloudSyncAvailable()) return;
        if (state.currentUser) {
            initCloudSyncForUser();
            // Run one immediate forced pull so page refresh/reopen always
            // restores from cloud first.
            runLifecycleCloudRefresh('startup', true).finally(function () {
                if (!state.cloud.applyingRemote) hideLoadingOverlay();
            });
            scheduleStartupRecoverySync();
        }
    }

    function runLifecycleCloudRefresh(reason, bypassThrottle) {
        if (!state.currentUser || !state.cloud.token || !cloudSyncAvailable()) {
            return Promise.resolve();
        }
        if (state.cloud.inFlight || state.cloud.applyingRemote) {
            return Promise.resolve();
        }

        if (reason === 'startup') {
            if (state.cloud.startupRefreshDone) return Promise.resolve();
            state.cloud.startupRefreshDone = true;
        }

        var now = Date.now();
        var throttleMs = 2500;
        if (!bypassThrottle && (now - (state.cloud.lastRefreshSyncAt || 0) < throttleMs)) {
            return Promise.resolve();
        }

        state.cloud.lastRefreshSyncAt = now;
        state.cloud.forceFullPullOnce = true;

        if (!state.shows || !state.shows.length || bypassThrottle) {
            showLoadingOverlay('Syncing from cloud\u2026', 'Loading your tracker data');
        }

        return cloudRunSyncWithTimeout(false).catch(function (error) {
            console.warn('[CLOUD-SYNC] lifecycle refresh failed:', reason, error);
        });
    }

    function scheduleStartupRecoverySync() {
        // Mobile PWA resumes can occasionally miss the first startup pull
        // (network wake/timeout). If the UI is still empty shortly after
        // startup, auto-run a force pull so users do not need to tap Refresh.
        window.setTimeout(function () {
            if (!state.currentUser || !state.cloud.token) return;
            if (!cloudSyncAvailable()) return;
            if (state.shows && state.shows.length) return;
            if (state.cloud.inFlight || state.cloud.applyingRemote) return;

            state.cloud.forceFullPullOnce = true;
            showLoadingOverlay('Syncing from cloud\u2026', 'Restoring your tracker data');
            cloudRunSyncWithTimeout(false).finally(function () {
                if (!state.cloud.applyingRemote) hideLoadingOverlay();
            });
        }, 1800);
    }

    function hasLocalTrackerCache() {
        // Show list can only be rebuilt from importedData/custom shows.
        if (state.importedData && typeof state.importedData === 'object') {
            var hasImportedRows = (state.importedData.userShows && state.importedData.userShows.length)
                || (state.importedData.followed && state.importedData.followed.length);
            if (hasImportedRows) return true;
        }
        if (state.customShows && state.customShows.length) return true;
        return false;
    }

    function initCloudSyncForUser() {
        if (!cloudSyncAvailable() || !state.currentUser) return;
        if (!state.cloud.token) return;
        if (state.cloud.stuckDetectorTimer) {
            clearInterval(state.cloud.stuckDetectorTimer);
            state.cloud.stuckDetectorTimer = null;
        }
        var meta = loadUserScopedJson(STORE_KEYS.cloudSyncMeta, null);
        state.cloud.version = meta && typeof meta.version === 'number' ? meta.version : 0;
        state.cloud.pendingLocalChanges = false;
        // If local cache is missing on startup (for example after a hard reload
        // plus storage quirks), force one full pull regardless of knownVersion.
        state.cloud.forceFullPullOnce = !hasLocalTrackerCache();
        state.cloud.stuckDetectorTimer = window.setInterval(detectStuckCloudSync, 30000);
        cloudScheduleSync(800);
    }

    function detectStuckCloudSync() {
        if (!state.cloud.inFlight && !state.cloud.applyingRemote) return;
        if (typeof document !== 'undefined' && document.visibilityState === 'hidden') return;
        var now = Date.now();
        var startedAt = state.cloud.syncStartedAt || 0;
        var lastActivityAt = state.cloud.lastActivityAt || 0;
        var stuckDuration = now - lastActivityAt;
        var totalSyncDuration = startedAt ? (now - startedAt) : stuckDuration;
        if (stuckDuration > CLOUD_SYNC_TIMEOUT_MS * 2 && totalSyncDuration > CLOUD_SYNC_TIMEOUT_MS * 4) {
            console.warn('[CLOUD-SYNC] Detected stuck sync state for ' + stuckDuration + 'ms, resetting');
            state.cloud.inFlight = false;
            state.cloud.applyingRemote = false;
            state.cloud.lastActivityAt = now;
            state.cloud.syncStartedAt = 0;
        }
    }

    function teardownCloudSync() {
        if (state.cloud.timer) {
            clearTimeout(state.cloud.timer);
            state.cloud.timer = null;
        }
        if (state.cloud.stuckDetectorTimer) {
            clearInterval(state.cloud.stuckDetectorTimer);
            state.cloud.stuckDetectorTimer = null;
        }
        state.cloud.inFlight = false;
        state.cloud.applyingRemote = false;
        state.cloud.pendingLocalChanges = false;
        state.cloud.forceFullPullOnce = false;
        state.cloud.startupRefreshDone = false;
        state.cloud.version = 0;
        state.cloud.token = '';
        state.cloud.retryAt = 0;
        state.cloud.lastErrorAt = 0;
        state.cloud.lastActivityAt = 0;
        state.cloud.lastRefreshSyncAt = 0;
        state.cloud.syncStartedAt = 0;
    }

    function cloudScheduleSync(delayMs) {
        if (!cloudSyncAvailable() || !state.currentUser || !state.cloud.token) return;
        if (state.cloud.timer) return;
        var delay = typeof delayMs === 'number' ? delayMs : 2000;
        state.cloud.timer = window.setTimeout(function () {
            state.cloud.timer = null;
            cloudRunSyncWithTimeout(false);
        }, delay);
    }

    async function cloudRunSyncWithTimeout(forcePush) {
        var timeoutHandle = null;
        var completed = false;
        state.cloud.lastActivityAt = Date.now();
        try {
            var syncPromise = cloudRunSync(forcePush);
            var timeoutPromise = new Promise(function (resolve) {
                timeoutHandle = window.setTimeout(function () {
                    if (!completed) {
                        state.cloud.inFlight = false;
                        state.cloud.applyingRemote = false;
                        state.cloud.lastActivityAt = Date.now();
                        console.warn('[CLOUD-SYNC] sync timed out after ' + CLOUD_SYNC_TIMEOUT_MS + 'ms');
                    }
                    resolve();
                }, CLOUD_SYNC_TIMEOUT_MS);
            });
            await Promise.race([syncPromise, timeoutPromise]);
        } catch (e) {
            state.cloud.inFlight = false;
            state.cloud.applyingRemote = false;
            state.cloud.lastActivityAt = Date.now();
            console.warn('[CLOUD-SYNC] sync wrapper error:', e);
        } finally {
            completed = true;
            state.cloud.lastActivityAt = Date.now();
            if (timeoutHandle) clearTimeout(timeoutHandle);
        }
    }

    function cloudAuthForCurrentUser() {
        if (!state.currentUser || !state.cloud.token) return null;
        return { token: state.cloud.token };
    }

    function buildCloudSyncSnapshot() {
        var snap = buildSyncSnapshot();
        delete snap.account;
        // Metadata cache can become very large and is regenerable from APIs,
        // so keep cloud snapshots focused on user state.
        delete snap.metadataCache;
        return snap;
    }

    function persistCloudVersion(version) {
        state.cloud.version = version || 0;
        persistUserScopedJson(STORE_KEYS.cloudSyncMeta, {
            version: state.cloud.version,
            syncedAt: Date.now()
        });
    }

    async function cloudFetch(path, payload) {
        var ctrl = new AbortController();
        var timeout = window.setTimeout(function () { ctrl.abort(); }, CLOUD_SYNC_TIMEOUT_MS);
        try {
            var resp;
            try {
                resp = await fetch(CLOUD_SYNC_BASE_PATH + path, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload || {}),
                    signal: ctrl.signal
                });
            } catch (networkError) {
                if (isLocalHost()) {
                    throw new Error('Local sync worker is offline. Start `wrangler dev --remote --config tv-sync-worker/wrangler.toml`.');
                }
                throw networkError;
            }
            var json = await resp.json().catch(function () { return {}; });
            if (!resp.ok) {
                var msg = (json && json.error) ? json.error : ('HTTP ' + resp.status);
                var err = new Error(msg);
                err.status = resp.status;
                err.body = json;
                throw err;
            }
            return json || {};
        } finally {
            clearTimeout(timeout);
        }
    }

    async function cloudRunSync(forcePush) {
        if (!cloudSyncAvailable() || !state.currentUser) return;
        if (state.cloud.inFlight) return;
        if (state.cloud.applyingRemote) return;
        if (state.cloud.retryAt && Date.now() < state.cloud.retryAt) {
            cloudScheduleSync(Math.max(1000, state.cloud.retryAt - Date.now()));
            return;
        }

        var auth = cloudAuthForCurrentUser();
        if (!auth) return;

        state.cloud.inFlight = true;
        state.cloud.syncStartedAt = Date.now();
        try {
            var knownVersion = state.cloud.forceFullPullOnce ? 0 : state.cloud.version;
            var pull = await cloudFetch('/v1/pull', {
                token: auth.token,
                knownVersion: knownVersion
            });
            state.cloud.forceFullPullOnce = false;

            var mustApplyFullPull = knownVersion === 0;
            if (pull && pull.snapshot && (pull.version > state.cloud.version || mustApplyFullPull)) {
                state.cloud.applyingRemote = true;
                var merged = mergeSyncSnapshot(pull.snapshot);
                if (merged.changed) applyMergeAndRebuild();
                persistCloudVersion(pull.version);
                state.cloud.applyingRemote = false;
            } else if (isLocalHost() && !hasLocalTrackerCache() && pull && Number(pull.version || 0) === 0) {
                setStatus('Local worker has no cloud snapshot. Start `wrangler dev --remote --config tv-sync-worker/wrangler.toml` to access your real cloud account data.', true);
            }

            if (CLOUD_SYNC_READONLY) {
                state.cloud.pendingLocalChanges = false;
                state.cloud.retryAt = 0;
                return;
            }

            var shouldBootstrapPush = !forcePush
                && !state.cloud.pendingLocalChanges
                && Number(state.cloud.version || 0) === 0
                && pull
                && Number(pull.version || 0) === 0;

            if (!forcePush && !state.cloud.pendingLocalChanges && !shouldBootstrapPush) return;

            var localSnap = buildCloudSyncSnapshot();
            var push = await cloudFetch('/v1/push', {
                token: auth.token,
                baseVersion: state.cloud.version,
                snapshot: localSnap,
                deviceId: getDeviceId()
            });

            if (push && typeof push.version === 'number') {
                persistCloudVersion(push.version);
            }
            state.cloud.pendingLocalChanges = false;
            state.cloud.retryAt = 0;
        } catch (error) {
            state.cloud.applyingRemote = false;
            if (error && error.status === 401) {
                setStatus('Session expired. Please log in again.', true);
                logoutUser();
                return;
            }
            if (error && error.status === 409) {
                state.cloud.pendingLocalChanges = true;
                cloudScheduleSync(1200);
                return;
            }
            // Keep failures quiet for users and retry in the background.
            var now = Date.now();
            if (!state.cloud.lastErrorAt || (now - state.cloud.lastErrorAt) > 15000) {
                console.warn('[CLOUD-SYNC] sync failed:', error && error.message ? error.message : error);
                state.cloud.lastErrorAt = now;
            }
            state.cloud.retryAt = now + CLOUD_SYNC_RETRY_MS;
            cloudScheduleSync(CLOUD_SYNC_RETRY_MS);
        } finally {
            state.cloud.inFlight = false;
            state.cloud.syncStartedAt = 0;
        }
    }

    function persistUserScopedValueFor(username, baseKey, value) {
        persistJson(scopedKeyForUser(username, baseKey), value);
    }

    async function bootstrap() {
        if (!state.currentUser) return;

        var imported = state.importedData || { userShows: [], followed: [], latestSeenByShow: [] };
        var hasImport = (imported.userShows && imported.userShows.length) || (imported.followed && imported.followed.length);
        var hasCustom = state.customShows && state.customShows.length;
        state.mobileGreetingDone = false;

        if (!hasImport && !hasCustom) {
            state.shows = [];
            applyFilters();
            render();
            if (state.cloud && state.cloud.applyingRemote) hideLoadingOverlay();
            setStatus('No data yet. Add shows manually, or use More -> Import legacy TV Time data if you already have an old export file.');
            return;
        }

        try {
            state.shows = buildShowsModel(imported);
            autoCompleteEndedShows();
            applyFilters();
            render();
            var when = imported.importedAt ? new Date(imported.importedAt).toLocaleDateString() : '';
            var loadedMsg = 'Loaded ' + state.shows.length + ' shows from legacy import' + (when ? ' (imported ' + when + ')' : '') + '.';
            if (state.cloud && state.cloud.applyingRemote) hideLoadingOverlay();
            setStatus(loadedMsg + ' Metadata is not auto-refreshed in the background; use "Refresh Metadata" when you want to update posters and episode data.');
        } catch (error) {
            if (state.cloud && state.cloud.applyingRemote) hideLoadingOverlay();
            console.error(error);
            setStatus('Could not build your show list from the imported data.', true);
            els.watchNextGrid.innerHTML = '<div class="error">Failed to read imported data. Try importing a different legacy export file.</div>';
            if (els.historyGrid) els.historyGrid.innerHTML = '';
            els.staleGrid.innerHTML = '';
        }
    }

    // --- TV Time export import -------------------------------------------------

    function triggerImport() {
        if (!state.currentUser) {
            setStatus('Log in first, then import your TV Time export.', true);
            return;
        }
        if (els.importInput) els.importInput.click();
    }

    async function importTvTimeExport(fileList) {
        if (!state.currentUser) {
            setStatus('Log in first, then import your TV Time export.', true);
            return;
        }
        var files = fileList ? Array.prototype.slice.call(fileList) : [];
        if (!files.length) return;

        showLoadingOverlay('Importing your export\u2026', 'Reading file\u2026');
        try {
            var datasets;
            var zipFile = files.find(function (f) { return /\.zip$/i.test(f.name || ''); });
            var csvFiles = files.filter(function (f) { return /\.csv$/i.test(f.name || ''); });

            if (zipFile) {
                updateLoadingSub('Reading ' + zipFile.name + '\u2026');
                datasets = await parseTvTimeZip(zipFile);
            } else if (csvFiles.length) {
                updateLoadingSub('Reading ' + csvFiles.length + ' CSV file(s)\u2026');
                datasets = await parseTvTimeCsvFiles(csvFiles);
            } else {
                hideLoadingOverlay();
                setStatus('Select the .zip you downloaded from TV Time (or its extracted CSV files).', true);
                return;
            }

            if (!datasets.userShows.length && !datasets.followed.length) {
                hideLoadingOverlay();
                setStatus('That file did not contain the expected TV Time data (user_tv_show_data.csv / followed_tv_show.csv).', true);
                return;
            }

            datasets.importedAt = new Date().toISOString();
            state.importedData = datasets;
            try {
                persistUserScopedJson(STORE_KEYS.importedData, datasets);
            } catch (quotaError) {
                console.error(quotaError);
                hideLoadingOverlay();
                setStatus('Your export is too large for this browser\u2019s storage. Try clearing old data and re-importing.', true);
                return;
            }

            updateLoadingSub('Building your show list\u2026');
            startImportBuild();
        } catch (error) {
            console.error(error);
            hideLoadingOverlay();
            setStatus('Could not read that file: ' + (error && error.message ? error.message : error), true);
        }
    }

    async function parseTvTimeZip(file) {
        if (typeof JSZip === 'undefined') {
            throw new Error('Zip reader not loaded (check your connection and reload), or extract the .zip and select the CSV files instead.');
        }
        var zip = await JSZip.loadAsync(file);
        var names = Object.keys(zip.files);
        var out = { userShows: [], followed: [], latestSeenByShow: [] };
        for (var key in TVTIME_FILES) {
            if (!Object.prototype.hasOwnProperty.call(TVTIME_FILES, key)) continue;
            var wanted = TVTIME_FILES[key];
            var match = names.find(function (n) {
                return String(n).toLowerCase().split('/').pop() === wanted;
            });
            if (match && !zip.files[match].dir) {
                var text = await zip.files[match].async('string');
                out[key] = reduceRows(key, parseCsv(text));
            }
        }
        return out;
    }

    async function parseTvTimeCsvFiles(files) {
        var out = { userShows: [], followed: [], latestSeenByShow: [] };
        for (var i = 0; i < files.length; i++) {
            var file = files[i];
            var base = String(file.name || '').toLowerCase().split('/').pop();
            for (var key in TVTIME_FILES) {
                if (!Object.prototype.hasOwnProperty.call(TVTIME_FILES, key)) continue;
                if (base === TVTIME_FILES[key]) {
                    var text = await file.text();
                    out[key] = reduceRows(key, parseCsv(text));
                }
            }
        }
        return out;
    }

    // Keep only the columns buildShowsModel needs, so stored data stays small.
    function reduceRows(kind, rows) {
        if (kind === 'userShows') {
            // Some TV Time exports contain duplicated rows for the same show.
            // Collapse by id (or normalized name fallback) before storing.
            var byKey = new Map();
            rows.forEach(function (r) {
                var id = safeId(r.tv_show_id);
                var name = String(r.tv_show_name || '').trim();
                var key = id || ('name:' + normalizeName(name));
                if (!key) return;

                var prev = byKey.get(key);
                var nextCount = toInt(r.nb_episodes_seen);
                if (!prev) {
                    byKey.set(key, {
                        tv_show_id: id || r.tv_show_id,
                        tv_show_name: name,
                        is_followed: r.is_followed === '1' ? '1' : '0',
                        is_favorited: r.is_favorited === '1' ? '1' : '0',
                        nb_episodes_seen: String(nextCount)
                    });
                    return;
                }

                prev.tv_show_name = String(prev.tv_show_name || '').length >= name.length ? prev.tv_show_name : name;
                prev.is_followed = (prev.is_followed === '1' || r.is_followed === '1') ? '1' : '0';
                prev.is_favorited = (prev.is_favorited === '1' || r.is_favorited === '1') ? '1' : '0';
                prev.nb_episodes_seen = String(Math.max(toInt(prev.nb_episodes_seen), nextCount));
            });

            return Array.from(byKey.values());
        }
        if (kind === 'followed') {
            var latestById = new Map();
            rows.forEach(function (r) {
                var id = safeId(r.tv_show_id);
                if (!id) return;
                var prev = latestById.get(id);
                var rAt = asTime(r.updated_at) || asTime(r.created_at);
                var pAt = prev ? (asTime(prev.updated_at) || asTime(prev.created_at)) : 0;
                if (!prev || rAt >= pAt) {
                    latestById.set(id, {
                        tv_show_id: id,
                        active: r.active,
                        archived: r.archived,
                        created_at: r.created_at,
                        updated_at: r.updated_at
                    });
                }
            });
            return Array.from(latestById.values());
        }
        // latestSeenByShow: dedupe to the latest record per show to minimise storage.
        var latest = new Map();
        rows.forEach(function (r) {
            var name = normalizeName(r.tv_show_name);
            if (!name) return;
            var prev = latest.get(name);
            if (!prev || asTime(r.updated_at) > asTime(prev.updated_at)) {
                latest.set(name, {
                    tv_show_name: r.tv_show_name,
                    episode_season_number: r.episode_season_number,
                    episode_number: r.episode_number,
                    updated_at: r.updated_at || r.created_at || '',
                    created_at: r.created_at || ''
                });
            }
        });
        return Array.from(latest.values());
    }

    function buildShowsModel(data) {
        var followedById = new Map();
        (data.followed || []).forEach(function (row) {
            var id = safeId(row.tv_show_id);
            if (!id) return;
            followedById.set(id, {
                active: row.active === '1',
                archived: row.archived === '1',
                createdAt: row.created_at || '',
                updatedAt: row.updated_at || ''
            });
        });

        var latestSeenByName = new Map();
        (data.latestSeenByShow || []).forEach(function (row) {
            var key = normalizeName(row.tv_show_name);
            if (!key) return;
            var prev = latestSeenByName.get(key);
            if (!prev || asTime(row.updated_at) > asTime(prev.updated_at)) {
                latestSeenByName.set(key, {
                    season: toInt(row.episode_season_number),
                    episode: toInt(row.episode_number),
                    updated_at: row.updated_at || row.created_at || ''
                });
            }
        });

        // Always use this user's own imported export rows (no shared data folder).
        var sourceRows = (data.userShows || []).slice();

        state.customShows.forEach(function (custom) {
            sourceRows.push({
                tv_show_id: custom.id,
                tv_show_name: custom.title,
                is_followed: '1',
                is_favorited: '0',
                nb_episodes_seen: String(toInt(custom.nb_episodes_seen))
            });
        });

        // Final safety net: collapse duplicate rows by show id before rendering.
        // This catches any lingering duplicates from old stored imports/customs.
        var rowById = new Map();
        sourceRows.forEach(function (row) {
            var id = safeId(row.tv_show_id);
            var name = String(row.tv_show_name || '').trim();
            var key = id || ('name:' + normalizeName(name));
            if (!key) return;

            var prev = rowById.get(key);
            if (!prev) {
                rowById.set(key, {
                    tv_show_id: id || row.tv_show_id,
                    tv_show_name: name,
                    is_followed: row.is_followed,
                    is_favorited: row.is_favorited,
                    nb_episodes_seen: row.nb_episodes_seen
                });
                return;
            }

            prev.tv_show_name = String(prev.tv_show_name || '').length >= name.length ? prev.tv_show_name : name;
            prev.is_followed = (prev.is_followed === '1' || row.is_followed === '1') ? '1' : '0';
            prev.is_favorited = (prev.is_favorited === '1' || row.is_favorited === '1') ? '1' : '0';
            prev.nb_episodes_seen = String(Math.max(toInt(prev.nb_episodes_seen), toInt(row.nb_episodes_seen)));
        });
        sourceRows = Array.from(rowById.values());

        var shows = [];
        sourceRows.forEach(function (row) {
            var tvShowId = safeId(row.tv_show_id);
            if (!tvShowId) return;

            var title = String(row.tv_show_name || '').trim();
            if (!title) return;

            var followedInfo = followedById.get(tvShowId) || { active: row.is_followed === '1', archived: false, createdAt: '', updatedAt: '' };
            var override = state.overrides[tvShowId] || {};
            if (override.removed) return;
            var lastSeen = override.lastSeen || latestSeenByName.get(normalizeName(title)) || null;

            var watchedCountBase = toInt(row.nb_episodes_seen);
            var watchedCount = typeof override.watchedCount === 'number' ? override.watchedCount : watchedCountBase;

            // Per-episode manual overrides. Migrate any legacy watchedEpisodes[]
            // array into the new { "SxN": true } map so old data isn't lost.
            var episodeStates = {};
            if (override.episodeStates && typeof override.episodeStates === 'object') {
                episodeStates = override.episodeStates;
            } else if (Array.isArray(override.watchedEpisodes)) {
                override.watchedEpisodes.forEach(function (w) {
                    episodeStates[episodeKey(w.season, w.number)] = true;
                });
            }

            var derivedStatus = deriveStatus(override.status, followedInfo, watchedCount, lastSeen);
            var metadata = mergeManualLinkMeta(getCachedMeta(tvShowId, title), state.manualLinks[tvShowId]);

            shows.push({
                id: tvShowId,
                title: title,
                isFollowed: row.is_followed === '1',
                isFavorited: row.is_favorited === '1',
                watchedCountBase: watchedCountBase,
                watchedCount: watchedCount,
                lastSeen: lastSeen,
                active: followedInfo.active,
                archived: followedInfo.archived,
                sourceUpdatedAt: followedInfo.updatedAt,
                notes: String(override.notes || ''),
                episodeStates: episodeStates,
                localStatus: override.status || '',
                status: derivedStatus,
                meta: metadata
            });
        });

        return shows;
    }

    function deriveStatus(overrideStatus, followedInfo, watchedCount, lastSeen) {
        if (overrideStatus) return normalizeTrackerStatus(overrideStatus);
        if (followedInfo.archived) return 'archived';
        if (!followedInfo.active && watchedCount <= 0) return 'paused';
        if (!followedInfo.active) return 'paused';
        if (lastSeen && watchedCount > 0 && lastSeen.season > 0) return 'active';
        return 'active';
    }

    function normalizeTrackerStatus(raw) {
        var s = String(raw || '').trim().toLowerCase();
        if (s === 'completed' || s === 'complete') return 'completed';
        if (s === 'paused') return 'paused';
        if (s === 'archived') return 'archived';
        return 'active';
    }

    function applyFilters() {
        cleanupExpiredManualWatchLaterOverrides();

        var filtered = state.shows.filter(function (show) {
            if (!matchesFilter(show)) return false;
            if (!state.search) return true;
            return searchableText(show).indexOf(state.search) >= 0;
        });

        filtered.sort(compareByPreference);

        state.filtered = filtered;
    }

    function compareByPreference(a, b) {
        if (state.sortBy === 'name') return a.title.localeCompare(b.title);
        if (state.sortBy === 'progress') return (b.watchedCount || 0) - (a.watchedCount || 0);
        if (state.sortBy === 'recent') return asTime((b.lastSeen && b.lastSeen.updated_at) || '') - asTime((a.lastSeen && a.lastSeen.updated_at) || '');
        return compareUpcoming(a, b);
    }

    function getCategoryTier(show) {
        return categorizeShow(show);
    }

    function isSameOrAfterToday(value) {
        var time = asTime(value);
        if (!time) return false;
        var date = new Date(time);
        var candidate = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
        var now = new Date();
        var today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
        return candidate >= today;
    }

    function getFutureUpcomingEpisode(show) {
        var next = show && show.meta ? show.meta.nextEpisode : null;
        if (!next || !next.airdate) return null;
        return isSameOrAfterToday(next.airdate) ? next : null;
    }

    function matchesFilter(show) {
        if (state.filterBy === 'all') return true;
        if (state.filterBy === 'active') return ['watchnext', 'uptodate', 'stale'].indexOf(getCategoryTier(show)) >= 0;
        if (state.filterBy === 'paused') return getCategoryTier(show) === 'paused';
        if (state.filterBy === 'completed') return isStrictlyCompletedShow(show);
        if (state.filterBy === 'archived') return normalizeTrackerStatus(show && show.status) === 'archived';
        if (state.filterBy === 'with-upcoming') return Boolean(getFutureUpcomingEpisode(show));
        return true;
    }

    function compareUpcoming(a, b) {
        var aDate = getUpcomingTime(a);
        var bDate = getUpcomingTime(b);
        if (aDate === bDate) return a.title.localeCompare(b.title);
        if (!aDate) return 1;
        if (!bDate) return -1;
        return aDate - bDate;
    }

    function getUpcomingTime(show) {
        var next = getFutureUpcomingEpisode(show);
        return next ? asTime(next.airdate) : 0;
    }

    function searchableText(show) {
        var meta = show.meta || {};
        return [
            show.title,
            show.notes,
            meta.summary,
            meta.imdbId,
            Array.isArray(meta.genres) ? meta.genres.join(' ') : ''
        ].join(' ').toLowerCase();
    }

    function render() {
        renderStats();
        renderUpcoming();
        renderWatchHistory();
        renderShows();
        refreshUnresolvedControl();
        maybeFocusWatchNextOnMobile();
    }

    function renderWatchHistory() {
        if (!els.historyGrid) return;
        var entries = (state.watchHistory || []).slice().sort(function (a, b) {
            return asTime(b && b.loggedAt) - asTime(a && a.loggedAt);
        });

        if (els.historyCount) {
            els.historyCount.textContent = entries.length + ' logged';
        }

        if (!entries.length) {
            els.historyGrid.innerHTML = '<div class="empty">No watched-episode activity yet. Mark episodes watched to build your timeline.</div>';
            return;
        }

        var fragment = document.createDocumentFragment();
        entries.forEach(function (entry) {
            if (!entry || !entry.showId) return;
            var show = state.shows.find(function (item) { return item.id === entry.showId; }) || null;
            var item = document.createElement('button');
            item.type = 'button';
            item.className = 'history-item';

            var dt = new Date(entry.loggedAt || Date.now());
            var whenText = isNaN(dt.getTime()) ? 'Unknown time' : dt.toLocaleString(undefined, {
                month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
            });

            var episodeLabel = 'S' + toInt(entry.season) + 'E' + toInt(entry.episode);
            var epName = entry.episodeName ? (' · ' + entry.episodeName) : '';
            item.innerHTML = '<div class="history-item-top">'
                + '<span class="history-show">' + escapeHtml(entry.showTitle || (show && show.title) || 'Show') + '</span>'
                + '<span class="history-when">' + escapeHtml(whenText) + '</span>'
                + '</div>'
                + '<div class="history-episode">Marked watched: ' + escapeHtml(episodeLabel + epName) + '</div>';

            if (show) {
                item.addEventListener('click', function () {
                    openShowModal(show.id);
                });
            } else {
                item.disabled = true;
                item.title = 'This show is no longer in your tracker.';
            }
            fragment.appendChild(item);
        });

        els.historyGrid.innerHTML = '';
        els.historyGrid.appendChild(fragment);
    }

    function renderStats() {
        var totalShows = state.shows.length;
        var totalWatchedEpisodes = state.shows.reduce(function (sum, show) { return sum + (show.watchedCount || 0); }, 0);
        var totalHours = Math.round(estimateWatchedMinutes() / 60);
        var active = state.shows.filter(function (show) {
            var tier = getCategoryTier(show);
            return tier === 'watchnext' || tier === 'uptodate' || tier === 'stale';
        }).length;
        var paused = state.shows.filter(function (show) {
            return getCategoryTier(show) === 'paused';
        }).length;

        var html = [
            statCard(totalShows, 'Shows in library'),
            statCard(totalWatchedEpisodes, 'Episodes marked watched'),
            statCard(totalHours.toLocaleString(), 'Hours watched (est.)'),
            statCard(active, 'Active shows'),
            statCard(paused, 'Paused shows')
        ].join('');

        els.statsCards.innerHTML = html;
    }

    // Estimated total watch time in minutes = watched episodes x per-episode
    // runtime (falling back to a sensible default when runtime is unknown).
    function estimateWatchedMinutes() {
        return state.shows.reduce(function (sum, show) {
            var perEp = show.meta && toInt(show.meta.runtime) > 0 ? toInt(show.meta.runtime) : DEFAULT_EPISODE_MINUTES;
            return sum + (show.watchedCount || 0) * perEp;
        }, 0);
    }

    function statCard(value, label) {
        return '<article class="stat-card"><strong>' + escapeHtml(String(value)) + '</strong><span>' + escapeHtml(label) + '</span></article>';
    }

    function renderUpcoming() {
        var upcoming = state.shows
            .filter(function (show) {
                return !!getFutureUpcomingEpisode(show);
            })
            .sort(compareUpcoming);

        if (els.upcomingTabs) els.upcomingTabs.innerHTML = '';

        if (!upcoming.length) {
            els.upcomingBoard.innerHTML = '<div class="empty">No upcoming episodes found yet. Metadata is still loading, or the providers have no next-episode dates for your shows.</div>';
            return;
        }

        var grouped = groupUpcomingByDays(upcoming);
        var categories = Object.keys(grouped);

        if (!state.upcomingTab || categories.indexOf(state.upcomingTab) === -1) {
            state.upcomingTab = categories[0];
        }

        // Day-category tabs (Today / Tomorrow / This Week / …)
        if (els.upcomingTabs) {
            categories.forEach(function (cat) {
                var tab = document.createElement('button');
                tab.type = 'button';
                tab.className = 'tab' + (cat === state.upcomingTab ? ' active' : '');
                tab.setAttribute('role', 'tab');
                tab.innerHTML = escapeHtml(cat) + ' <span class="tab-count">' + grouped[cat].length + '</span>';
                tab.addEventListener('click', function () {
                    state.upcomingTab = cat;
                    renderUpcoming();
                });
                els.upcomingTabs.appendChild(tab);
            });
        }

        // Compact poster tiles for the active category.
        var shows = grouped[state.upcomingTab] || [];
        els.upcomingBoard.innerHTML = shows.map(function (show) {
            var next = getFutureUpcomingEpisode(show) || show.meta.nextEpisode;
            var poster = (show.meta && show.meta.poster) || FALLBACK_POSTER;
            return '<button type="button" class="upcoming-item" data-show-id="' + escapeHtml(show.id) + '">'
                + '<span class="upcoming-poster-wrap"><img class="upcoming-poster" src="' + escapeHtml(poster) + '" alt="" loading="lazy"></span>'
                + '<span class="upcoming-info">'
                + '<span class="upcoming-title">' + escapeHtml(show.title) + '</span>'
                + '<span class="upcoming-ep">S' + escapeHtml(String(next.season || '?')) + 'E' + escapeHtml(String(next.number || '?')) + (next.name ? ' · ' + escapeHtml(next.name) : '') + '</span>'
                + '<span class="upcoming-date">' + escapeHtml(formatUpcomingDate(next.airdate)) + '</span>'
                + '</span>'
                + '</button>';
        }).join('');

        els.upcomingBoard.querySelectorAll('.upcoming-item').forEach(function (item) {
            item.addEventListener('click', function () {
                openShowModal(item.getAttribute('data-show-id'));
            });
        });
        wirePosterFallbackHandlers(els.upcomingBoard);
    }

    function formatUpcomingDate(value) {
        if (!value) return 'TBA';
        var date = new Date(value);
        if (isNaN(date.getTime())) return String(value);
        return date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
    }

    function groupUpcomingByDays(shows) {
        var grouped = {
            'Today': [],
            'Tomorrow': [],
            'This Week': [],
            'Next Week': [],
            'Later': []
        };

        var now = new Date();
        var today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        var tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        var weekEnd = new Date(today);
        weekEnd.setDate(weekEnd.getDate() + 7);
        var nextWeekEnd = new Date(today);
        nextWeekEnd.setDate(nextWeekEnd.getDate() + 14);

        shows.forEach(function (show) {
            var next = getFutureUpcomingEpisode(show);
            if (!next || !next.airdate) return;

            var airDate = new Date(next.airdate);
            var episodeDate = new Date(airDate.getFullYear(), airDate.getMonth(), airDate.getDate());

            if (episodeDate.getTime() === today.getTime()) {
                grouped['Today'].push(show);
            } else if (episodeDate.getTime() === tomorrow.getTime()) {
                grouped['Tomorrow'].push(show);
            } else if (episodeDate < weekEnd) {
                grouped['This Week'].push(show);
            } else if (episodeDate < nextWeekEnd) {
                grouped['Next Week'].push(show);
            } else {
                grouped['Later'].push(show);
            }
        });

        var result = {};
        Object.keys(grouped).forEach(function (key) {
            if (grouped[key].length > 0) {
                result[key] = grouped[key];
            }
        });

        return result;
    }

    function renderShows() {
        var watchNext = [];
        var upToDateShows = [];
        var staleShows = [];
        var pausedShows = [];
        var completedShows = [];
        state.filtered.forEach(function (show) {
            var tier = categorizeShow(show);
            if (tier === 'completed') completedShows.push(show);
            else if (tier === 'paused') pausedShows.push(show);
            else if (tier === 'stale') staleShows.push(show);
            else if (tier === 'uptodate') upToDateShows.push(show);
            else if (tier === 'watchnext') watchNext.push(show);
        });

        // In Watch Next, surface shows that have a new aired episode to watch.
        watchNext.sort(function (a, b) {
            var na = hasNewEpisode(a) ? 1 : 0;
            var nb = hasNewEpisode(b) ? 1 : 0;
            if (na !== nb) return nb - na;
            return compareByPreference(a, b);
        });

        // "Haven't watched in a while" uses explicit recency ordering.
        staleShows.sort(function (a, b) {
            return asTime((b.lastSeen && b.lastSeen.updated_at) || '') - asTime((a.lastSeen && a.lastSeen.updated_at) || '');
        });

        // Up-to-date shows are active titles with no currently aired episode pending.
        upToDateShows.sort(compareByPreference);

        els.watchNextCount.textContent = watchNext.length + ' shown';
        if (els.upToDateCount) els.upToDateCount.textContent = upToDateShows.length + ' shown';
        els.staleCount.textContent = staleShows.length + ' shown';
        els.pausedShowsCount.textContent = pausedShows.length + ' shown';
        els.completedShowsCount.textContent = completedShows.length + ' shown';

        renderShowList(els.watchNextGrid, watchNext, 'No active shows need watching right now.', 'watchnext');
        if (els.upToDateGrid) renderShowList(els.upToDateGrid, upToDateShows, 'No up-to-date active shows right now.', 'default');
        renderShowList(els.staleGrid, staleShows, 'No inactive catch-up shows right now.', 'default');
        renderShowList(els.pausedShowsGrid, pausedShows, 'No paused/backlog shows right now.', 'default');
        renderShowList(els.completedShowsGrid, completedShows, 'No completed shows yet.', 'default');
    }

    function getLatestAiredEpisode(show) {
        var cached = state.episodeCache && state.episodeCache[show && show.id];
        if (Array.isArray(cached) && cached.length) {
            var aired = cached.filter(function (ep) {
                return toInt(ep.season) > 0 && toInt(ep.number) > 0 && !isEpisodeUnaired(ep);
            });
            if (aired.length) {
                return aired[aired.length - 1];
            }
        }
        var meta = show && show.meta ? show.meta : null;
        if (!meta) return null;
        if (meta.nextEpisode && meta.nextEpisode.airdate && !isEpisodeUnaired(meta.nextEpisode)) {
            return meta.nextEpisode;
        }
        return meta.lastAired || null;
    }

    function isStrictlyCompletedShow(show) {
        if (!show) return false;
        var meta = show.meta || {};
        if (normalizeSeriesStatus(meta.seriesStatus) !== 'ended') return false;
        if (hasNewEpisode(show)) return false;

        var lastAired = getLatestAiredEpisode(show);
        var lastSeen = show.lastSeen;
        if (lastAired && toInt(lastAired.season) > 0 && lastSeen && toInt(lastSeen.season) > 0) {
            return epRank(lastSeen.season, lastSeen.episode) >= epRank(lastAired.season, lastAired.number);
        }

        // Fallback when episode-level metadata is missing.
        return normalizeTrackerStatus(show.status) === 'completed';
    }

    function categorizeShow(show) {
        var status = normalizeTrackerStatus(show && show.status);
        if (status === 'paused' || status === 'archived') return 'paused';
        if (isStrictlyCompletedShow(show)) return 'completed';
        if (hasNewEpisode(show)) {
            return isNotWatchedForAWhile(show) ? 'stale' : 'watchnext';
        }
        return 'uptodate';
    }

    function isManuallyPushedToWatchLater(show) {
        if (!show || !show.id) return false;
        var entry = state.overrides && state.overrides[show.id];
        return !!(entry && entry.forceWatchLater);
    }

    function isNaturallyStaleShow(show) {
        if (!hasNewEpisode(show)) return false;
        var last = asTime(show && show.lastSeen && show.lastSeen.updated_at);
        if (!last) return true;
        var thresholdMs = STALE_DAYS_THRESHOLD * 24 * 60 * 60 * 1000;
        return (Date.now() - last) >= thresholdMs;
    }

    function cleanupExpiredManualWatchLaterOverrides() {
        if (!state.shows || !state.shows.length || !state.overrides) return;

        var changed = false;
        state.shows.forEach(function (show) {
            if (!isManuallyPushedToWatchLater(show)) return;
            if (!isNaturallyStaleShow(show)) return;

            var entry = state.overrides[show.id];
            if (!entry) return;
            delete entry.forceWatchLater;
            if (!Object.keys(entry).length) {
                delete state.overrides[show.id];
            }
            changed = true;
        });

        if (changed) {
            persistUserScopedJson(STORE_KEYS.localOverrides, state.overrides);
        }
    }

    function isNotWatchedForAWhile(show) {
        if (isNaturallyStaleShow(show)) return true;
        if (!hasNewEpisode(show)) return false;
        return isManuallyPushedToWatchLater(show);
    }

    function renderShowList(container, shows, emptyText, listType) {
        if (!shows.length) {
            container.innerHTML = '<div class="empty">' + escapeHtml(emptyText) + '</div>';
            return;
        }

        var isWatchNextList = listType === 'watchnext';

        var fragment = document.createDocumentFragment();

        shows.forEach(function (show) {
            var cardNode = els.cardTemplate.content.cloneNode(true);
            var card = cardNode.querySelector('.show-card');
            var poster = cardNode.querySelector('.poster');
            var newBadge = cardNode.querySelector('.new-badge');
            var premiereBadge = cardNode.querySelector('.premiere-badge');
            var title = cardNode.querySelector('.show-title');
            var statusPill = cardNode.querySelector('.status-pill');
            var metaRow = cardNode.querySelector('.meta-row');
            var description = cardNode.querySelector('.description');
            var watchRow = cardNode.querySelector('.watch-row');
            var nextRow = cardNode.querySelector('.next-row');
            var tags = cardNode.querySelector('.tags');

            var meta = show.meta || {};
            var posterSrc = meta.poster || FALLBACK_POSTER;
            var hasPoster = !!meta.poster && posterSrc !== FALLBACK_POSTER;
            applyPosterSrc(poster, posterSrc);
            poster.alt = show.title + ' poster';
            if (newBadge) newBadge.hidden = !hasNewEpisode(show);
            if (premiereBadge) premiereBadge.hidden = !hasUpcomingPremiere(show);

            // The poster is its own button: with real art it magnifies into the
            // shared lightbox; the placeholder falls through to opening the modal
            // (nothing worth zooming). Either way the card's modal-open handler
            // ignores it because it's a <button>.
            var posterWrap = cardNode.querySelector('.poster-wrap');
            if (posterWrap) {
                posterWrap.classList.toggle('has-poster', hasPoster);
                posterWrap.setAttribute('aria-label', hasPoster ? ('View ' + show.title + ' poster full size') : ('Open ' + show.title));
                posterWrap.addEventListener('click', function (event) {
                    event.stopPropagation();
                    if (hasPoster) {
                        openPosterLightbox(posterSrc, show.title + ' poster');
                    } else {
                        openShowModal(show.id);
                    }
                });
            }
            title.textContent = show.title;

            statusPill.textContent = capitalize(show.status);
            statusPill.classList.add(show.status);

            var seriesBadge = cardNode.querySelector('.series-badge');
            if (seriesBadge) {
                var sInfo = seriesStatusLabel(meta.seriesStatus);
                if (sInfo) {
                    seriesBadge.textContent = sInfo.text;
                    seriesBadge.classList.add('series-' + sInfo.cls);
                    seriesBadge.hidden = false;
                } else {
                    seriesBadge.hidden = true;
                }
            }

            if (isWatchNextList) {
                card.classList.add('watchnext-card');
                if (statusPill) statusPill.hidden = true;
                if (seriesBadge) seriesBadge.hidden = true;
                if (metaRow) metaRow.hidden = true;
                if (description) description.hidden = true;
                if (tags) tags.hidden = true;

                watchRow.textContent = buildWatchNextFocusRow(show);
                nextRow.textContent = buildWatchNextSecondaryRow(show);

                var actions = document.createElement('div');
                actions.className = 'watchnext-actions';
                var markBtn = document.createElement('button');
                markBtn.type = 'button';
                markBtn.className = 'btn btn-primary btn-sm watchnext-mark-btn';
                markBtn.textContent = 'Mark as watched';
                markBtn.addEventListener('click', function (event) {
                    event.stopPropagation();
                    if (markBtn.disabled) return;
                    markBtn.disabled = true;
                    var success = false;
                    var previousText = markBtn.textContent;
                    markBtn.textContent = 'Marking...';
                    Promise.resolve(markNextEpisodeAsWatched(show)).then(function () {
                        success = true;
                        markBtn.classList.add('is-success');
                        markBtn.textContent = 'Watched ✓';
                    }).catch(function (error) {
                        console.warn('Could not mark next episode as watched for', show.title, error);
                        setStatus('Could not mark next episode for ' + show.title + '.', true);
                    }).finally(function () {
                        if (!success) {
                            markBtn.disabled = false;
                            markBtn.textContent = previousText;
                            return;
                        }
                        window.setTimeout(function () {
                            markBtn.disabled = false;
                            markBtn.classList.remove('is-success');
                            markBtn.textContent = previousText;
                        }, 420);
                    });
                });
                actions.appendChild(markBtn);
                var cardContent = cardNode.querySelector('.card-content');
                if (cardContent) cardContent.appendChild(actions);
            } else {
                metaRow.textContent = buildMetaRow(show);
                description.textContent = stripHtml(meta.summary || 'No external description available yet.');

                watchRow.textContent = 'Watched episodes: ' + show.watchedCount + buildLastSeenSuffix(show);
                nextRow.textContent = buildNextRow(show);

                if (isManuallyPushedToWatchLater(show)) {
                    var watchLaterTag = document.createElement('span');
                    watchLaterTag.className = 'tag tag-watchlater';
                    watchLaterTag.textContent = 'Watch later';
                    tags.appendChild(watchLaterTag);
                }

                (meta.genres || []).slice(0, 4).forEach(function (genre) {
                    var tag = document.createElement('span');
                    tag.className = 'tag';
                    tag.textContent = genre;
                    tags.appendChild(tag);
                });

                if (meta.imdbRating) {
                    var rating = document.createElement('span');
                    rating.className = 'tag tag-rating';
                    rating.textContent = '\u2b50 ' + meta.imdbRating;
                    tags.appendChild(rating);
                }
            }

            card.dataset.showId = show.id;
            card.addEventListener('click', function (event) {
                if (event.target.closest('button, textarea, input, a, label, select')) return;
                openShowModal(show.id);
            });
            fragment.appendChild(cardNode);
        });

        container.innerHTML = '';
        container.appendChild(fragment);
    }

    function buildMetaRow(show) {
        var meta = show.meta || {};
        var parts = [];
        if (meta.premiered) parts.push('Premiered ' + formatDate(meta.premiered));
        if (meta.network) parts.push(meta.network);
        if (meta.provider) parts.push('via ' + meta.provider);
        return parts.length ? parts.join(' · ') : 'Metadata pending';
    }

    function buildLastSeenSuffix(show) {
        if (!show.lastSeen || !show.lastSeen.season) return '';
        return ' · Last seen S' + show.lastSeen.season + 'E' + show.lastSeen.episode;
    }

    function getNextEpisodeToWatchFromKnownData(show) {
        if (!show || !show.id) return null;

        var cached = state.episodeCache && state.episodeCache[show.id];
        if (Array.isArray(cached) && cached.length) {
            var nextFromCatalog = cached.slice().sort(byEpOrder).find(function (ep) {
                return !isEpisodeWatched(show, ep) && !isEpisodeUnaired(ep);
            });
            if (nextFromCatalog) return nextFromCatalog;
        }

        var meta = show.meta || {};
        if (meta.lastAired && !isEpisodeWatched(show, meta.lastAired) && !isEpisodeUnaired(meta.lastAired)) {
            return meta.lastAired;
        }
        if (meta.nextEpisode && !isEpisodeWatched(show, meta.nextEpisode) && !isEpisodeUnaired(meta.nextEpisode)) {
            return meta.nextEpisode;
        }

        return null;
    }

    function buildWatchNextFocusRow(show) {
        var next = getNextEpisodeToWatchFromKnownData(show);
        if (next && toInt(next.season) > 0 && toInt(next.number) > 0) {
            var epName = next.name ? (' - ' + stripHtml(next.name)) : '';
            return 'Watch now: S' + next.season + 'E' + next.number + epName;
        }
        if (hasNewEpisode(show)) return 'Watch now: next aired episode';
        return 'No aired episode pending right now';
    }

    function buildWatchNextSecondaryRow(show) {
        var next = getNextEpisodeToWatchFromKnownData(show);
        if (next && next.airdate) {
            return 'Aired ' + formatDate(next.airdate) + buildLastSeenSuffix(show);
        }
        return buildNextRow(show) + buildLastSeenSuffix(show);
    }

    function buildNextRow(show) {
        var next = getFutureUpcomingEpisode(show);
        if (!next || !next.airdate) {
            if (hasNewEpisode(show)) return 'New aired episode ready to watch';
            return 'Next episode: unknown';
        }
        if (isSeasonPremiere(next)) {
            return 'Season ' + next.season + ' premiere: ' + formatDate(next.airdate);
        }
        return 'Next: S' + (next.season || '?') + 'E' + (next.number || '?') + ' on ' + formatDate(next.airdate);
    }

    // ---- Watched-episode model -------------------------------------------
    // show.lastSeen is the imported "watched up to here" marker. Manual ticks
    // live in show.episodeStates = { "SxN": true|false } and override the
    // baseline, so imported TV Time progress appears watched while individual
    // toggles still work.

    function epRank(season, number) {
        return toInt(season) * 100000 + toInt(number);
    }

    function byEpOrder(a, b) {
        return epRank(a.season, a.number) - epRank(b.season, b.number);
    }

    function episodeKey(season, number) {
        return toInt(season) + 'x' + toInt(number);
    }

    function isEpisodeWatched(show, episode) {
        var states = show.episodeStates || {};
        var key = episodeKey(episode.season, episode.number);
        if (Object.prototype.hasOwnProperty.call(states, key)) {
            return states[key] === true;
        }
        if (show.lastSeen && show.lastSeen.season) {
            return epRank(episode.season, episode.number) <= epRank(show.lastSeen.season, show.lastSeen.episode);
        }
        return false;
    }

    // An episode with a known future air date hasn't aired yet and can't be
    // marked as watched. Episodes with no/blank air date are treated as aired.
    function isEpisodeUnaired(episode) {
        var t = asTime(episode && episode.airdate);
        return t > 0 && t > Date.now();
    }

    function computeLastSeen(show, catalog) {
        if (!Array.isArray(catalog) || !catalog.length) return show.lastSeen || null;
        var best = null;
        catalog.forEach(function (ep) {
            if (isEpisodeWatched(show, ep)) {
                if (!best || epRank(ep.season, ep.number) > epRank(best.season, best.episode)) {
                    best = { season: toInt(ep.season), episode: toInt(ep.number), updated_at: new Date().toISOString() };
                }
            }
        });
        return best;
    }

    // TV Time's export only lists a "latest seen" row for recently-watched shows,
    // but every followed show has a reliable nb_episodes_seen count. For shows
    // with a count but no progress marker (e.g. finished long ago), seed lastSeen
    // to the Nth aired episode so the imported progress shows as watched.
    function maybeSeedProgressFromCount(show, catalog) {
        if (!catalog || !catalog.length) return;
        if (show.lastSeen && show.lastSeen.season) return;
        if (show.episodeStates && Object.keys(show.episodeStates).length) return;
        var count = toInt(show.watchedCount);
        if (count <= 0) return;
        var sorted = catalog.filter(function (ep) {
            return toInt(ep.season) >= 1 && toInt(ep.number) > 0 && !isEpisodeUnaired(ep);
        }).sort(byEpOrder);
        var target = sorted[Math.min(count, sorted.length) - 1];
        if (!target) return;
        patchShow(show.id, {
            lastSeen: {
                season: toInt(target.season),
                episode: toInt(target.number),
                updated_at: new Date().toISOString()
            }
        });
    }

    // Flip one or more episodes watched/unwatched and persist in a single patch.
    function applyWatchedChange(show, episodesToChange, watched, catalog) {
        if (!show.episodeStates) show.episodeStates = {};
        var delta = 0;
        var markedWatched = [];
        var markedUnwatched = [];
        episodesToChange.forEach(function (ep) {
            if (watched && isEpisodeUnaired(ep)) return; // can't watch the future
            var was = isEpisodeWatched(show, ep);
            show.episodeStates[episodeKey(ep.season, ep.number)] = watched;
            if (was !== watched) {
                delta += watched ? 1 : -1;
                if (watched) markedWatched.push(ep);
                else markedUnwatched.push(ep);
            }
        });
        var nextCount = Math.max(0, toInt(show.watchedCount) + delta);
        var nextStatus = show.status;
        if (nextCount > 0 && show.status === 'paused') nextStatus = 'active';
        // Auto-complete ended series when all aired episodes are watched.
        // episodeStates were updated above, so isEpisodeWatched sees the new state.
        if (watched && nextStatus === 'active') {
            var m = show.meta || {};
            if (normalizeSeriesStatus(m.seriesStatus) === 'ended' && allAiredEpisodesWatched(show, catalog)) {
                nextStatus = 'completed';
            }
        }
        // If a completed show no longer has all aired episodes watched, reopen it.
        if (nextStatus === 'completed' && !allAiredEpisodesWatched(show, catalog)) {
            nextStatus = 'active';
        }
        patchShow(show.id, {
            watchedCount: nextCount,
            episodeStates: show.episodeStates,
            lastSeen: computeLastSeen(show, catalog),
            status: nextStatus,
            clearForceWatchLater: watched === true
        });

        if (markedWatched.length) appendWatchHistory(show, markedWatched);
        if (markedUnwatched.length) pruneWatchHistory(show.id, markedUnwatched);
    }

    function appendWatchHistory(show, episodes) {
        if (!show || !show.id || !Array.isArray(episodes) || !episodes.length) return;
        var base = Date.now();
        var history = Array.isArray(state.watchHistory) ? state.watchHistory.slice() : [];

        episodes.slice().sort(byEpOrder).forEach(function (ep, idx) {
            history.push({
                id: String(show.id) + ':' + episodeKey(ep.season, ep.number) + ':' + String(base + idx),
                showId: show.id,
                showTitle: show.title || '',
                season: toInt(ep.season),
                episode: toInt(ep.number),
                episodeName: ep.name || '',
                loggedAt: new Date(base + idx).toISOString()
            });
        });

        if (history.length > WATCH_HISTORY_MAX) {
            history = history.slice(history.length - WATCH_HISTORY_MAX);
        }

        state.watchHistory = history;
        persistUserScopedJson(STORE_KEYS.watchHistory, state.watchHistory);
    }

    function pruneWatchHistory(showId, episodes) {
        if (!showId || !Array.isArray(episodes) || !episodes.length) return;
        var history = Array.isArray(state.watchHistory) ? state.watchHistory.slice() : [];

        episodes.forEach(function (ep) {
            var targetSeason = toInt(ep.season);
            var targetEpisode = toInt(ep.number);
            for (var i = history.length - 1; i >= 0; i--) {
                var entry = history[i];
                if (!entry) continue;
                if (entry.showId === showId && toInt(entry.season) === targetSeason && toInt(entry.episode) === targetEpisode) {
                    history.splice(i, 1);
                    break;
                }
            }
        });

        state.watchHistory = history;
        persistUserScopedJson(STORE_KEYS.watchHistory, state.watchHistory);
    }

    function setEpisodeWatched(show, episode, watched, catalog) {
        applyWatchedChange(show, [episode], watched, catalog);
    }

    function setSeasonWatched(show, seasonNumber, watched, catalog) {
        var eps = (catalog || []).filter(function (ep) { return toInt(ep.season) === toInt(seasonNumber); });
        if (!eps.length) return;
        applyWatchedChange(show, eps, watched, catalog);
    }

    function findNextEpisode(show, catalog) {
        var sorted = (catalog || []).slice().sort(byEpOrder);
        return sorted.find(function (ep) { return !isEpisodeWatched(show, ep); }) || null;
    }

    async function markNextEpisodeAsWatched(show) {
        var catalog = await loadEpisodeCatalog(show);
        var next = findNextEpisode(show, catalog);
        if (next && isEpisodeUnaired(next)) {
            setStatus('The next episode of ' + show.title + ' hasn\u2019t aired yet.');
            return;
        }
        if (next) {
            applyWatchedChange(show, [next], true, catalog);
            setStatus('Marked S' + next.season + 'E' + next.number + ' watched for ' + show.title + '.');
            return;
        }
        patchShow(show.id, {
            watchedCount: Math.max(0, (show.watchedCount || 0) + 1),
            status: show.status === 'paused' ? 'active' : show.status
        });
    }

    async function removeLatestWatchedEpisode(show) {
        var catalog = await loadEpisodeCatalog(show);
        if (catalog.length) {
            var last = null;
            catalog.slice().sort(byEpOrder).forEach(function (ep) {
                if (isEpisodeWatched(show, ep)) last = ep;
            });
            if (last) {
                applyWatchedChange(show, [last], false, catalog);
                return;
            }
        }
        patchShow(show.id, {
            watchedCount: Math.max(0, (show.watchedCount || 0) - 1),
            status: show.status === 'completed' ? 'active' : show.status
        });
    }

    function groupEpisodesBySeason(episodes) {
        var map = {};
        episodes.forEach(function (ep) {
            var s = toInt(ep.season);
            if (!map[s]) map[s] = [];
            map[s].push(ep);
        });
        return Object.keys(map)
            .map(function (s) { return toInt(s); })
            .sort(function (a, b) { return a - b; })
            .map(function (s) {
                return {
                    season: s,
                    episodes: map[s].slice().sort(function (a, b) { return toInt(a.number) - toInt(b.number); })
                };
            });
    }

    async function openShowModal(showId) {
        var show = state.shows.find(function (item) { return item.id === showId; });
        if (!show) return;
        state.modalRequestId = (state.modalRequestId || 0) + 1;
        var requestId = state.modalRequestId;
        state.modalShowId = showId;
        state.modalOpenSeasons = null;
        if (els.showModalMenu) els.showModalMenu.open = false;
        els.showModal.hidden = false;
        els.showModalTitle.textContent = show.title;
        els.showModalSubtitle.textContent = 'Loading episodes…';
        setModalPoster(show);
        els.modalFactsText.textContent = '';
        els.modalSummary.textContent = '';
        els.modalProgress.textContent = '';
        els.modalSeasons.innerHTML = '<div class="empty">Loading episode list…</div>';

        var episodes = await loadEpisodeCatalog(show);
        if (state.modalShowId !== showId || state.modalRequestId !== requestId || !els.showModal || els.showModal.hidden) return;
        // Opening details should not modify watch state or list placement.
        var current = state.shows.find(function (item) { return item.id === showId; }) || show;
        renderShowModal(current, episodes);
    }

    // --- Auto-complete ended shows ---------------------------------------
    // Ended series become Completed automatically once all aired episodes are
    // watched, and switch back to Active if progress is later undone.

    function allAiredEpisodesWatched(show, catalog) {
        if (!Array.isArray(catalog) || !catalog.length) return false;
        // Ignore specials (season 0) for completion and only count regular aired eps.
        var aired = catalog.filter(function (ep) {
            return toInt(ep.season) >= 1 && toInt(ep.number) > 0 && !isEpisodeUnaired(ep);
        });
        if (!aired.length) return false;
        // Import rows can carry a reliable total seen count without per-episode marks.
        if (toInt(show && show.watchedCount) >= aired.length) return true;
        return aired.every(function (ep) { return isEpisodeWatched(show, ep); });
    }

    // Accurate per-show check used when a modal opens (we have the full catalog).
    function maybeAutoCompleteFromCatalog(show, episodes) {
        if (!show || show.status !== 'active') return;
        var meta = show.meta || {};
        if (normalizeSeriesStatus(meta.seriesStatus) !== 'ended') return;
        if (!allAiredEpisodesWatched(show, episodes)) return;
        patchShow(show.id, { status: 'completed' });
        setStatus('Marked “' + show.title + '” completed — it has ended and you\u2019ve watched every episode.');
    }

    // Cheap heuristic used for a batch pass over the whole list (no catalog):
    // an ended series whose last-aired episode is at or below the user's progress
    // marker is fully watched. Relies on meta.lastAired + show.lastSeen.
    function shouldAutoComplete(show) {
        if (!show || show.status !== 'active') return false;
        var meta = show.meta || {};
        if (normalizeSeriesStatus(meta.seriesStatus) !== 'ended') return false;
        var lastAired = getLatestAiredEpisode(show);
        if (!lastAired || !lastAired.season) return false;
        if (!show.lastSeen || !show.lastSeen.season) return false;
        return epRank(show.lastSeen.season, show.lastSeen.episode) >= epRank(lastAired.season, lastAired.number);
    }

    // Batch pass over the loaded shows; flips qualifying ones to Completed
    // WITHOUT re-rendering per show (the caller renders once). Returns the count.
    function autoCompleteEndedShows() {
        var changed = 0;
        (state.shows || []).forEach(function (show) {
            if (!shouldAutoComplete(show)) return;
            show.status = 'completed';
            show.localStatus = 'completed';
            updateShowOverride(show.id, {
                watchedCount: show.watchedCount,
                status: 'completed',
                lastSeen: show.lastSeen || null,
                episodeStates: show.episodeStates || {}
            });
            changed += 1;
        });
        return changed;
    }

    // During a full metadata refresh we have fresh metadata for every show.
    // Re-check ended titles with full episode catalogs so completion status is
    // accurate even when the user does not open individual modals.
    async function reconcileEndedShowCompletionFromCatalog() {
        var candidates = (state.shows || []).filter(function (show) {
            var meta = show && show.meta ? show.meta : {};
            var seriesStatus = normalizeSeriesStatus(meta.seriesStatus);
            var trackerStatus = normalizeTrackerStatus(show && show.status);
            return seriesStatus === 'ended' && (trackerStatus === 'active' || trackerStatus === 'completed');
        });
        var changed = 0;

        for (var i = 0; i < candidates.length; i++) {
            var show = candidates[i];
            updateLoadingSub('Checking ended-show completion… ' + (i + 1) + ' / ' + candidates.length);

            var catalog = [];
            try {
                catalog = await loadEpisodeCatalog(show);
            } catch (error) {
                console.warn('Completion catalog check failed for', show.title, error);
                continue;
            }
            if (!catalog.length) continue;

            var nextStatus = allAiredEpisodesWatched(show, catalog) ? 'completed' : 'active';
            if (show.status === nextStatus) continue;

            show.status = nextStatus;
            show.localStatus = nextStatus;
            updateShowOverride(show.id, {
                watchedCount: show.watchedCount,
                status: nextStatus,
                lastSeen: show.lastSeen || null,
                episodeStates: show.episodeStates || {}
            });
            changed += 1;
        }

        return changed;
    }

    function closeShowModal() {
        state.modalShowId = '';
        state.modalEpisodes = [];
        closePosterLightbox();
        if (els.showModalMenu) els.showModalMenu.open = false;
        if (els.showModal) els.showModal.hidden = true;
    }

    // Resets the "Fix show link" tool back to its collapsed state. Pass true when
    // the show has episodes (i.e. is properly linked) to adjust the helper copy.
    function resetFixLinkUi(hasEpisodes) {
        if (!els.fixLink) return;
        els.fixLink.hidden = false;
        if (els.fixLinkNote) {
            els.fixLinkNote.textContent = hasEpisodes
                ? 'Wrong poster, summary, or episode match? Paste a direct IMDb or TVMaze page to override this show.'
                : 'This show is not linked to a database yet, so there is no poster or episode list. Link it with its IMDb or TVMaze page to pull the right details.';
        }
        if (els.fixLinkToggle) {
            els.fixLinkToggle.textContent = hasEpisodes ? '🔗 Change database link' : '🔗 Fix show link';
        }
        if (els.fixLinkForm) els.fixLinkForm.hidden = true;
        if (els.fixLinkToggle) els.fixLinkToggle.hidden = false;
        if (els.fixLinkInput) els.fixLinkInput.value = '';
        if (els.fixLinkSearchInput) els.fixLinkSearchInput.value = '';
        if (els.fixLinkSearchResults) els.fixLinkSearchResults.innerHTML = '';
        if (els.fixLinkMsg) { els.fixLinkMsg.hidden = true; els.fixLinkMsg.textContent = ''; els.fixLinkMsg.className = 'modal-fix-link-msg'; }
        if (els.fixLinkSubmit) { els.fixLinkSubmit.disabled = false; els.fixLinkSubmit.textContent = 'Match'; }
        switchFixLinkMode('paste');
    }

    function showFixLinkMsg(message, isError) {
        if (!els.fixLinkMsg) return;
        els.fixLinkMsg.textContent = message;
        els.fixLinkMsg.className = 'modal-fix-link-msg' + (isError ? ' error' : '');
        els.fixLinkMsg.hidden = !message;
    }

    function switchFixLinkMode(mode) {
        var tabs = [els.fixLinkPasteTab, els.fixLinkSearchTab];
        var modes = [els.fixLinkPasteMode, els.fixLinkSearchMode];
        
        tabs.forEach(function (tab) {
            if (!tab) return;
            tab.classList.toggle('active', tab.getAttribute('data-mode') === mode);
        });
        
        modes.forEach(function (m) {
            if (!m) return;
            m.classList.toggle('active', modes.indexOf(m) === (mode === 'search' ? 1 : 0));
            m.classList.toggle('hidden', modes.indexOf(m) !== (mode === 'search' ? 1 : 0));
        });

        if (mode === 'search' && els.fixLinkSearchInput) {
            setTimeout(function () { els.fixLinkSearchInput.focus(); }, 50);
        }
    }

    var fixLinkSearchTimer = null;
    var fixLinkSearchSeq = 0;

    function scheduleFixLinkSearch() {
        if (fixLinkSearchTimer) clearTimeout(fixLinkSearchTimer);
        var query = els.fixLinkSearchInput ? String(els.fixLinkSearchInput.value || '').trim() : '';
        if (query.length < 2) {
            fixLinkSearchSeq += 1;
            if (els.fixLinkSearchResults) els.fixLinkSearchResults.innerHTML = '';
            showFixLinkMsg(query.length ? 'Keep typing…' : '');
            return;
        }
        fixLinkSearchTimer = setTimeout(runFixLinkSearch, 500);
    }

    async function runFixLinkSearch() {
        fixLinkSearchSeq += 1;
        var currentSeq = fixLinkSearchSeq;
        var query = els.fixLinkSearchInput ? String(els.fixLinkSearchInput.value || '').trim() : '';
        
        if (query.length < 2) {
            if (els.fixLinkSearchResults) els.fixLinkSearchResults.innerHTML = '';
            return;
        }

        showFixLinkMsg('Searching databases…');
        if (els.fixLinkSearchResults) els.fixLinkSearchResults.innerHTML = '';

        try {
            var results = await searchMultipleDbsForShow(query);
            if (fixLinkSearchSeq !== currentSeq) return; // another search superseded this one
            
            if (!results || !results.length) {
                showFixLinkMsg('No results found. Try a different name or paste a direct link.', true);
                if (els.fixLinkSearchResults) els.fixLinkSearchResults.innerHTML = '<div class="addshow-empty">No results found</div>';
                return;
            }

            showFixLinkMsg('');
            renderFixLinkSearchResults(results);
        } catch (error) {
            if (fixLinkSearchSeq !== currentSeq) return;
            console.warn('Fix-link search failed', error);
            showFixLinkMsg('Search failed. Try a direct link instead.', true);
        }
    }

    async function searchMultipleDbsForShow(query) {
        // Search both TVMaze and IMDb (via OMDb or IMDb bridge)
        var results = [];

        try {
            var tvmazeResults = await searchTvMazeShows(query);
            if (Array.isArray(tvmazeResults)) {
                tvmazeResults.forEach(function (show) {
                    results.push({
                        title: show.name || show.title || query,
                        year: show.premiered ? new Date(show.premiered).getFullYear() : null,
                        tvmazeId: show.id,
                        tvmazePoster: show.image && show.image.medium ? show.image.medium : null,
                        source: 'tvmaze',
                        summary: show.summary && show.summary.replace(/<[^>]*>/g, '') || ''
                    });
                });
            }
        } catch (error) {
            console.warn('TVMaze search failed:', error);
        }

        return results.sort(function (a, b) {
            return (a.title || '').localeCompare(b.title || '');
        });
    }

    async function searchTvMazeShows(query) {
        // TVMaze API: GET /search/shows?q=query
        var url = 'https://api.tvmaze.com/search/shows?q=' + encodeURIComponent(query);
        var resp = await fetch(url);
        if (!resp.ok) throw new Error('TVMaze search failed: ' + resp.status);
        var data = await resp.json();
        return data.map(function (item) { return item.show; });
    }

    function renderFixLinkSearchResults(results) {
        if (!els.fixLinkSearchResults) return;
        els.fixLinkSearchResults.innerHTML = '';

        if (!results.length) {
            els.fixLinkSearchResults.innerHTML = '<div class="addshow-empty">No shows found</div>';
            return;
        }

        var fragment = document.createDocumentFragment();
        results.slice(0, 20).forEach(function (result) {
            var row = document.createElement('div');
            row.className = 'addshow-result';

            var poster = document.createElement('img');
            poster.src = result.tvmazePoster || FALLBACK_POSTER;
            poster.alt = result.title;
            poster.className = 'addshow-poster';

            var info = document.createElement('div');
            info.className = 'addshow-info';

            var title = document.createElement('strong');
            title.textContent = result.title || 'Unknown';
            title.className = 'addshow-title';

            var yearText = result.year ? ' (' + result.year + ')' : '';
            var sourceText = ' [' + (result.source === 'tvmaze' ? 'TVMaze' : 'IMDb') + ']';
            var subtitle = document.createElement('span');
            subtitle.textContent = yearText + sourceText;
            subtitle.className = 'addshow-subtitle';

            var summary = document.createElement('span');
            summary.textContent = stripHtml(result.summary || '').substring(0, 100);
            summary.className = 'addshow-summary';

            info.appendChild(title);
            info.appendChild(subtitle);
            info.appendChild(summary);

            var selectBtn = document.createElement('button');
            selectBtn.type = 'button';
            selectBtn.className = 'btn btn-accent btn-sm';
            selectBtn.textContent = 'Select';
            selectBtn.addEventListener('click', function () {
                selectFixLinkResult(result);
            });

            row.appendChild(poster);
            row.appendChild(info);
            row.appendChild(selectBtn);
            fragment.appendChild(row);
        });

        els.fixLinkSearchResults.appendChild(fragment);
    }

    async function selectFixLinkResult(result) {
        var showId = state.modalShowId;
        var show = state.shows.find(function (item) { return item.id === showId; });
        if (!show) return;

        if (els.fixLinkSubmit) els.fixLinkSubmit.disabled = true;
        if (els.fixLinkSearchResults) {
            els.fixLinkSearchResults.querySelectorAll('button').forEach(function (btn) { btn.disabled = true; });
        }
        showFixLinkMsg('Matching…');

        try {
            var meta;
            if (result.tvmazeId) {
                meta = await resolveMetaFromTvMaze(result.tvmazeId, show.title);
            } else {
                throw new Error('No valid database ID found');
            }

            if (state.modalShowId !== showId) return; // modal changed
            if (!meta || (!meta.tvmazeId && !meta.imdbId)) {
                showFixLinkMsg('Could not load show details. Try another result.', true);
                if (els.fixLinkSubmit) els.fixLinkSubmit.disabled = false;
                if (els.fixLinkSearchResults) {
                    els.fixLinkSearchResults.querySelectorAll('button').forEach(function (btn) { btn.disabled = false; });
                }
                return;
            }

            // Re-link the show
            delete state.episodeCache[show.id];
            setManualLinkMeta(show.id, meta, { preferredLookup: result.source });
            setCachedMeta(show, meta);
            updateCustomShowIds(show.id, meta);

            var episodes = await loadEpisodeCatalog(show);
            if (state.modalShowId !== showId) return;
            maybeSeedProgressFromCount(show, episodes);
            var updated = state.shows.find(function (item) { return item.id === showId; }) || show;
            renderShowModal(updated, episodes);

            applyFilters();
            render();

            if (episodes.length) {
                setStatus('Linked "' + show.title + '" — pulled ' + episodes.length + ' episodes from ' + result.source + '.');
            } else {
                setStatus('Linked "' + show.title + '" to ' + result.source + '. Episode tracking is still unavailable for this title.');
            }

            // Close the form and switch back to paste mode
            if (els.fixLinkForm) els.fixLinkForm.hidden = true;
            if (els.fixLinkToggle) els.fixLinkToggle.hidden = false;
            if (els.fixLinkSearchInput) els.fixLinkSearchInput.value = '';
            switchFixLinkMode('paste');
        } catch (error) {
            console.warn('Fix-link search selection failed', error);
            if (state.modalShowId === showId) {
                showFixLinkMsg('Something went wrong. Try another result or paste a direct link.', true);
                if (els.fixLinkSubmit) els.fixLinkSubmit.disabled = false;
                if (els.fixLinkSearchResults) {
                    els.fixLinkSearchResults.querySelectorAll('button').forEach(function (btn) { btn.disabled = false; });
                }
            }
        }
    }

    function toggleUnfixable() {
        var showId = state.modalShowId;
        if (!showId) return;
        var show = state.shows.find(function (item) { return item.id === showId; });
        if (!show) return;

        var isCurrentlyUnfixable = !!(state.unfixableShows && state.unfixableShows[showId]);
        
        if (!state.unfixableShows) state.unfixableShows = {};
        
        if (isCurrentlyUnfixable) {
            delete state.unfixableShows[showId];
            setStatus('Unmarked "' + show.title + '" as unfixable.');
        } else {
            state.unfixableShows[showId] = true;
            setStatus('Marked "' + show.title + '" as unfixable — it will no longer appear in the fix list.');
        }

        persistUserScopedJson(STORE_KEYS.unfixableShows, state.unfixableShows);
        updateMarkUnfixableBtn();
        refreshUnresolvedControl();
        applyFilters();
        render();
    }

    function updateMarkUnfixableBtn() {
        if (!els.markUnfixableBtn) return;
        var showId = state.modalShowId;
        if (!showId) {
            els.markUnfixableBtn.hidden = true;
            return;
        }
        
        var isUnfixable = !!(state.unfixableShows && state.unfixableShows[showId]);
        els.markUnfixableBtn.textContent = isUnfixable ? '✓ Marked as unfixable' : 'Mark as unfixable';
        els.markUnfixableBtn.classList.toggle('active', isUnfixable);
        els.markUnfixableBtn.hidden = false;
    }

    // Pulls a supported external id out of a pasted URL or raw token.
    function parseFixedShowLink(raw) {
        var text = String(raw || '').trim();
        var imdbMatch = text.match(/tt\d{6,10}/i);
        if (imdbMatch) {
            return { type: 'imdb', imdbId: imdbMatch[0].toLowerCase(), label: imdbMatch[0].toLowerCase() };
        }

        var tvmazeMatch = text.match(/tvmaze\.com\/shows\/(\d+)/i);
        if (!tvmazeMatch) tvmazeMatch = text.match(/(?:tvmaze|maze)\s*[:#-]?\s*(\d{1,10})/i);
        if (tvmazeMatch) {
            return { type: 'tvmaze', tvmazeId: toInt(tvmazeMatch[1]), label: 'TVMaze #' + toInt(tvmazeMatch[1]) };
        }

        return null;
    }

    // Resolves fresh metadata for a show from an IMDb id. Prefers OMDb (rich
    // details, and it bridges to TVMaze for the episode list) when a key is set,
    // then falls back to a direct TVMaze lookup. Always carries the imdb id so at
    // minimum the show gets linked even if it isn't on TVMaze.
    async function resolveMetaFromImdb(imdbId, title) {
        var omdbKey = loadUserScopedValue(STORE_KEYS.omdbApiKey) || '';
        if (omdbKey) {
            try {
                var omdb = await fetchOmdbById(imdbId, omdbKey, title);
                if (omdb && (omdb.tvmazeId || omdb.imdbId)) return omdb;
            } catch (error) {
                console.warn('OMDb lookup for fix-link failed, trying TVMaze', error);
            }
        }

        var show = await fetchJson('https://api.tvmaze.com/lookup/shows?imdb=' + encodeURIComponent(imdbId));
        if (show) {
            var meta = metaFromTvMazeShow(show, title);
            if (!meta.imdbId) meta.imdbId = imdbId;
            try {
                var links = await fetchEpisodeLinks(show._links);
                meta.nextEpisode = links.nextEpisode;
                meta.lastAired = links.lastAired;
            } catch (error) { /* keep meta without episode links */ }
            return meta;
        }

        // Not on TVMaze: still link the imdb id so IMDb button + future OMDb
        // enrichment work, even though episodes can't be tracked.
        return {
            provider: 'IMDb',
            poster: FALLBACK_POSTER,
            title: title || '',
            summary: '',
            genres: [],
            imdbId: imdbId,
            imdbRating: '',
            premiered: '',
            network: '',
            runtime: 0,
            tvmazeId: 0,
            seriesStatus: '',
            nextEpisode: null,
            lastAired: null,
            fetchedAt: new Date().toISOString()
        };
    }

    async function resolveMetaFromTvMaze(tvmazeId, title) {
        var meta = await fetchTvMazeById(tvmazeId, title || '', '');
        return meta && (meta.tvmazeId || meta.imdbId) ? meta : null;
    }

    // Keeps a custom show's stored ids in sync after a re-link so de-duplication
    // (collectTrackedIds) stays correct. No-op for imported shows.
    function updateCustomShowIds(showId, meta) {
        var changed = false;
        (state.customShows || []).forEach(function (custom) {
            if (custom.id !== showId) return;
            var tv = toInt(meta.tvmazeId);
            if (tv && toInt(custom.tvmazeId) !== tv) { custom.tvmazeId = tv; changed = true; }
            if (meta.imdbId && custom.imdbId !== meta.imdbId) { custom.imdbId = meta.imdbId; changed = true; }
            if (changed) custom.updatedAt = Date.now();
        });
        if (changed) persistUserScopedJson(STORE_KEYS.customShows, state.customShows);
    }

    async function submitFixLink() {
        var showId = state.modalShowId;
        var show = state.shows.find(function (item) { return item.id === showId; });
        if (!show) return;

        var linkedSource = parseFixedShowLink(els.fixLinkInput ? els.fixLinkInput.value : '');
        if (!linkedSource) {
            showFixLinkMsg('Enter a valid IMDb link/ID or a TVMaze show URL/ID.', true);
            return;
        }

        els.fixLinkSubmit.disabled = true;
        els.fixLinkSubmit.textContent = 'Matching…';
        showFixLinkMsg('Looking up show…');

        try {
            var meta = linkedSource.type === 'tvmaze'
                ? await resolveMetaFromTvMaze(linkedSource.tvmazeId, show.title)
                : await resolveMetaFromImdb(linkedSource.imdbId, show.title);
            if (state.modalShowId !== showId) return; // modal changed while loading
            if (!meta || (!meta.tvmazeId && !meta.imdbId)) {
                showFixLinkMsg('Could not find that show. Double-check the pasted IMDb or TVMaze link and try again.', true);
                els.fixLinkSubmit.disabled = false;
                els.fixLinkSubmit.textContent = 'Match';
                return;
            }

            // Re-link: drop the stale (empty) episode cache, cache the new meta,
            // and keep any custom-show id record in sync for de-duplication.
            delete state.episodeCache[show.id];
            setManualLinkMeta(show.id, meta, { preferredLookup: linkedSource.type });
            setCachedMeta(show, meta);
            updateCustomShowIds(show.id, meta);

            var episodes = await loadEpisodeCatalog(show);
            if (state.modalShowId !== showId) return;
            maybeSeedProgressFromCount(show, episodes);
            var updated = state.shows.find(function (item) { return item.id === showId; }) || show;
            renderShowModal(updated, episodes);

            // Refresh the card grid so the newly linked poster/badges show there too.
            applyFilters();
            render();

            if (episodes.length) {
                setStatus('Linked “' + show.title + '” — pulled ' + episodes.length + ' episodes from ' + linkedSource.label + '.');
            } else {
                setStatus('Linked “' + show.title + '” to ' + linkedSource.label + '. Episode tracking is still unavailable for this title.');
            }
        } catch (error) {
            console.warn('Fix-link failed', error);
            if (state.modalShowId !== showId) return;
            showFixLinkMsg('Something went wrong. Check your connection and try again.', true);
            els.fixLinkSubmit.disabled = false;
            els.fixLinkSubmit.textContent = 'Match';
        }
    }

    // Point the modal poster at the show's art. When a real poster exists it
    // becomes a zoom-in button that opens the full-size lightbox; the "No
    // Poster" placeholder stays inert.
    function setModalPoster(show) {
        var meta = (show && show.meta) || {};
        var hasPoster = !!meta.poster;
        var title = (show && show.title) ? show.title : 'Show';
        applyPosterSrc(els.modalPoster, meta.poster || FALLBACK_POSTER);
        els.modalPoster.alt = title + ' poster';
        if (els.posterBtn) {
            els.posterBtn.classList.toggle('has-poster', hasPoster);
            els.posterBtn.disabled = !hasPoster;
            els.posterBtn.setAttribute('aria-label', hasPoster ? ('View ' + title + ' poster full size') : (title + ' poster'));
        }
    }

    // Opens the full-size poster overlay. With no arguments it uses the show
    // modal's poster; callers (e.g. Add-Show results) can pass their own image.
    function openPosterLightbox(src, alt) {
        if (!els.posterLightbox || !els.posterLightboxImg) return;
        if (src == null) {
            if (!els.modalPoster) return;
            if (els.posterBtn && els.posterBtn.disabled) return;
            src = els.modalPoster.src || '';
            alt = els.modalPoster.alt || 'Poster';
        }
        if (!src) return;
        els.posterLightboxImg.src = src;
        els.posterLightboxImg.alt = alt || 'Poster';
        els.posterLightbox.hidden = false;
    }

    function closePosterLightbox() {
        if (!els.posterLightbox || els.posterLightbox.hidden) return;
        els.posterLightbox.hidden = true;
        if (els.posterLightboxImg) els.posterLightboxImg.src = '';
    }

    function applyPosterSrc(imgEl, src) {
        if (!imgEl) return;
        var desired = src || FALLBACK_POSTER;
        if (desired !== FALLBACK_POSTER && state.brokenPosters[desired]) {
            desired = FALLBACK_POSTER;
        }
        imgEl.removeAttribute('data-poster-src');
        if (desired === FALLBACK_POSTER) {
            imgEl.onerror = null;
            imgEl.src = FALLBACK_POSTER;
            return;
        }
        imgEl.setAttribute('data-poster-src', desired);
        imgEl.onerror = function () {
            var failed = this.getAttribute('data-poster-src') || '';
            if (failed) state.brokenPosters[failed] = true;
            this.onerror = null;
            this.src = FALLBACK_POSTER;
        };
        imgEl.src = desired;
    }

    function wirePosterFallbackHandlers(container) {
        if (!container) return;
        container.querySelectorAll('img').forEach(function (img) {
            var src = img.getAttribute('src') || '';
            if (!src || src === FALLBACK_POSTER || img.getAttribute('data-poster-fallback-bound') === '1') return;
            if (state.brokenPosters[src]) {
                img.src = FALLBACK_POSTER;
                return;
            }
            img.setAttribute('data-poster-fallback-bound', '1');
            img.setAttribute('data-poster-src', src);
            img.onerror = function () {
                var failed = this.getAttribute('data-poster-src') || '';
                if (failed) state.brokenPosters[failed] = true;
                this.onerror = null;
                this.src = FALLBACK_POSTER;
            };
        });
    }

    function saveModalNotes() {
        var showId = state.modalShowId;
        if (!showId || !els.modalNotes) return;
        var show = state.shows.find(function (item) { return item.id === showId; });
        if (!show) return;
        show.notes = String(els.modalNotes.value || '');
        updateShowOverride(showId, { notes: show.notes });
        applyFilters();
        render();
        setStatus('Saved note for ' + show.title + '.');
    }

    function requestRemoveShow() {
        var showId = state.modalShowId;
        if (!showId) return;
        var show = state.shows.find(function (item) { return item.id === showId; });
        if (!show) return;

        openConfirm(
            'Remove ' + show.title + '?',
            'This removes it from your tracker list on this account. You can re-import your export or add it again later.',
            'Remove',
            function () {
                removeShowFromTracker(show);
            }
        );
    }

    function togglePushToWatchLater() {
        var showId = state.modalShowId;
        if (!showId) return;

        var show = state.shows.find(function (item) { return item.id === showId; });
        if (!show) return;
        var currentlyPushed = isManuallyPushedToWatchLater(show);

        if (els.showModalMenu) els.showModalMenu.open = false;

        if (!hasNewEpisode(show) && !currentlyPushed) {
            setStatus('This show has no pending aired episode to move right now.');
            return;
        }

        updateShowOverride(show.id, {
            forceWatchLater: !currentlyPushed
        });

        applyFilters();
        render();

        var updated = state.shows.find(function (item) { return item.id === show.id; }) || show;
        if (state.modalShowId === show.id && !els.showModal.hidden) {
            renderShowModal(updated, state.modalEpisodes || []);
        }

        if (currentlyPushed) {
            setStatus('Moved ' + show.title + ' back to Watch Next.');
        } else {
            setStatus('Pushed ' + show.title + ' to Haven\'t Watched in a While.');
        }
    }

    function removeShowFromTracker(show) {
        if (!show || !show.id) return;

        if (String(show.id).indexOf('custom:') === 0) {
            state.customShows = (state.customShows || []).filter(function (custom) {
                return custom.id !== show.id;
            });
            persistUserScopedJson(STORE_KEYS.customShows, state.customShows);
        }

        updateShowOverride(show.id, { removed: true });
        delete state.episodeCache[show.id];
        state.watchHistory = (state.watchHistory || []).filter(function (entry) {
            return entry && entry.showId !== show.id;
        });
        persistUserScopedJson(STORE_KEYS.watchHistory, state.watchHistory);

        closeShowModal();
        bootstrap().then(function () {
            setStatus('Removed ' + show.title + ' from your tracker.');
        });
    }

    // Builds the IMDb rating chip + external link shown under the modal facts.
    function renderModalLinks(meta) {
        if (!els.modalLinks) return;
        els.modalLinks.innerHTML = '';
        meta = meta || {};
        var sInfo = seriesStatusLabel(meta.seriesStatus);
        if (sInfo) {
            var badge = document.createElement('span');
            badge.className = 'series-badge series-' + sInfo.cls;
            badge.textContent = sInfo.text;
            els.modalLinks.appendChild(badge);
        }
        if (meta.imdbRating) {
            var rating = document.createElement('span');
            rating.className = 'imdb-rating';
            rating.innerHTML = '<span class="imdb-star" aria-hidden="true">\u2b50</span> <strong>' +
                escapeHtml(meta.imdbRating) + '</strong><span class="imdb-max">/10</span>';
            els.modalLinks.appendChild(rating);
        }
        if (meta.imdbId) {
            var link = document.createElement('a');
            link.className = 'imdb-btn';
            link.href = 'https://www.imdb.com/title/' + encodeURIComponent(meta.imdbId) + '/';
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
            link.textContent = 'View on IMDb \u2197';
            els.modalLinks.appendChild(link);
        }
        if (toInt(meta.tvmazeId)) {
            var mazeLink = document.createElement('a');
            mazeLink.className = 'imdb-btn modal-provider-link';
            mazeLink.href = 'https://www.tvmaze.com/shows/' + encodeURIComponent(String(meta.tvmazeId));
            mazeLink.target = '_blank';
            mazeLink.rel = 'noopener noreferrer';
            mazeLink.textContent = 'View on TVMaze \u2197';
            els.modalLinks.appendChild(mazeLink);
        }
        els.modalLinks.hidden = !els.modalLinks.childNodes.length;
    }

    function renderShowModal(show, episodes) {
        state.modalEpisodes = episodes || [];
        var meta = show.meta || {};

        els.showModalTitle.textContent = show.title;
        setModalPoster(show);

        var facts = [];
        if (meta.network) facts.push(meta.network);
        if (meta.premiered) facts.push('Since ' + formatYear(meta.premiered));
        if (meta.provider) facts.push(meta.provider);
        if (meta.genres && meta.genres.length) facts.push(meta.genres.slice(0, 3).join(', '));
        els.modalFactsText.textContent = facts.join('  ·  ');
        renderModalLinks(meta);
        els.modalSummary.textContent = stripHtml(meta.summary || '');
        if (els.modalNotes) {
            els.modalNotes.value = show.notes || '';
        }

        if (els.modalDecrease) {
            els.modalDecrease.onclick = function () {
                removeLatestWatchedEpisode(show);
            };
        }
        if (els.modalIncrease) {
            els.modalIncrease.onclick = function () {
                markNextEpisodeAsWatched(show);
            };
        }
        if (els.modalWatchSeason) {
            els.modalWatchSeason.onclick = function () {
                watchSeasonUpToCurrent(show);
            };
        }
        if (els.modalRefreshMeta) {
            els.modalRefreshMeta.disabled = false;
            els.modalRefreshMeta.textContent = '↻ Refresh show metadata';
            els.modalRefreshMeta.onclick = function () {
                refreshSingleShowMeta(show.id);
            };
        }
        if (els.modalPreferTvmaze) {
            var manualLink = getManualLinkMeta(show.id);
            var prefersTvmaze = manualLink && manualLink.preferredLookup === 'tvmaze';
            var canUseTvmaze = !!(toInt(meta.tvmazeId) || (manualLink && manualLink.imdbId) || meta.imdbId || meta.provider === 'IMDb');
            els.modalPreferTvmaze.hidden = !canUseTvmaze;
            els.modalPreferTvmaze.disabled = false;
            els.modalPreferTvmaze.textContent = prefersTvmaze ? 'Use IMDb instead' : 'Use TVMaze instead';
            els.modalPreferTvmaze.onclick = canUseTvmaze ? function () {
                toggleMetadataPreference(show.id);
            } : null;
        }

        var isCompleted = show.status === 'completed';
        var isPausedLike = show.status === 'paused' || show.status === 'archived';
        if (els.modalPauseShow) {
            els.modalPauseShow.textContent = isPausedLike ? 'Unpause' : 'Pause';
            els.modalPauseShow.classList.toggle('is-unpause', isPausedLike);
            els.modalPauseShow.disabled = isCompleted;
            els.modalPauseShow.onclick = function () {
                patchShow(show.id, { status: isPausedLike ? 'active' : 'paused' });
                setStatus((isPausedLike ? 'Resumed ' : 'Paused ') + show.title + '.');
            };
        }

        if (els.pushWatchLaterBtn) {
            var hasPendingEpisode = hasNewEpisode(show);
            var pushed = isManuallyPushedToWatchLater(show);
            var canToggle = hasPendingEpisode || pushed;
            els.pushWatchLaterBtn.textContent = pushed ? 'Return to Watch Next' : 'Push to Watch Later';
            els.pushWatchLaterBtn.disabled = !canToggle;
            els.pushWatchLaterBtn.title = canToggle
                ? (pushed ? 'Move this show back to Watch Next logic' : 'Manually place this show in Haven\'t Watched in a While')
                : 'No pending episode right now';
        }

        var totalEps = episodes.length;
        var watchedEps = episodes.filter(function (ep) { return isEpisodeWatched(show, ep); }).length;
        els.showModalSubtitle.textContent = totalEps
            ? ('Watched ' + watchedEps + ' of ' + totalEps + ' episodes')
            : ('Watched ' + show.watchedCount + ' episodes');
        els.modalProgress.textContent = totalEps ? (watchedEps + ' / ' + totalEps + ' watched') : '';

        // Keep the relink tool available on every show so the user can override
        // a bad match later with a direct IMDb or TVMaze page.
        resetFixLinkUi(totalEps > 0);
        updateMarkUnfixableBtn();

        if (!totalEps) {
            els.modalSeasons.innerHTML = '<div class="empty">Episode list unavailable for this show yet. Try “Refresh show metadata”, “Use TVMaze instead”, or “Fix show link” above to match it directly.</div>';
            return;
        }

        var seasons = groupEpisodesBySeason(episodes);

        // Default: open the season holding current progress (else the last one).
        if (!state.modalOpenSeasons) {
            state.modalOpenSeasons = {};
            var progressSeason = show.lastSeen && show.lastSeen.season
                ? toInt(show.lastSeen.season)
                : seasons[seasons.length - 1].season;
            state.modalOpenSeasons[progressSeason] = true;
        }

        els.modalSeasons.innerHTML = '';
        seasons.forEach(function (season) {
            var seasonWatched = season.episodes.filter(function (ep) { return isEpisodeWatched(show, ep); }).length;
            var airedEpisodes = season.episodes.filter(function (ep) { return !isEpisodeUnaired(ep); });
            var allWatched = airedEpisodes.length > 0 && airedEpisodes.every(function (ep) { return isEpisodeWatched(show, ep); });
            var isOpen = !!state.modalOpenSeasons[season.season];

            var wrap = document.createElement('div');
            wrap.className = 'season-block' + (isOpen ? ' open' : '');

            var header = document.createElement('div');
            header.className = 'season-header';

            var body = document.createElement('div');
            body.className = 'season-episodes';
            body.hidden = !isOpen;

            var toggle = document.createElement('button');
            toggle.type = 'button';
            toggle.className = 'season-toggle';
            toggle.innerHTML = '<span class="season-caret" aria-hidden="true">▸</span>'
                + '<span class="season-name">Season ' + season.season + '</span>'
                + '<span class="season-count">' + seasonWatched + '/' + season.episodes.length + '</span>';
            toggle.addEventListener('click', function () {
                var nowOpen = !state.modalOpenSeasons[season.season];
                state.modalOpenSeasons[season.season] = nowOpen;
                body.hidden = !nowOpen;
                wrap.classList.toggle('open', nowOpen);
            });

            var markBtn = document.createElement('button');
            markBtn.type = 'button';
            markBtn.className = 'btn btn-sm season-mark';
            markBtn.textContent = allWatched ? 'Unwatch season' : 'Watch season';
            markBtn.disabled = airedEpisodes.length === 0;
            markBtn.addEventListener('click', function (event) {
                event.stopPropagation();
                setSeasonWatched(show, season.season, !allWatched, episodes);
                var updated = state.shows.find(function (item) { return item.id === show.id; }) || show;
                renderShowModal(updated, episodes);
            });

            header.appendChild(toggle);
            header.appendChild(markBtn);

            season.episodes.forEach(function (ep) {
                var watched = isEpisodeWatched(show, ep);
                var unaired = isEpisodeUnaired(ep);
                var dateText = ep.airdate ? formatDate(ep.airdate) : '';
                var row = document.createElement('button');
                row.type = 'button';
                row.className = 'episode-row' + (watched ? ' watched' : '') + (unaired ? ' unaired' : '');
                row.disabled = unaired;
                if (unaired) row.title = 'Not aired yet' + (dateText ? ' \u00b7 airs ' + dateText : '');
                row.innerHTML = '<span class="ep-check" aria-hidden="true">' + (watched ? '\u2713' : (unaired ? '\uD83D\uDD12' : '')) + '</span>'
                    + '<span class="ep-num">S' + ep.season + 'E' + ep.number + '</span>'
                    + '<span class="ep-name">' + escapeHtml(ep.name || 'Episode') + '</span>'
                    + '<span class="ep-date">' + escapeHtml(unaired && dateText ? ('Airs ' + dateText) : dateText) + '</span>';
                if (!unaired) {
                    row.addEventListener('click', function () {
                        setEpisodeWatched(show, ep, !isEpisodeWatched(show, ep), episodes);
                        var updated = state.shows.find(function (item) { return item.id === show.id; }) || show;
                        renderShowModal(updated, episodes);
                    });
                }
                body.appendChild(row);
            });

            wrap.appendChild(header);
            wrap.appendChild(body);
            els.modalSeasons.appendChild(wrap);
        });
    }

    async function loadEpisodeCatalog(show) {
        if (state.episodeCache[show.id]) return state.episodeCache[show.id];

        var meta = show.meta || {};
        var tvmazeId = toInt(meta.tvmazeId);
        if (!tvmazeId && meta.imdbId) {
            var byImdb = await fetchTvMazeByImdb(meta.imdbId);
            if (byImdb && byImdb.tvmazeId) {
                tvmazeId = byImdb.tvmazeId;
                show.meta = Object.assign({}, show.meta || {}, { tvmazeId: tvmazeId });
                setCachedMeta(show, show.meta);
            }
        }
        if (!tvmazeId) {
            state.episodeCache[show.id] = [];
            return [];
        }

        var episodes = await fetchJson('https://api.tvmaze.com/shows/' + encodeURIComponent(String(tvmazeId)) + '/episodes');
        var mapped = Array.isArray(episodes) ? episodes.map(function (episode) {
            return {
                season: toInt(episode.season),
                number: toInt(episode.number),
                name: episode.name || 'Episode',
                summary: stripHtml(episode.summary || ''),
                airdate: episode.airdate || ''
            };
        }) : [];
        state.episodeCache[show.id] = mapped;
        return mapped;
    }

    function openAddShowModal() {
        if (!state.currentUser) {
            setStatus('Log in first to add shows.');
            return;
        }
        if (!els.addShowModal) return;
        if (els.addShowInput) els.addShowInput.value = '';
        if (els.addShowResults) els.addShowResults.innerHTML = '';
        if (state.addShowTimer) { clearTimeout(state.addShowTimer); state.addShowTimer = null; }
        state.addShowSeq += 1; // discard any in-flight search from a previous open
        setAddShowMessage('');
        refreshUnresolvedControl();
        els.addShowModal.hidden = false;
        setTimeout(function () {
            try { if (els.addShowInput) els.addShowInput.focus(); } catch (e) { /* ignore */ }
        }, 30);
    }

    // A show is "unresolved" when we can't load an episode list for it, so there's
    // nothing to track and the "Fix show link" tool applies. This mirrors the
    // per-show check (0 episodes) used inside the show modal, so an IMDb-only link
    // that never bridged to TVMaze still counts even though it has an imdbId.
    function isShowUnresolved(show) {
        if (!show) return false;
        // If marked as unfixable, don't list it anymore
        if (state.unfixableShows && state.unfixableShows[show.id]) return false;
        var m = show.meta || {};
        // If the catalog was already fetched, trust it outright: an empty list
        // means the show still needs fixing even when a (stale) id is present.
        var cached = state.episodeCache && state.episodeCache[show.id];
        if (Array.isArray(cached)) return cached.length === 0;
        // A saved/manual link that has either a tvmaze id or an imdb id should
        // not immediately count as unresolved before we attempt provider fallback.
        if (toInt(m.tvmazeId) || m.imdbId) return false;
        // Not fetched yet: unresolved when there's no TVMaze id to load episodes
        // from. A bare IMDb id may bridge to TVMaze when the show is opened, but
        // until then it has nothing to track, so surface it as fixable.
        return !toInt(m.tvmazeId);
    }

    function getUnresolvedShows() {
        return (state.shows || []).filter(isShowUnresolved).sort(function (a, b) {
            return String(a.title || '').localeCompare(String(b.title || ''));
        });
    }

    // Shows/hides the "Fix unresolved shows (N)" control on the main page and
    // keeps its count current. If already open, keep it open while updating.
    function refreshUnresolvedControl() {
        if (!els.unresolvedWrap) return;
        var unresolved = getUnresolvedShows();
        var count = unresolved.length;
        var wasOpen = !!(els.unresolvedPanel && !els.unresolvedPanel.hidden);
        if (els.unresolvedCount) els.unresolvedCount.textContent = String(count);
        els.unresolvedWrap.hidden = count === 0;
        if (count === 0) {
            if (els.unresolvedPanel) els.unresolvedPanel.hidden = true;
            if (els.unresolvedToggle) els.unresolvedToggle.setAttribute('aria-expanded', 'false');
            if (els.unresolvedList) els.unresolvedList.innerHTML = '';
            return;
        }
        if (wasOpen) {
            renderUnresolvedList();
            if (els.unresolvedPanel) els.unresolvedPanel.hidden = false;
            if (els.unresolvedToggle) els.unresolvedToggle.setAttribute('aria-expanded', 'true');
        }
    }

    function toggleUnresolvedPanel() {
        if (!els.unresolvedPanel || !els.unresolvedToggle) return;
        var willOpen = els.unresolvedPanel.hidden;
        if (willOpen) renderUnresolvedList();
        els.unresolvedPanel.hidden = !willOpen;
        els.unresolvedToggle.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
    }

    function renderUnresolvedList() {
        if (!els.unresolvedList) return;
        els.unresolvedList.innerHTML = '';
        var unresolved = getUnresolvedShows();
        if (!unresolved.length) {
            els.unresolvedList.innerHTML = '<div class="addshow-empty">Everything is linked — nothing to fix.</div>';
            return;
        }
        unresolved.forEach(function (show) {
            var row = document.createElement('div');
            row.className = 'unresolved-row';

            var info = document.createElement('div');
            info.className = 'unresolved-info';
            var name = document.createElement('span');
            name.className = 'unresolved-title';
            name.textContent = show.title;
            var sub = document.createElement('span');
            sub.className = 'unresolved-sub';
            sub.textContent = (toInt(show.watchedCount) || 0) + ' watched \u00b7 ' + capitalize(show.status || 'active');
            info.appendChild(name);
            info.appendChild(sub);

            var fixBtn = document.createElement('button');
            fixBtn.type = 'button';
            fixBtn.className = 'btn btn-accent btn-sm';
            fixBtn.textContent = 'Fix link';
            fixBtn.addEventListener('click', function () {
                closeAddShowModal();
                openShowModal(show.id);
            });

            row.appendChild(info);
            row.appendChild(fixBtn);
            els.unresolvedList.appendChild(row);
        });
    }

    function closeAddShowModal() {
        if (state.addShowTimer) { clearTimeout(state.addShowTimer); state.addShowTimer = null; }
        closePosterLightbox();
        if (els.addShowModal) els.addShowModal.hidden = true;
    }

    function setAddShowMessage(message, isError) {
        if (!els.addShowMessage) return;
        els.addShowMessage.textContent = message || '';
        els.addShowMessage.style.color = isError ? 'var(--danger)' : '';
    }

    // Debounced live search: called on every keystroke. Waits briefly so we
    // only hit TVMaze once the user pauses, and skips very short queries.
    function scheduleAddShowSearch() {
        if (state.addShowTimer) { clearTimeout(state.addShowTimer); state.addShowTimer = null; }
        var query = els.addShowInput ? String(els.addShowInput.value || '').trim() : '';
        if (query.length < 2) {
            // Nothing worth searching yet: drop stale results and any spinner.
            state.addShowSeq += 1; // cancel any in-flight response
            if (els.addShowResults) els.addShowResults.innerHTML = '';
            setAddShowMessage(query.length ? 'Keep typing…' : '');
            return;
        }
        state.addShowTimer = window.setTimeout(function () {
            state.addShowTimer = null;
            runAddShowSearch();
        }, 350);
    }

    // Verify the typed name against TVMaze and show the matching variants so the
    // user picks the exact show before adding it.
    async function runAddShowSearch() {
        if (!state.currentUser) {
            setAddShowMessage('Log in first to add shows.', true);
            return;
        }
        var query = els.addShowInput ? String(els.addShowInput.value || '').trim() : '';
        if (!query) {
            setAddShowMessage('');
            if (els.addShowResults) els.addShowResults.innerHTML = '';
            return;
        }

        // Tag this search; if a newer keystroke starts another before we finish,
        // this response is stale and must not overwrite the newer results.
        var seq = ++state.addShowSeq;

        // With an OMDb key we search IMDb's catalog; otherwise TVMaze. If OMDb
        // returns nothing (e.g. the key is invalid or over its daily quota) we
        // fall back to TVMaze so search always works.
        var omdbKey = loadUserScopedValue(STORE_KEYS.omdbApiKey) || '';
        var usingImdb = !!omdbKey;
        setAddShowMessage(usingImdb ? 'Searching IMDb…' : 'Searching TVMaze…');

        try {
            var results = [];
            if (usingImdb) {
                try { results = await searchOmdbShows(query, omdbKey); }
                catch (e) { results = []; }
                if (seq !== state.addShowSeq) return; // superseded by a newer search
                if (!results.length) {
                    usingImdb = false;
                    results = await searchTvMazeShows(query);
                }
            } else {
                results = await searchTvMazeShows(query);
            }
            if (seq !== state.addShowSeq) return; // superseded by a newer search
            if (!results.length) {
                setAddShowMessage('No shows found for “' + query + '”. Check the spelling and try again.', true);
                renderAddShowResults([]);
            } else {
                // Hide anything already in the user's list (matched by ID, not
                // title) so the results only show things they can actually add.
                var trackedIds = collectTrackedIds();
                var fresh = results.filter(function (s) { return !isResultTracked(s, trackedIds); });
                var hidden = results.length - fresh.length;
                var src = usingImdb ? 'IMDb' : 'TVMaze';
                if (!fresh.length) {
                    setAddShowMessage('All ' + results.length + ' match' + (results.length === 1 ? ' is' : 'es are') + ' already in your list.', true);
                    renderAddShowResults([]);
                } else {
                    var msg = fresh.length + ' match' + (fresh.length === 1 ? '' : 'es') + ' found on ' + src;
                    if (hidden) msg += ' (' + hidden + ' already in your list hidden)';
                    msg += ' — pick the right one to add.';
                    setAddShowMessage(msg);
                    renderAddShowResults(fresh);
                }
            }
        } catch (error) {
            if (seq !== state.addShowSeq) return;
            console.warn('Add-show search failed', error);
            setAddShowMessage('Search failed. Check your connection and try again.', true);
        }
    }

    function renderAddShowResults(shows) {
        var container = els.addShowResults;
        if (!container) return;
        // Tie any async OMDb enrichment below to the current search; if the user
        // types again, state.addShowSeq changes and stale detail is discarded.
        var seq = state.addShowSeq;
        container.innerHTML = '';

        if (!shows.length) {
            container.innerHTML = '<div class="addshow-empty">No matches found. Try a different spelling.</div>';
            return;
        }

        shows.forEach(function (show) {
            var row = document.createElement('div');
            row.className = 'addshow-result';

            var posterSrc = pickPoster(show);
            var hasPoster = posterSrc !== FALLBACK_POSTER;
            var poster = document.createElement('img');
            poster.className = 'addshow-poster';
            poster.loading = 'lazy';
            applyPosterSrc(poster, posterSrc);
            poster.alt = (show.name || 'Show') + ' poster';

            // With real art the poster becomes a zoom-in button (same full-size
            // lightbox as the show modal); the placeholder stays inert.
            var posterNode = poster;
            if (hasPoster) {
                var posterBtn = document.createElement('button');
                posterBtn.type = 'button';
                posterBtn.className = 'addshow-poster-btn';
                posterBtn.setAttribute('aria-label', 'View ' + (show.name || 'show') + ' poster full size');
                var hint = document.createElement('span');
                hint.className = 'poster-zoom-hint';
                hint.setAttribute('aria-hidden', 'true');
                hint.textContent = '\u2922';
                posterBtn.appendChild(poster);
                posterBtn.appendChild(hint);
                posterBtn.addEventListener('click', function () {
                    openPosterLightbox(posterSrc, (show.name || 'Show') + ' poster');
                });
                posterNode = posterBtn;
            }

            var info = document.createElement('div');
            info.className = 'addshow-info';

            var titleEl = document.createElement('h4');
            titleEl.className = 'addshow-title';
            var year = show.premiered ? formatYear(show.premiered) : '';
            titleEl.textContent = (show.name || 'Untitled') + (year ? ' (' + year + ')' : '');
            info.appendChild(titleEl);

            var metaEl = document.createElement('p');
            metaEl.className = 'addshow-meta';
            info.appendChild(metaEl);

            var descEl = document.createElement('p');
            descEl.className = 'addshow-desc';
            info.appendChild(descEl);

            // Meta line + description are (re)built by these closures so the async
            // OMDb enrichment pass can drop richer genre/rating/plot into the same
            // card. show._genres/_network/_imdbRating/_summary hold enriched values;
            // the plain fields come straight from TVMaze results.
            var moreBtn = null;
            show.__renderMeta = function () {
                var bits = [];
                if (show._omdb) bits.push('IMDb');
                var net = (show.network && show.network.name) || (show.webChannel && show.webChannel.name) || show._network || '';
                if (net) bits.push(net);
                var genres = (show.genres && show.genres.length) ? show.genres : (show._genres || []);
                if (genres.length) bits.push(genres.slice(0, 3).join(', '));
                if (show.status) bits.push(show.status);
                var rating = (show.rating && show.rating.average) || show._imdbRating || '';
                if (rating) bits.push('⭐ ' + rating);
                metaEl.textContent = bits.join('  ·  ');
                metaEl.style.display = bits.length ? '' : 'none';
            };
            show.__renderDesc = function (fullText) {
                var fullDesc = stripHtml(fullText || '');
                var shortDesc = truncateText(fullDesc, 180);
                var pending = show._omdb && !show._enrichTried;
                descEl.textContent = shortDesc || (pending ? 'Loading description…' : 'No description available.');
                if (moreBtn) { moreBtn.remove(); moreBtn = null; }
                // Long summaries collapse to ~180 chars; a Show more/less toggle
                // reveals the full text (truncateText adds a trailing … so a
                // difference means it was actually clipped).
                if (fullDesc && shortDesc !== fullDesc) {
                    moreBtn = document.createElement('button');
                    moreBtn.type = 'button';
                    moreBtn.className = 'addshow-more';
                    moreBtn.textContent = 'Show more';
                    var expanded = false;
                    moreBtn.addEventListener('click', function () {
                        expanded = !expanded;
                        descEl.textContent = expanded ? fullDesc : shortDesc;
                        moreBtn.textContent = expanded ? 'Show less' : 'Show more';
                    });
                    info.appendChild(moreBtn);
                }
            };
            show.__renderMeta();
            show.__renderDesc(show._summary || show.summary || '');

            var addBtn = document.createElement('button');
            addBtn.type = 'button';
            addBtn.className = 'btn btn-accent addshow-add';
            addBtn.textContent = '➕ Add';
            addBtn.addEventListener('click', function () {
                addVariant(show, addBtn);
            });

            row.appendChild(posterNode);
            row.appendChild(info);
            row.appendChild(addBtn);
            container.appendChild(row);
        });

        enrichOmdbCards(shows, seq);
    }

    // Gathers every TVMaze/IMDb id already in the user's list. Imported shows
    // carry ids on meta; custom shows carry them directly. Used to de-duplicate
    // add-show results by ID rather than by title — same-named shows can be
    // different entries, and a differently-named import can be the same show.
    function collectTrackedIds() {
        var tvmaze = {};
        var imdb = {};
        function add(t, i) {
            var tv = toInt(t);
            if (tv) tvmaze[tv] = true;
            if (i) imdb[String(i).toLowerCase()] = true;
        }
        (state.shows || []).forEach(function (s) {
            var m = s.meta || {};
            add(m.tvmazeId, m.imdbId);
        });
        (state.customShows || []).forEach(function (c) {
            add(c.tvmazeId, c.imdbId);
        });
        return { tvmaze: tvmaze, imdb: imdb };
    }

    // True when a search result is already tracked by ID. TVMaze results carry
    // the tvmaze id on show.id; OMDb/IMDb results carry the imdb id on externals.
    function isResultTracked(show, ids) {
        if (!show || !ids) return false;
        var tv = toInt(show.id);
        if (tv && ids.tvmaze[tv]) return true;
        var imdb = show.externals && show.externals.imdb ? String(show.externals.imdb).toLowerCase() : '';
        if (imdb && ids.imdb[imdb]) return true;
        return false;
    }

    // Adds a specific verified TVMaze variant as a custom show, caching its full
    // metadata (including next/previous episode) so badges work immediately.
    async function addVariant(show, button) {
        if (!state.currentUser) {
            setAddShowMessage('Log in first to add shows.', true);
            return;
        }

        var isOmdb = !!(show && show._omdb);
        var imdbId = (show && show.externals && show.externals.imdb) || '';
        var tvmazeId = toInt(show.id);
        var finalTitle = show.name || '';
        var normalized = normalizeName(finalTitle);

        // De-duplicate by ID, not title: same-named shows can be different
        // entries, and the user may keep a differently-named import of the same
        // show (title matching previously blocked legitimate adds).
        var trackedIds = collectTrackedIds();
        var lowerImdb = imdbId ? String(imdbId).toLowerCase() : '';
        if ((tvmazeId && trackedIds.tvmaze[tvmazeId]) || (lowerImdb && trackedIds.imdb[lowerImdb])) {
            setAddShowMessage('“' + finalTitle + '” is already in your list.', true);
            return;
        }

        button.disabled = true;
        var originalLabel = button.textContent;
        button.textContent = 'Adding…';

        var meta;
        if (isOmdb) {
            // IMDb search result: pull rich OMDb metadata for the exact show by
            // its imdb id. fetchOmdbById also bridges to TVMaze internally to fill
            // the tvmaze id + next/last episode so the show stays trackable.
            var omdbKey = loadUserScopedValue(STORE_KEYS.omdbApiKey) || '';
            if (omdbKey && imdbId) {
                try { meta = await fetchOmdbById(imdbId, omdbKey, finalTitle); } catch (e) { meta = null; }
            }
            if (!meta && imdbId) {
                // Fallback: resolve TVMaze straight from the imdb id.
                try {
                    var byImdb = await fetchTvMazeByImdb(imdbId);
                    meta = metaFromTvMazeShow(show, finalTitle);
                    if (byImdb) {
                        meta.tvmazeId = byImdb.tvmazeId;
                        meta.nextEpisode = byImdb.nextEpisode;
                        meta.lastAired = byImdb.lastAired;
                        if (byImdb.runtime && !meta.runtime) meta.runtime = byImdb.runtime;
                        if (byImdb.poster && (!meta.poster || meta.poster === FALLBACK_POSTER)) meta.poster = byImdb.poster;
                    }
                } catch (e) { meta = metaFromTvMazeShow(show, finalTitle); }
            }
            if (!meta) meta = metaFromTvMazeShow(show, finalTitle);
        } else {
            meta = metaFromTvMazeShow(show, finalTitle);
            try {
                var links = await fetchEpisodeLinks(show._links);
                meta.nextEpisode = links.nextEpisode;
                meta.lastAired = links.lastAired;
            } catch (error) {
                console.warn('Could not load episode links for added show', error);
            }
        }

        var resolvedTvmazeId = toInt(meta.tvmazeId) || tvmazeId;
        var resolvedImdbId = meta.imdbId || imdbId || '';

        // The OMDb→TVMaze bridge can resolve a tvmaze/imdb id we already track
        // even when the raw result didn't match; re-check before adding a dupe.
        var lowerResolvedImdb = resolvedImdbId ? String(resolvedImdbId).toLowerCase() : '';
        if ((resolvedTvmazeId && trackedIds.tvmaze[resolvedTvmazeId]) || (lowerResolvedImdb && trackedIds.imdb[lowerResolvedImdb])) {
            setAddShowMessage('“' + finalTitle + '” is already in your list.', true);
            button.disabled = false;
            button.textContent = originalLabel;
            return;
        }

        var id = 'custom:' + normalized.replace(/\s+/g, '-') + ':' + Date.now();
        state.customShows.push({
            id: id,
            title: finalTitle,
            tvmazeId: resolvedTvmazeId,
            imdbId: resolvedImdbId,
            nb_episodes_seen: 0,
            createdAt: new Date().toISOString(),
            updatedAt: Date.now()
        });
        persistUserScopedJson(STORE_KEYS.customShows, state.customShows);
        setCachedMeta({ id: id, title: finalTitle }, meta);

        closeAddShowModal();
        bootstrap();
        if (isOmdb && !resolvedTvmazeId) {
            setStatus('Added “' + finalTitle + '”. Heads up: episode tracking may be unavailable (not found on TVMaze).');
        } else {
            setStatus('Added show: ' + finalTitle + '.');
        }
        button.disabled = false;
        button.textContent = originalLabel;
    }

    function truncateText(text, max) {
        var value = String(text || '');
        if (value.length <= max) return value;
        return value.slice(0, max).replace(/\s+\S*$/, '') + '…';
    }

    // True when the most recent aired episode is later than the user's progress,
    // i.e. there's a new episode ready to watch. Uses meta.lastAired (TVMaze
    // previous-episode) so it needs no extra per-card fetch.
    function hasNewEpisode(show) {
        var lastAired = getLatestAiredEpisode(show);
        if (!lastAired || !lastAired.season) return false;
        var seenRank = (show.lastSeen && show.lastSeen.season)
            ? epRank(show.lastSeen.season, show.lastSeen.episode)
            : 0;
        return epRank(lastAired.season, lastAired.number) > seenRank;
    }

    // A returning season opener (episode 1 of season >= 2) counts as a premiere.
    function isSeasonPremiere(ep) {
        return !!ep && toInt(ep.number) === 1 && toInt(ep.season) >= 2;
    }

    // True when the next episode is a season premiere that has already aired,
    // so "New Season" doesn't show months before release.
    function hasUpcomingPremiere(show) {
        var next = getFutureUpcomingEpisode(show);
        if (!next || !next.airdate) return false;
        return isSeasonPremiere(next);
    }

    // 🎬 button: catch up by marking every already-aired, unwatched episode.
    async function watchSeasonUpToCurrent(show) {
        var catalog = await loadEpisodeCatalog(show);
        if (!catalog.length) {
            setStatus('Could not load episode data for ' + show.title + '. Try again later.');
            return;
        }

        var now = Date.now();
        var episodesToWatch = catalog.filter(function (ep) {
            if (isEpisodeWatched(show, ep)) return false;
            var airTime = asTime(ep.airdate);
            return airTime && airTime <= now;
        });

        if (!episodesToWatch.length) {
            setStatus('You are already caught up on aired episodes for ' + show.title + '.');
            return;
        }

        openConfirm(
            'Catch up on ' + show.title + '?',
            'Mark ' + episodesToWatch.length + ' already-aired episode' + (episodesToWatch.length === 1 ? '' : 's') + ' as watched?',
            'Mark as watched',
            function () {
                applyWatchedChange(show, episodesToWatch, true, catalog);
                setStatus('Marked ' + episodesToWatch.length + ' episodes as watched for ' + show.title + '.');
            }
        );
    }

    // Marks every aired episode watched and flips the show to Completed in a
    // single patch. Unaired (future) episodes are left untouched. Falls back to
    // just flipping status when there's no episode catalog (unlinked shows).
    async function completeShow(show) {
        var catalog = await loadEpisodeCatalog(show);
        var current = state.shows.find(function (item) { return item.id === show.id; }) || show;

        if (catalog && catalog.length) {
            var toWatch = catalog.filter(function (ep) {
                return !isEpisodeUnaired(ep) && !isEpisodeWatched(current, ep);
            });
            if (toWatch.length) {
                applyWatchedChange(current, toWatch, true, catalog);
            }
            patchShow(show.id, { status: 'completed' });
            setStatus('Completed ' + show.title + ' \u2014 marked all aired episodes watched.');
        } else {
            // Unlinked show (no episode data): just flip the status.
            patchShow(show.id, { status: 'completed' });
            setStatus('Completed ' + show.title + '.');
        }
    }

    function patchShow(showId, patch) {
        var show = state.shows.find(function (item) { return item.id === showId; });
        if (!show) return;

        if (typeof patch.watchedCount === 'number') {
            show.watchedCount = patch.watchedCount;
        }
        if (patch.status) {
            var normalized = normalizeTrackerStatus(patch.status);
            show.status = normalized;
            show.localStatus = normalized;
        }
        if (patch.episodeStates && typeof patch.episodeStates === 'object') {
            show.episodeStates = patch.episodeStates;
        }
        if (patch.lastSeen === null) {
            show.lastSeen = null;
        } else if (patch.lastSeen) {
            show.lastSeen = {
                season: toInt(patch.lastSeen.season),
                episode: toInt(patch.lastSeen.episode),
                updated_at: patch.lastSeen.updated_at || new Date().toISOString()
            };
        }

        var overridePatch = {
            watchedCount: show.watchedCount,
            status: show.localStatus || show.status,
            lastSeen: show.lastSeen || null,
            episodeStates: show.episodeStates || {}
        };
        if (patch.clearForceWatchLater) overridePatch.forceWatchLater = false;
        updateShowOverride(showId, overridePatch);

        applyFilters();
        render();

        // Keep the currently open modal live when actions are triggered there.
        if (state.modalShowId === showId && !els.showModal.hidden) {
            loadEpisodeCatalog(show).then(function (episodes) {
                var current = state.shows.find(function (item) { return item.id === showId; }) || show;
                if (state.modalShowId !== showId) return;
                renderShowModal(current, episodes || []);
            }).catch(function () {
                var current = state.shows.find(function (item) { return item.id === showId; }) || show;
                if (state.modalShowId !== showId) return;
                renderShowModal(current, []);
            });
        }
    }

    function updateShowOverride(showId, updates) {
        if (!state.overrides[showId]) state.overrides[showId] = {};
        Object.assign(state.overrides[showId], updates);
        // Stamp the per-show change time so cross-device sync can merge by
        // "newest wins" per show (edits on both devices then both survive).
        state.overrides[showId].updatedAt = Date.now();
        persistUserScopedJson(STORE_KEYS.localOverrides, state.overrides);
    }

    function isStandaloneApp() {
        var mql = window.matchMedia && window.matchMedia('(display-mode: standalone)');
        return (mql && mql.matches) || window.navigator.standalone === true;
    }

    function isIosInstallDevice() {
        return /iphone|ipad|ipod/i.test(window.navigator.userAgent || '');
    }

    function maybeFocusWatchNextOnMobile() {
        if (state.mobileGreetingDone) return;
        if (!state.currentUser || !state.shows.length) return;
        if (!(window.matchMedia && window.matchMedia('(max-width: 680px)').matches)) return;
        if (!els.watchNextSection) return;

        state.mobileGreetingDone = true;
        window.setTimeout(function () {
            els.watchNextSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 180);
    }

    function getCachedMeta(showId, title) {
        var key = metaKey(showId, title);
        return state.metadataCache[key] || null;
    }

    function mergeManualLinkMeta(baseMeta, manualMeta) {
        if (!manualMeta) return baseMeta || null;
        return Object.assign({}, baseMeta || {}, manualMeta || {});
    }

    function getManualLinkMeta(showId) {
        return state.manualLinks && state.manualLinks[showId] ? state.manualLinks[showId] : null;
    }

    function setManualLinkMeta(showId, meta, options) {
        if (!showId || !meta) return;
        if (!state.manualLinks) state.manualLinks = {};
        var existing = state.manualLinks[showId] || {};
        var preferredLookup = options && options.preferredLookup
            ? options.preferredLookup
            : (existing.preferredLookup || ((meta.provider || '').toLowerCase() === 'tvmaze' && toInt(meta.tvmazeId) ? 'tvmaze' : 'imdb'));
        state.manualLinks[showId] = Object.assign({}, existing, {
            imdbId: meta.imdbId || '',
            tvmazeId: toInt(meta.tvmazeId) || 0,
            preferredLookup: preferredLookup,
            provider: meta.provider || '',
            poster: meta.poster || '',
            seriesStatus: meta.seriesStatus || '',
            nextEpisode: meta.nextEpisode || null,
            lastAired: meta.lastAired || null,
            runtime: toInt(meta.runtime) || 0,
            network: meta.network || '',
            premiered: meta.premiered || '',
            genres: Array.isArray(meta.genres) ? meta.genres.slice() : [],
            summary: meta.summary || '',
            imdbRating: meta.imdbRating || '',
            fetchedAt: meta.fetchedAt || new Date().toISOString()
        });
        persistUserScopedJson(STORE_KEYS.manualLinks, state.manualLinks);
    }

    function setCachedMeta(show, meta) {
        var key = metaKey(show.id, show.title);
        state.metadataCache[key] = meta;
        show.meta = mergeManualLinkMeta(meta, getManualLinkMeta(show.id));
        persistUserScopedJson(STORE_KEYS.metadataCache, state.metadataCache);
    }

    function queueMetadataFetches(shows, forceRefresh) {
        state.metadataFetchQueue = shows
            .filter(function (show) {
                if (forceRefresh) return true;
                return !show.meta;
            })
            .map(function (show) { return show.id; });

        pumpMetadataQueue();
    }

    function pumpMetadataQueue() {
        var maxConcurrent = 3;

        while (state.activeFetches < maxConcurrent && state.metadataFetchQueue.length) {
            let nextShowId = state.metadataFetchQueue.shift();
            var show = state.shows.find(function (item) { return item.id === nextShowId; });
            if (!show) continue;

            state.activeFetches += 1;
            fetchShowMeta(show).then(function (meta) {
                if (meta) {
                    var target = state.shows.find(function (item) { return item.id === nextShowId; });
                    if (target) {
                        setCachedMeta(target, meta);
                        // During a full refresh or import the page is hidden behind
                        // the loading overlay, so skip per-item re-renders (no flashing).
                        if (!state.refreshMode && !state.importMode) {
                            applyFilters();
                            render();
                        }
                    }
                }
            }).catch(function (error) {
                console.warn('Metadata fetch failed for', show.title, error);
            }).finally(function () {
                state.activeFetches -= 1;
                if (state.refreshMode || state.importMode) {
                    state.refreshDone += 1;
                    updateLoadingSub(Math.min(state.refreshDone, state.refreshTotal) + ' / ' + state.refreshTotal + ' shows');
                }
                if (!state.metadataFetchQueue.length && state.activeFetches === 0) {
                    if (state.refreshMode) {
                        state.refreshMode = false;
                        finishMetadataRefresh();
                    } else if (state.importMode) {
                        state.importMode = false;
                        finishImport();
                    } else {
                        // Fresh metadata may reveal ended shows that are fully
                        // watched; auto-complete them and re-render if any changed.
                        if (autoCompleteEndedShows() > 0) {
                            applyFilters();
                            render();
                        }
                        setStatus('Metadata fetch completed.');
                    }
                }
                pumpMetadataQueue();
            });
        }
    }

    async function fetchShowMeta(show) {
        var manual = getManualLinkMeta(show.id);
        if (manual) {
            var preferTvmaze = manual.preferredLookup === 'tvmaze';
            if (preferTvmaze) {
                if (toInt(manual.tvmazeId)) {
                    try {
                        return await fetchTvMazeById(toInt(manual.tvmazeId), show.title, manual.imdbId || '');
                    } catch (error) {
                        console.warn('Manual TVMaze refresh failed, trying IMDb/title fallback', error);
                    }
                }
                if (manual.imdbId) {
                    try {
                        return await resolveMetaFromImdb(manual.imdbId, show.title);
                    } catch (error) {
                        console.warn('Manual IMDb refresh failed after TVMaze miss, trying title fallback', error);
                    }
                }
            } else {
                if (manual.imdbId) {
                    try {
                        return await resolveMetaFromImdb(manual.imdbId, show.title);
                    } catch (error) {
                        console.warn('Manual IMDb refresh failed, trying TVMaze/title fallback', error);
                    }
                }
                if (toInt(manual.tvmazeId)) {
                    try {
                        return await fetchTvMazeById(toInt(manual.tvmazeId), show.title, manual.imdbId || '');
                    } catch (error) {
                        console.warn('Manual TVMaze refresh failed, trying title fallback', error);
                    }
                }
            }
        }

        var omdbKey = loadUserScopedValue(STORE_KEYS.omdbApiKey) || '';
        if (omdbKey) {
            try {
                var omdb = await fetchOmdb(show.title, omdbKey);
                if (omdb) return omdb;
            } catch (error) {
                console.warn('OMDb fetch failed, falling back to TVMaze', error);
            }
        }

        return fetchTvMaze(show.title);
    }

    async function refreshSingleShowMeta(showId) {
        var show = state.shows.find(function (item) { return item.id === showId; });
        if (!show) return;
        if (els.modalRefreshMeta) {
            els.modalRefreshMeta.disabled = true;
            els.modalRefreshMeta.textContent = 'Refreshing…';
        }
        setStatus('Refreshing metadata for ' + show.title + '…');

        try {
            delete state.episodeCache[show.id];
            var meta = await fetchShowMeta(show);
            if (meta) {
                if (getManualLinkMeta(show.id)) setManualLinkMeta(show.id, meta);
                setCachedMeta(show, meta);
            }
            var episodes = await loadEpisodeCatalog(show);
            maybeSeedProgressFromCount(show, episodes);
            maybeAutoCompleteFromCatalog(show, episodes);
            var current = state.shows.find(function (item) { return item.id === showId; }) || show;
            applyFilters();
            render();
            if (state.modalShowId === showId) renderShowModal(current, episodes);
            setStatus('Refreshed metadata for ' + show.title + '.');
        } catch (error) {
            console.warn('Single-show metadata refresh failed', error);
            setStatus('Could not refresh metadata for ' + show.title + '.', true);
        } finally {
            if (els.modalRefreshMeta) {
                els.modalRefreshMeta.disabled = false;
                els.modalRefreshMeta.textContent = '↻ Refresh show metadata';
            }
        }
    }

    function toggleMetadataPreference(showId) {
        var show = state.shows.find(function (item) { return item.id === showId; });
        if (!show) return;

        var currentManual = getManualLinkMeta(show.id) || {};
        var currentPrefers = currentManual.preferredLookup === 'tvmaze';
        var newPreference = currentPrefers ? 'imdb' : 'tvmaze';

        var meta = show.meta || {};
        var updated = Object.assign({}, currentManual, { preferredLookup: newPreference });
        setManualLinkMeta(showId, meta, { preferredLookup: newPreference });

        var label = newPreference === 'tvmaze' ? 'TVMaze-first' : 'IMDb-first';
        setStatus('Set ' + show.title + ' to ' + label + ' metadata lookup.');

        var current = state.shows.find(function (item) { return item.id === showId; }) || show;
        if (state.modalShowId === showId) {
            loadEpisodeCatalog(show).then(function (episodes) {
                if (state.modalShowId !== showId) return;
                renderShowModal(current, episodes || []);
            }).catch(function () {
                if (state.modalShowId !== showId) return;
                renderShowModal(current, []);
            });
        }
    }

    async function fetchOmdb(title, apiKey) {
        return fetchOmdbBy('t', title, apiKey, title);
    }

    // Fetch rich OMDb (IMDb) metadata for the exact show the user picked from an
    // IMDb search result, keyed by its imdb id rather than by title.
    async function fetchOmdbById(imdbId, apiKey, fallbackTitle) {
        return fetchOmdbBy('i', imdbId, apiKey, fallbackTitle || '');
    }

    async function fetchOmdbBy(param, value, apiKey, fallbackTitle) {
        var url = 'https://www.omdbapi.com/?apikey=' + encodeURIComponent(apiKey) + '&type=series&' + param + '=' + encodeURIComponent(value);
        var result = await fetchJson(url);
        if (!result || result.Response === 'False') return null;

        var meta = {
            provider: 'OMDb (IMDb)',
            poster: result.Poster && result.Poster !== 'N/A' ? result.Poster : FALLBACK_POSTER,
            title: result.Title || fallbackTitle,
            summary: result.Plot && result.Plot !== 'N/A' ? result.Plot : '',
            genres: splitGenres(result.Genre),
            imdbId: result.imdbID || '',
            imdbRating: result.imdbRating && result.imdbRating !== 'N/A' ? result.imdbRating : '',
            premiered: result.Released && result.Released !== 'N/A' ? result.Released : '',
            network: result.Production && result.Production !== 'N/A' ? result.Production : '',
            runtime: parseRuntimeMinutes(result.Runtime),
            tvmazeId: 0,
            seriesStatus: seriesStatusFromOmdbYear(result.Year),
            nextEpisode: null,
            lastAired: null,
            fetchedAt: new Date().toISOString()
        };

        if (meta.imdbId) {
            var mazeByImdb = await fetchTvMazeByImdb(meta.imdbId);
            if (mazeByImdb && mazeByImdb.nextEpisode) {
                meta.nextEpisode = mazeByImdb.nextEpisode;
            }
            if (mazeByImdb && mazeByImdb.lastAired) {
                meta.lastAired = mazeByImdb.lastAired;
            }
            if (mazeByImdb && mazeByImdb.tvmazeId) {
                meta.tvmazeId = mazeByImdb.tvmazeId;
            }
            // TVMaze's status is more reliable than the OMDb year heuristic.
            if (mazeByImdb && mazeByImdb.seriesStatus) {
                meta.seriesStatus = mazeByImdb.seriesStatus;
            }
            if (!meta.runtime && mazeByImdb && mazeByImdb.runtime) {
                meta.runtime = mazeByImdb.runtime;
            }
            if ((!meta.poster || meta.poster === FALLBACK_POSTER) && mazeByImdb && mazeByImdb.poster) {
                meta.poster = mazeByImdb.poster;
            }
        }

        return meta;
    }

    async function fetchTvMaze(title) {
        var searchUrl = 'https://api.tvmaze.com/singlesearch/shows?q=' + encodeURIComponent(title);
        var show = await fetchJson(searchUrl);
        if (!show) {
            return metaFromTvMazeShow({}, title);
        }

        var meta = metaFromTvMazeShow(show, title);
        var links = await fetchEpisodeLinks(show._links);
        meta.nextEpisode = links.nextEpisode;
        meta.lastAired = links.lastAired;
        return meta;
    }

    async function fetchTvMazeById(tvmazeId, fallbackTitle, imdbId) {
        var show = await fetchJson('https://api.tvmaze.com/shows/' + encodeURIComponent(String(tvmazeId)));
        if (!show) return metaFromTvMazeShow({}, fallbackTitle || '');

        var meta = metaFromTvMazeShow(show, fallbackTitle || '');
        if (!meta.imdbId && imdbId) meta.imdbId = imdbId;
        var links = await fetchEpisodeLinks(show._links);
        meta.nextEpisode = links.nextEpisode;
        meta.lastAired = links.lastAired;
        return meta;
    }

    // Cleans an add-show query so decorations users type don't break the match:
    // pulls out a 4-digit year (from "(2011)" or a trailing "2011") for OMDb's
    // year filter, and strips parentheticals + trailing region tags like US/UK so
    // "Shameless US", "Shameless (2011)" and "Shameless 2011" all find the show.
    function normalizeSearchQuery(raw) {
        var text = String(raw || '').trim();
        var year = '';
        var paren = text.match(/\((\d{4})\)/);
        if (paren) year = paren[1];
        text = text.replace(/\([^)]*\)/g, ' ');
        if (!year) {
            var trailing = text.match(/\b(19|20)\d{2}\b\s*$/);
            if (trailing) year = trailing[0].trim();
        }
        text = text.replace(/\b(19|20)\d{2}\b\s*$/, ' ');
        text = text.replace(/\b(us|usa|uk|au|ca|nz)\b\s*$/i, ' ');
        text = text.replace(/\s+/g, ' ').trim();
        return { title: text, year: year };
    }

    // Searches TVMaze for all shows matching a query, returning the raw show
    // objects (each carries poster, summary, genres, rating, externals, _links).
    async function searchTvMazeShows(query) {
        var norm = normalizeSearchQuery(query);
        var term = norm.title || query;
        var url = 'https://api.tvmaze.com/search/shows?q=' + encodeURIComponent(term);
        var results = await fetchJson(url);
        if (!Array.isArray(results)) return [];
        return results
            .slice(0, 8)
            .map(function (item) { return item && item.show; })
            .filter(Boolean);
    }

    // Searches OMDb (IMDb's catalog) by title. OMDb's search results are sparse
    // (title, year, poster, imdb id), so we normalize them to the same shape the
    // TVMaze results use and mark them with _omdb; full descriptions are filled in
    // afterwards by enrichOmdbCards, and the TVMaze bridge for episode tracking is
    // resolved when the show is actually added.
    async function searchOmdbShows(query, apiKey) {
        var norm = normalizeSearchQuery(query);
        var term = norm.title || query;
        var base = 'https://www.omdbapi.com/?apikey=' + encodeURIComponent(apiKey) + '&type=series&s=' + encodeURIComponent(term);
        var data = await fetchJson(base + (norm.year ? '&y=' + encodeURIComponent(norm.year) : ''));
        // A year filter can be too strict (OMDb sometimes lists a different start
        // year); if it finds nothing, retry on the title alone before giving up.
        if ((!data || data.Response === 'False' || !Array.isArray(data.Search)) && norm.year) {
            data = await fetchJson(base);
        }
        if (!data || data.Response === 'False' || !Array.isArray(data.Search)) return [];
        var seen = {};
        return data.Search.map(function (item) {
            var imdb = item && item.imdbID ? String(item.imdbID) : '';
            var poster = item && item.Poster && item.Poster !== 'N/A' ? item.Poster : '';
            var year = (String((item && item.Year) || '').match(/\d{4}/) || [''])[0];
            return {
                id: 0,
                name: (item && item.Title) || '',
                premiered: year,
                image: poster ? { original: poster, medium: poster } : null,
                genres: [],
                summary: '',
                status: '',
                rating: null,
                externals: { imdb: imdb },
                _omdb: true,
                _links: null
            };
        }).filter(function (s) {
            if (!s.name || !s.externals.imdb || seen[s.externals.imdb]) return false;
            seen[s.externals.imdb] = true;
            return true;
        }).slice(0, 8);
    }

    // OMDb's cheap "s=" search omits plot/genre/rating, so we lazily fetch full
    // detail per imdb id and cache it (localStorage, shared across users since
    // it's public data) to avoid re-spending the 1000/day quota on repeat looks.
    var omdbDetailMem = null;
    var OMDB_CACHE_KEY = 'tv_omdb_detail_cache';
    var OMDB_CACHE_MAX = 400;

    function loadOmdbCache() {
        if (omdbDetailMem) return omdbDetailMem;
        omdbDetailMem = {};
        try {
            var raw = storageGetItem(OMDB_CACHE_KEY);
            if (raw) omdbDetailMem = JSON.parse(raw) || {};
        } catch (e) { omdbDetailMem = {}; }
        return omdbDetailMem;
    }

    function getOmdbDetail(imdbId) {
        var cache = loadOmdbCache();
        return cache[imdbId] || null;
    }

    function setOmdbDetail(imdbId, detail) {
        var cache = loadOmdbCache();
        cache[imdbId] = detail;
        var keys = Object.keys(cache);
        if (keys.length > OMDB_CACHE_MAX) delete cache[keys[0]];
        try { storageSetItem(OMDB_CACHE_KEY, JSON.stringify(cache)); } catch (e) { /* quota - ignore */ }
    }

    async function fetchOmdbDetail(imdbId, apiKey) {
        var cached = getOmdbDetail(imdbId);
        if (cached) return cached;
        var url = 'https://www.omdbapi.com/?apikey=' + encodeURIComponent(apiKey) + '&plot=full&i=' + encodeURIComponent(imdbId);
        var result = await fetchJson(url);
        if (!result || result.Response === 'False') return null;
        var detail = {
            summary: result.Plot && result.Plot !== 'N/A' ? result.Plot : '',
            genres: splitGenres(result.Genre),
            imdbRating: result.imdbRating && result.imdbRating !== 'N/A' ? result.imdbRating : '',
            network: result.Production && result.Production !== 'N/A' ? result.Production : ''
        };
        setOmdbDetail(imdbId, detail);
        return detail;
    }

    // --- OMDb daily request tracking --------------------------------------
    // OMDb's free tier allows 1,000 requests/day per key. We tally the requests
    // this device makes (per user, since each user has their own key) so the
    // count can be surfaced in the OMDb key modal. It's a per-device estimate
    // stored locally and NOT synced (the real quota is per key, across devices).
    var OMDB_USAGE_KEY = 'tvTrackerOmdbUsageV1';
    var OMDB_DAILY_LIMIT = 1000;

    function omdbUsageStorageKey() {
        return OMDB_USAGE_KEY + '::' + (state.currentUser || 'anonymous');
    }

    function todayStamp() {
        var d = new Date();
        var m = String(d.getMonth() + 1);
        if (m.length < 2) m = '0' + m;
        var day = String(d.getDate());
        if (day.length < 2) day = '0' + day;
        return d.getFullYear() + '-' + m + '-' + day;
    }

    function loadOmdbUsage() {
        try {
            var raw = storageGetItem(omdbUsageStorageKey());
            var parsed = raw ? JSON.parse(raw) : null;
            return parsed && typeof parsed === 'object' ? parsed : {};
        } catch (e) {
            return {};
        }
    }

    function recordOmdbRequest() {
        var usage = loadOmdbUsage();
        var today = todayStamp();
        usage[today] = (usage[today] || 0) + 1;
        // Keep only the most recent ~14 days so this never grows unbounded.
        var keys = Object.keys(usage).sort();
        while (keys.length > 14) {
            delete usage[keys.shift()];
        }
        try {
            storageSetItem(omdbUsageStorageKey(), JSON.stringify(usage));
        } catch (e) { /* storage full - ignore telemetry write */ }
    }

    function getOmdbUsageToday() {
        return loadOmdbUsage()[todayStamp()] || 0;
    }

    // Fills in descriptions/genre/rating for OMDb (IMDb) result cards after they
    // render. Fetches run in parallel but each bails if the user has since typed
    // a newer query (seq mismatch) so stale detail never lands on fresh results.
    function enrichOmdbCards(shows, seq) {
        var apiKey = loadUserScopedValue(STORE_KEYS.omdbApiKey) || '';
        if (!apiKey) return;
        shows.forEach(function (show) {
            if (!show || !show._omdb || show._summary) return;
            var imdb = show.externals && show.externals.imdb;
            if (!imdb) return;
            Promise.resolve(fetchOmdbDetail(imdb, apiKey)).then(function (detail) {
                if (seq !== state.addShowSeq) return;
                show._enrichTried = true;
                if (detail) {
                    show._summary = detail.summary;
                    show._genres = detail.genres;
                    show._imdbRating = detail.imdbRating;
                    show._network = detail.network;
                }
                if (typeof show.__renderMeta === 'function') show.__renderMeta();
                if (typeof show.__renderDesc === 'function') show.__renderDesc(show._summary || '');
            }).catch(function () {
                if (seq !== state.addShowSeq) return;
                show._enrichTried = true;
                if (typeof show.__renderDesc === 'function') show.__renderDesc('');
            });
        });
    }

    // Builds our metadata object from a TVMaze show payload (no episode links;
    // callers merge those in via fetchEpisodeLinks when needed).
    function metaFromTvMazeShow(show, fallbackTitle) {
        show = show || {};
        return {
            provider: 'TVMaze',
            poster: pickPoster(show),
            title: show.name || fallbackTitle || '',
            summary: stripHtml(show.summary || ''),
            genres: Array.isArray(show.genres) ? show.genres : [],
            imdbId: show.externals && show.externals.imdb ? show.externals.imdb : '',
            imdbRating: show.rating && show.rating.average ? String(show.rating.average) : '',
            premiered: show.premiered || '',
            network: (show.network && show.network.name) || (show.webChannel && show.webChannel.name) || '',
            runtime: toInt(show.averageRuntime || show.runtime) || 0,
            tvmazeId: toInt(show.id),
            seriesStatus: normalizeSeriesStatus(show.status),
            nextEpisode: null,
            lastAired: null,
            fetchedAt: new Date().toISOString()
        };
    }

    // Canonicalizes a show's airing status into 'running' | 'ended' | 'upcoming'
    // | '' (unknown). TVMaze uses Running/Ended/To Be Determined/In Development.
    // NOTE: neither TVMaze nor OMDb reliably distinguish "cancelled" from "ended",
    // so a cancelled show reads as 'ended' here.
    function normalizeSeriesStatus(raw) {
        var s = String(raw || '').trim().toLowerCase();
        if (s === 'running' || s === 'continuing' || s === 'returning series') return 'running';
        if (s === 'ended' || s === 'canceled' || s === 'cancelled') return 'ended';
        if (s === 'in development' || s === 'to be determined' || s === 'upcoming') return 'upcoming';
        return '';
    }

    // Derives airing status from an OMDb "Year" string: "2011–2021" (closed
    // range) => ended; "2011–" (open range) => running; a bare year is ambiguous
    // so it stays unknown.
    function seriesStatusFromOmdbYear(year) {
        var text = String(year || '').trim();
        // OMDb uses an en-dash (–) but tolerate a hyphen too.
        var m = text.match(/^(\d{4})\s*[–-]\s*(\d{0,4})/);
        if (!m) return '';
        return m[2] ? 'ended' : 'running';
    }

    async function fetchTvMazeByImdb(imdbId) {
        var url = 'https://api.tvmaze.com/lookup/shows?imdb=' + encodeURIComponent(imdbId);
        var show = await fetchJson(url);
        if (!show) return null;

        var links = await fetchEpisodeLinks(show._links);

        return {
            poster: pickPoster(show),
            tvmazeId: toInt(show.id),
            runtime: toInt(show.averageRuntime || show.runtime) || 0,
            seriesStatus: normalizeSeriesStatus(show.status),
            nextEpisode: links.nextEpisode,
            lastAired: links.lastAired
        };
    }

    // Resolves the next-episode and previous-episode (last aired) links from a
    // TVMaze _links block in parallel, returning normalized episode objects.
    async function fetchEpisodeLinks(linksBlock) {
        var links = linksBlock || {};
        var nextHref = links.nextepisode && links.nextepisode.href ? toHttps(links.nextepisode.href) : '';
        var prevHref = links.previousepisode && links.previousepisode.href ? toHttps(links.previousepisode.href) : '';
        var results = await Promise.all([
            nextHref ? fetchJson(nextHref) : Promise.resolve(null),
            prevHref ? fetchJson(prevHref) : Promise.resolve(null)
        ]);
        return {
            nextEpisode: mapEpisode(results[0]),
            lastAired: mapEpisode(results[1])
        };
    }

    function mapEpisode(ep) {
        if (!ep) return null;
        return {
            name: ep.name || '',
            season: ep.season || 0,
            number: ep.number || 0,
            airdate: ep.airdate || '',
            summary: stripHtml(ep.summary || '')
        };
    }

    function pickPoster(show) {
        if (show.image && show.image.original) return show.image.original;
        if (show.image && show.image.medium) return show.image.medium;
        return FALLBACK_POSTER;
    }

    async function fetchJson(url) {
        var isOmdb = typeof url === 'string' && url.indexOf('omdbapi.com') !== -1;
        try {
            var response = await fetch(url, { cache: 'no-store' });
            // Count only requests that actually reached OMDb (a response came
            // back, even an error/quota one, which still counts against the key).
            // Network failures throw below and are not counted.
            if (isOmdb) recordOmdbRequest();
            if (!response.ok) return null;
            return response.json();
        } catch (error) {
            return null;
        }
    }

    function splitGenres(text) {
        if (!text || text === 'N/A') return [];
        return String(text).split(',').map(function (x) { return x.trim(); }).filter(Boolean);
    }

    // Parses an OMDb "Runtime" string (e.g. "60 min") to whole minutes.
    function parseRuntimeMinutes(text) {
        if (!text || text === 'N/A') return 0;
        var match = String(text).match(/\d+/);
        return match ? toInt(match[0]) : 0;
    }

    function parseCsv(raw) {
        var text = String(raw || '');
        if (text.charCodeAt(0) === 0xfeff) {
            text = text.slice(1);
        }

        var rows = [];
        var row = [];
        var value = '';
        var inQuotes = false;

        for (var i = 0; i < text.length; i++) {
            var char = text[i];

            if (char === '"') {
                if (inQuotes && text[i + 1] === '"') {
                    value += '"';
                    i += 1;
                } else {
                    inQuotes = !inQuotes;
                }
                continue;
            }

            if (char === ',' && !inQuotes) {
                row.push(value);
                value = '';
                continue;
            }

            if ((char === '\n' || char === '\r') && !inQuotes) {
                if (char === '\r' && text[i + 1] === '\n') i += 1;
                row.push(value);
                value = '';
                if (row.some(function (cell) { return cell !== ''; })) {
                    rows.push(row);
                }
                row = [];
                continue;
            }

            value += char;
        }

        if (value.length > 0 || row.length > 0) {
            row.push(value);
            rows.push(row);
        }

        if (!rows.length) return [];
        var headers = rows[0].map(function (h) { return String(h || '').trim(); });
        var results = [];

        for (var r = 1; r < rows.length; r++) {
            var source = rows[r];
            if (!source || !source.length) continue;
            var obj = {};
            for (var c = 0; c < headers.length; c++) {
                obj[headers[c]] = source[c] == null ? '' : String(source[c]).trim();
            }
            results.push(obj);
        }

        return results;
    }

    function normalizeName(name) {
        return String(name || '')
            .toLowerCase()
            .replace(/\(.*?\)/g, ' ')
            .replace(/[^a-z0-9]+/g, ' ')
            .trim();
    }

    function safeId(value) {
        var id = String(value || '').trim();
        return id || '';
    }

    function toInt(value) {
        var n = parseInt(String(value || ''), 10);
        return Number.isFinite(n) ? n : 0;
    }

    function asTime(value) {
        var t = Date.parse(String(value || ''));
        return Number.isFinite(t) ? t : 0;
    }

    function formatDate(value) {
        if (!value) return 'Unknown';
        var date = new Date(value);
        if (isNaN(date.getTime())) return String(value);
        return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
    }

    function formatYear(value) {
        if (!value) return '';
        var date = new Date(value);
        if (isNaN(date.getTime())) return String(value).slice(0, 4);
        return String(date.getFullYear());
    }

    function stripHtml(html) {
        return String(html || '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
    }

    function capitalize(value) {
        var text = String(value || '');
        return text ? text[0].toUpperCase() + text.slice(1) : '';
    }

    // Maps a canonical series status to a display label + CSS suffix for the
    // airing-status badge. Returns null for unknown so the badge stays hidden.
    function seriesStatusLabel(status) {
        if (status === 'running') return { text: 'Ongoing', cls: 'running' };
        if (status === 'ended') return { text: 'Ended', cls: 'ended' };
        if (status === 'upcoming') return { text: 'Upcoming', cls: 'upcoming' };
        return null;
    }

    function metaKey(showId, title) {
        return showId + '::' + normalizeName(title);
    }

    function setStatus(message, isError, forceShow) {
        var error = !!isError;
        var allowInfo = !!forceShow || !!(state.profileSettings && state.profileSettings.debugMessages);
        if (!error && !allowInfo) {
            els.statusText.textContent = '';
            els.statusText.className = 'status-text';
            return;
        }
        els.statusText.textContent = message;
        els.statusText.className = error ? 'status-text error' : 'status-text';
    }

    function loadJson(key, fallback) {
        try {
            var raw = storageGetItem(key);
            if (!raw) return fallback;
            var parsed = JSON.parse(raw);
            // Backward compatibility: some older writes stored JSON as a string
            // payload; parse one extra level so existing user data is recovered.
            if (typeof parsed === 'string') {
                try {
                    var reparsed = JSON.parse(parsed);
                    if (reparsed && typeof reparsed === 'object') return reparsed;
                } catch (nestedError) { /* ignore */ }
            }
            return parsed && typeof parsed === 'object' ? parsed : fallback;
        } catch (error) {
            return fallback;
        }
    }

    function persistJson(key, value) {
        try {
            storageSetItem(key, JSON.stringify(value));
        } catch (error) {
            console.warn('Could not persist localStorage key', key, error);
        }
    }

    function escapeHtml(value) {
        return String(value)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function toHttps(url) {
        return String(url || '').replace(/^http:\/\//i, 'https://');
    }

    function normalizeUsername(value) {
        return String(value || '').trim().toLowerCase().replace(/[^a-z0-9._-]+/g, '');
    }

    // Generate random salt (base64)
    function generateSalt() {
        var arr = new Uint8Array(32);
        crypto.getRandomValues(arr);
        return btoa(String.fromCharCode.apply(null, arr));
    }

    // Derive password hash using PBKDF2 (Web Crypto API)
    async function hashPassword(password, salt) {
        try {
            var encoder = new TextEncoder();
            var data = encoder.encode(password);
            var saltData = Uint8Array.from(atob(salt), function (c) { return c.charCodeAt(0); });

            var key = await crypto.subtle.importKey('raw', data, 'PBKDF2', false, ['deriveBits']);
            var bits = await crypto.subtle.deriveBits(
                {
                    name: 'PBKDF2',
                    salt: saltData,
                    iterations: 100000,
                    hash: 'SHA-256'
                },
                key,
                256
            );
            var hashArray = Array.from(new Uint8Array(bits));
            return btoa(String.fromCharCode.apply(null, hashArray));
        } catch (error) {
            console.error('Password hashing failed:', error);
            return null;
        }
    }

    function weakHash(value) {
        var input = String(value || '');
        var hash = 5381;
        for (var i = 0; i < input.length; i++) {
            hash = ((hash << 5) + hash) + input.charCodeAt(i);
            hash = hash & 0xffffffff;
        }
        return String(hash >>> 0);
    }

    // Cloud sync metadata clock for settings bundle conflict resolution.
    function getSyncSettingsAt() {
        var m = loadJson(scopedKey(STORE_KEYS.syncMeta), null);
        return (m && m.settingsAt) || 0;
    }
    function setSyncSettingsAt(v) {
        persistJson(scopedKey(STORE_KEYS.syncMeta), { settingsAt: v || Date.now() });
    }
    function bumpSyncSettingsAt() { setSyncSettingsAt(Date.now()); }

    // --- snapshot build / merge -------------------------------------------
    function buildSyncSnapshot() {
        return {
            t: 'push',
            v: 1,
            user: state.currentUser,
            overrides: state.overrides || {},
            watchHistory: state.watchHistory || [],
            customShows: state.customShows || [],
            importedData: state.importedData || null,
            metadataCache: state.metadataCache || {},
            manualLinks: state.manualLinks || {},
            settings: {
                profileSettings: state.profileSettings || null,
                omdbApiKey: loadUserScopedValue(STORE_KEYS.omdbApiKey) || '',
                settingsAt: getSyncSettingsAt()
            },
            sentAt: Date.now()
        };
    }

    function mergeSyncSnapshot(remote) {
        if (!remote || typeof remote !== 'object') return { changed: false };
        if (!state.currentUser) return { changed: false, rejected: true, reason: 'not-signed-in' };
        // Backward compatibility: older snapshots may not include `user`.
        var remoteUser = normalizeUsername(remote.user || '');
        if (remoteUser && remoteUser !== state.currentUser) {
            return { changed: false, rejected: true, reason: 'user' };
        }

        var changed = false;
        var importChanged = false;
        var metaChanged = false;
        var manualLinksChanged = false;
        var watchHistoryChanged = false;
        var settingsChanged = false;
        var pendingOmdb = null;
        var pendingSettingsAt = 0;

        state.cloud.applyingRemote = true;
        try {
            // overrides: per-show newest wins (never delete local shows)
            var rov = remote.overrides || {};
            Object.keys(rov).forEach(function (showId) {
                var rEntry = rov[showId];
                if (!rEntry || typeof rEntry !== 'object') return;
                var lEntry = state.overrides[showId];
                var rAt = rEntry.updatedAt || 0;
                var lAt = (lEntry && lEntry.updatedAt) || 0;
                if (!lEntry || rAt > lAt) {
                    state.overrides[showId] = JSON.parse(JSON.stringify(rEntry));
                    changed = true;
                }
            });

            // customShows: per-id newest wins (union)
            var byId = {};
            (state.customShows || []).forEach(function (s) { if (s && s.id) byId[s.id] = s; });
            (remote.customShows || []).forEach(function (rs) {
                if (!rs || !rs.id) return;
                var ex = byId[rs.id];
                var rAt = rs.updatedAt || Date.parse(rs.createdAt || '') || 0;
                var eAt = ex ? (ex.updatedAt || Date.parse(ex.createdAt || '') || 0) : -1;
                if (!ex || rAt > eAt) { byId[rs.id] = rs; changed = true; }
            });
            var mergedCustom = Object.keys(byId).map(function (k) { return byId[k]; });

            // watchHistory: append-only merge by event id.
            var histById = {};
            (state.watchHistory || []).forEach(function (e) {
                if (!e || !e.id) return;
                histById[e.id] = e;
            });
            (remote.watchHistory || []).forEach(function (e) {
                if (!e || !e.id) return;
                if (!histById[e.id]) {
                    histById[e.id] = e;
                    watchHistoryChanged = true;
                    changed = true;
                }
            });
            var mergedHistory = Object.keys(histById).map(function (k) { return histById[k]; })
                .sort(function (a, b) { return asTime(a && a.loggedAt) - asTime(b && b.loggedAt); });
            if (mergedHistory.length > WATCH_HISTORY_MAX) {
                mergedHistory = mergedHistory.slice(mergedHistory.length - WATCH_HISTORY_MAX);
            }

            // importedData: newest importedAt wins
            var lImp = state.importedData;
            var rImp = remote.importedData;
            var lAtImp = lImp && lImp.importedAt ? (Date.parse(lImp.importedAt) || 0) : 0;
            var rAtImp = rImp && rImp.importedAt ? (Date.parse(rImp.importedAt) || 0) : 0;
            if (rImp && (!lImp || rAtImp > lAtImp)) { state.importedData = rImp; changed = true; importChanged = true; }

            // metadataCache: fill missing keys only (regenerable, keep local on conflict)
            var rmc = remote.metadataCache || {};
            Object.keys(rmc).forEach(function (k) {
                if (!state.metadataCache[k]) { state.metadataCache[k] = rmc[k]; metaChanged = true; }
            });
            if (metaChanged) changed = true;

            // manualLinks: per-show union, remote fills missing ids/details only.
            var rml = remote.manualLinks || {};
            Object.keys(rml).forEach(function (showId) {
                var remoteLink = rml[showId];
                if (!remoteLink || typeof remoteLink !== 'object') return;
                var localLink = state.manualLinks[showId] || null;
                if (!localLink) {
                    state.manualLinks[showId] = JSON.parse(JSON.stringify(remoteLink));
                    manualLinksChanged = true;
                    changed = true;
                    return;
                }
                var merged = Object.assign({}, remoteLink, localLink);
                if (JSON.stringify(merged) !== JSON.stringify(localLink)) {
                    state.manualLinks[showId] = merged;
                    manualLinksChanged = true;
                    changed = true;
                }
            });

            // settings bundle: newest settingsAt wins
            var rSet = remote.settings || {};
            var rSetAt = rSet.settingsAt || 0;
            if (rSetAt > getSyncSettingsAt()) {
                if (rSet.profileSettings) state.profileSettings = rSet.profileSettings;
                pendingOmdb = { value: rSet.omdbApiKey || '' };
                pendingSettingsAt = rSetAt;
                settingsChanged = true;
                changed = true;
            }

            if (changed) {
                state.customShows = mergedCustom;
                state.watchHistory = mergedHistory;
                persistJson(scopedKey(STORE_KEYS.localOverrides), state.overrides);
                if (watchHistoryChanged) persistJson(scopedKey(STORE_KEYS.watchHistory), state.watchHistory);
                persistJson(scopedKey(STORE_KEYS.customShows), state.customShows);
                if (importChanged) persistJson(scopedKey(STORE_KEYS.importedData), state.importedData);
                if (metaChanged) persistJson(scopedKey(STORE_KEYS.metadataCache), state.metadataCache);
                if (manualLinksChanged) persistJson(scopedKey(STORE_KEYS.manualLinks), state.manualLinks);
                if (settingsChanged) {
                    if (state.profileSettings) persistJson(scopedKey(STORE_KEYS.profileSettings), state.profileSettings);
                    if (pendingOmdb) {
                        if (pendingOmdb.value) storageSetItem(scopedKey(STORE_KEYS.omdbApiKey), pendingOmdb.value);
                        else { try { storageRemoveItem(scopedKey(STORE_KEYS.omdbApiKey)); } catch (e) { /* ignore */ } }
                    }
                    setSyncSettingsAt(pendingSettingsAt || Date.now());
                }
            }
        } finally {
            state.cloud.applyingRemote = false;
        }
        return { changed: changed };
    }

    function applyMergeAndRebuild() {
        if (state.cloud && state.cloud.applyingRemote) {
            showLoadingOverlay('Syncing from cloud…', 'Refreshing your tracker data');
        }
        try {
            refreshForCurrentUser();
        } catch (e) {
            console.warn('[SYNC] rebuild failed', e);
            if (state.cloud && state.cloud.applyingRemote) hideLoadingOverlay();
        }
    }

})();
