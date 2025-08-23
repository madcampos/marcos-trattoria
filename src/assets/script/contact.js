const title = localStorage.getItem('contact-form-title');
const text = localStorage.getItem('contact-form-text');
const messageField = /** @type {HTMLTextAreaElement} */ (document.querySelector('#contact-message'));

if (title) {
	messageField.value = `${title}\n`;
}

if (text) {
	messageField.value = `${messageField.value}${text}`;
}

document.querySelector('form')?.addEventListener('submit', () => {
	localStorage.removeItem('contact-form-title');
	localStorage.removeItem('contact-form-text');
});
