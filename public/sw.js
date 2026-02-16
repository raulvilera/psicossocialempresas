const CACHE_NAME = 'lkm-gestao-v8';

// Instalação: Cachear apenas o básico
self.addEventListener('install', function (event) {
    self.skipWaiting();
});

// Ativação: Limpeza de caches antigos
self.addEventListener('activate', function (event) {
    event.waitUntil(
        caches.keys().then(function (cacheNames) {
            return Promise.all(
                cacheNames.map(function (cacheName) {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    return self.clients.claim();
});

// Fetch: Tenta buscar no cache, se não houver, busca na rede e guarda no cache (Dynamic Caching)
self.addEventListener('fetch', function (event) {
    // Não cachear solicitações de APIs externas ou de outros domínios se preferir
    if (event.request.url.indexOf('http') !== 0) return;

    event.respondWith(
        caches.match(event.request).then(function (response) {
            // Retorna o cache se encontrar
            if (response) {
                return response;
            }

            // Se não houver no cache, faz o fetch na rede
            return fetch(event.request).then(function (networkResponse) {
                // Valida se a resposta é válida
                if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
                    return networkResponse;
                }

                // Clona a resposta para guardar no cache
                var responseToCache = networkResponse.clone();
                caches.open(CACHE_NAME).then(function (cache) {
                    cache.put(event.request, responseToCache);
                });

                return networkResponse;
            }).catch(function () {
                // Se falhar a rede e não houver cache, você pode retornar uma página offline aqui
            });
        })
    );
});
