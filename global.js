async function getCoinsCount() {
	const response = await fetch(`https://api.coinranking.com/v1/public/coins?limit=1`);
	const json = await response.json();

	if (json.status !== "success")
		throw JSON.stringify(json);

	return json.data.stats.total;
}

async function getCoin(id) {
	if (Array.isArray(id))
		id = id.join(",");

	const response = await fetch(`https://api.coinranking.com/v1/public/coin/${id}`);
	const json = await response.json();

	if (json.status !== "success")
		throw JSON.stringify(json);

	return json.data;
}

async function getUp(number = 100) {
	if (number <= 0) {
		return {
			stats: {},
			base: {},
			coins: []
		};
	}

	const response = await fetch(`https://api.coinranking.com/v1/public/coins?sort=change&order=desc&limit=${number}`);
	const json = await response.json();

	if (json.status !== "success")
		throw JSON.stringify(json);

	return json.data;
}

async function getDown(number = 100) {
	if (number <= 0) {
		return {
			stats: {},
			base: {},
			coins: []
		};
	}

	const response = await fetch(`https://api.coinranking.com/v1/public/coins?sort=change&order=asc&limit=${number}`);
	const json = await response.json();

	if (json.status !== "success")
		throw JSON.stringify(json);

	return json.data;
}

async function getRandomCoins(number = 3) {
	if (number <= 0) {
		return {
			stats: {},
			base: {},
			coins: []
		};
	}

	const coinsCount = await getCoinsCount();

	var promises = [];

	for (var i = 0; i < number; i++) {
		const offset = Math.floor(Math.random() * coinsCount);
		promises.push(fetch(`https://api.coinranking.com/v1/public/coins?offset=${offset}&limit=1`).then(response => response.json()));
	}

	const responses = await Promise.all(promises);

	var coins = [];
	var base = {};
	var stats = {
		limit: number,
		offset: null,
		order: null
	};

	for (var i = 0; i < number; i++) {
		if (responses[i].status !== "success")
			throw JSON.stringify(responses[i]);

		for (var key in responses[i].data.base)
			if (!base.hasOwnProperty(key))
				base[key] = responses[i].data.base[key];

		for (var key in responses[i].data.stats)
			if (!stats.hasOwnProperty(key))
				stats[key] = responses[i].data.stats[key];

		coins.push(responses[i].data.coins[0]);
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
