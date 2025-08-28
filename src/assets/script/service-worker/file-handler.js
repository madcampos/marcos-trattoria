/**
 * @param {FileSystemFileHandle[]} files
 */
async function loadFile(files) {
	const file = await files[0]?.getFile();
	const text = await file?.text();
	const json = JSON.parse(text ?? '{}');

	for (const [key, value] of Object.entries(json)) {
		if (key.startsWith('book-')) {
			localStorage.setItem(key, value);
		}
	}
}

if ('launchQueue' in window) {
	window.launchQueue?.setConsumer((launchParams) => {
		if (launchParams.files && launchParams.files.length > 0) {
			void loadFile(launchParams.files);
		}
	});
}
