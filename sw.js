/* Service Worker: network-first for .js/.css and skipWaiting update flow */
var CACHE_NAME = 'site-static-v1';

self.addEventListener('install', function (event) {
    self.skipWaiting();
});

self.addEventListener('activate', function (event) {
    event.waitUntil(
        caches.keys().then(function (names) {
            return Promise.all(names.map(function (n) {
                if (n !== CACHE_NAME) return caches.delete(n);
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
        var path = url.pathname;
        var isAsset = path.endsWith('.js') || path.endsWith('.css');
        if (isAsset) {
            event.respondWith(
                fetch(req, { cache: 'reload' }).then(function (resp) {
                    // Update cache asynchronously
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
        // fallback: do nothing
    }
});
