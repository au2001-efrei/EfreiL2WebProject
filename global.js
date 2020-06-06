async function getCoinsList(limit = 100, offset = 0, sort = "coinranking", order = "desc") {
	if (limit <= 0) {
		return {
			stats: {},
			base: {},
			coins: []
		};
	}

	const response = await fetch(`https://api.coinranking.com/v1/public/coins?limit=${limit}&offset=${offset}&sort=${sort}&order=${order}`);
	const json = await response.json();

	if (json.status !== "success")
		throw JSON.stringify(json);

	return json.data;
}

async function getCoin(id) {
	const response = await fetch(`https://api.coinranking.com/v1/public/coin/${id}`);
	const json = await response.json();

	if (json.status !== "success")
		throw JSON.stringify(json);

	return json.data;
}

async function getCoinsCount() {
	const list = await getCoinsList(1);
	return list.stats.total;
}

async function getTrending(limit = 100) {
	const list = await getCoinsList(limit);
	return list;
}

async function getUp(limit = 100) {
	const list = await getCoinsList(limit, 0, "change");
	return list;
}

async function getDown(limit = 100) {
	const list = await getCoinsList(limit, 0, "change", "asc");
	return list;
}

async function getRandomCoins(limit = 3) {
	if (limit <= 0) {
		return {
			stats: {},
			base: {},
			coins: []
		};
	}

	const coinsCount = await getCoinsCount();

	var promises = [];

	for (var i = 0; i < limit; i++) {
		const offset = Math.floor(Math.random() * coinsCount);
		promises.push(getCoinsList(1, offset));
	}

	const responses = await Promise.all(promises);

	var coins = [];
	var base = {};
	var stats = {
		limit: limit,
		offset: null,
		order: null
	};

	for (var i = 0; i < limit; i++) {
		for (var key in responses[i].base)
			if (!base.hasOwnProperty(key))
				base[key] = responses[i].base[key];

		for (var key in responses[i].stats)
			if (!stats.hasOwnProperty(key))
				stats[key] = responses[i].stats[key];

		coins.push(responses[i].coins[0]);
	}

	return { stats, base, coins };
}

function createCoinCard(coin) {
	const element = document.createElement("div");

	element.innerText = `Name: ${coin.name} – Symbol: ${coin.symbol}`; // TODO

	return element;
}

function fillCoins(element, coins) {
	for (var i in coins)
		element.appendChild(createCoinCard(coins[i]));
}
