/* OrthoChronicles Calorie Tracker — Service Worker v4
   • HTML: network-first (always the latest app when online, cached copy offline)
   • JS/CSS/images: stale-while-revalidate
   • Notification buttons (web reminders): Ate / Later / Skip, water 100 / 200 ml / Skip */
const CACHE = 'ct-v4';
const PRECACHE = [
  '/calorie-tracker.html',
  '/ct-app.css?v=3','/ct-data.js?v=3','/ct-fotd.js?v=3','/ct-core.js?v=3','/ct-plan.js?v=3',
  '/ct-charts.js?v=3','/ct-scan-ai.js?v=3','/ct-scan.js?v=3','/ct-app.js?v=3',
  '/assets/ct-icon-192.png','/assets/ct-icon-512.png'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => Promise.all(PRECACHE.map(u => c.add(new Request(u, {cache:'reload'})).catch(() => {})))));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  if (url.origin !== location.origin) return;

  if (e.request.mode === 'navigate') {
    e.respondWith(
      fetch(e.request).then(res => {
        if (res && res.status === 200) { const c2 = res.clone(); caches.open(CACHE).then(c => c.put(e.request, c2)); }
        return res;
      }).catch(() => caches.match(e.request).then(m => m || caches.match('/calorie-tracker.html')))
    );
    return;
  }
  e.respondWith(
    caches.match(e.request).then(cached => {
      const fresh = fetch(e.request).then(res => {
        if (res && res.status === 200) { const c2 = res.clone(); caches.open(CACHE).then(c => c.put(e.request, c2)); }
        return res;
      }).catch(() => cached);
      return cached || fresh;
    })
  );
});

/* ── notification button replies ── */
self.addEventListener('notificationclick', e => {
  e.notification.close();
  const a = e.action || '', d = e.notification.data || {};
  let reply = null;
  if (a === 'w100') reply = {t:'water', ml:100, ts:Date.now()};
  else if (a === 'w200') reply = {t:'water', ml:200, ts:Date.now()};
  else if (a === 'wskip') reply = {t:'water', skip:1, ts:Date.now()};
  else if (a.indexOf(':') > 0) { const p = a.split(':'); reply = {t:'meal', a:p[0], slot:p[1], ts:Date.now(), d:d.date}; }
  e.waitUntil(self.clients.matchAll({type:'window', includeUncontrolled:true}).then(list => {
    if (list.length) {
      const c = list[0]; if (reply) c.postMessage({ctReply: reply}); return c.focus();
    }
    let q = '';
    if (reply) q = reply.t === 'water' ? '?resp=water:' + (reply.skip ? 'skip' : reply.ml) : '?resp=meal:' + reply.slot + ':' + reply.a;
    return self.clients.openWindow('/calorie-tracker.html' + q);
  }));
});
