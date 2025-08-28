/// <reference types="@types/serviceworker" />

/**
 * @typedef {Object} ServiceWorkerMessages
 * @prop {'sw-registered'} REGISTERED
 * @prop {'booking-saved'} BOOKING_SAVED
 */

const FALLBACK_URL = '/404.html';
const CACHE_VERSION = 'v1';
const CACHE_MANIFEST = [
	'/',
	'/404.html',
	'/about/',
	'/accessibility/',
	'/assets/css/base.css',
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
	'/assets/css/fonts.css',
	'/assets/css/index.css',
	'/assets/css/pages/about.css',
	'/assets/css/pages/book-form.css',
	'/assets/css/pages/book.css',
	'/assets/css/pages/contact-form.css',
	'/assets/css/pages/contact.css',
	'/assets/css/pages/home.css',
	'/assets/css/pages/license.css',
	'/assets/css/pages/menu.css',
	'/assets/css/pages/recipes.css',
	'/assets/css/pages/thank-you.css',
	'/assets/css/print.css',
	'/assets/css/transitions.css',
	'/assets/css/vars.css',
	'/assets/fonts/cookie-regular.woff2',
	'/assets/fonts/cormorantinfant-variablefont_wght.woff2',
	'/assets/fonts/cormorantinfant-italic-variablefont_wght.woff2',
	'/assets/images/logo.svg',
	'/assets/script/components/hero-controls.js',
	'/assets/script/components/index.js',
	'/assets/script/components/keep-screen.js',
	'/assets/script/components/share-options.js',
	'/assets/script/main.js',
	'/book/',
	'/book/form.html',
	'/book/thank-you.html',
	'/contact/',
	'/contact/form.html',
	'/contact/thank-you.html',
	'/license/',
	'/menu/',
	'/recipes/',
	'/recipes/apple-pie.html',
	'/recipes/brigadeiro.html',
	'/recipes/francisquito.html',
	'/recipes/nonnas-pasta.html'
];

self.addEventListener('install', (/** @type {ExtendableEvent}*/ event) => {
	event.waitUntil((async () => {
		const cache = await caches.open(CACHE_VERSION);

		await cache.addAll(CACHE_MANIFEST);

		await self.skipWaiting();
	})());
});

self.addEventListener('activate', (/** @type {ExtendableEvent} */ event) => {
	event.waitUntil((async () => {
		await self.registration?.navigationPreload.enable();

		await clients.claim();

		const keyList = await caches.keys();

		await Promise.all(
			keyList
				.filter((key) => key !== CACHE_VERSION)
				.map(async (cache) => caches.delete(cache))
		);

		(await clients.matchAll({ type: 'window' })).forEach(async ({ id }) => {
			/** @satisfies {ServiceWorkerMessages['REGISTERED']} */
			const message = 'sw-registered';

			(await clients.get(id))?.postMessage(message);
		});
	})());
});

self.addEventListener('fetch', (/** @type {FetchEvent} */ event) => {
	event.respondWith((async () => {
		const { request, preloadResponse } = event;
		const url = new URL(request.url);

		if (request.method === 'POST' && url.pathname.startsWith('/contact')) {
			const title = url.searchParams.get('title') ?? '';
			const text = url.searchParams.get('text') ?? '';

			localStorage.setItem('contact-form-title', title);
			localStorage.setItem('contact-form-text', text);

			// eslint-disable-next-line @typescript-eslint/no-magic-numbers
			return Response.redirect('/contact/', 303);
		}

		const cache = await caches.open(CACHE_VERSION);

		let response = await caches.match(request, {
			cacheName: CACHE_VERSION,
			ignoreSearch: true
		});

		if (preloadResponse !== undefined) {
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
				console.error(error);

				response = await caches.match(FALLBACK_URL, {
					cacheName: CACHE_VERSION,
					ignoreSearch: true
				});

				response ??= new Response('Network error happened', {
					status: 408,
					headers: { 'Content-Type': 'text/plain' }
				});
			}
		}

		return response;
	})());
});

self.addEventListener('message', (/** @type {ExtendableMessageEvent} */ event) => {
	// TODO: add background sync
});

self.addEventListener('push', (/** @type {PushEvent} */ event) => {
	if (!(self.Notification && self.Notification.permission === 'granted')) {
		return;
	}

	event.waitUntil(
		self.registration.showNotification("Marco's Trattoria Booking", {
			body: 'Your booking is coming soon!',
			badge: '/assets/icons/icon-mono.svg',
			icon: '/assets/icons/icon.svg',
			// @ts-expect-error
			image: '/assets/images/focaccia.webp',
			lang: 'en-US',
			timestamp: Date.now(),
			// eslint-disable-next-line @typescript-eslint/no-magic-numbers
			vibrate: [200, 100, 200]
		})
	);
});

self.addEventListener('notificationclick', (/** @type {NotificationEvent} */ event) => {
	event.notification.close();
	// TODO: go to booking page
});
