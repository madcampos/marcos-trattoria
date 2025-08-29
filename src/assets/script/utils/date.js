/* eslint-disable @typescript-eslint/no-magic-numbers */

/** @type {Date[] | undefined} */
let holidays;

/**
 * Calculates Easter in the Gregorian/Western (Catholic and Protestant) calendar
 * based on the algorithm by Oudin (1940) from http://www.tondering.dk/claus/cal/easter.php
 *
 * @param {number} year
 */
function getEasterHolidays(year) {
	/* eslint-disable id-length */
	// Golden Number - 1
	const G = year % 19;
	const C = Math.floor(year / 100);
	// related to Epact
	const H = (C - Math.floor(C / 4) - Math.floor((8 * C + 13) / 25) + 19 * G + 15) % 30;
	// number of days from 21 March to the Paschal full moon
	const I = H - Math.floor(H / 28) * (1 - Math.floor(29 / (H + 1)) * Math.floor((21 - G) / 11));
	// weekday for the Paschal full moon
	const J = (year + Math.floor(year / 4) + I + 2 - C + Math.floor(C / 4)) % 7;
	// number of days from 21 March to the Sunday on or before the Paschal full moon
	const L = I - J;
	const month = 3 + Math.floor((L + 40) / 44);
	const day = L + 28 - 31 * Math.floor(month / 4);
	/* eslint-enable id-length */

	const easterDate = new Date(year, month, day);
	const goodFriday = new Date(easterDate);
	const easterMonday = new Date(easterDate);

	goodFriday.setDate(easterDate.getDate() - 2);
	easterMonday.setDate(easterDate.getDate() + 1);

	return [goodFriday, easterDate, easterMonday];
}

/**
 * @param {number} year
 * @param {number} month
 */
function getNthMondayOfMonth(year, month, weeksToAdd = 0) {
	const date = new Date(year, month, 1);
	const dayOfTheWeek = date.getDay();
	const daysToAdd = (dayOfTheWeek === 0) ? 1 : (8 - dayOfTheWeek) % 7;
	date.setDate(date.getDate() + daysToAdd);

	date.setDate(date.getDate() + (7 * weeksToAdd));

	return date;
}

/**
 * @param {number} year
 * @param {number} month
 */
function getNthFridayOfMonth(year, month, weeksToAdd = 0) {
	const date = new Date(year, month, 1);
	const dayOfTheWeek = date.getDay();
	const daysToAdd = (dayOfTheWeek <= 5) ? (5 - dayOfTheWeek) : (12 - dayOfTheWeek);
	date.setDate(date.getDate() + daysToAdd);

	date.setDate(date.getDate() + (7 * weeksToAdd));

	return date;
}

/**
 * @param {Date} date
 */
function getPreviousMonday(date) {
	const previousMonday = new Date(date);
	const dayOfTheWeek = date.getDay();
	const daysToSubtract = (dayOfTheWeek === 0) ? 6 : dayOfTheWeek - 1;
	previousMonday.setDate(date.getDate() - daysToSubtract);

	return previousMonday;
}

function getHolidays() {
	/** @type {Array<Date>} */
	const holidayList = [];

	const now = new Date();

	// New Year's Day - January 1st
	holidayList.push(new Date(now.getFullYear(), 0, 1));

	// Family Day - 1st Monday of February
	holidayList.push(getNthMondayOfMonth(now.getFullYear(), 1));

	// Easter Holidays - Good Friday, Easter, Easter Monday
	holidayList.push(...getEasterHolidays(now.getFullYear()));

	// Victoria Day - Monday before May 25th
	holidayList.push(getPreviousMonday(new Date(now.getFullYear(), 4, 25)));

	// Canada Day - July 1st
	holidayList.push(new Date(now.getFullYear(), 6, 25));

	// Civic Holiday - 1st Monday of August
	holidayList.push(getNthFridayOfMonth(now.getFullYear(), 7));

	// Labour Day - 1st Monday of September
	holidayList.push(getNthFridayOfMonth(now.getFullYear(), 8));

	// Truth and Reconciliation Day - September 30th
	holidayList.push(new Date(now.getFullYear(), 8, 30));

	// Thanksgiving - 2nd Monday of October
	holidayList.push(getNthFridayOfMonth(now.getFullYear(), 9, 1));

	// Rememberance Day - November 11th
	holidayList.push(new Date(now.getFullYear(), 10, 11));

	// Christmas - December 25th
	holidayList.push(new Date(now.getFullYear(), 11, 25));

	// Boxing Day - December 26th
	holidayList.push(new Date(now.getFullYear(), 11, 26));

	return holidayList;
}

/**
 * @param {Date} dateA
 * @param {Date} dateB
 */
export function isSameDate(dateA, dateB) {
	const isSameYear = dateA.getFullYear() === dateB.getFullYear();
	const isSameMonth = dateA.getMonth() === dateB.getMonth();
	const isSameDay = dateA.getDate() === dateB.getDate();

	return isSameYear && isSameMonth && isSameDay;
}

/**
 * @param {Date} date
 */
export function isHoliday(date) {
	holidays ??= getHolidays();

	return holidays.some((holiday) => isSameDate(holiday, date));
}
