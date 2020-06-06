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

	// {
	// 	"id": 1,
	// 	"slug": "bitcoin-btc",
	// 	"symbol": "BTC",
	// 	"name": "Bitcoin",
	// 	"description": "Bitcoin is the first decentralized digital currency.",
	// 	"color": "#f7931A",
	// 	"iconType": "vector",
	// 	"iconUrl": "https://cdn.coinranking.com/Sy33Krudb/btc.svg",
	// 	"websiteUrl": "https://bitcoin.org",
	// 	"socials": [
	// 		{
	//	 		"name": "Bitcoin",
	//	 		"url": "https://www.reddit.com/r/Bitcoin/",
	//	 		"type": "reddit"
	// 		}
	// 	],
	// 	"confirmedSupply": true,
	// 	"type": "coin",
	// 	"volume": 6818750000,
	// 	"marketCap": 159393904304,
	// 	"price": "9370.9993109108",
	// 	"circulatingSupply": 17009275,
	// 	"totalSupply": 21000000,
	// 	"firstSeen": 1330214400000,
	// 	"change": -0.52,
	// 	"rank": 1,
	// 	"numberOfMarkets": 9800,
	// 	"numberOfExchanges": 190,
	// 	"history": [
	// 		"9515.0454185372",
	// 		"9540.1812284677",
	// 		"9554.2212643043",
	// 		"9593.571539283",
	// 		"9592.8596962985",
	// 		"9562.5310295967",
	// 		"9556.7860427046",
	// 		"9388.823394515",
	// 		"9335.3004209165",
	// 		"9329.4331700521",
	// 		"9370.9993109108"
	// 	],
	// 	"allTimeHigh": {
	// 		"price": "19500.471361532",
	// 		"timestamp": 1513555200000
	// 	},
	// 	"penalty": false
	// }

	element.innerText = `Name: ${coin.name} – Symbol: ${coin.symbol}`; // TODO

	return element;
}

function fillCoins(element, coins) {
	for (var i in coins)
		element.appendChild(createCoinCard(coins[i]));
}
