/* Prompter · service worker: se abre desde el icono del móvil aunque falle la cobertura.
   Primero internet (versión nueva); si no hay conexión, la última copia guardada. */
const V = 'wp-prompter-9.77-menu.2';
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(
  caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith('wp-prompter-') && k !== V).map(k => caches.delete(k)))).then(() => self.clients.claim())));
self.addEventListener('fetch', e => {
  const r = e.request; if (r.method !== 'GET') return;
  const u = new URL(r.url); if (u.origin !== location.origin) return;
  e.respondWith(fetch(r).then(x => { if (x.ok) { const c = x.clone(); caches.open(V).then(k => k.put(r, c)); } return x; })
    .catch(() => caches.match(r).then(m => m || caches.match('./'))));
});
