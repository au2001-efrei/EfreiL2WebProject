(async function() {
	const searchForm = document.querySelector("#search-form");
	const searchResults = document.querySelector("#search-results");
	const favoriteCoins = document.querySelector("#favorite-coins");

	const searchQuery = searchForm['query'];
	const clearButton = searchForm.querySelector(".clear");

	function createClickableCoinCards(element, coins, callback) {
		for (var i in coins) {
			const coin = coins[i];
			if (coin === null) continue;

			const link = document.createElement("a");
			const card = createCoinCard(coin);

			const subLinks = card.querySelectorAll("a");
			for (var subLink of subLinks) {
				subLink.addEventListener("click", function(event) {
					event.stopPropagation();
				});
			}

			link.addEventListener("click", (function(coin) {
				return function() {
					callback(coin);
				};
			})(coin));

			link.appendChild(card);
			element.appendChild(link);
		}
	}

	async function refreshFavorites() {
		const favorites = await getFavorites();

		if (favorites.coins.length > 0) {
			while (favoriteCoins.firstChild !== null)
				favoriteCoins.removeChild(favoriteCoins.firstChild);

			createClickableCoinCards(favoriteCoins, favorites.coins, function(coin) {
				removeFavorite(coin);
				refreshFavorites();
			});
		} else {
			const paragraph = document.createElement("p");
			paragraph.innerText = "You don't have any favorite cryptocurrency.";
			favoriteCoins.appendChild(paragraph);
		}
	}

	async function search() {
		if (searchResults.query === searchQuery.value) return;
		searchResults.query = searchQuery.value;

		while (searchResults.firstChild !== null)
			searchResults.removeChild(searchResults.firstChild);

		const results = await searchCoins(searchQuery.value);
		if (searchResults.query !== searchQuery.value) return;

		if (results.coins.length > 0) {
			createClickableCoinCards(searchResults, results.coins, function(coin) {
				addFavorite(coin);
				refreshFavorites();
			});
		} else {
			const paragraph = document.createElement("p");
			paragraph.innerText = "No cryptocurrency found matching your query.";
			searchResults.appendChild(paragraph);
		}
	}

	searchForm.addEventListener("submit", search);

	searchQuery.addEventListener("change", function() {
		search();
	});

	clearButton.addEventListener("click", function() {
		searchQuery.value = "";
		search();
	});

	await refreshFavorites();

	document.querySelector("#loading").classList.add("hidden");
	document.querySelector("#content").classList.remove("hidden");
})().catch(console.error);
