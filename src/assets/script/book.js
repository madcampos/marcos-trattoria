(/** @type {NodeListOf<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>} */ (document.querySelectorAll('form :is(input, select, textarea)'))).forEach((field) => {
	const savedValue = localStorage.getItem(field.id);

	if (savedValue) {
		field.value = savedValue;
	}
});

document.querySelector('form')?.addEventListener('submit', () => {
	(/** @type {NodeListOf<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>} */ (document.querySelectorAll('form :is(input, select, textarea)'))).forEach((field) => {
		localStorage.setItem(field.id, field.value);
	});

	const bookDate = new Date((/** @type {HTMLInputElement} */ (document.querySelector('#book-date'))).valueAsDate ?? Date.now());
	const [bookHours, bookMinutes] = (/** @type {HTMLSelectElement} */ (document.querySelector('#book-date'))).value.split(':').map((str) => Number.parseInt(str));

	bookDate.setHours(bookHours ?? 0, bookMinutes);

	localStorage.setItem('reservation-timestamp', bookDate.toISOString());
});

document.querySelector('form')?.addEventListener('reset', () => {
	(/** @type {NodeListOf<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>} */ (document.querySelectorAll('form :is(input, select, textarea)'))).forEach((field) => {
		localStorage.removeItem(field.id);
	});

	localStorage.removeItem('reservation-timestamp');
});

// TODO: add logic to update available select items.
