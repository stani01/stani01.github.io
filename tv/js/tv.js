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
        metadataCache: 'tvTrackerMetadataCacheV1',
        omdbApiKey: 'tvTrackerOmdbApiKey',
        accounts: 'tvTrackerAccountsV1',
        sessionUser: 'tvTrackerSessionUserV1',
        customShows: 'tvTrackerCustomShowsV1',
        importedData: 'tvTrackerImportedDataV1',
        profileSettings: 'tvTrackerProfileSettingsV1',
        sortPreference: 'tvTrackerSortPreference',
        filterPreference: 'tvTrackerFilterPreference',
        sectionCollapse: 'tvTrackerSectionCollapseV1'
    };

    // Shows watched within this window are "Watch Next"; older ones drop into
    // "Haven't Watched in a While" (TV Time-style split of the active list).
    var RECENT_DAYS_THRESHOLD = 30;

    // Fallback per-episode length (minutes) used for the "Hours watched" estimate
    // when a show's metadata has no runtime yet.
    var DEFAULT_EPISODE_MINUTES = 40;

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
        metadataCache: {},
        customShows: [],
        importedData: null,
        profileSettings: { useImportedData: true },
        metadataFetchQueue: [],
        episodeCache: {},
        activeFetches: 0,
        currentUser: '',
        modalShowId: '',
        modalEpisodes: [],
        modalOpenSeasons: null,
        upcomingTab: '',
        pendingConfirm: null,
        refreshMode: false,
        importMode: false,
        refreshTotal: 0,
        refreshDone: 0,
        search: '',
        sortBy: 'recent',
        filterBy: 'all',
        // Watch Next & Paused expanded; the long lists start collapsed.
        collapsedSections: { watchnext: false, stale: true, paused: false, completed: true }
    };

    var els = {
        statusText: document.getElementById('status-text'),
        statsCards: document.getElementById('stats-cards'),
        pausedShowsGrid: document.getElementById('paused-shows-grid'),
        completedShowsGrid: document.getElementById('completed-shows-grid'),
        watchNextGrid: document.getElementById('watchnext-shows-grid'),
        staleGrid: document.getElementById('stale-shows-grid'),
        pausedShowsCount: document.getElementById('paused-shows-count'),
        completedShowsCount: document.getElementById('completed-shows-count'),
        watchNextCount: document.getElementById('watchnext-shows-count'),
        staleCount: document.getElementById('stale-shows-count'),
        sectionToggles: Array.prototype.slice.call(document.querySelectorAll('.section-toggle')),
        searchInput: document.getElementById('search-input'),
        sortSelect: document.getElementById('sort-select'),
        filterSelect: document.getElementById('filter-select'),
        upcomingBoard: document.getElementById('upcoming-board'),
        cardTemplate: document.getElementById('show-card-template'),
        importButton: document.getElementById('import-data'),
        importInput: document.getElementById('import-file'),
        refreshMetaButton: document.getElementById('refresh-meta'),
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
        showModalTitle: document.getElementById('show-modal-title'),
        showModalSubtitle: document.getElementById('show-modal-subtitle'),
        modalPoster: document.getElementById('modal-poster'),
        modalFactsText: document.getElementById('modal-facts-text'),
        modalLinks: document.getElementById('modal-links'),
        modalSummary: document.getElementById('modal-summary'),
        modalProgress: document.getElementById('modal-progress'),
        modalSeasons: document.getElementById('modal-seasons'),
        upcomingTabs: document.getElementById('upcoming-tabs'),
        accountModal: document.getElementById('account-modal'),
        accountModalBackdrop: document.getElementById('account-modal-backdrop'),
        accountModalClose: document.getElementById('account-modal-close'),
        accountUsernameDisplay: document.getElementById('account-username-display'),
        accountEmailDisplay: document.getElementById('account-email-display'),
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
        addShowModal: document.getElementById('addshow-modal'),
        addShowModalBackdrop: document.getElementById('addshow-modal-backdrop'),
        addShowModalClose: document.getElementById('addshow-modal-close'),
        addShowInput: document.getElementById('addshow-input'),
        addShowSearchBtn: document.getElementById('addshow-search-btn'),
        addShowMessage: document.getElementById('addshow-message'),
        addShowResults: document.getElementById('addshow-results'),
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
        backupMessage: document.getElementById('backup-message')
    };

    initAuth();
    try {
        bindEvents();
    } catch (error) {
        console.error('[AUTH] Error binding events:', error);
    }
    refreshForCurrentUser();
    setupPWA();

    function bindEvents() {
        els.authLogin.addEventListener('click', function () {
            loginUser();
        });

        els.authLogout.addEventListener('click', function () {
            logoutUser();
        });

        els.authSettings.addEventListener('click', function () {
            openAccountModal();
        });

        if (els.accountModalClose) els.accountModalClose.addEventListener('click', function () {
            closeAccountModal();
        });

        if (els.accountModalBackdrop) els.accountModalBackdrop.addEventListener('click', function () {
            closeAccountModal();
        });

        window.addEventListener('keydown', function (event) {
            if (event.key === 'Escape' && !els.accountModal.hidden) {
                closeAccountModal();
            }
        });

        if (els.editEmailBtn) els.editEmailBtn.addEventListener('click', function () {
            els.emailEditForm.hidden = false;
            els.newEmail.focus();
        });

        if (els.cancelEmailBtn) els.cancelEmailBtn.addEventListener('click', function () {
            els.emailEditForm.hidden = true;
            els.newEmail.value = '';
        });

        if (els.saveEmailBtn) els.saveEmailBtn.addEventListener('click', function () {
            updateEmail();
        });

        if (els.changePasswordBtn) els.changePasswordBtn.addEventListener('click', function () {
            changePassword();
        });

        if (els.deleteAccountBtn) els.deleteAccountBtn.addEventListener('click', function () {
            requestDeleteAccount();
        });

        els.authPassword.addEventListener('keydown', function (event) {
            if (event.key === 'Enter') loginUser();
        });

        els.searchInput.addEventListener('input', function (event) {
            state.search = String(event.target.value || '').trim().toLowerCase();
            applyFilters();
            render();
        });

        els.sortSelect.addEventListener('change', function (event) {
            state.sortBy = event.target.value || 'recent';
            persistJson(STORE_KEYS.sortPreference, state.sortBy);
            applyFilters();
            render();
        });

        els.filterSelect.addEventListener('change', function (event) {
            state.filterBy = event.target.value || 'all';
            persistJson(STORE_KEYS.filterPreference, state.filterBy);
            applyFilters();
            render();
        });

        els.importButton.addEventListener('click', function () {
            triggerImport();
        });

        els.importInput.addEventListener('change', function (event) {
            importTvTimeExport(event.target.files);
            // Reset so selecting the same file again still fires 'change'.
            event.target.value = '';
        });

        els.refreshMetaButton.addEventListener('click', function () {
            if (!state.currentUser) {
                setStatus('Please log in first.');
                return;
            }
            if (!state.shows.length) {
                setStatus('Import your shows first, then refresh metadata.');
                return;
            }
            openConfirm(
                'Refresh all metadata?',
                'This re-fetches posters, descriptions and next-episode air dates for every show from the metadata providers. It can take a little while. The page will reload automatically when it finishes.',
                'Refresh',
                function () { startMetadataRefresh(); }
            );
        });

        els.setOmdbKeyButton.addEventListener('click', function () {
            openOmdbModal();
        });

        if (els.omdbModalClose) els.omdbModalClose.addEventListener('click', function () {
            closeOmdbModal();
        });

        if (els.omdbModalBackdrop) els.omdbModalBackdrop.addEventListener('click', function () {
            closeOmdbModal();
        });

        if (els.omdbSaveBtn) els.omdbSaveBtn.addEventListener('click', function () {
            saveOmdbKey();
        });

        if (els.omdbRemoveBtn) els.omdbRemoveBtn.addEventListener('click', function () {
            removeOmdbKey();
        });

        window.addEventListener('keydown', function (event) {
            if (event.key === 'Escape' && els.omdbModal && !els.omdbModal.hidden) {
                closeOmdbModal();
            }
        });

        if (els.helpBtn) els.helpBtn.addEventListener('click', function () {
            openHelpModal();
        });

        if (els.helpModalClose) els.helpModalClose.addEventListener('click', function () {
            closeHelpModal();
        });

        if (els.helpModalBackdrop) els.helpModalBackdrop.addEventListener('click', function () {
            closeHelpModal();
        });

        if (els.confirmCancel) els.confirmCancel.addEventListener('click', function () {
            closeConfirm();
        });

        if (els.confirmModalBackdrop) els.confirmModalBackdrop.addEventListener('click', function () {
            closeConfirm();
        });

        if (els.confirmOk) els.confirmOk.addEventListener('click', function () {
            var action = state.pendingConfirm;
            closeConfirm();
            if (typeof action === 'function') action();
        });

        window.addEventListener('keydown', function (event) {
            if (event.key !== 'Escape') return;
            if (els.helpModal && !els.helpModal.hidden) closeHelpModal();
            if (els.confirmModal && !els.confirmModal.hidden) closeConfirm();
            if (els.recoverModal && !els.recoverModal.hidden) closeRecoverModal();
        });

        if (els.authForgot) els.authForgot.addEventListener('click', function () {
            openRecoverModal();
        });

        if (els.recoverModalClose) els.recoverModalClose.addEventListener('click', function () {
            closeRecoverModal();
        });

        if (els.recoverModalBackdrop) els.recoverModalBackdrop.addEventListener('click', function () {
            closeRecoverModal();
        });

        if (els.recoverSubmit) els.recoverSubmit.addEventListener('click', function () {
            resetPasswordViaRecovery();
        });

        if (els.authRestore) els.authRestore.addEventListener('click', function () {
            if (els.restoreFile) els.restoreFile.click();
        });

        if (els.restoreDataBtn) els.restoreDataBtn.addEventListener('click', function () {
            if (els.restoreFile) els.restoreFile.click();
        });

        if (els.restoreFile) els.restoreFile.addEventListener('change', function (event) {
            var file = event.target.files && event.target.files[0];
            if (file) importUserData(file);
            event.target.value = '';
        });

        if (els.exportDataBtn) els.exportDataBtn.addEventListener('click', function () {
            exportUserData();
        });

        els.addShowButton.addEventListener('click', function () {
            openAddShowModal();
        });

        if (els.addShowModalClose) els.addShowModalClose.addEventListener('click', function () {
            closeAddShowModal();
        });

        if (els.addShowModalBackdrop) els.addShowModalBackdrop.addEventListener('click', function () {
            closeAddShowModal();
        });

        if (els.addShowSearchBtn) els.addShowSearchBtn.addEventListener('click', function () {
            runAddShowSearch();
        });

        if (els.addShowInput) els.addShowInput.addEventListener('keydown', function (event) {
            if (event.key === 'Enter') {
                event.preventDefault();
                runAddShowSearch();
            }
        });

        window.addEventListener('keydown', function (event) {
            if (event.key === 'Escape' && els.addShowModal && !els.addShowModal.hidden) {
                closeAddShowModal();
            }
        });

        (els.sectionToggles || []).forEach(function (toggle) {
            toggle.addEventListener('click', function () {
                toggleSection(toggle.getAttribute('data-section'));
            });
        });
        // Reflect default collapse state on first paint (before any login).
        applySectionCollapseUi();

        els.showModalClose.addEventListener('click', function () {
            closeShowModal();
        });

        els.showModalBackdrop.addEventListener('click', function () {
            closeShowModal();
        });

        window.addEventListener('keydown', function (event) {
            if (event.key === 'Escape' && !els.showModal.hidden) {
                closeShowModal();
            }
        });

        // PWA Install button handler
        els.installAppButton.addEventListener('click', function () {
            if (window.deferredPrompt) {
                window.deferredPrompt.prompt();
                window.deferredPrompt.userChoice.then(function (choiceResult) {
                    if (choiceResult.outcome === 'accepted') {
                        setStatus('✅ App installed! You can now access it from your home screen.');
                        els.installAppButton.hidden = true;
                    }
                    window.deferredPrompt = null;
                });
            }
        });
    }

    function initAuth() {
        // sessionUser is stored as a JSON string (e.g. "john"), which loadJson
        // rejects because it only returns objects. Read/parse it directly.
        var lastUser = '';
        try {
            var raw = localStorage.getItem(STORE_KEYS.sessionUser);
            if (raw) {
                var parsed = JSON.parse(raw);
                if (typeof parsed === 'string') lastUser = parsed;
            }
        } catch (error) {
            lastUser = '';
        }
        if (lastUser) {
            state.currentUser = String(lastUser);
        }
        updateAuthUi();
    }

    function setupPWA() {
        // Register service worker for offline support and caching
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('sw.js').then(function (reg) {
                console.log('[PWA] Service worker registered:', reg);
            }).catch(function (err) {
                console.log('[PWA] Service worker registration failed:', err);
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
        if (window.navigator.standalone === true) {
            console.log('[PWA] Running in standalone/installed mode');
            els.installAppButton.hidden = true;
            els.installPrompt.style.display = 'none';
        }

        // Notify user about periodic updates from service worker
        if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
            navigator.serviceWorker.controller.postMessage({ type: 'CLIENTS_CLAIM' });
        }
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
        try {
            // Load user-scoped data from localStorage
            state.overrides = loadUserScopedJson(STORE_KEYS.localOverrides, {});
            state.metadataCache = loadUserScopedJson(STORE_KEYS.metadataCache, {});
            state.customShows = loadUserScopedJson(STORE_KEYS.customShows, []);
            state.importedData = loadUserScopedJson(STORE_KEYS.importedData, null);
            state.profileSettings = loadUserScopedJson(STORE_KEYS.profileSettings, { useImportedData: true });
            state.episodeCache = {};
            state.modalShowId = '';
            loadPreferences();

            // Build the shows model from this user's own imported export + custom shows
            bootstrap();
        } catch (error) {
            console.error('[USER] Error refreshing current user data:', error);
        }
    }


    async function loginUser() {
        var username = normalizeUsername(els.authUsername.value);
        var password = String(els.authPassword.value || '');
        if (!username || !password) {
            setStatus('Enter username and password to log in.');
            return;
        }
        var accounts = loadJson(STORE_KEYS.accounts, {});
        var account = accounts[username];
        if (!account) {
            setStatus('Invalid username or password.');
            return;
        }
        
        // Verify password using PBKDF2
        var derivedHash = await hashPassword(password, account.salt);
        if (!derivedHash || derivedHash !== account.passwordHash) {
            setStatus('Invalid username or password.');
            return;
        }
        
        state.currentUser = username;
        persistJson(STORE_KEYS.sessionUser, username);
        els.authPassword.value = '';
        updateAuthUi();
        refreshForCurrentUser();
        setStatus('Logged in as ' + username + '.');
    }

    function logoutUser() {
        state.currentUser = '';
        persistJson(STORE_KEYS.sessionUser, '');
        updateAuthUi();
        clearUiForSignedOut();
        setStatus('Signed out. Log in to access your tracker data.');
    }

    function openAccountModal() {
        if (!state.currentUser) return;
        
        var accounts = loadJson(STORE_KEYS.accounts, {});
        var account = accounts[state.currentUser];
        
        els.accountUsernameDisplay.textContent = state.currentUser;
        els.accountEmailDisplay.textContent = account && account.email ? escapeHtml(account.email) : 'Not set';
        els.emailEditForm.hidden = true;
        els.newEmail.value = '';
        els.currentPasswordInput.value = '';
        els.newPasswordInput.value = '';
        els.confirmPasswordInput.value = '';
        els.passwordMessage.textContent = '';
        els.deleteMessage.textContent = '';
        
        els.accountModal.hidden = false;
    }

    function closeAccountModal() {
        els.accountModal.hidden = true;
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

    // --- Lost-password reset (local-only) ---------------------------------
    // No server exists, so we can't email a reset link. Instead we verify the
    // username + the email captured at registration, then let the user set a
    // new password. This matches the app's local-profile threat model.

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
        var accounts = loadJson(STORE_KEYS.accounts, {});
        var account = accounts[username];
        if (!account) {
            setRecoverMessage('No account with that username exists in this browser.', true);
            return;
        }
        if (!account.email) {
            setRecoverMessage('This account has no email on file, so it can\u2019t be reset here. Re-register it instead.', true);
            return;
        }
        if (String(account.email).trim().toLowerCase() !== email.toLowerCase()) {
            setRecoverMessage('That email does not match the one on file for this account.', true);
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

        var salt = generateSalt();
        var passwordHash = await hashPassword(newPassword, salt);
        if (!passwordHash) {
            setRecoverMessage('Password hashing failed. Please try again.', true);
            return;
        }
        account.salt = salt;
        account.passwordHash = passwordHash;
        accounts[username] = account;
        persistJson(STORE_KEYS.accounts, accounts);

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
        var accounts = loadJson(STORE_KEYS.accounts, {});
        var payload = {
            type: 'tvtracker-backup',
            version: 1,
            exportedAt: new Date().toISOString(),
            username: state.currentUser,
            account: accounts[state.currentUser] || null,
            data: {}
        };
        var suffix = '::' + state.currentUser;
        for (var i = 0; i < localStorage.length; i++) {
            var key = localStorage.key(i);
            if (key && key.length > suffix.length && key.slice(-suffix.length) === suffix) {
                payload.data[key.slice(0, key.length - suffix.length)] = localStorage.getItem(key);
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
            if (els.backupMessage) els.backupMessage.textContent = 'Backup downloaded. Restore it on your other device to sync.';
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
            if (!payload || payload.type !== 'tvtracker-backup' || !payload.username || !payload.account) {
                setStatus('That file is not a valid TV Tracker backup.');
                return;
            }
            var username = normalizeUsername(payload.username);
            if (!username) {
                setStatus('That backup has an invalid username.');
                return;
            }
            var accounts = loadJson(STORE_KEYS.accounts, {});
            var applyRestore = function () {
                accounts[username] = payload.account;
                persistJson(STORE_KEYS.accounts, accounts);
                var data = payload.data || {};
                Object.keys(data).forEach(function (base) {
                    try { localStorage.setItem(base + '::' + username, data[base]); } catch (e) { /* ignore */ }
                });
                persistJson(STORE_KEYS.sessionUser, username);
                setStatus('Backup restored. Loading your account\u2026');
                window.setTimeout(function () { window.location.reload(); }, 500);
            };
            if (accounts[username]) {
                openConfirm(
                    'Restore over \u201c' + username + '\u201d?',
                    'An account named \u201c' + username + '\u201d already exists in this browser. Restoring will overwrite its login and tracker data with the backup.',
                    'Overwrite',
                    applyRestore
                );
            } else {
                applyRestore();
            }
        };
        reader.onerror = function () {
            setStatus('Could not read that backup file.');
        };
        reader.readAsText(file);
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
        if (els.loadingOverlay) els.loadingOverlay.hidden = false;
    }

    function updateLoadingSub(sub) {
        if (els.loadingSub) els.loadingSub.textContent = sub || '';
    }

    function hideLoadingOverlay() {
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
        persistUserScopedJson(STORE_KEYS.metadataCache, state.metadataCache);
        state.shows.forEach(function (show) { show.meta = null; });

        queueMetadataFetches(state.shows, true);
    }

    function finishMetadataRefresh() {
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
            'This permanently removes your profile and all tracker data stored in this browser. It cannot be undone.',
            'Delete forever',
            function () { confirmDeleteAccount(password); }
        );
    }

    async function confirmDeleteAccount(password) {
        var accounts = loadJson(STORE_KEYS.accounts, {});
        var account = accounts[state.currentUser];
        if (!account) return;
        var derivedHash = await hashPassword(password, account.salt);
        if (!derivedHash || derivedHash !== account.passwordHash) {
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
        
        var accounts = loadJson(STORE_KEYS.accounts, {});
        if (accounts[state.currentUser]) {
            accounts[state.currentUser].email = newEmail;
            persistJson(STORE_KEYS.accounts, accounts);
            els.accountEmailDisplay.textContent = escapeHtml(newEmail);
            els.emailEditForm.hidden = true;
            els.newEmail.value = '';
            setStatus('Email updated successfully.');
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
        
        // Verify current password
        var accounts = loadJson(STORE_KEYS.accounts, {});
        var account = accounts[state.currentUser];
        if (!account) {
            els.passwordMessage.textContent = 'Account not found.';
            return;
        }
        
        var derivedHash = await hashPassword(currentPassword, account.salt);
        if (!derivedHash || derivedHash !== account.passwordHash) {
            els.passwordMessage.textContent = 'Current password is incorrect.';
            return;
        }
        
        // Hash new password with same salt
        var newHash = await hashPassword(newPassword, account.salt);
        if (!newHash) {
            els.passwordMessage.textContent = 'Password hashing failed. Please try again.';
            return;
        }
        
        account.passwordHash = newHash;
        persistJson(STORE_KEYS.accounts, accounts);
        
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
            STORE_KEYS.metadataCache,
            STORE_KEYS.omdbApiKey,
            STORE_KEYS.customShows,
            STORE_KEYS.importedData,
            STORE_KEYS.profileSettings
        ];
        
        userScopedKeys.forEach(function (key) {
            localStorage.removeItem(key + '::' + state.currentUser);
        });
        
        // Delete account
        var accounts = loadJson(STORE_KEYS.accounts, {});
        delete accounts[state.currentUser];
        persistJson(STORE_KEYS.accounts, accounts);
        
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
            ['watchnext', 'stale', 'paused', 'completed'].forEach(function (key) {
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

    function toggleSection(key) {
        state.collapsedSections[key] = !state.collapsedSections[key];
        persistJson(STORE_KEYS.sectionCollapse, state.collapsedSections);
        applySectionCollapseUi();
    }

    function clearUiForSignedOut() {
        state.shows = [];
        state.filtered = [];
        state.importedData = null;
        state.customShows = [];
        els.statsCards.innerHTML = '';
        els.watchNextGrid.innerHTML = '<div class="empty">Sign in to load your personal tracker.</div>';
        els.staleGrid.innerHTML = '';
        els.pausedShowsGrid.innerHTML = '';
        els.completedShowsGrid.innerHTML = '';
        els.watchNextCount.textContent = '';
        els.staleCount.textContent = '';
        els.pausedShowsCount.textContent = '';
        els.completedShowsCount.textContent = '';
        els.upcomingBoard.innerHTML = '<div class="empty">Sign in to load upcoming episodes.</div>';
        closeShowModal();
    }

    /* ====== DATA PERSISTENCE (PER-USER ACCOUNT) ======
     * All user data is stored locally in the browser's localStorage under per-user scoped keys.
     * This includes:
     * - Watched episodes and counts
     * - Show metadata cache (posters, descriptions, genres, next episode)
     * - Custom shows added by the user
     * - User profile settings (whether to use imported data)
     * - Account credentials (username + weak hash for local login)
     * 
     * Data is NOT synced to a server or cloud. Each browser/device is independent.
     * Each user account has scoped keys in the format: "baseKey::username"
     * 
     * This approach means:
     * ✓ No login required to other services
     * ✓ All data stays private on your device
     * ✓ Works offline once cached
     * ⚠ Data is lost if browser storage is cleared
     * ⚠ Each device/browser has separate accounts
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
    }

    function loadUserScopedValue(baseKey) {
        return localStorage.getItem(scopedKey(baseKey));
    }

    function persistUserScopedValue(baseKey, value) {
        localStorage.setItem(scopedKey(baseKey), value);
    }

    function clearUserScopedValue(baseKey) {
        localStorage.removeItem(scopedKey(baseKey));
    }

    function persistUserScopedValueFor(username, baseKey, value) {
        persistJson(scopedKeyForUser(username, baseKey), value);
    }

    async function bootstrap() {
        if (!state.currentUser) return;

        var imported = state.importedData || { userShows: [], followed: [], latestSeenByShow: [] };
        var hasImport = (imported.userShows && imported.userShows.length) || (imported.followed && imported.followed.length);
        var hasCustom = state.customShows && state.customShows.length;

        if (!hasImport && !hasCustom) {
            state.shows = [];
            applyFilters();
            render();
            setStatus('No data yet. Click "Import TV Time Export" and pick the .zip you downloaded from TV Time (Settings \u2192 Export your data).');
            return;
        }

        try {
            state.shows = buildShowsModel(imported);
            applyFilters();
            render();
            queueMetadataFetches(state.shows, false);
            var when = imported.importedAt ? new Date(imported.importedAt).toLocaleDateString() : '';
            setStatus('Loaded ' + state.shows.length + ' shows from your TV Time export' + (when ? ' (imported ' + when + ')' : '') + '.');
        } catch (error) {
            console.error(error);
            setStatus('Could not build your show list from the imported data.', true);
            els.watchNextGrid.innerHTML = '<div class="error">Failed to read imported data. Try re-importing your TV Time export.</div>';
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
                persistUserScopedValue(STORE_KEYS.importedData, JSON.stringify(datasets));
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
            return rows.map(function (r) {
                return {
                    tv_show_id: r.tv_show_id,
                    tv_show_name: r.tv_show_name,
                    is_followed: r.is_followed,
                    is_favorited: r.is_favorited,
                    nb_episodes_seen: r.nb_episodes_seen
                };
            });
        }
        if (kind === 'followed') {
            return rows.map(function (r) {
                return {
                    tv_show_id: r.tv_show_id,
                    active: r.active,
                    archived: r.archived,
                    created_at: r.created_at,
                    updated_at: r.updated_at
                };
            });
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

        var shows = [];
        sourceRows.forEach(function (row) {
            var tvShowId = safeId(row.tv_show_id);
            if (!tvShowId) return;

            var title = String(row.tv_show_name || '').trim();
            if (!title) return;

            var followedInfo = followedById.get(tvShowId) || { active: row.is_followed === '1', archived: false, createdAt: '', updatedAt: '' };
            var override = state.overrides[tvShowId] || {};
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
            var metadata = getCachedMeta(tvShowId, title);

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
        if (overrideStatus) return overrideStatus;
        if (followedInfo.archived) return 'archived';
        if (!followedInfo.active && watchedCount <= 0) return 'paused';
        if (!followedInfo.active) return 'paused';
        if (lastSeen && watchedCount > 0 && lastSeen.season > 0) return 'active';
        return 'active';
    }

    function applyFilters() {
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

    function matchesFilter(show) {
        if (state.filterBy === 'all') return true;
        if (state.filterBy === 'active') return show.status === 'active';
        if (state.filterBy === 'paused') return show.status === 'paused';
        if (state.filterBy === 'completed') return show.status === 'completed';
        if (state.filterBy === 'archived') return show.status === 'archived';
        if (state.filterBy === 'with-upcoming') return Boolean(show.meta && show.meta.nextEpisode && show.meta.nextEpisode.airdate);
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
        if (!show.meta || !show.meta.nextEpisode || !show.meta.nextEpisode.airdate) return 0;
        return asTime(show.meta.nextEpisode.airdate);
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
        renderShows();
    }

    function renderStats() {
        var totalShows = state.shows.length;
        var totalWatchedEpisodes = state.shows.reduce(function (sum, show) { return sum + (show.watchedCount || 0); }, 0);
        var totalHours = Math.round(estimateWatchedMinutes() / 60);
        var active = state.shows.filter(function (show) { return show.status === 'active'; }).length;
        var paused = state.shows.filter(function (show) { return show.status === 'paused'; }).length;

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
                return show.meta && show.meta.nextEpisode && show.meta.nextEpisode.airdate;
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
            var next = show.meta.nextEpisode;
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
            var next = show.meta.nextEpisode;
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
        var staleShows = [];
        var pausedShows = [];
        var completedShows = [];
        state.filtered.forEach(function (show) {
            var tier = categorizeShow(show);
            if (tier === 'completed') completedShows.push(show);
            else if (tier === 'paused') pausedShows.push(show);
            else if (tier === 'stale') staleShows.push(show);
            else watchNext.push(show);
        });

        // In Watch Next, surface shows that have a new aired episode to watch.
        watchNext.sort(function (a, b) {
            var na = hasNewEpisode(a) ? 1 : 0;
            var nb = hasNewEpisode(b) ? 1 : 0;
            if (na !== nb) return nb - na;
            return compareByPreference(a, b);
        });

        els.watchNextCount.textContent = watchNext.length + ' shown';
        els.staleCount.textContent = staleShows.length + ' shown';
        els.pausedShowsCount.textContent = pausedShows.length + ' shown';
        els.completedShowsCount.textContent = completedShows.length + ' shown';

        renderShowList(els.watchNextGrid, watchNext, 'No shows watched in the last ' + RECENT_DAYS_THRESHOLD + ' days. Watch something to see it here.');
        renderShowList(els.staleGrid, staleShows, 'Nothing here — every active show has recent progress.');
        renderShowList(els.pausedShowsGrid, pausedShows, 'No paused/backlog shows right now.');
        renderShowList(els.completedShowsGrid, completedShows, 'No completed shows yet.');
    }

    function categorizeShow(show) {
        if (show.status === 'completed') return 'completed';
        if (show.status === 'paused' || show.status === 'archived') return 'paused';
        return isRecentlyWatched(show) ? 'watchnext' : 'stale';
    }

    function renderShowList(container, shows, emptyText) {
        if (!shows.length) {
            container.innerHTML = '<div class="empty">' + escapeHtml(emptyText) + '</div>';
            return;
        }

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
            var noteInput = cardNode.querySelector('.note-input');
            var decButton = cardNode.querySelector('.btn-decrease');
            var incButton = cardNode.querySelector('.btn-increase');
            var seasonButton = cardNode.querySelector('.watch-season');
            var pauseButton = cardNode.querySelector('.pause-show');
            var completeButton = cardNode.querySelector('.complete-show');

            var meta = show.meta || {};
            poster.src = meta.poster || FALLBACK_POSTER;
            poster.alt = show.title + ' poster';
            if (newBadge) newBadge.hidden = !hasNewEpisode(show);
            if (premiereBadge) premiereBadge.hidden = !hasUpcomingPremiere(show);
            title.textContent = show.title;

            statusPill.textContent = capitalize(show.status);
            statusPill.classList.add(show.status);

            metaRow.textContent = buildMetaRow(show);
            description.textContent = stripHtml(meta.summary || 'No external description available yet.');

            watchRow.textContent = 'Watched episodes: ' + show.watchedCount + buildLastSeenSuffix(show);
            nextRow.textContent = buildNextRow(show);

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

            noteInput.value = show.notes;
            noteInput.addEventListener('change', function () {
                updateShowOverride(show.id, { notes: noteInput.value });
                setStatus('Saved note for ' + show.title + '.');
            });

            decButton.addEventListener('click', function () {
                removeLatestWatchedEpisode(show);
            });

            incButton.addEventListener('click', function () {
                markNextEpisodeAsWatched(show);
            });

            seasonButton.addEventListener('click', function () {
                watchSeasonUpToCurrent(show);
            });

            var isCompleted = show.status === 'completed';
            var isPausedLike = show.status === 'paused' || show.status === 'archived';
            pauseButton.textContent = isPausedLike ? 'Unpause' : 'Pause';
            pauseButton.classList.toggle('is-unpause', isPausedLike);
            pauseButton.disabled = isCompleted;
            pauseButton.addEventListener('click', function () {
                patchShow(show.id, { status: isPausedLike ? 'active' : 'paused' });
                setStatus((isPausedLike ? 'Resumed ' : 'Paused ') + show.title + '.');
            });

            completeButton.textContent = isCompleted ? 'Reopen' : 'Complete';
            completeButton.classList.toggle('is-unpause', isCompleted);
            completeButton.addEventListener('click', function () {
                patchShow(show.id, { status: isCompleted ? 'active' : 'completed' });
                setStatus((isCompleted ? 'Reopened ' : 'Completed ') + show.title + '.');
            });

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

    function buildNextRow(show) {
        var next = show.meta && show.meta.nextEpisode;
        if (!next || !next.airdate) return 'Next episode: unknown';
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
        var sorted = catalog.slice().sort(byEpOrder);
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
        episodesToChange.forEach(function (ep) {
            if (watched && isEpisodeUnaired(ep)) return; // can't watch the future
            var was = isEpisodeWatched(show, ep);
            show.episodeStates[episodeKey(ep.season, ep.number)] = watched;
            if (was !== watched) delta += watched ? 1 : -1;
        });
        var nextCount = Math.max(0, toInt(show.watchedCount) + delta);
        var nextStatus = show.status;
        if (nextCount > 0 && show.status === 'paused') nextStatus = 'active';
        patchShow(show.id, {
            watchedCount: nextCount,
            episodeStates: show.episodeStates,
            lastSeen: computeLastSeen(show, catalog),
            status: nextStatus
        });
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
        state.modalShowId = showId;
        state.modalOpenSeasons = null;
        els.showModal.hidden = false;
        els.showModalTitle.textContent = show.title;
        els.showModalSubtitle.textContent = 'Loading episodes…';
        els.modalPoster.src = (show.meta && show.meta.poster) || FALLBACK_POSTER;
        els.modalPoster.alt = show.title + ' poster';
        els.modalFactsText.textContent = '';
        els.modalSummary.textContent = '';
        els.modalProgress.textContent = '';
        els.modalSeasons.innerHTML = '<div class="empty">Loading episode list…</div>';

        var episodes = await loadEpisodeCatalog(show);
        if (state.modalShowId !== showId) return; // modal changed/closed while loading
        maybeSeedProgressFromCount(show, episodes);
        var current = state.shows.find(function (item) { return item.id === showId; }) || show;
        renderShowModal(current, episodes);
    }

    function closeShowModal() {
        state.modalShowId = '';
        state.modalEpisodes = [];
        if (els.showModal) els.showModal.hidden = true;
    }

    // Builds the IMDb rating chip + external link shown under the modal facts.
    function renderModalLinks(meta) {
        if (!els.modalLinks) return;
        els.modalLinks.innerHTML = '';
        meta = meta || {};
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
        els.modalLinks.hidden = !els.modalLinks.childNodes.length;
    }

    function renderShowModal(show, episodes) {
        state.modalEpisodes = episodes || [];
        var meta = show.meta || {};

        els.showModalTitle.textContent = show.title;
        els.modalPoster.src = meta.poster || FALLBACK_POSTER;
        els.modalPoster.alt = show.title + ' poster';

        var facts = [];
        if (meta.network) facts.push(meta.network);
        if (meta.premiered) facts.push('Since ' + formatYear(meta.premiered));
        if (meta.provider) facts.push(meta.provider);
        if (meta.genres && meta.genres.length) facts.push(meta.genres.slice(0, 3).join(', '));
        els.modalFactsText.textContent = facts.join('  ·  ');
        renderModalLinks(meta);
        els.modalSummary.textContent = stripHtml(meta.summary || '');

        var totalEps = episodes.length;
        var watchedEps = episodes.filter(function (ep) { return isEpisodeWatched(show, ep); }).length;
        els.showModalSubtitle.textContent = totalEps
            ? ('Watched ' + watchedEps + ' of ' + totalEps + ' episodes')
            : ('Watched ' + show.watchedCount + ' episodes');
        els.modalProgress.textContent = totalEps ? (watchedEps + ' / ' + totalEps + ' watched') : '';

        if (!totalEps) {
            els.modalSeasons.innerHTML = '<div class="empty">Episode list unavailable for this show yet. Try “Refresh Metadata”, or the provider has no episode data for it.</div>';
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
        setAddShowMessage('');
        els.addShowModal.hidden = false;
        setTimeout(function () {
            try { if (els.addShowInput) els.addShowInput.focus(); } catch (e) { /* ignore */ }
        }, 30);
    }

    function closeAddShowModal() {
        if (els.addShowModal) els.addShowModal.hidden = true;
    }

    function setAddShowMessage(message, isError) {
        if (!els.addShowMessage) return;
        els.addShowMessage.textContent = message || '';
        els.addShowMessage.style.color = isError ? 'var(--danger)' : '';
    }

    // Verify a typed name against TVMaze and show the matching variants so the
    // user picks the exact show before adding it.
    async function runAddShowSearch() {
        if (!state.currentUser) {
            setAddShowMessage('Log in first to add shows.', true);
            return;
        }
        var query = els.addShowInput ? String(els.addShowInput.value || '').trim() : '';
        if (!query) {
            setAddShowMessage('Type a show name to search.', true);
            return;
        }

        setAddShowMessage('Searching TVMaze…');
        if (els.addShowResults) els.addShowResults.innerHTML = '';
        if (els.addShowSearchBtn) els.addShowSearchBtn.disabled = true;

        try {
            var results = await searchTvMazeShows(query);
            if (!results.length) {
                setAddShowMessage('No shows found for “' + query + '”. Check the spelling and try again.', true);
                renderAddShowResults([]);
            } else {
                setAddShowMessage(results.length + ' match' + (results.length === 1 ? '' : 'es') + ' found — pick the right one to add.');
                renderAddShowResults(results);
            }
        } catch (error) {
            console.warn('Add-show search failed', error);
            setAddShowMessage('Search failed. Check your connection and try again.', true);
        } finally {
            if (els.addShowSearchBtn) els.addShowSearchBtn.disabled = false;
        }
    }

    function renderAddShowResults(shows) {
        var container = els.addShowResults;
        if (!container) return;
        container.innerHTML = '';

        if (!shows.length) {
            container.innerHTML = '<div class="addshow-empty">No matches found. Try a different spelling.</div>';
            return;
        }

        shows.forEach(function (show) {
            var row = document.createElement('div');
            row.className = 'addshow-result';

            var poster = document.createElement('img');
            poster.className = 'addshow-poster';
            poster.loading = 'lazy';
            poster.src = pickPoster(show);
            poster.alt = (show.name || 'Show') + ' poster';

            var info = document.createElement('div');
            info.className = 'addshow-info';

            var titleEl = document.createElement('h4');
            titleEl.className = 'addshow-title';
            var year = show.premiered ? formatYear(show.premiered) : '';
            titleEl.textContent = (show.name || 'Untitled') + (year ? ' (' + year + ')' : '');

            var bits = [];
            var net = (show.network && show.network.name) || (show.webChannel && show.webChannel.name) || '';
            if (net) bits.push(net);
            if (show.genres && show.genres.length) bits.push(show.genres.slice(0, 3).join(', '));
            if (show.status) bits.push(show.status);
            if (show.rating && show.rating.average) bits.push('⭐ ' + show.rating.average);

            info.appendChild(titleEl);
            if (bits.length) {
                var metaEl = document.createElement('p');
                metaEl.className = 'addshow-meta';
                metaEl.textContent = bits.join('  ·  ');
                info.appendChild(metaEl);
            }

            var descEl = document.createElement('p');
            descEl.className = 'addshow-desc';
            descEl.textContent = truncateText(stripHtml(show.summary || ''), 180) || 'No description available.';
            info.appendChild(descEl);

            var addBtn = document.createElement('button');
            addBtn.type = 'button';
            addBtn.className = 'btn btn-accent addshow-add';
            addBtn.textContent = '➕ Add';
            addBtn.addEventListener('click', function () {
                addVariant(show, addBtn);
            });

            row.appendChild(poster);
            row.appendChild(info);
            row.appendChild(addBtn);
            container.appendChild(row);
        });
    }

    // Adds a specific verified TVMaze variant as a custom show, caching its full
    // metadata (including next/previous episode) so badges work immediately.
    async function addVariant(show, button) {
        if (!state.currentUser) {
            setAddShowMessage('Log in first to add shows.', true);
            return;
        }

        var tvmazeId = toInt(show.id);
        var finalTitle = show.name || '';
        var normalized = normalizeName(finalTitle);

        var alreadyAdded = (state.customShows || []).some(function (custom) {
            return tvmazeId && toInt(custom.tvmazeId) === tvmazeId;
        });
        var alreadyTracked = (state.shows || []).some(function (existing) {
            return normalizeName(existing.title) === normalized;
        });
        if (alreadyAdded || alreadyTracked) {
            setAddShowMessage('“' + finalTitle + '” is already in your list.', true);
            return;
        }

        button.disabled = true;
        var originalLabel = button.textContent;
        button.textContent = 'Adding…';

        var meta = metaFromTvMazeShow(show, finalTitle);
        try {
            var links = await fetchEpisodeLinks(show._links);
            meta.nextEpisode = links.nextEpisode;
            meta.lastAired = links.lastAired;
        } catch (error) {
            console.warn('Could not load episode links for added show', error);
        }

        var id = 'custom:' + normalized.replace(/\s+/g, '-') + ':' + Date.now();
        state.customShows.push({
            id: id,
            title: finalTitle,
            tvmazeId: tvmazeId,
            imdbId: meta.imdbId || '',
            nb_episodes_seen: 0,
            createdAt: new Date().toISOString()
        });
        persistUserScopedJson(STORE_KEYS.customShows, state.customShows);
        setCachedMeta({ id: id, title: finalTitle }, meta);

        closeAddShowModal();
        bootstrap();
        setStatus('Added show: ' + finalTitle + '.');
        button.disabled = false;
        button.textContent = originalLabel;
    }

    function truncateText(text, max) {
        var value = String(text || '');
        if (value.length <= max) return value;
        return value.slice(0, max).replace(/\s+\S*$/, '') + '…';
    }

    // Recently active = last watched within the recent window. Shows with no
    // known watch date fall through to "Haven't Watched in a While".
    function isRecentlyWatched(show) {
        var t = asTime(show.lastSeen && show.lastSeen.updated_at);
        if (!t) return false;
        return t >= Date.now() - RECENT_DAYS_THRESHOLD * 24 * 60 * 60 * 1000;
    }

    // True when the most recent aired episode is later than the user's progress,
    // i.e. there's a new episode ready to watch. Uses meta.lastAired (TVMaze
    // previous-episode) so it needs no extra per-card fetch.
    function hasNewEpisode(show) {
        var meta = show.meta || {};
        var lastAired = meta.lastAired;
        if (!lastAired || !lastAired.season) return false;
        if (!show.lastSeen || !show.lastSeen.season) return false;
        return epRank(lastAired.season, lastAired.number) > epRank(show.lastSeen.season, show.lastSeen.episode);
    }

    // A returning season opener (episode 1 of season >= 2) counts as a premiere.
    function isSeasonPremiere(ep) {
        return !!ep && toInt(ep.number) === 1 && toInt(ep.season) >= 2;
    }

    // True when the next upcoming (scheduled) episode kicks off a new season,
    // so we can flag a "New Season" premiere on the card.
    function hasUpcomingPremiere(show) {
        var next = show.meta && show.meta.nextEpisode;
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
            'Mark watched',
            function () {
                applyWatchedChange(show, episodesToWatch, true, catalog);
                setStatus('Marked ' + episodesToWatch.length + ' episodes as watched for ' + show.title + '.');
            }
        );
    }

    function patchShow(showId, patch) {
        var show = state.shows.find(function (item) { return item.id === showId; });
        if (!show) return;

        if (typeof patch.watchedCount === 'number') {
            show.watchedCount = patch.watchedCount;
        }
        if (patch.status) {
            show.status = patch.status;
            show.localStatus = patch.status;
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

        updateShowOverride(showId, {
            watchedCount: show.watchedCount,
            status: show.localStatus || show.status,
            lastSeen: show.lastSeen || null,
            episodeStates: show.episodeStates || {}
        });

        applyFilters();
        render();
    }

    function updateShowOverride(showId, updates) {
        if (!state.overrides[showId]) state.overrides[showId] = {};
        Object.assign(state.overrides[showId], updates);
        persistUserScopedJson(STORE_KEYS.localOverrides, state.overrides);
    }

    function getCachedMeta(showId, title) {
        var key = metaKey(showId, title);
        return state.metadataCache[key] || null;
    }

    function setCachedMeta(show, meta) {
        var key = metaKey(show.id, show.title);
        state.metadataCache[key] = meta;
        show.meta = meta;
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
                        setStatus('Metadata fetch completed.');
                    }
                }
                pumpMetadataQueue();
            });
        }
    }

    async function fetchShowMeta(show) {
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

    async function fetchOmdb(title, apiKey) {
        var url = 'https://www.omdbapi.com/?apikey=' + encodeURIComponent(apiKey) + '&type=series&t=' + encodeURIComponent(title);
        var result = await fetchJson(url);
        if (!result || result.Response === 'False') return null;

        var meta = {
            provider: 'OMDb (IMDb)',
            poster: result.Poster && result.Poster !== 'N/A' ? result.Poster : FALLBACK_POSTER,
            title: result.Title || title,
            summary: result.Plot && result.Plot !== 'N/A' ? result.Plot : '',
            genres: splitGenres(result.Genre),
            imdbId: result.imdbID || '',
            imdbRating: result.imdbRating && result.imdbRating !== 'N/A' ? result.imdbRating : '',
            premiered: result.Released && result.Released !== 'N/A' ? result.Released : '',
            network: result.Production && result.Production !== 'N/A' ? result.Production : '',
            runtime: parseRuntimeMinutes(result.Runtime),
            tvmazeId: 0,
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

    // Searches TVMaze for all shows matching a query, returning the raw show
    // objects (each carries poster, summary, genres, rating, externals, _links).
    async function searchTvMazeShows(query) {
        var url = 'https://api.tvmaze.com/search/shows?q=' + encodeURIComponent(query);
        var results = await fetchJson(url);
        if (!Array.isArray(results)) return [];
        return results
            .slice(0, 8)
            .map(function (item) { return item && item.show; })
            .filter(Boolean);
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
            nextEpisode: null,
            lastAired: null,
            fetchedAt: new Date().toISOString()
        };
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
        try {
            var response = await fetch(url, { cache: 'no-store' });
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

    function metaKey(showId, title) {
        return showId + '::' + normalizeName(title);
    }

    function setStatus(message, isError) {
        els.statusText.textContent = message;
        els.statusText.className = isError ? 'status-text error' : 'status-text';
    }

    function loadJson(key, fallback) {
        try {
            var raw = localStorage.getItem(key);
            if (!raw) return fallback;
            var parsed = JSON.parse(raw);
            return parsed && typeof parsed === 'object' ? parsed : fallback;
        } catch (error) {
            return fallback;
        }
    }

    function persistJson(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
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
})();
