const url = new URL(window.location.href);
const recipe = (url.searchParams.get('recipe') ?? '').toLowerCase().normalize('NFC').replace("'", '\u2019');

if (recipe) {
	const recipeTitle = [...document.querySelectorAll('dt')].find((titleElement) => titleElement.innerText.toLowerCase().normalize('NFC') === recipe);

	if (recipeTitle) {
		const range = new Range();

		range.setStart(recipeTitle, 0);
		range.setEnd(recipeTitle, 1);

		CSS.highlights.set('recipe', new Highlight(range));

		recipeTitle.scrollIntoView();
	}
}
