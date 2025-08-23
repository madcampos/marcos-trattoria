const video = /** @type {HTMLVideoElement} */ (document.querySelector('hero-image video'));

if (video) {
	const playPauseButton = /** @type {HTMLButtonElement} */ (document.querySelector('#video-play-pause-button'));
	const playIcon = /** @type {HTMLSpanElement} */ (document.querySelector('#video-play-icon'));
	const pauseIcon = /** @type {HTMLSpanElement} */ (document.querySelector('#video-pause-icon'));

	video.addEventListener('play', () => {
		playIcon.hidden = true;
		pauseIcon.hidden = false;
	});

	video.addEventListener('pause', () => {
		playIcon.hidden = false;
		pauseIcon.hidden = true;
	});

	playPauseButton.addEventListener('click', () => {
		if (video.paused) {
			void video.play();
		} else {
			video.pause();
		}
	});

	if (window.matchMedia('(prefers-reduced-motion: no-preference), (prefers-reduced-data: no-preference)')) {
		try {
			void video.play();
		} catch (err) {
			console.error(err);
		}
	}

	document.querySelector('hero-controls')?.removeAttribute('hidden');
}
