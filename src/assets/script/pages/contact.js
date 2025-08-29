const url = new URL(window.location.href);
const title = url.searchParams.get('title');
const text = url.searchParams.get('text');
const iframe = /** @type {HTMLIFrameElement} */ (document.querySelector('#contact-form'));
const messageField = /** @type {HTMLTextAreaElement} */ (iframe.contentDocument?.querySelector('#contact-message'));

if (title) {
	messageField.value = `${title}\n\n`;
}

if (text) {
	messageField.value = `${messageField.value}${text}`;
}
