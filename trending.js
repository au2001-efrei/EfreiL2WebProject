(async function() {
	const trending = await getTrending();

	fillCoins(document.querySelector("#trending-coins"), trending.coins);
	document.querySelector("#loading").classList.add("hidden");
	document.querySelector("#content").classList.remove("hidden");
})().catch(console.error);
