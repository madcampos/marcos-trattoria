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
});

document.querySelector('form')?.addEventListener('reset', () => {
	(/** @type {NodeListOf<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>} */ (document.querySelectorAll('form :is(input, select, textarea)'))).forEach((field) => {
		localStorage.removeItem(field.id);
	});
});
