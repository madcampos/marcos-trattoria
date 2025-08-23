import './components/index.js';

const DEV_MODE = false;

async function registerServiceWorker() {
	if (DEV_MODE) {
		return;
	}

	if ('serviceWorker' in navigator) {
		try {
			const serviceWorkerRegistration = await navigator.serviceWorker.register('/sw.js', {
				scope: '/',
				type: 'module'
			});

			if (serviceWorkerRegistration.active) {
				// TODO: show alert the page is ready to work offline
			}
		} catch (error) {
			console.error(`Registration failed with ${error}`);
		}
	}
}

registerServiceWorker();
