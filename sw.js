// sw.js
const CACHE = 'gestion-locations-v1';
const FILES = [
  '/',
  '/index.html',
  '/maintenance.html',
  '/paiements.html',
  '/incidents.html',
  '/stats.html',
  '/script.js',
  '/maintenance.js',
  '/paiements.js',
  '/incidents.js',
  'https://cdn.jsdelivr.net/npm/bulma@0.9.4/css/bulma.min.css',
  '/icon-192.png',
  '/icon-512.png'
];

// Installation du SW → mise en cache
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE)
      .then(cache => cache.addAll(FILES))
  );
});

// Intercepte les requêtes → serve depuis le cache si offline
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
