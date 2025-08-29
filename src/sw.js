/// <reference types="@types/serviceworker" />

/**
 * @typedef {Object} ServiceWorkerMessages
 * @prop {'sw-registered'} REGISTERED
 * @prop {'booking-saved'} BOOKING_SAVED
 */

/**
 * @typedef {Object} ServiceWorkerSyncTag
 * @prop {'check-booking'} CHECK_BOOKING
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

async function registerPeriodicSync() {
	try {
		/** @satisfies {ServiceWorkerSyncTag['CHECK_BOOKING']} */
		const tag = 'check-booking';

		// eslint-disable-next-line @typescript-eslint/no-magic-numbers
		const FIVE_MINUTES_IN_MS = 5 * 60 * 60 * 1000;

		await self.registration.periodicSync?.register(tag, {
			minInterval: FIVE_MINUTES_IN_MS
		});
	} catch (error) {
		console.error(error);
	}
}

async function unregisterPeriodicSync() {
	/** @satisfies {ServiceWorkerSyncTag['CHECK_BOOKING']} */
	const tag = 'check-booking';

	await self.registration.periodicSync?.unregister(tag);
}

async function showBookingNotification() {
	if (!(self.Notification && self.Notification.permission === 'granted')) {
		return;
	}

	const savedTimestamp = localStorage.getItem('reservation-timestamp');

	if (!savedTimestamp) {
		return;
	}

	const reservationTimestamp = new Date(savedTimestamp);
	const now = new Date();

	if (now.getTime() > reservationTimestamp.getTime()) {
		localStorage.removeItem('reservation-timestamp');
		await unregisterPeriodicSync();

		return;
	}

	const oneHourToReservation = new Date(reservationTimestamp);
	oneHourToReservation.setHours(oneHourToReservation.getHours() - 1);

	if (now.getTime() > oneHourToReservation.getTime()) {
		return;
	}

	let message = 'Your reservation is an hour away!';

	const thirtyMinutesToReservation = new Date(reservationTimestamp);
	thirtyMinutesToReservation.setHours(thirtyMinutesToReservation.getHours() - 1);

	if (now.getTime() <= thirtyMinutesToReservation.getTime()) {
		message = 'Your reservation is 30 miutes away!';
	}

	const fifteenMinutesToReservation = new Date(reservationTimestamp);
	fifteenMinutesToReservation.setHours(fifteenMinutesToReservation.getHours() - 1);

	if (now.getTime() <= fifteenMinutesToReservation.getTime()) {
		message = 'Your reservation is 15 miutes away!';
	}

	if ('setAppBadge' in navigator) {
		await navigator.setAppBadge(1);
	}

	return self.registration.showNotification("Marco's Trattoria Booking", {
		body: message,
		badge: '/assets/icons/icon-mono.svg',
		icon: '/assets/icons/icon.svg',
		// @ts-expect-error
		image: '/assets/images/focaccia.webp',
		lang: 'en-US',
		timestamp: Date.now(),
		actions: [
			{
				action: 'dismiss',
				title: 'Okay'
			},
			{
				action: 'cancel',
				title: 'Cancel Reminder'
			}
		],
		// eslint-disable-next-line @typescript-eslint/no-magic-numbers
		vibrate: [200, 100, 200]
	});
}

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

				// eslint-disable-next-line @typescript-eslint/no-magic-numbers
				if (url.origin === self.origin && response.status === 200) {
					await cache.put(request, response.clone());
				}
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

self.addEventListener('periodicsync', (/** @type {PeriodicSyncEvent} */ event) => {
	const tagName = /** @type {ServiceWorkerSyncTag[keyof ServiceWorkerSyncTag]} */ (event.tag);

	switch (tagName) {
		case 'check-booking':
			event.waitUntil(showBookingNotification());
			break;
		default:
			break;
	}
});

self.addEventListener('message', (/** @type {ExtendableMessageEvent} */ event) => {
	const message = /** @type {ServiceWorkerMessages[keyof ServiceWorkerMessages]} */ (event.data);

	switch (message) {
		case 'booking-saved':
			event.waitUntil(registerPeriodicSync());
			break;
		case 'sw-registered':
		default:
			break;
	}
});

self.addEventListener('notificationclick', (/** @type {NotificationEvent} */ event) => {
	event.notification.close();

	if (event.action === 'cancel') {
		event.waitUntil(unregisterPeriodicSync());
	}
});
