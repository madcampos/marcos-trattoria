(/** @type {NodeListOf<HTMLInputElement>} */ (document.querySelectorAll('form input[type="checkbox"]'))).forEach((checkbox) => {
	const page = window.location.pathname;
	const item = checkbox.id;
	const isChecked = localStorage.getItem(`recipe-${page}-${item}`) === 'true';

	checkbox.checked = isChecked;
});

document.addEventListener('change', (event) => {
	const element = /** @type {HTMLInputElement} */ (event.target);

	if (!element.matches('form input[type="checkbox"]')) {
		return;
	}

	const page = window.location.pathname;
	const item = element.id;

	localStorage.setItem(`recipe-${page}-${item}`, element.checked.toString());
});

document.querySelector('form')?.addEventListener('reset', () => {
	(/** @type {NodeListOf<HTMLInputElement>} */ (document.querySelectorAll('form input[type="checkbox"]'))).forEach((checkbox) => {
		const page = window.location.pathname;
		const item = checkbox.id;

		localStorage.removeItem(`recipe-${page}-${item}`);
	});
});
