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
        omdbApiKey: 'tvTrackerOmdbApiKey',
        accounts: 'tvTrackerAccountsV1',
        sessionUser: 'tvTrackerSessionUserV1',
        customShows: 'tvTrackerCustomShowsV1',
        importedData: 'tvTrackerImportedDataV1',
        profileSettings: 'tvTrackerProfileSettingsV1',
        sortPreference: 'tvTrackerSortPreference',
        filterPreference: 'tvTrackerFilterPreference',
        sectionCollapse: 'tvTrackerSectionCollapseV1',
        // Cross-device sync: per-user partner link + settings clock (scoped),
        // and a device-level stable peer id (NOT user-scoped).
        syncPartner: 'tvTrackerSyncPartnerV1',
        syncMeta: 'tvTrackerSyncMetaV1',
        syncDeviceId: 'tvTrackerSyncDeviceIdV1'
    };

    // Base keys whose changes should trigger a device-to-device sync push.
    // (metadataCache is intentionally excluded: it is large and regenerable,
    // so it rides along in the snapshot but never triggers a push by itself.)
    var SYNC_PUSH_KEYS = ['tvTrackerLocalOverridesV1', 'tvTrackerWatchHistoryV1', 'tvTrackerCustomShowsV1', 'tvTrackerImportedDataV1', 'tvTrackerProfileSettingsV1', 'tvTrackerManualLinksV1'];

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
        // Add-Show live search: debounce timer + a sequence counter so a slow
        // earlier response can't overwrite the results of a newer keystroke.
        addShowTimer: null,
        addShowSeq: 0,
        pendingConfirm: null,
        refreshMode: false,
        importMode: false,
        refreshTotal: 0,
        refreshDone: 0,
        search: '',
        sortBy: 'recent',
        filterBy: 'all',
        // Watch Next/Up-to-date/Paused expanded; the long lists start collapsed.
        collapsedSections: { watchnext: false, uptodate: false, history: true, stale: true, paused: false, completed: true },
        mobileGreetingDone: false,
        // Cross-device sync runtime state (see the sync module near the bottom).
        sync: {
            selfId: '',
            peer: null,
            conn: null,
            partner: null,
            connected: false,
            applying: false,
            pendingPairCode: '',
            pairSecret: '',
            lastSentSig: '',
            pushTimer: null,
            hourlyTimer: null,
            retryTimer: null,
            lastSyncAt: 0,
            lastResumeAt: 0,
            statusText: 'Not connected'
        }
    };

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
        fixLinkForm: document.getElementById('modal-fix-link-form'),
        fixLinkInput: document.getElementById('modal-fix-link-input'),
        fixLinkSubmit: document.getElementById('modal-fix-link-submit'),
        fixLinkCancel: document.getElementById('modal-fix-link-cancel'),
        fixLinkMsg: document.getElementById('modal-fix-link-msg'),
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
        backupMessage: document.getElementById('backup-message'),
        syncDeviceBtn: document.getElementById('sync-device-btn'),
        syncDeviceBtnMain: document.getElementById('sync-device-btn-main'),
        syncDeviceStatus: document.getElementById('sync-device-status'),
        syncModal: document.getElementById('sync-modal'),
        syncModalBackdrop: document.getElementById('sync-modal-backdrop'),
        syncModalClose: document.getElementById('sync-modal-close'),
        syncStatus: document.getElementById('sync-status'),
        syncDeviceLabel: document.getElementById('sync-device-label'),
        syncUnpaired: document.getElementById('sync-unpaired'),
        syncPaired: document.getElementById('sync-paired'),
        syncQrWrap: document.getElementById('sync-qr-wrap'),
        syncQr: document.getElementById('sync-qr'),
        syncCode: document.getElementById('sync-code'),
        syncCopyBtn: document.getElementById('sync-copy-btn'),
        syncInviteBtn: document.getElementById('sync-invite-btn'),
        syncCodeInput: document.getElementById('sync-code-input'),
        syncConnectBtn: document.getElementById('sync-connect-btn'),
        syncPartnerLabel: document.getElementById('sync-partner-label'),
        syncLast: document.getElementById('sync-last'),
        syncNowBtn: document.getElementById('sync-now-btn'),
        syncUnpairBtn: document.getElementById('sync-unpair-btn')
    };

    initAuth();
    try {
        bindEvents();
    } catch (error) {
        console.error('[AUTH] Error binding events:', error);
    }
    initSiteFooter();
    refreshForCurrentUser();
    setupPWA();
    try {
        setupSync();
    } catch (error) {
        console.error('[SYNC] Setup failed:', error);
    }

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

        if (els.pageRefreshButton) els.pageRefreshButton.addEventListener('click', function () {
            setStatus('Refreshing page…');
            window.location.reload();
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

        if (els.syncDeviceBtn) els.syncDeviceBtn.addEventListener('click', function () {
            openSyncModal();
        });

        if (els.syncDeviceBtnMain) els.syncDeviceBtnMain.addEventListener('click', function () {
            openSyncModal();
        });

        if (els.syncModalClose) els.syncModalClose.addEventListener('click', function () {
            closeSyncModal();
        });

        if (els.syncModalBackdrop) els.syncModalBackdrop.addEventListener('click', function () {
            closeSyncModal();
        });

        if (els.syncInviteBtn) els.syncInviteBtn.addEventListener('click', function () {
            startPairingInvite();
        });

        if (els.syncCopyBtn) els.syncCopyBtn.addEventListener('click', function () {
            copyPairCode();
        });

        if (els.syncConnectBtn) els.syncConnectBtn.addEventListener('click', function () {
            var code = els.syncCodeInput ? String(els.syncCodeInput.value || '').trim() : '';
            connectWithCode(code);
        });

        if (els.syncCodeInput) els.syncCodeInput.addEventListener('keydown', function (event) {
            if (event.key === 'Enter') {
                event.preventDefault();
                connectWithCode(String(els.syncCodeInput.value || '').trim());
            }
        });

        if (els.syncNowBtn) els.syncNowBtn.addEventListener('click', function () {
            syncNow();
        });

        if (els.syncUnpairBtn) els.syncUnpairBtn.addEventListener('click', function () {
            requestUnpair();
        });

        window.addEventListener('keydown', function (event) {
            if (event.key === 'Escape' && els.syncModal && !els.syncModal.hidden) {
                closeSyncModal();
            }
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

        if (els.unresolvedToggle) els.unresolvedToggle.addEventListener('click', function () {
            toggleUnresolvedPanel();
        });

        if (els.addShowInput) els.addShowInput.addEventListener('input', function () {
            scheduleAddShowSearch();
        });

        if (els.addShowInput) els.addShowInput.addEventListener('keydown', function (event) {
            if (event.key === 'Enter') {
                event.preventDefault();
                // Skip the debounce and search right away on Enter.
                if (state.addShowTimer) { clearTimeout(state.addShowTimer); state.addShowTimer = null; }
                runAddShowSearch();
            }
        });

        window.addEventListener('keydown', function (event) {
            if (event.key !== 'Escape') return;
            if (!els.addShowModal || els.addShowModal.hidden) return;
            // If the full-size poster is open over the results, Escape closes
            // that first (handled by the lightbox listener), not the modal.
            if (els.posterLightbox && !els.posterLightbox.hidden) return;
            closeAddShowModal();
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

        if (els.posterBtn) els.posterBtn.addEventListener('click', function () {
            openPosterLightbox();
        });

        if (els.modalNotes) els.modalNotes.addEventListener('change', function () {
            saveModalNotes();
        });

        if (els.removeShowBtn) els.removeShowBtn.addEventListener('click', function () {
            requestRemoveShow();
        });

        if (els.fixLinkToggle) els.fixLinkToggle.addEventListener('click', function () {
            if (els.fixLinkForm) els.fixLinkForm.hidden = false;
            els.fixLinkToggle.hidden = true;
            showFixLinkMsg('');
            if (els.fixLinkInput) els.fixLinkInput.focus();
        });

        if (els.fixLinkCancel) els.fixLinkCancel.addEventListener('click', function () {
            if (els.fixLinkForm) els.fixLinkForm.hidden = true;
            if (els.fixLinkToggle) els.fixLinkToggle.hidden = false;
            showFixLinkMsg('');
            if (els.fixLinkInput) els.fixLinkInput.value = '';
        });

        if (els.fixLinkForm) els.fixLinkForm.addEventListener('submit', function (event) {
            event.preventDefault();
            submitFixLink();
        });

        if (els.posterLightboxClose) els.posterLightboxClose.addEventListener('click', function () {
            closePosterLightbox();
        });

        if (els.posterLightboxBackdrop) els.posterLightboxBackdrop.addEventListener('click', function () {
            closePosterLightbox();
        });

        if (els.posterLightboxImg) els.posterLightboxImg.addEventListener('click', function () {
            closePosterLightbox();
        });

        window.addEventListener('keydown', function (event) {
            if (event.key !== 'Escape') return;
            // The poster lightbox sits above the show modal, so close it first.
            if (els.posterLightbox && !els.posterLightbox.hidden) {
                closePosterLightbox();
                return;
            }
            if (!els.showModal.hidden) {
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
                        els.installPrompt.style.display = 'none';
                    }
                    window.deferredPrompt = null;
                });
                return;
            }

            // iOS Safari has no beforeinstallprompt; keep a fallback CTA visible.
            els.installPrompt.style.display = 'block';
            if (isIosInstallDevice()) {
                setStatus('On iPhone/iPad, tap Share in Safari, then "Add to Home Screen".');
            } else {
                setStatus('Install is not ready yet. Use your browser menu for "Install app" or "Add to Home Screen".');
            }
        });
    }

    function initSiteFooter() {
        var year = document.getElementById('tv-footer-year');
        if (year) year.textContent = String(new Date().getFullYear());

        var shareBtn = document.getElementById('tv-share-btn');
        if (shareBtn) {
            shareBtn.addEventListener('click', function () {
                var original = shareBtn.textContent;
                function onDone() {
                    shareBtn.textContent = '✅ Link Copied!';
                    window.setTimeout(function () {
                        shareBtn.textContent = original;
                    }, 1800);
                }
                var url = window.location.href;
                if (navigator.clipboard && navigator.clipboard.writeText) {
                    navigator.clipboard.writeText(url).then(onDone, function () {
                        shareBtn.textContent = 'Copy failed';
                    });
                    return;
                }
                try {
                    var tmp = document.createElement('input');
                    tmp.value = url;
                    document.body.appendChild(tmp);
                    tmp.select();
                    document.execCommand('copy');
                    document.body.removeChild(tmp);
                    onDone();
                } catch (e) {
                    shareBtn.textContent = 'Copy failed';
                }
            });
        }

        var topBtn = document.getElementById('tv-back-to-top');
        if (topBtn) {
            topBtn.addEventListener('click', function () {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
            window.addEventListener('scroll', function () {
                var y = window.pageYOffset || document.documentElement.scrollTop || 0;
                topBtn.style.display = y > 320 ? 'block' : 'none';
            });
        }
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
            state.watchHistory = loadUserScopedJson(STORE_KEYS.watchHistory, []);
            state.metadataCache = loadUserScopedJson(STORE_KEYS.metadataCache, {});
            state.manualLinks = loadUserScopedJson(STORE_KEYS.manualLinks, {});
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
        try { initSyncForUser(); } catch (e) { console.warn('[SYNC] init after login failed', e); }
    }

    function logoutUser() {
        try { teardownSync(); } catch (e) { /* ignore */ }
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
            STORE_KEYS.watchHistory,
            STORE_KEYS.metadataCache,
            STORE_KEYS.manualLinks,
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
        afterUserScopedWrite(baseKey);
    }

    function loadUserScopedValue(baseKey) {
        return localStorage.getItem(scopedKey(baseKey));
    }

    function persistUserScopedValue(baseKey, value) {
        localStorage.setItem(scopedKey(baseKey), value);
        afterUserScopedWrite(baseKey);
    }

    function clearUserScopedValue(baseKey) {
        localStorage.removeItem(scopedKey(baseKey));
        afterUserScopedWrite(baseKey);
    }

    // Central choke point: whenever synced user data changes, keep the settings
    // clock current and schedule a device-to-device sync push. Skipped while we
    // are applying an incoming snapshot (that path pushes explicitly to converge).
    function afterUserScopedWrite(baseKey) {
        if (state.sync && state.sync.applying) return;
        if (baseKey === STORE_KEYS.profileSettings || baseKey === STORE_KEYS.omdbApiKey) {
            bumpSyncSettingsAt();
        }
        if (SYNC_PUSH_KEYS.indexOf(baseKey) !== -1 || baseKey === STORE_KEYS.omdbApiKey) {
            syncSchedulePush();
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
            setStatus('No data yet. Click "Import TV Time Export" and pick the .zip you downloaded from TV Time (Settings \u2192 Export your data).');
            return;
        }

        try {
            state.shows = buildShowsModel(imported);
            autoCompleteEndedShows();
            applyFilters();
            render();
            var when = imported.importedAt ? new Date(imported.importedAt).toLocaleDateString() : '';
            var loadedMsg = 'Loaded ' + state.shows.length + ' shows from your TV Time export' + (when ? ' (imported ' + when + ')' : '') + '.';
            setStatus(loadedMsg + ' Verifying completed shows…');
            // The fast pass above depends on lastSeen and can miss some ended
            // fully-watched shows from imported counts. Run the accurate catalog
            // check in the background so users don't need to open each modal.
            reconcileEndedShowCompletionFromCatalog().then(function (changed) {
                if (changed) {
                    applyFilters();
                    render();
                    setStatus(loadedMsg + ' Verified completed shows: ' + changed + ' updated.');
                    return;
                }
                setStatus(loadedMsg + ' Completed-show verification finished.');
            }).catch(function (error) {
                console.warn('Background completion reconcile failed', error);
                setStatus(loadedMsg + ' Completed-show verification could not finish (you can still use the tracker).');
            });
            queueMetadataFetches(state.shows, false);
        } catch (error) {
            console.error(error);
            setStatus('Could not build your show list from the imported data.', true);
            els.watchNextGrid.innerHTML = '<div class="error">Failed to read imported data. Try re-importing your TV Time export.</div>';
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
        if (state.filterBy === 'completed') return isStrictlyCompletedShow(show);
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

        renderShowList(els.watchNextGrid, watchNext, 'No active shows need watching right now.');
        if (els.upToDateGrid) renderShowList(els.upToDateGrid, upToDateShows, 'No up-to-date active shows right now.');
        renderShowList(els.staleGrid, staleShows, 'No inactive catch-up shows right now.');
        renderShowList(els.pausedShowsGrid, pausedShows, 'No paused/backlog shows right now.');
        renderShowList(els.completedShowsGrid, completedShows, 'No completed shows yet.');
    }

    function isStrictlyCompletedShow(show) {
        if (!show) return false;
        var meta = show.meta || {};
        if (normalizeSeriesStatus(meta.seriesStatus) !== 'ended') return false;
        if (hasNewEpisode(show)) return false;

        var lastAired = meta.lastAired;
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

    function isNotWatchedForAWhile(show) {
        if (!hasNewEpisode(show)) return false;
        var last = asTime(show && show.lastSeen && show.lastSeen.updated_at);
        if (!last) return true;
        var thresholdMs = STALE_DAYS_THRESHOLD * 24 * 60 * 60 * 1000;
        return (Date.now() - last) >= thresholdMs;
    }

    function renderShowList(container, shows, emptyText, listType) {
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

            var meta = show.meta || {};
            var posterSrc = meta.poster || FALLBACK_POSTER;
            var hasPoster = !!meta.poster && posterSrc !== FALLBACK_POSTER;
            poster.src = posterSrc;
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
            status: nextStatus
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
        state.modalShowId = showId;
        state.modalOpenSeasons = null;
        els.showModal.hidden = false;
        els.showModalTitle.textContent = show.title;
        els.showModalSubtitle.textContent = 'Loading episodes…';
        setModalPoster(show);
        els.modalFactsText.textContent = '';
        els.modalSummary.textContent = '';
        els.modalProgress.textContent = '';
        els.modalSeasons.innerHTML = '<div class="empty">Loading episode list…</div>';

        var episodes = await loadEpisodeCatalog(show);
        if (state.modalShowId !== showId) return; // modal changed/closed while loading
        maybeSeedProgressFromCount(show, episodes);
        maybeAutoCompleteFromCatalog(show, episodes);
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
        var lastAired = meta.lastAired;
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
        if (els.fixLinkMsg) { els.fixLinkMsg.hidden = true; els.fixLinkMsg.textContent = ''; els.fixLinkMsg.className = 'modal-fix-link-msg'; }
        if (els.fixLinkSubmit) { els.fixLinkSubmit.disabled = false; els.fixLinkSubmit.textContent = 'Match'; }
    }

    function showFixLinkMsg(message, isError) {
        if (!els.fixLinkMsg) return;
        els.fixLinkMsg.textContent = message;
        els.fixLinkMsg.className = 'modal-fix-link-msg' + (isError ? ' error' : '');
        els.fixLinkMsg.hidden = !message;
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
        els.modalPoster.src = meta.poster || FALLBACK_POSTER;
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

        var totalEps = episodes.length;
        var watchedEps = episodes.filter(function (ep) { return isEpisodeWatched(show, ep); }).length;
        els.showModalSubtitle.textContent = totalEps
            ? ('Watched ' + watchedEps + ' of ' + totalEps + ' episodes')
            : ('Watched ' + show.watchedCount + ' episodes');
        els.modalProgress.textContent = totalEps ? (watchedEps + ' / ' + totalEps + ' watched') : '';

        // Keep the relink tool available on every show so the user can override
        // a bad match later with a direct IMDb or TVMaze page.
        resetFixLinkUi(totalEps > 0);

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
            poster.src = posterSrc;
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
        var meta = show.meta || {};
        var lastAired = meta.lastAired;
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
        var next = show.meta && show.meta.nextEpisode;
        if (!next || !next.airdate) return false;
        var airTime = asTime(next.airdate);
        if (!airTime || airTime > Date.now()) return false;
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

        updateShowOverride(showId, {
            watchedCount: show.watchedCount,
            status: show.localStatus || show.status,
            lastSeen: show.lastSeen || null,
            episodeStates: show.episodeStates || {}
        });

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
            var raw = localStorage.getItem(OMDB_CACHE_KEY);
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
        try { localStorage.setItem(OMDB_CACHE_KEY, JSON.stringify(cache)); } catch (e) { /* quota - ignore */ }
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
            var raw = localStorage.getItem(omdbUsageStorageKey());
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
            localStorage.setItem(omdbUsageStorageKey(), JSON.stringify(usage));
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

    /* =====================================================================
     * Cross-device sync (WebRTC peer-to-peer, PeerJS for signalling only)
     * ---------------------------------------------------------------------
     * Two devices signed into the SAME account pair once (QR / short code).
     * After that, whenever both have the tracker open they auto-connect and
     * exchange snapshots directly device-to-device (on the same Wi-Fi the
     * data never leaves the network). A tiny public broker only introduces
     * the peers (random IDs, never your data); the transfer itself is
     * end-to-end encrypted by WebRTC. Merge is "newest wins" per show so
     * edits made on both devices all survive.
     * ===================================================================== */

    function syncAvailable() {
        return typeof Peer !== 'undefined';
    }

    // --- small helpers -----------------------------------------------------
    function randomHex(nBytes) {
        var arr = new Uint8Array(nBytes);
        crypto.getRandomValues(arr);
        var s = '';
        for (var i = 0; i < arr.length; i++) s += ('0' + arr[i].toString(16)).slice(-2);
        return s;
    }

    function randomSecret() { return randomHex(16); } // 128-bit shared secret

    function getDeviceId() {
        var id = localStorage.getItem(STORE_KEYS.syncDeviceId);
        if (!id) {
            id = 'tvsync-' + randomHex(16);
            try { localStorage.setItem(STORE_KEYS.syncDeviceId, id); } catch (e) { /* ignore */ }
        }
        return id;
    }

    function deviceLabel() {
        var ua = navigator.userAgent || '';
        var os = /Android/i.test(ua) ? 'Android'
            : /iPhone|iPad|iPod/i.test(ua) ? 'iOS'
            : /Windows/i.test(ua) ? 'Windows'
            : /Macintosh|Mac OS/i.test(ua) ? 'Mac'
            : /Linux/i.test(ua) ? 'Linux' : 'device';
        var kind = /Mobi|Android|iPhone|iPad|iPod/i.test(ua) ? 'phone' : 'computer';
        return os + ' ' + kind;
    }

    function btoaUrl(str) {
        return btoa(unescape(encodeURIComponent(str)))
            .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    }

    function atobUrl(str) {
        var s = String(str || '').replace(/-/g, '+').replace(/_/g, '/');
        while (s.length % 4) s += '=';
        return decodeURIComponent(escape(atob(s)));
    }

    function encodePairCode(id, secret) {
        return btoaUrl(JSON.stringify({ i: id, s: secret }));
    }

    function decodePairCode(code) {
        try {
            var raw = String(code || '').trim();
            var idx = raw.indexOf('sync=');
            if (idx !== -1) raw = raw.slice(idx + 5);
            raw = raw.split('&')[0].replace(/[^A-Za-z0-9\-_]/g, '');
            if (!raw) return null;
            var obj = JSON.parse(atobUrl(raw));
            if (obj && obj.i && obj.s) return { id: String(obj.i), secret: String(obj.s) };
        } catch (e) { /* ignore */ }
        return null;
    }

    function timeAgo(ms) {
        if (!ms) return 'never';
        var s = Math.max(0, Math.floor((Date.now() - ms) / 1000));
        if (s < 60) return 'just now';
        var mnt = Math.floor(s / 60); if (mnt < 60) return mnt + ' min ago';
        var h = Math.floor(mnt / 60); if (h < 24) return h + ' h ago';
        return Math.floor(h / 24) + ' d ago';
    }

    // --- persisted partner + settings clock -------------------------------
    function getSyncPartner() { return loadJson(scopedKey(STORE_KEYS.syncPartner), null); }
    function setSyncPartner(p) { persistJson(scopedKey(STORE_KEYS.syncPartner), p); }
    function clearSyncPartner() {
        try { localStorage.removeItem(scopedKey(STORE_KEYS.syncPartner)); } catch (e) { /* ignore */ }
    }

    function getSyncSettingsAt() {
        var m = loadJson(scopedKey(STORE_KEYS.syncMeta), null);
        return (m && m.settingsAt) || 0;
    }
    function setSyncSettingsAt(v) {
        persistJson(scopedKey(STORE_KEYS.syncMeta), { settingsAt: v || Date.now() });
    }
    function bumpSyncSettingsAt() { setSyncSettingsAt(Date.now()); }

    function amInitiatorFor(partner) {
        return !!(partner && partner.id && state.sync.selfId && state.sync.selfId < partner.id);
    }

    // --- snapshot build / signature / merge -------------------------------
    function buildSyncSnapshot() {
        var accounts = loadJson(STORE_KEYS.accounts, {});
        return {
            t: 'push',
            v: 1,
            user: state.currentUser,
            account: accounts[state.currentUser] || null,
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

    function snapshotSignature(snap) {
        var ov = snap.overrides || {};
        var oCount = 0, oSum = 0;
        Object.keys(ov).forEach(function (k) { oCount++; oSum += (ov[k] && ov[k].updatedAt) || 0; });
        var cs = snap.customShows || [];
        var csSum = 0;
        cs.forEach(function (s) { csSum += (s && s.updatedAt) || 0; });
        var wh = snap.watchHistory || [];
        var whLast = wh.length ? asTime(wh[wh.length - 1] && wh[wh.length - 1].loggedAt) : 0;
        var imp = (snap.importedData && snap.importedData.importedAt) ? (Date.parse(snap.importedData.importedAt) || 0) : 0;
        var setAt = (snap.settings && snap.settings.settingsAt) || 0;
        var mc = snap.metadataCache ? Object.keys(snap.metadataCache).length : 0;
        return [oCount, oSum, wh.length, whLast, cs.length, csSum, imp, setAt, mc].join('|');
    }

    function mergeSyncSnapshot(remote) {
        if (!remote || remote.t !== 'push') return { changed: false };
        if (!state.currentUser) return { changed: false, rejected: true, reason: 'not-signed-in' };
        if (normalizeUsername(remote.user || '') !== state.currentUser) {
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

        state.sync.applying = true;
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

            // account: create locally only if missing (never overwrite an existing login)
            var accounts = loadJson(STORE_KEYS.accounts, {});
            if (!accounts[state.currentUser] && remote.account) {
                accounts[state.currentUser] = remote.account;
                persistJson(STORE_KEYS.accounts, accounts);
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
                        if (pendingOmdb.value) localStorage.setItem(scopedKey(STORE_KEYS.omdbApiKey), pendingOmdb.value);
                        else { try { localStorage.removeItem(scopedKey(STORE_KEYS.omdbApiKey)); } catch (e) { /* ignore */ } }
                    }
                    setSyncSettingsAt(pendingSettingsAt || Date.now());
                }
            }
        } finally {
            state.sync.applying = false;
        }
        return { changed: changed };
    }

    function applyMergeAndRebuild() {
        try { refreshForCurrentUser(); } catch (e) { console.warn('[SYNC] rebuild failed', e); }
    }

    // --- connection plumbing ----------------------------------------------
    function sendMsg(conn, obj) {
        try { if (conn && conn.open) conn.send(obj); } catch (e) { console.warn('[SYNC] send failed', e); }
    }

    function onConnData(msg) {
        if (!msg || typeof msg !== 'object') return;
        if (msg.t === 'hello') { handleHello(msg); return; }
        if (msg.t === 'hello-ack') { handleHelloAck(msg); return; }
        if (msg.t === 'deny') {
            setSyncStatus('Other device declined: ' + (msg.reason === 'user' ? 'different account' : 'wrong code') + '.');
            closeConn();
            return;
        }
        if (msg.t === 'push') { handlePush(msg); return; }
    }

    function handleHello(msg) {
        // An active invite (pairSecret) takes precedence over a previously
        // stored partner, so re-pairing to a new device uses the fresh secret.
        var expected = state.sync.pairSecret || (state.sync.partner && state.sync.partner.secret) || '';
        if (!expected || msg.secret !== expected) {
            sendMsg(state.sync.conn, { t: 'deny', reason: 'secret' });
            setSyncStatus('A device tried to connect with the wrong code.');
            closeConn();
            return;
        }
        if (normalizeUsername(msg.user || '') !== state.currentUser) {
            sendMsg(state.sync.conn, { t: 'deny', reason: 'user' });
            setSyncStatus('Other device is signed in as a different account — log in with the same account on both.');
            closeConn();
            return;
        }
        var partner = {
            id: msg.selfId, secret: expected, user: normalizeUsername(msg.user),
            label: msg.label || 'other device', pairedAt: Date.now()
        };
        setSyncPartner(partner);
        state.sync.partner = partner;
        state.sync.pairSecret = '';
        state.sync.connected = true;
        sendMsg(state.sync.conn, {
            t: 'hello-ack', secret: expected, selfId: state.sync.selfId,
            user: state.currentUser, label: deviceLabel()
        });
        setSyncStatus('Connected to ' + partner.label + '.');
        startHourlyTimer();
        renderSyncModal();
        syncPushNow(true);
    }

    function handleHelloAck(msg) {
        var expected = state.sync._connectSecret || (state.sync.partner && state.sync.partner.secret) || '';
        if (!expected || msg.secret !== expected) {
            setSyncStatus('Pairing failed (wrong code).');
            closeConn();
            return;
        }
        if (normalizeUsername(msg.user || '') !== state.currentUser) {
            setSyncStatus('Other device uses a different account.');
            closeConn();
            return;
        }
        var partner = {
            id: msg.selfId, secret: expected, user: normalizeUsername(msg.user),
            label: msg.label || 'other device', pairedAt: Date.now()
        };
        setSyncPartner(partner);
        state.sync.partner = partner;
        state.sync._connectSecret = '';
        state.sync.connected = true;
        setSyncStatus('Connected to ' + partner.label + '.');
        startHourlyTimer();
        renderSyncModal();
        syncPushNow(true);
    }

    function handlePush(snap) {
        var res = mergeSyncSnapshot(snap);
        state.sync.lastSyncAt = Date.now();
        persistSyncLast();
        if (res.rejected) {
            if (res.reason === 'user') setSyncStatus('Different account on the other device — sync skipped.');
            renderSyncModal();
            return;
        }
        if (res.changed) {
            setSyncStatus('Synced \u2014 updated from your other device.');
            applyMergeAndRebuild();
            syncSchedulePush();
        } else {
            setSyncStatus('Up to date.');
        }
        renderSyncModal();
    }

    function wireConn(conn, isInitiator) {
        conn.on('open', function () {
            if (isInitiator) {
                var secret = state.sync._connectSecret || (state.sync.partner && state.sync.partner.secret) || '';
                sendMsg(conn, {
                    t: 'hello', secret: secret, selfId: state.sync.selfId,
                    user: state.currentUser, label: deviceLabel()
                });
                setSyncStatus('Handshaking\u2026');
            }
        });
        conn.on('data', function (data) {
            try { onConnData(data); } catch (e) { console.warn('[SYNC] data error', e); }
        });
        conn.on('close', function () { onConnClose(); });
        conn.on('error', function (err) { console.warn('[SYNC] conn error', err); });
    }

    function handleConn(conn) {
        // Accept the newest incoming connection (replaces any stale one).
        if (state.sync.conn && state.sync.conn !== conn) {
            try { state.sync.conn.close(); } catch (e) { /* ignore */ }
        }
        state.sync.conn = conn;
        wireConn(conn, false);
    }

    function connectTo(peerId, secret) {
        if (!state.sync.peer) return;
        state.sync._connectSecret = secret || (state.sync.partner && state.sync.partner.secret) || '';
        var conn;
        try { conn = state.sync.peer.connect(peerId, { reliable: true }); } catch (e) { conn = null; }
        if (!conn) { setSyncStatus('Could not start the connection.'); scheduleRetry(); return; }
        state.sync.conn = conn;
        wireConn(conn, true);
    }

    function onConnClose() {
        state.sync.connected = false;
        state.sync.conn = null;
        setSyncStatus('Disconnected.');
        renderSyncModal();
        scheduleRetry();
    }

    function closeConn() {
        if (state.sync.conn) { try { state.sync.conn.close(); } catch (e) { /* ignore */ } state.sync.conn = null; }
        state.sync.connected = false;
        renderSyncModal();
    }

    function scheduleRetry() {
        if (state.sync.retryTimer) return;
        var partner = state.sync.partner;
        if (!partner || !amInitiatorFor(partner)) return; // listener just waits for the peer
        state.sync.retryTimer = window.setTimeout(function () {
            state.sync.retryTimer = null;
            if (!state.sync.connected && state.currentUser && state.sync.partner) {
                connectTo(state.sync.partner.id, state.sync.partner.secret);
            }
        }, 15000);
    }

    // --- peer lifecycle ----------------------------------------------------
    function ensurePeer(mode, onReady) {
        if (!syncAvailable()) { setSyncStatus('Peer-to-peer library not loaded \u2014 reload the page.'); return; }
        if (state.sync.peer && state.sync.peerMode === mode && !state.sync.peer.destroyed) {
            if (state.sync.peer.open) { if (onReady) onReady(); }
            else state.sync.peer.on('open', function () { if (onReady) onReady(); });
            return;
        }
        teardownPeer();
        var id = (mode === 'listener') ? state.sync.selfId : undefined;
        var peer;
        try { peer = id ? new Peer(id, { debug: 1 }) : new Peer({ debug: 1 }); }
        catch (e) { setSyncStatus('Could not start the sync engine.'); return; }
        state.sync.peer = peer;
        state.sync.peerMode = mode;
        peer.on('open', function () { if (onReady) onReady(); });
        peer.on('connection', function (conn) { handleConn(conn); });
        peer.on('disconnected', function () { try { peer.reconnect(); } catch (e) { /* ignore */ } });
        peer.on('error', function (err) { onPeerError(err, mode, onReady); });
    }

    function onPeerError(err, mode, onReady) {
        var type = err && err.type;
        console.warn('[SYNC] peer error', type, err);
        if (type === 'unavailable-id') {
            setSyncStatus('Reconnecting\u2026');
            window.setTimeout(function () { teardownPeer(); ensurePeer(mode, onReady); }, 4000);
        } else if (type === 'peer-unavailable') {
            setSyncStatus('Other device is offline. Will keep trying while both are open.');
            scheduleRetry();
        } else if (type === 'browser-incompatible') {
            setSyncStatus('This browser does not support peer-to-peer sync.');
        } else if (type === 'network' || type === 'server-error' || type === 'socket-error' || type === 'socket-closed') {
            setSyncStatus('Network hiccup \u2014 retrying\u2026');
            scheduleRetry();
        } else {
            setSyncStatus('Sync error: ' + (type || 'unknown') + '.');
        }
    }

    function teardownPeer() {
        if (state.sync.retryTimer) { clearTimeout(state.sync.retryTimer); state.sync.retryTimer = null; }
        if (state.sync.conn) { try { state.sync.conn.close(); } catch (e) { /* ignore */ } state.sync.conn = null; }
        if (state.sync.peer) { try { state.sync.peer.destroy(); } catch (e) { /* ignore */ } state.sync.peer = null; }
        state.sync.peerMode = '';
        state.sync.connected = false;
    }

    function teardownSync() {
        teardownPeer();
        if (state.sync.hourlyTimer) { clearInterval(state.sync.hourlyTimer); state.sync.hourlyTimer = null; }
        if (state.sync.pushTimer) { clearTimeout(state.sync.pushTimer); state.sync.pushTimer = null; }
        state.sync.partner = null;
        state.sync.pairSecret = '';
        state.sync.lastSentSig = '';
        state.sync.lastSyncAt = 0;
        setSyncStatus('Not connected');
    }

    // --- push scheduling ---------------------------------------------------
    function syncSchedulePush() {
        if (!state.sync.connected || !state.sync.conn) return;
        if (state.sync.pushTimer) return;
        state.sync.pushTimer = window.setTimeout(function () {
            state.sync.pushTimer = null;
            syncPushNow(false);
        }, 4000);
    }

    function syncPushNow(force) {
        if (!state.sync.connected || !state.sync.conn) return;
        var snap = buildSyncSnapshot();
        var sig = snapshotSignature(snap);
        if (!force && sig === state.sync.lastSentSig) return;
        state.sync.lastSentSig = sig;
        sendMsg(state.sync.conn, snap);
        state.sync.lastSyncAt = Date.now();
        persistSyncLast();
        renderSyncModal();
    }

    function syncNow() {
        if (!state.sync.partner) { setSyncStatus('Pair a device first.'); return; }
        if (!state.sync.connected) {
            setSyncStatus('Not connected \u2014 trying to reconnect\u2026');
            initSyncForUser();
            return;
        }
        syncPushNow(true);
        setSyncStatus('Sync sent.');
    }

    function startHourlyTimer() {
        if (state.sync.hourlyTimer) return;
        state.sync.hourlyTimer = window.setInterval(function () {
            if (state.sync.connected) syncPushNow(false);
        }, 60 * 60 * 1000);
    }

    function persistSyncLast() {
        if (!state.sync.partner) return;
        state.sync.partner.lastSyncAt = state.sync.lastSyncAt;
        setSyncPartner(state.sync.partner);
    }

    // When the app regains focus (e.g. you unlock your phone back home), get the
    // two devices talking again right away instead of waiting on the ~15s retry
    // timer: revive the broker link if it dropped while backgrounded, then push
    // our latest immediately if connected, or reconnect if the link was lost.
    function syncOnResume() {
        if (!syncAvailable() || !state.currentUser) return;
        var partner = state.sync.partner || getSyncPartner();
        if (!partner) return;

        // Debounce the burst of visible/focus/pageshow events fired together.
        var now = Date.now();
        if (now - (state.sync.lastResumeAt || 0) < 1500) return;
        state.sync.lastResumeAt = now;

        // Mobile browsers often drop the signalling connection while the tab is
        // frozen; reconnect it to the broker so a re-pair isn't needed.
        if (state.sync.peer && state.sync.peer.disconnected && !state.sync.peer.destroyed) {
            try { state.sync.peer.reconnect(); } catch (e) { /* ignore */ }
        }

        if (state.sync.connected && state.sync.conn && state.sync.conn.open) {
            syncPushNow(true);
        } else {
            // Skip the retry delay and reconnect immediately.
            if (state.sync.retryTimer) { clearTimeout(state.sync.retryTimer); state.sync.retryTimer = null; }
            initSyncForUser();
        }
    }

    // --- pairing -----------------------------------------------------------
    function startPairingInvite() {
        if (!state.currentUser) { setSyncStatus('Log in first.'); return; }
        if (!syncAvailable()) { setSyncStatus('Sync library not loaded.'); return; }
        state.sync.selfId = getDeviceId();
        state.sync.pairSecret = randomSecret();
        setSyncStatus('Starting\u2026');
        ensurePeer('listener', function () {
            var code = encodePairCode(state.sync.selfId, state.sync.pairSecret);
            showPairCode(code);
            setSyncStatus('Ready \u2014 scan the QR (or paste the link) on your other device.');
        });
    }

    function connectWithCode(code) {
        if (!state.currentUser) { setSyncStatus('Log in first, then connect.'); return; }
        if (!syncAvailable()) { setSyncStatus('Sync library not loaded.'); return; }
        var decoded = decodePairCode(code);
        if (!decoded) { setSyncStatus('That code / link is not valid.'); return; }
        state.sync.selfId = getDeviceId();
        if (decoded.id === state.sync.selfId) { setSyncStatus('That code is from this same device.'); return; }
        setSyncStatus('Connecting to the other device\u2026');
        ensurePeer('initiator', function () { connectTo(decoded.id, decoded.secret); });
    }

    function showPairCode(code) {
        var url = location.origin + '/tv/#sync=' + code;
        if (els.syncCode) els.syncCode.value = url;
        if (els.syncQr) {
            els.syncQr.innerHTML = '';
            try {
                if (typeof qrcode !== 'undefined') {
                    var qr = qrcode(0, 'M');
                    qr.addData(url);
                    qr.make();
                    els.syncQr.innerHTML = qr.createSvgTag({ cellSize: 4, margin: 2, scalable: true });
                } else {
                    els.syncQr.textContent = 'QR unavailable \u2014 copy the link below.';
                }
            } catch (e) { els.syncQr.textContent = 'QR error \u2014 copy the link below.'; }
        }
        if (els.syncQrWrap) els.syncQrWrap.hidden = false;
    }

    function copyPairCode() {
        if (!els.syncCode) return;
        var text = els.syncCode.value || '';
        var done = function () { setSyncStatus('Link copied. Open it on your other device.'); };
        try {
            els.syncCode.select();
            document.execCommand('copy');
            done();
        } catch (e) {
            if (navigator.clipboard) navigator.clipboard.writeText(text).then(done, function () { /* ignore */ });
        }
    }

    function requestUnpair() {
        openConfirm(
            'Unpair this device?',
            'This stops automatic syncing with the other device. Your show data stays on both devices \u2014 you can pair again anytime.',
            'Unpair',
            function () {
                teardownPeer();
                clearSyncPartner();
                state.sync.partner = null;
                state.sync.lastSyncAt = 0;
                setSyncStatus('Unpaired.');
                renderSyncModal();
            }
        );
    }

    // --- UI ----------------------------------------------------------------
    function setSyncStatus(text) {
        state.sync.statusText = text;
        if (els.syncStatus) els.syncStatus.textContent = text;
        updateSyncButton();
    }

    function updateSyncButton() {
        if (!els.syncDeviceStatus) return;
        if (!syncAvailable()) { els.syncDeviceStatus.textContent = ''; return; }
        var p = state.sync.partner;
        if (!p) { els.syncDeviceStatus.textContent = 'Not paired with another device yet.'; return; }
        els.syncDeviceStatus.textContent = (state.sync.connected ? '\uD83D\uDFE2 Connected to ' : 'Paired with ')
            + (p.label || 'other device')
            + (state.sync.lastSyncAt ? ' \u2022 last sync ' + timeAgo(state.sync.lastSyncAt) : '');
    }

    function renderSyncModal() {
        if (!els.syncModal) return;
        var p = state.sync.partner;
        if (els.syncDeviceLabel) els.syncDeviceLabel.textContent = deviceLabel();
        if (els.syncStatus) els.syncStatus.textContent = state.sync.statusText;
        if (els.syncUnpaired) els.syncUnpaired.hidden = !!p;
        if (els.syncPaired) els.syncPaired.hidden = !p;
        if (p) {
            if (els.syncPartnerLabel) els.syncPartnerLabel.textContent = p.label || 'other device';
            if (els.syncLast) els.syncLast.textContent = state.sync.lastSyncAt ? ('Last sync: ' + timeAgo(state.sync.lastSyncAt)) : 'Not synced yet.';
        }
        updateSyncButton();
    }

    function openSyncModal() {
        if (!state.currentUser) { setStatus('Log in first to set up device sync.'); return; }
        if (!els.syncModal) return;
        state.sync.selfId = getDeviceId();
        state.sync.partner = getSyncPartner();
        if (state.sync.partner && state.sync.partner.lastSyncAt) state.sync.lastSyncAt = state.sync.partner.lastSyncAt;
        if (els.syncQrWrap) els.syncQrWrap.hidden = true;
        if (els.syncCodeInput) els.syncCodeInput.value = '';
        if (!syncAvailable()) {
            setSyncStatus('Peer-to-peer library not loaded \u2014 reload the page.');
        } else if (!state.sync.statusText || state.sync.statusText === 'Not connected') {
            setSyncStatus(state.sync.partner
                ? (state.sync.connected ? 'Connected.' : 'Paired. Trying to connect\u2026')
                : 'Not paired yet.');
        }
        renderSyncModal();
        els.syncModal.hidden = false;
        if (syncAvailable() && state.sync.partner && !state.sync.connected) initSyncForUser();
    }

    function closeSyncModal() {
        if (els.syncModal) els.syncModal.hidden = true;
    }

    // --- lifecycle ---------------------------------------------------------
    function initSyncForUser() {
        if (!syncAvailable()) { updateSyncButton(); return; }
        if (!state.currentUser) return;
        state.sync.selfId = getDeviceId();

        // A pending deep-link code means this device just scanned the other's
        // QR: act as the initiator/scanner and connect straight away.
        if (state.sync.pendingPairCode) {
            var code = state.sync.pendingPairCode;
            state.sync.pendingPairCode = '';
            openSyncModal();
            connectWithCode(code);
            return;
        }

        var partner = getSyncPartner();
        state.sync.partner = partner;
        if (partner && partner.lastSyncAt) state.sync.lastSyncAt = partner.lastSyncAt;

        if (partner) {
            if (amInitiatorFor(partner)) {
                ensurePeer('initiator', function () { connectTo(partner.id, partner.secret); });
            } else {
                ensurePeer('listener', function () {
                    setSyncStatus('Waiting for ' + (partner.label || 'your other device') + '\u2026');
                });
            }
            startHourlyTimer();
        } else {
            setSyncStatus('Not paired yet.');
        }
        updateSyncButton();
    }

    function setupSync() {
        // Deep-link pairing: the other device scans a QR that opens .../tv/#sync=CODE
        var hash = location.hash || '';
        var m = hash.match(/[#&]sync=([^&]+)/);
        if (m && m[1]) {
            state.sync.pendingPairCode = m[1];
            try { history.replaceState(null, '', location.pathname + location.search); } catch (e) { /* ignore */ }
        }

        // Keep the two devices converged around app focus changes:
        //  - hidden  -> flush our latest to the other device before we freeze.
        //  - visible -> reconnect (if the link dropped while backgrounded) and
        //    push immediately, so unlocking the phone back home syncs at once
        //    instead of waiting on the ~15s retry timer.
        document.addEventListener('visibilitychange', function () {
            if (document.visibilityState === 'hidden') {
                if (state.sync.connected) { try { syncPushNow(true); } catch (e) { /* ignore */ } }
            } else if (document.visibilityState === 'visible') {
                syncOnResume();
            }
        });
        // Desktop tab refocus and mobile back-forward (bfcache) restores don't
        // always fire visibilitychange, so cover those too.
        window.addEventListener('focus', function () { syncOnResume(); });
        window.addEventListener('pageshow', function () { syncOnResume(); });

        if (!syncAvailable()) { updateSyncButton(); return; }
        if (state.currentUser) {
            initSyncForUser();
        } else if (state.sync.pendingPairCode) {
            setStatus('Log in with the same account to finish syncing with your other device.');
        }
        updateSyncButton();
    }
})();
