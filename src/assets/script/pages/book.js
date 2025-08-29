/* eslint-disable @typescript-eslint/no-magic-numbers */

import { isHoliday, isSameDate } from '../utils/date.js';

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
	const [bookHours, bookMinutes] = (/** @type {HTMLSelectElement} */ (document.querySelector('#book-time'))).value.split(':').map((str) => Number.parseInt(str));

	bookDate.setHours(bookHours ?? 0, bookMinutes);

	localStorage.setItem('reservation-timestamp', bookDate.toISOString());
});

document.querySelector('form')?.addEventListener('reset', () => {
	(/** @type {NodeListOf<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>} */ (document.querySelectorAll('form :is(input, select, textarea)'))).forEach((field) => {
		localStorage.removeItem(field.id);
	});

	localStorage.removeItem('reservation-timestamp');
});

const dateInput = /** @type {HTMLInputElement} */ (document.querySelector('#book-date'));
const timeInput = /** @type {HTMLSelectElement} */ (document.querySelector('#book-time'));
const dateErrorMessage = /** @type {HTMLSelectElement} */ (document.querySelector('#book-date-error-message'));

function initializeDateInput() {
	const formatter = new Intl.DateTimeFormat('en-CA', {
		year: 'numeric',
		month: '2-digit',
		day: '2-digit'
	});
	const now = new Date();
	const sixMonthsFromNow = new Date(now);

	sixMonthsFromNow.setMonth(sixMonthsFromNow.getMonth() + 6);

	dateInput.min = formatter.format(now);
	dateInput.max = formatter.format(sixMonthsFromNow);
	dateInput.value = formatter.format(now);
}

function updateDisabledTimes() {
	const date = new Date(`${dateInput.value}T00:00:00`);
	const dayOfTheWeek = date.getDay();

	// Default: Friday - Sunday: 10:00 - 01:00
	[...timeInput.options].forEach((option) => {
		option.disabled = false;
	});

	timeInput.selectedIndex = 0;
	timeInput.ariaDisabled = 'true';
	dateErrorMessage.textContent = 'Please select a valid date.';
	dateInput.setCustomValidity('');

	// Tuesday - Thursday: 11:00 - 14:00 / 16:00 - 23:00
	if (dayOfTheWeek > 1 && dayOfTheWeek <= 5) {
		const disallowedTimes = ['13:00', '14:00', '00:00'];

		[...timeInput.options].forEach((option) => {
			if (disallowedTimes.includes(option.value)) {
				option.disabled = true;
			}
		});
	}

	// Monday: closed
	if (dayOfTheWeek === 1) {
		[...timeInput.options].forEach((option) => {
			option.disabled = true;
		});

		timeInput.ariaDisabled = 'true';
		dateInput.setCustomValidity('The restaurant is closed on Mondays.');
		dateErrorMessage.textContent = 'The restaurant is closed on Mondays.';
	}

	// Hours before now
	const now = new Date();

	if (isSameDate(now, date)) {
		[...timeInput.options].forEach((option) => {
			const hour = Number.parseInt(option.value.split(':')[0] ?? '0');

			if (hour !== 0 && hour <= now.getHours()) {
				option.disabled = true;
			}
		});
	}

	// Is a holiday
	if (isHoliday(date)) {
		[...timeInput.options].forEach((option) => {
			option.disabled = true;
		});

		timeInput.ariaDisabled = 'true';
		dateInput.setCustomValidity('The restaurant is closed on Holidays.');
		dateErrorMessage.textContent = 'The restaurant is closed on Holidays.';
	}
}

dateInput.addEventListener('change', () => updateDisabledTimes());

timeInput.addEventListener('change', (evt) => {
	if (timeInput.ariaDisabled === 'true') {
		evt.preventDefault();
	}
});

initializeDateInput();
updateDisabledTimes();
