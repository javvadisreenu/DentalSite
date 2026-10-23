// Bump CACHE whenever you deploy changes you want every visitor to get.
const CACHE = 'dental-v3';
const STATIC = ['./', './index.html', './assets/css/styles.css', './assets/js/components.js', './assets/js/main.js', './assets/data/clinic.json', './manifest.json'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(STATIC)).then(() => self.skipWaiting()));
});

// Remove caches from older versions so stale pages/images are not served.
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

function saveCopy(req, res) {
  if (res && res.status === 200) {
    const copy = res.clone();
    caches.open(CACHE).then(c => c.put(req, copy));
  }
  return res;
}

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;

  // Images rarely change: serve from cache first, fetch if missing.
  if (req.destination === 'image') {
    e.respondWith(caches.match(req).then(cached => cached || fetch(req).then(res => saveCopy(req, res))));
    return;
  }

  // Pages, scripts, styles and data: always try the network first so
  // updates show up right away; fall back to cache when offline.
  e.respondWith(
    fetch(req)
      .then(res => saveCopy(req, res))
      .catch(() => caches.match(req).then(cached =>
        cached || (req.mode === 'navigate' ? caches.match('./index.html') : Response.error())
      ))
  );
});
