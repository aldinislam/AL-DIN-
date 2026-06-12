const CACHE_NAME = 'al-dine-v1';
const urlsToCache = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './hadiths.html',
  './questions.html',
  './nawafil.html',
  './quran.html',
  './dhikr.html',
  './contact.html',
  './manifest.json',
  './icon.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache)));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
    )
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => cachedResponse || fetch(event.request))
  );
});
