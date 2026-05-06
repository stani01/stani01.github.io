/**
 * AION Tools Hub - Shared Site Components
 * Injects consistent header (home button) and footer across all pages.
 */
(function () {
    'use strict';

    // Bump this value on deploys that should force users onto fresh HTML/CSS/JS.
    var ASSET_CACHE_VERSION = '2026.05.06.1';
    var ASSET_VERSION_STORAGE_KEY = 'aionToolsAssetVersion';
    var ASSET_VERSION_RELOAD_KEY = 'aionToolsAssetReload_' + ASSET_CACHE_VERSION;

    function appendVersionParam(urlLike) {
        try {
            var u = new URL(urlLike, window.location.href);
            u.searchParams.set('v', ASSET_CACHE_VERSION);
            return u.toString();
        } catch (e) {
            return urlLike;
        }
    }

    function bustStylesheetLinks() {
        document.querySelectorAll('link[rel="stylesheet"][href]').forEach(function (link) {
            var href = link.getAttribute('href');
            if (!href) return;
            link.setAttribute('href', appendVersionParam(href));
        });
    }

    function showAssetUpdateToast() {
        var toast = document.createElement('div');
        toast.textContent = 'Updating site assets...';
        toast.setAttribute('role', 'status');
        toast.style.position = 'fixed';
        toast.style.right = '16px';
        toast.style.bottom = '16px';
        toast.style.zIndex = '2147483647';
        toast.style.padding = '10px 14px';
        toast.style.borderRadius = '8px';
        toast.style.border = '1px solid rgba(100, 180, 255, 0.45)';
        toast.style.background = 'rgba(14, 20, 34, 0.96)';
        toast.style.color = 'rgba(180, 220, 255, 0.98)';
        toast.style.fontSize = '13px';
        toast.style.fontWeight = '700';
        toast.style.letterSpacing = '0.02em';
        toast.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.45)';
        (document.body || document.documentElement).appendChild(toast);
    }

    // One-time auto refresh for average users when asset version changes.
    // This removes the need for manual Ctrl+F5 when pushing style/script updates.
    try {
        var previousVersion = localStorage.getItem(ASSET_VERSION_STORAGE_KEY);
        if (previousVersion !== ASSET_CACHE_VERSION) {
            localStorage.setItem(ASSET_VERSION_STORAGE_KEY, ASSET_CACHE_VERSION);

            // Apply fresh stylesheet URLs immediately.
            bustStylesheetLinks();

            // Force a single versioned reload so the document and scripts refresh too.
            if (!sessionStorage.getItem(ASSET_VERSION_RELOAD_KEY)) {
                sessionStorage.setItem(ASSET_VERSION_RELOAD_KEY, '1');
                showAssetUpdateToast();
                setTimeout(function () {
                    window.location.replace(appendVersionParam(window.location.href));
                }, 120);
                return;
            }
        }
    } catch (e) {
        // If storage APIs are blocked, continue without forced cache logic.
    }

    var DISCORD_SVG = '<svg class="discord-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">'
        + '<path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>'
        + '</svg>';

    /* -- 1. Top navigation bar -- */
    var NAV_ITEMS = [
        { label: 'Homepage',              href: '/aion/' },
        { label: 'Magical Boost Calendar', href: '/magicalBoostTime/' },
        { label: 'Retail EU Scheduler',    href: '/scheduler/' },
        { label: 'Damage Calculator',      href: '/aion-calc/' },
        { label: 'Enchanting Simulator',   href: '/enchanting/' },
        { label: 'Gear Compare',           href: '/gear-compare/' },
        { label: 'Statistics Finder',      href: '/stats/' },
        { label: 'Progress Tracker',       href: '/tracker/' }
    ];
    var _pathParts = window.location.pathname.split('/').filter(function(p) { return p !== ''; });
    var currentPage = _pathParts.length > 0 ? '/' + _pathParts[0] + '/' : '/';

    var nav = document.createElement('nav');
    nav.className = 'site-topbar';
    var links = NAV_ITEMS.map(function (item) {
        var isActive = currentPage === item.href;
        return '<a href="' + item.href + '" class="topbar-link'
            + (isActive ? ' active' : '') + '">' + item.label + '</a>';
    });
    nav.innerHTML = links.join('<span class="topbar-sep">|</span>');
    document.body.prepend(nav);

    /* -- 2. Footer -- */
    var footerEl = document.getElementById('site-footer');
    if (footerEl) {

        var html = '';

        /* Discord server advertisement */
        html += '<div class="discord-ad">';
        html += '<div class="discord-ad-icon">\uD83C\uDFAE</div>';
        html += '<h3 class="discord-ad-title">Join Aion EU Shugo Tavern</h3>';
        html += '<p class="discord-ad-text">Discord server with tutorials and information about most of the important things in Retail AION</p>';
        html += '<a href="https://discord.gg/tAFp8zwaCs" target="_blank" class="discord-ad-btn">Join Discord Server</a>';
        html += '</div>';

        /* Footer block */
        html += '<div class="footer">';
        html += '<div class="footer-actions">';
        html += '<a href="https://discordapp.com/users/158658357606088704" target="_blank" class="discord-button">';
        html += DISCORD_SVG + ' Support &amp; Feedback</a>';
        if (currentPage !== '/gear-compare/') {
            html += '<button onclick="copyToClipboard()" class="share-btn" id="shareBtn">\uD83D\uDD17 Copy Share Link</button>';
        }
        html += '</div>';
        html += '<div class="copyright">';
        html += '\u00A9 <span id="copyright-year"></span> <a href="/myAionProfiles/"><strong>15TAN</strong></a> - AION Tools Hub<br>';
        html += 'Tools and calculators for AION Retail 8.x';
        html += '</div>';
        html += '<div class="disclaimer">';
        html += 'This website is a non-commercial fan project. AION and all related images/assets are trademarks or registered trademarks of NCSoft Corporation and Gameforge. All rights reserved.';
        html += '</div>';
        html += '</div>';

        footerEl.innerHTML = html;
    }

    /* -- 3. Back-to-top button (appended to body so fixed positioning works) -- */
    var topBtn = document.createElement('button');
    topBtn.id = 'backToTop';
    topBtn.textContent = '\u2191';
    topBtn.title = 'Back to top';
    topBtn.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    document.body.appendChild(topBtn);

    /* -- 3. Copyright year -- */
    var yearEl = document.getElementById('copyright-year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    /* -- 4. Global utility functions (used by footer buttons) -- */
    window.copyToClipboard = function () {
        var btn = document.getElementById('shareBtn');
        if (!btn) return;
        navigator.clipboard.writeText(window.location.href).then(function () {
            var original = btn.innerHTML;
            btn.innerHTML = '\u2705 Link Copied!';
            btn.style.borderColor = '#43a047';
            setTimeout(function () {
                btn.innerHTML = original;
                btn.style.borderColor = '';
            }, 2000);
        });
    };

    /* -- 5. Back-to-top scroll visibility -- */
    var backBtn = document.getElementById('backToTop');
    if (backBtn) {
        window.addEventListener('scroll', function () {
            backBtn.style.display = (document.documentElement.scrollTop > 300) ? 'block' : 'none';
        });
    }
})();
