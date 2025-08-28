import './components/index.js';

const DEV_MODE = false;

async function registerServiceWorker() {
	if (DEV_MODE) {
		return;
	}

	if ('serviceWorker' in navigator) {
		try {
			await navigator.serviceWorker.register('/sw.js', {
				scope: '/',
				type: 'module'
			});

			navigator.serviceWorker.addEventListener('message', (event) => {
				const messageType = /** @type {import('../../sw.js').ServiceWorkerMessages[keyof import('../../sw.js').ServiceWorkerMessages]} */ (event.data);

				switch (messageType) {
					case 'sw-registered':
						console.info('[⚙️] Service Worker registered');

						document.querySelector('pwa-banner button')?.addEventListener('click', () => {
							document.querySelector('pwa-banner')?.toggleAttribute('hidden');
						});

						document.querySelector('pwa-banner')?.removeAttribute('hidden');
						break;
					default:
						break;
				}
			});
		} catch (error) {
			console.error(`Registration failed with ${error}`);
		}
	}
}

void registerServiceWorker();
