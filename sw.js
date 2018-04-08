self.addEventListener('install', function(event) {
  console.log('[Service worker]: Installing Service Worker: ', event);
});

self.addEventListener('activate', function(event) {
  console.log('[Service worker]: Service Worker Activated: ', event);
  return self.clients.claim();
});

self.addEventListener('fetch', function(event) {
  console.log('[Service worker]: Service Worker Fetched Something: ', event);
  event.respondWith(fetch(event.request));
});
