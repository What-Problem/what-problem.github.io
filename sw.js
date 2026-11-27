/* What Problem · service worker de la tienda: la web abre aunque no haya cobertura y las fotos cargan al instante.
   Siempre intenta primero internet para que veas la versión nueva; solo usa lo guardado si no hay conexión. */
const V = 'wp-web-9.81';
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(
  caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith('wp-web-') && k !== V).map(k => caches.delete(k)))).then(() => self.clients.claim())));
self.addEventListener('fetch', e => {
  const r = e.request; if (r.method !== 'GET') return;
  const u = new URL(r.url); if (u.origin !== location.origin) return;
  if (r.mode === 'navigate') {
    e.respondWith(fetch(r).then(x => { const c = x.clone(); caches.open(V).then(k => k.put(r, c)); return x; })
      .catch(() => caches.match(r).then(m => m || caches.match('./'))));
    return;
  }
  if (/\/img\//.test(u.pathname) || /\.(png|webp|css|js)$/.test(u.pathname)) {
    e.respondWith(caches.match(r).then(m => m || fetch(r).then(x => { const c = x.clone(); caches.open(V).then(k => k.put(r, c)); return x; })));
  }
});
