(async function() {
	const favoriteCoins = document.querySelector("#favorite-coins");

	const favorites = await getFavorites();
	if (favorites.coins.length > 0) {
		fillCoins(favoriteCoins, favorites.coins);
	} else {
		favoriteCoins.innerText = "You don't have any favorite cryptocurrency yet. Switch to the « Let’s play! » tab to start adding some.";
	}

	document.querySelector("#loading").classList.add("hidden");
	document.querySelector("#content").classList.remove("hidden");
})().catch(console.error);
