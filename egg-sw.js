/* Egg Climb — service worker (scope: /egg-bucket-game)
   • HTML: network-first, so players always get the latest game when online
   • Assets: stale-while-revalidate, so the game still opens offline */
const CACHE = 'egg-climb-v3';
const PAGE = '/egg-bucket-game.html';
const ASSETS = [
  PAGE,
  '/egg-manifest.json',
  '/assets/egg-logo.png',
  '/assets/egg-icon-192.png',
  '/assets/egg-icon-512.png'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(c => Promise.all(ASSETS.map(u => c.add(new Request(u, { cache: 'reload' })).catch(() => {}))))
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return;

  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req).then(res => {
        if (res && res.status === 200) {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(PAGE, copy));
        }
        return res;
      }).catch(() => caches.match(PAGE))
    );
    return;
  }

  e.respondWith(
    caches.match(req).then(cached => {
      const fresh = fetch(req).then(res => {
        if (res && res.status === 200) {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(req, copy));
        }
        return res;
      }).catch(() => cached);
      return cached || fresh;
    })
  );
});
