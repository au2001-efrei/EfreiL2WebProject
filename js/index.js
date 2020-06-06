(async function() {
	const [ random, up, down ] = await Promise.all([getRandomCoins(), getUp(), getDown()]);

	fillCoins(document.querySelector("#random-coins"), random.coins);
	fillCoins(document.querySelector("#up-coins"), up.coins);
	fillCoins(document.querySelector("#down-coins"), down.coins);
	document.querySelector("#loading").classList.add("hidden");
	document.querySelector("#content").classList.remove("hidden");
})().catch(console.error);
