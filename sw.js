/// <reference types="@types/serviceworker" />

const FALLBACK_URL = '/404.html';
const CACHE_VERSION = 'v1';
const CACHE_MANIFEST = [
	'/404.html',
	'/index.html',
	'/site.webmanifest',
	'/sw.js',
	'/contact/form.html',
	'/contact/index.html',
	'/contact/thank-you.html',
	'/license/index.html',
	'/about/index.html',
	'/recipes/apple-pie.html',
	'/recipes/brigadeiro.html',
	'/recipes/francisquito.html',
	'/recipes/index.html',
	'/recipes/nonnas-pasta.html',
	'/menu/index.html',
	'/book/form.html',
	'/book/index.html',
	'/book/thank-you.html',
	'/accessibility/index.html',
	'/assets/css/base.css',
	'/assets/css/index.css',
	'/assets/css/print.css',
	'/assets/css/transitions.css',
	'/assets/css/vars.css',
	'/assets/css/components/contact-info.css',
	'/assets/css/components/footer.css',
	'/assets/css/components/form.css',
	'/assets/css/components/header.css',
	'/assets/css/components/hero-controls.css',
	'/assets/css/components/hero-image.css',
	'/assets/css/components/icon.css',
	'/assets/css/components/index.css',
	'/assets/css/components/keep-screen.css',
	'/assets/css/components/main-menu.css',
	'/assets/css/components/main.css',
	'/assets/css/components/share-options.css',
	'/assets/css/components/sr-only.css',
	'/assets/css/components/svg-defs.css',
	'/assets/css/pages/about.css',
	'/assets/css/pages/book-form.css',
	'/assets/css/pages/book.css',
	'/assets/css/pages/contact-form.css',
	'/assets/css/pages/contact.css',
	'/assets/css/pages/home.css',
	'/assets/css/pages/menu.css',
	'/assets/css/pages/recipes.css',
	'/assets/css/pages/thank-you.css',
	'/assets/script/main.js',
	'/assets/script/components/hero-controls.js',
	'/assets/script/components/index.js',
	'/assets/script/components/keep-screen.js',
	'/assets/script/components/share-options.js'
];

self.addEventListener('install', (/** @type {ExtendableEvent}*/ event) => {
	event.waitUntil((async () => {
		const cache = await caches.open(CACHE_VERSION);

		await cache.addAll(CACHE_MANIFEST);
	})());
});

self.addEventListener('activate', (/** @type {ExtendableEvent} */ event) => {
	event.waitUntil((async () => {
		self.registration?.navigationPreload.enable();

		await clients.claim();

		const keyList = await caches.keys();

		await Promise.all(
			keyList
				.filter((key) => key !== CACHE_VERSION)
				.map((cache) => caches.delete(cache))
		);
	})());
});

self.addEventListener('fetch', (/** @type {FetchEvent} */ event) => {
	event.respondWith((async () => {
		const { request, preloadResponse } = event;
		const cache = await caches.open(CACHE_VERSION);

		let response = await caches.match(request, {
			cacheName: CACHE_VERSION,
			ignoreSearch: true
		});

		if (preloadResponse) {
			response = await preloadResponse;

			if (response) {
				await cache.put(request, response.clone());
			}
		}

		if (!response) {
			try {
				response = await fetch(request);

				await cache.put(request, response.clone());
			} catch (error) {
				response = await caches.match(FALLBACK_URL, {
					cacheName: CACHE_VERSION,
					ignoreSearch: true
				});

				if (!response) {
					response = new Response('Network error happened', {
						status: 408,
						headers: { 'Content-Type': 'text/plain' }
					});
				}
			}
		}

		return response;
	})());
});
