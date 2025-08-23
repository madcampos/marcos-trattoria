document.querySelector('#booking-alert')?.addEventListener('click', async () => {
	await Notification.requestPermission();
});

document.querySelector('#booking-save')?.addEventListener('click', () => {
	// TODO: save file to device
});
