const CACHE_NAME = 'lkm-gestao-v5';

// Instalação do Service Worker
self.addEventListener('install', (event) => {
    self.skipWaiting();
});

// Ativação e limpeza
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    return self.clients.claim();
});

// Handler de fetch obrigatório para PWA ser instalável
self.addEventListener('fetch', (event) => {
    event.respondWith(fetch(event.request));
});
