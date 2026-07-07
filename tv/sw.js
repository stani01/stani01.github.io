/* TV Tracker Service Worker: network-first strategy with offline support */
var CACHE_NAME = 'tv-tracker-v11';
var URLS_TO_CACHE = [
    '/tv/',
    '/tv/index.html',
    '/tv/css/tv.css',
    '/tv/js/tv.js',
    '/tv/manifest.json',
    'https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@400;500;700;800&family=Space+Grotesk:wght@400;500;700&display=swap'
];

self.addEventListener('install', function (event) {
    console.log('[TV SW] Installing...');
    event.waitUntil(
        caches.open(CACHE_NAME).then(function (cache) {
            return cache.addAll(URLS_TO_CACHE).catch(function (err) {
                console.log('[TV SW] Cache addAll warning:', err.message);
                // Don't fail install if some resources unavailable (e.g., no network)
                return Promise.resolve();
            });
        }).then(function () {
            return self.skipWaiting();
        })
    );
});

self.addEventListener('activate', function (event) {
    console.log('[TV SW] Activating...');
    event.waitUntil(
        caches.keys().then(function (names) {
            return Promise.all(names.map(function (n) {
                // Only clean up the TV app's own caches; leave the root site
                // caches (site-static-*) alone. CacheStorage is shared per
                // origin, so deleting them would break the rest of the site.
                if (n.indexOf('tv-tracker-') === 0 && n !== CACHE_NAME) {
                    console.log('[TV SW] Deleting old cache:', n);
                    return caches.delete(n);
                }
            }));
        }).then(function () {
            return self.clients.claim();
        })
    );
});

self.addEventListener('message', function (evt) {
    if (!evt.data) return;
    if (evt.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});

self.addEventListener('fetch', function (event) {
    var req = event.request;
    if (req.method !== 'GET') return;

    try {
        var url = new URL(req.url);
        var isTV = url.origin === new URL(self.location).origin && url.pathname.startsWith('/tv');
        
        if (!isTV) return; // Only handle TV app requests

        var path = url.pathname;
        var isAsset = path.endsWith('.js') || path.endsWith('.css') || path.endsWith('.json');
        var isNavigation = req.mode === 'navigate' || (req.headers.get('accept') || '').indexOf('text/html') !== -1;

        // Network-first for HTML pages and assets; fall back to cache when offline
        if (isAsset || isNavigation) {
            event.respondWith(
                fetch(req, { cache: 'reload' }).then(function (resp) {
                    if (!resp || resp.status !== 200 || resp.type === 'error') {
                        return resp;
                    }
                    var respClone = resp.clone();
                    caches.open(CACHE_NAME).then(function (cache) {
                        try { cache.put(req, respClone); } catch (e) { /* ignore */ }
                    });
                    return resp;
                }).catch(function () {
                    return caches.match(req).then(function (cached) {
                        return cached || new Response('Offline - content not available', {
                            status: 503,
                            statusText: 'Service Unavailable'
                        });
                    });
                })
            );
        }
        // For API requests (TVMaze, OMDb), use network-first with cache fallback
        else {
            event.respondWith(
                fetch(req).then(function (resp) {
                    if (!resp || resp.status !== 200 || resp.type === 'error') {
                        return resp;
                    }
                    var respClone = resp.clone();
                    caches.open(CACHE_NAME).then(function (cache) {
                        try { cache.put(req, respClone); } catch (e) { /* ignore */ }
                    });
                    return resp;
                }).catch(function () {
                    return caches.match(req);
                })
            );
        }
    } catch (e) {
        console.log('[TV SW] Fetch error:', e.message);
    }
});
