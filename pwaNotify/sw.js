/**
 * Service Worker runs even if the page is not open
 * Here is where the sincronization and push notifications should be
 */

function notify(title, body, icon = 'res/notification-icon.png') {
    if (Notification.permission === "granted") {
        // Do not request permissions here, use checkStatus() at window.onload
        self.registration.showNotification(title, {body: body, icon: icon});
    }
}

/**
 * Install the service worker
 */
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
        navigator.serviceWorker.register('./sw.js', {'scope': '.'}).then(function (registration) {
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
        }, function (err) {
            console.error('ServiceWorker registration failed: ', err);
        });
    });
}

/**
 * What files to cache
 */
var CACHE_NAME = 'pwaNotify-cache-v1';
var urlsToCache = [
    './',
    './res/notification-icon.png',
    './styles/main.css',
    './scripts/main.js'
];

/**
 * Cache the files
 */
self.addEventListener('install', function (event) {
    event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
            console.log('Opened cache');
            return cache.addAll(urlsToCache);
        })
    );
});

/**
 * Get the cached files
 */
self.addEventListener('fetch', function (event) {
    event.respondWith(
        caches.match(event.request).then(function (response) {
            if (response) {
                return response;
            }
            var fetchRequest = event.request.clone();

            return fetch(fetchRequest).then(function (response) {
                    if (!response || response.status !== 200 || response.type !== 'basic') {
                        return response;
                    }
                    var responseToCache = response.clone();

                    caches.open(CACHE_NAME).then(function (cache) {
                        cache.put(event.request, responseToCache);
                    });

                    return response;
                }
            );
        })
    );
});

/**
 * Delete the old versions on update
 */
self.addEventListener('activate', function (event) {
    var cacheWhitelist = ['pwaNotify-cache-v1'];

    event.waitUntil(
        caches.keys().then(function (cacheNames) {
            return Promise.all(
                cacheNames.map(function (cacheName) {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

self.addEventListener('sync', event => {
    if (event.tag === 'syncTest') {
        setTimeout(() => {
            notify('PWA Notification Example', 'Rabiot Games');
        }, 1000);
    }
});

self.addEventListener('push', function(event) {
    console.log('[Service Worker] Push Received.');
    console.log(`[Service Worker] Push had this data: "${event.data.text()}"`);

    event.waitUntil(
        notify('PWA Notification Example', event.data.text())
    );
});

self.addEventListener('notificationclick', function(event) {
    console.log('[Service Worker] Notification click Received.');

    event.notification.close();

    event.waitUntil(

    );
});
