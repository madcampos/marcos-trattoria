const keepScreenButton = /** @type {HTMLButtonElement | null}*/ (document.querySelector('keep-screen button'));

if (keepScreenButton && ('wakeLock' in navigator)) {
	keepScreenButton.hidden = false;

	/** @type {WakeLockSentinel | undefined} */
	let wakeLock;
	let hasRequestedLock = false;

	keepScreenButton.addEventListener('click', async () => {
		try {
			if (wakeLock) {
				await wakeLock.release();
				wakeLock = undefined;
				hasRequestedLock = false;
				keepScreenButton.toggleAttribute('data-has-lock', false);
			} else {
				wakeLock = await navigator.wakeLock.request('screen');
				hasRequestedLock = true;
				keepScreenButton.toggleAttribute('data-has-lock', true);
			}
		} catch (err) {
			console.error(err);
		}
	});

	document.addEventListener('visibilitychange', async () => {
		if (!hasRequestedLock || wakeLock) {
			return;
		}

		if (document.visibilityState !== 'visible') {
			return;
		}

		try {
			wakeLock = await navigator.wakeLock.request('screen');
		} catch (err) {
			console.error(err);
		}
	});
}
