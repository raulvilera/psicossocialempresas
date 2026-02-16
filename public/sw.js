const CACHE_NAME = 'lkm-gestao-v4';
const ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    '/manifest.json',
    '/pwa-192x192.png',
    '/pwa-512x512.png',
    '/index.css'
];

// Instalação do Service Worker
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('SW: Cache aberto');
            // Usamos addAll mas com tratamento de erro individual para não quebrar a instalação
            return Promise.allSettled(
                ASSETS_TO_CACHE.map(asset => cache.add(asset))
            ).then(results => {
                const failed = results.filter(r => r.status === 'rejected');
                if (failed.length > 0) {
                    console.warn(`SW: ${failed.length} recursos falharam ao carregar no cache.`);
                }
            });
        })
    );
    self.skipWaiting();
});

// Ativação e limpeza de caches antigos
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('SW: Limpando cache antigo', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    return self.clients.claim();
});

// Estratégia Fetch: Network First, falling back to cache
self.addEventListener('fetch', (event) => {
    // Ignora requisições de extensões de navegador ou esquemas não-http
    if (!(event.request.url.startsWith('http'))) return;

    event.respondWith(
        fetch(event.request)
            .catch(() => {
                return caches.match(event.request);
            })
    );
});
