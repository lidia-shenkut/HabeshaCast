const CACHE_NAME = 'habeshacast-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/logo.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    })
  );
  self.skipWaiting();
});

self.addEventListener('fetch', (event) => {
  // Cache first, then network for static assets
  // Network first, then cache for API calls if needed (but usually API should stay online)
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => caches.match('/index.html'))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) return response;
      
      // If it's an audio request, check the audio cache explicitly
      return caches.open('habeshacast-audio').then((cache) => {
        return cache.match(event.request).then((audioResponse) => {
          return audioResponse || fetch(event.request);
        });
      });
    })
  );
});
