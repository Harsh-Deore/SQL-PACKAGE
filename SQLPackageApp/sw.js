var CACHE = 'sqlpkg-v6'; 
var FILES = ['/', '/index.html', '/manifest.json'];

self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(CACHE).then(function(c) {
      return c.addAll(FILES);
    })
  );
  self.skipWaiting(); // activate immediately
});

self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.map(function(k) {
          if (k !== CACHE) {
            return caches.delete(k); // delete old cache
          }
        })
      );
    })
  );
  self.clients.claim(); // take control immediately
});

self.addEventListener('fetch', function(e) {
  e.respondWith(
    fetch(e.request)
      .then(function(response) {
        return caches.open(CACHE).then(function(cache) {
          cache.put(e.request, response.clone()); // update cache
          return response; // return fresh data
        });
      })
      .catch(function() {
        return caches.match(e.request); // fallback to cache if offline
      })
  );
});
