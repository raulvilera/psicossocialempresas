const CACHE_NAME = 'lkm-gestao-v11';
const ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    '/manifest.json',
    '/pwa-192x192.png',
    '/pwa-512x512.png'
];

// Instalação: Cachear recursos essenciais
self.addEventListener('install', function (event) {
    console.log('[SW] Instalando Service Worker...');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function (cache) {
                console.log('[SW] Cache aberto, adicionando recursos...');
                return cache.addAll(ASSETS_TO_CACHE);
            })
            .then(function () {
                console.log('[SW] Recursos cacheados com sucesso!');
                return self.skipWaiting();
            })
            .catch(function (error) {
                console.error('[SW] Erro ao cachear recursos:', error);
            })
    );
});

// Ativação: Limpar caches antigos
self.addEventListener('activate', function (event) {
    console.log('[SW] Ativando Service Worker...');
    event.waitUntil(
        caches.keys()
            .then(function (cacheNames) {
                return Promise.all(
                    cacheNames.map(function (cacheName) {
                        if (cacheName !== CACHE_NAME) {
                            console.log('[SW] Removendo cache antigo:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(function () {
                console.log('[SW] Controle de clientes assumido');
                return self.clients.claim();
            })
    );
});

// Fetch: Network-First com fallback para Cache
self.addEventListener('fetch', function (event) {
    // Ignorar requisições cross-origin
    if (!event.request.url.startsWith(self.location.origin)) {
        return;
    }
    event.respondWith(
        fetch(event.request)
            .then(function (response) {
                // Se a resposta é válida, cachear e retornar
                if (response && response.status === 200) {
                    var responseToCache = response.clone();
                    caches.open(CACHE_NAME)
                        .then(function (cache) {
                            cache.put(event.request, responseToCache);
                        });
                }
                return response;
            })
            .catch(function () {
                // Se falhar a rede, tentar o cache
                return caches.match(event.request)
                    .then(function (response) {
                        if (response) {
                            console.log('[SW] Servindo do cache:', event.request.url);
                            return response;
                        }
                        // Se não houver cache, retornar resposta offline básica
                        if (event.request.mode === 'navigate') {
                            return caches.match('/index.html');
                        }
                    });
            })
    );
});
