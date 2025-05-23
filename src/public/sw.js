const CACHE_NAME = 'qr-verify-v1';
const urlsToCache = [
  '/',
  '/verify',
  '/auth/login',
  '/offline',
  '/install',
  '/css/styles.css',
  '/css/bootstrap-dark-overrides.css',
  '/css/login-fullscreen.css',
  '/js/main.js',
  '/js/verification.js',
  '/js/pwa.js',
  '/img/favicon.ico',
  '/img/favicon.svg',
  '/img/logo.svg',
  '/img/scan-qr-illustration.svg',
  '/img/icon-192x192.png',
  '/img/icon-512x512.png',
  '/manifest.json',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css',
  'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css',
  'https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js'
];

// Install Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache opened');
        return cache.addAll(urlsToCache);
      })
      .catch(error => {
        console.error('Cache failed to open:', error);
      })
  );
});

// Activate and clean up old caches
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Serve cached content when offline
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return the response from the cached version
        if (response) {
          return response;
        }
        
        // Not in cache - fetch from network
        return fetch(event.request)
          .then(networkResponse => {
            // Check if we received a valid response
            if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
              return networkResponse;
            }

            // Clone the response
            const responseToCache = networkResponse.clone();

            // Add to cache for future use
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });

            return networkResponse;
          })
          .catch(() => {
            // If both cache and network fail, show offline page
            if (event.request.mode === 'navigate') {
              return caches.match('/offline');
            }
          });
      })
  );
});

// Handle push notifications
self.addEventListener('push', event => {
  const title = 'QR Verification';
  const options = {
    body: event.data.text(),
    icon: '/img/icon-192x192.png',
    badge: '/img/icon-192x192.png'
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

// Handle notification clicks
self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow('/')
  );
});