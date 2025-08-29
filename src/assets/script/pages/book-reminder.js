document.querySelector('#booking-alert')?.addEventListener('click', async () => {
	await Notification.requestPermission();

	/** @satisfies {import('../../../sw.js').ServiceWorkerMessages['BOOKING_SAVED']} */
	const message = 'booking-saved';

	(await navigator.serviceWorker.ready).active?.postMessage(message);
});

document.querySelector('#booking-save')?.addEventListener('click', () => {
	/** @type {Record<string, string>} */
	const bookingDetails = {};

	for (const [key, value] of Object.entries(localStorage)) {
		if (key.startsWith('book')) {
			bookingDetails[key] = value;
		}
	}

	const fileContents = JSON.stringify(bookingDetails);
	const file = new File([fileContents], 'booking-details.mtb', { type: 'application/json' });
	const anchor = document.createElement('a');
	const objectUrl = URL.createObjectURL(file);

	anchor.href = objectUrl;
	anchor.download = file.name;
	anchor.hidden = true;

	document.body.append(anchor);
	anchor.click();

	anchor.remove();
	URL.revokeObjectURL(objectUrl);
});
