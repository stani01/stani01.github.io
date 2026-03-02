/**
 * AION Tools Hub - Shared Site Components
 * Injects consistent header (home button) and footer across all pages.
 */
(function () {
    'use strict';

    var DISCORD_SVG = '<svg class="discord-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">'
        + '<path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>'
        + '</svg>';

    /* ── 1. Header (home button) ── */
    var isIndexPage = document.body.classList.contains('page-index');
    if (!isIndexPage) {
        var header = document.createElement('div');
        header.className = 'site-header';
        header.innerHTML = '<a href="aion.html" class="home-button">\uD83C\uDFE0 Tools Hub</a>';
        document.body.prepend(header);
    }

    /* ── 2. Footer ── */
    var footerEl = document.getElementById('site-footer');
    if (footerEl) {

        var html = '';

        /* Discord server advertisement */
        html += '<div class="discord-ad">';
        html += '<div class="discord-ad-icon">\uD83C\uDFAE</div>';
        html += '<h3 class="discord-ad-title">Join Aion EU Shugo Tavern</h3>';
        html += '<p class="discord-ad-text">Discord server with tutorials and information about most of the important things in Retail AION</p>';
        html += '<a href="https://discord.gg/mkU2DK9Q" target="_blank" class="discord-ad-btn">Join Discord Server</a>';
        html += '</div>';

        /* Footer block */
        html += '<div class="footer">';
        html += '<div class="footer-actions">';
        html += '<a href="https://discordapp.com/users/158658357606088704" target="_blank" class="discord-button">';
        html += DISCORD_SVG + ' Support &amp; Feedback</a>';
        html += '<button onclick="copyToClipboard()" class="share-btn" id="shareBtn">\uD83D\uDD17 Copy Share Link</button>';
        html += '</div>';
        html += '<div class="copyright">';
        html += '\u00A9 <span id="copyright-year"></span> <a href="myAionProfiles.html"><strong>15TAN</strong></a> - AION Tools Hub<br>';
        html += 'Tools and calculators for AION Retail 8.x';
        html += '</div>';
        html += '<div class="disclaimer">';
        html += 'This website is a non-commercial fan project. AION and all related images/assets are trademarks or registered trademarks of NCSoft Corporation and Gameforge. All rights reserved.';
        html += '</div>';
        html += '<button id="backToTop" onclick="scrollToTop()">\u2191</button>';
        html += '</div>';

        footerEl.innerHTML = html;
    }

    /* ── 3. Copyright year ── */
    var yearEl = document.getElementById('copyright-year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
