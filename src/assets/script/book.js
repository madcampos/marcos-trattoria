if ('launchQueue' in window) {
	window.launchQueue?.setConsumer(async (launchParams) => {
		if (launchParams.files && launchParams.files.length > 0) {
			const file = await launchParams.files[0]?.getFile();
			const text = await file?.text();
			const json = JSON.parse(text ?? '{}');

			// TODO: load booking into form
		}
	});
}

document.querySelector('form')?.addEventListener('submit', () => {
	// TODO: save form data to local storage
});
