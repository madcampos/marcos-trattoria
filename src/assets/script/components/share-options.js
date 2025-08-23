/* eslint-disable no-param-reassign */

const shareOptions = document.querySelector('share-options');

if (shareOptions) {
	const url = window.location.href;
	const title = (/** @type {HTMLElement} */ (document.querySelector('[data-share-title]')))?.innerText ?? '';
	const description = (/** @type {HTMLElement} */ (document.querySelector('[data-share-text]')))?.innerText ?? 'Check out this recipe!';
	const fileContents = (/** @type {Array<HTMLElement>} */ ([...document.querySelectorAll('[data-share-text], [data-share-list]')]))
		.reduce(
			(text, part) => {
				if (part instanceof HTMLOListElement) {
					text += `## ${part.dataset['shareList'] ?? 'List'}\n`;

					part.querySelectorAll('li').forEach((item, index) => {
						text += `${(index + 1).toString().padStart(2, '0')}. ${item.innerText}\n`;
					});

					text += '\n';
				} else if (part instanceof HTMLUListElement) {
					text += `## ${part.dataset['shareList'] ?? 'List'}\n`;

					part.querySelectorAll('li').forEach((item) => {
						text += `- ${item.innerText}\n`;
					});

					text += '\n';
				} else {
					text += `${part.innerText}\n\n`;
				}

				return text;
			},
			`# ${title}\n\nSource: ${url}\n\n`
		);
	const file = new File([fileContents], `${title}.txt`, { type: 'text/plain' });

	shareOptions.querySelector('button#share-os-link')?.addEventListener('click', async () => {
		await navigator.share({
			url,
			title,
			text: description
		});
	});

	shareOptions.querySelector('button#share-os-file')?.addEventListener('click', async () => {
		await navigator.share({
			url,
			title,
			text: description,
			files: [file]
		});
	});

	shareOptions.querySelector('button#share-sms')?.addEventListener('click', () => {
		const text = `${title}\n\n${description}\n${url}`;

		window.open(`sms://;?&body=${encodeURIComponent(text)}`);
	});

	shareOptions.querySelector('button#share-email')?.addEventListener('click', () => {
		const subject = encodeURIComponent(title);
		const body = encodeURIComponent(`${description}\n${url}`);

		window.open(`mailto:?subject=${subject}&body=${body}`);
	});

	shareOptions.querySelector('button#share-copy')?.addEventListener('click', async () => {
		await navigator.clipboard.writeText(url);
	});

	shareOptions.querySelector('button#share-download')?.addEventListener('click', () => {
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

	shareOptions.querySelector('button#share-print')?.addEventListener('click', () => {
		window.print();
	});
}
