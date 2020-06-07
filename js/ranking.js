(async function() {
	const valuable = await getCoinsList(100, 0, "price");

	fillCoins(document.querySelector("#valuable-coins"), valuable.coins);
	document.querySelector("#loading").classList.add("hidden");
	document.querySelector("#content").classList.remove("hidden");
})().catch(console.error);
