const url = new URL(window.location.href);
const recipeUrl = decodeURIComponent(url.searchParams.get('recipe') ?? '');

if (recipeUrl) {
	let recipe = recipeUrl;

	if (URL.canParse(recipeUrl)) {
		recipe = new URL(recipeUrl).hostname;
	}

	recipe = recipe
		.toLowerCase()
		.normalize('NFC')
		.replaceAll("'", '\u2019')
		.replaceAll('+', ' ')
		.replaceAll('-', ' ');

	const recipeTitle = [...document.querySelectorAll('dt')].find((titleElement) => titleElement.innerText.toLowerCase().normalize('NFC') === recipe);

	if (recipeTitle) {
		const range = new Range();

		range.setStart(recipeTitle, 0);
		range.setEnd(recipeTitle, 1);

		CSS.highlights.set('recipe', new Highlight(range));

		recipeTitle.scrollIntoView();
	}
}
