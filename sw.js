self.addEventListener('install', function(event) {
  console.log('[Service worker]: Installing Service Worker: ', event);
  event.waitUntil(
    caches.open('static').then(function(cache) {
      console.log('[Service Worker] Precaching App Shell');
      cache.addAll([
        './',
        'index.html',
        'https://cdn.jsdelivr.net/npm/moment@latest/moment.min.js',
        'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.7.0/Chart.min.js',
        'dist/build.js',
        'https://cdnjs.cloudflare.com/ajax/libs/bulma/0.6.2/css/bulma.min.css',
        'static/style.css',
        'static/spinner.svg',
        'static/spinner.gif',
      ]);
      cache.add('index.html');
      cache.add('dist/build.js');
    }),
  );
});

self.addEventListener('activate', function(event) {
  console.log('[Service worker]: Service Worker Activated: ', event);
  return self.clients.claim();
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      if (response) {
        // if match is found, return it
        return response;
      } else {
        // 1. If no response is found, fetch from the internet
        return fetch(event.request)
          .then(function(res) {
            // 2 Give response back to the requester before caching
            return caches.open('dynamic').then(function(cache) {
              // 3 Add the cloned response to dynamic cache
              cache.put(event.request.url, res.clone());
              return res;
            });
          })
          .catch(function(err) {
            console.log(err);
          });
      }
    }),
  );
});
