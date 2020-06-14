(async function() {
	const sample = await getCoinsList();
	const form = document.querySelector("#convert-form");

	const first = sample.coins[0].symbol;
	sample.coins.sort((a, b) => a.symbol.localeCompare(b.symbol));

	const fromSelect = form['from-coin-select'], toSelect = form['to-coin-select'];
	const fromInput = form['from-coin'], toInput = form['to-coin'];
	const fromCustom = form['from-custom'], toCustom = form['to-custom'];
	const fromAmount = form['from-coin-amount'], toAmount = form.querySelector(".to-coin-amount");

	for (var i = 0; i < sample.coins.length; ++i) {
		const coin = sample.coins[i];

		const option = document.createElement("option");
		option.value = coin.symbol;
		option.innerText = coin.name.trim() !== coin.symbol ? `${coin.symbol} (${coin.name.trim()})` : coin.symbol;

		fromSelect.appendChild(option);
		toSelect.appendChild(option.cloneNode(true));
	}

	var cache = {};
	for (var i = 0; i < sample.coins.length; ++i) {
		const coin = sample.coins[i];
		cache[coin.symbol.toUpperCase()] = coin;
	}

	async function findCoin(symbol) {
		if (cache.hasOwnProperty(symbol.toUpperCase()))
			return cache[symbol.toUpperCase()];

		const searchResult = await searchCoinSymbol(symbol);
		const coin = searchResult.coins[0];
		cache[coin.symbol.toUpperCase()] = coin;
		return coin;
	}

	async function updateResult() {
		const fromCoinSymbol = fromInput.value, toCoinSymbol = toInput.value;
		const amount = parseFloat(fromAmount.value);

		if (fromCoinSymbol === toCoinSymbol) {
			toAmount.innerText = formatPrice(amount, "");
			toAmount.setAttribute("data-value", amount);
			return;
		}

		const [ fromCoin, toCoin ] = await Promise.all([findCoin(fromCoinSymbol), findCoin(toCoinSymbol)]);
		if (fromCoin === null) {
			alert(`No cryptocurrency or fiat found with the symbol "${fromCoinSymbol}".`)
			return;
		}

		if (toCoin === null) {
			alert(`No cryptocurrency or fiat found with the symbol "${toCoinSymbol}".`)
			return;
		}

		const fromPrice = parseFloat(fromCoin.price), toPrice = parseFloat(toCoin.price);
		const result = amount * fromPrice / toPrice;
		toAmount.innerText = formatPrice(result, "");
		toAmount.setAttribute("data-value", result);
	}

	fromAmount.addEventListener("change", updateResult);

	fromInput.addEventListener("change", function() {
		fromSelect.value = fromInput.value;
		updateResult();
	});

	toInput.addEventListener("change", function() {
		toSelect.value = toInput.value;
		updateResult();
	});

	fromSelect.addEventListener("change", function() {
		fromInput.value = fromSelect.value;
		updateResult();
	});

	toSelect.addEventListener("change", function() {
		toInput.value = toSelect.value;
		updateResult();
	});

	fromCustom.addEventListener("change", function() {
		if (!fromCustom.checked && !sample.coins.some((coin) => coin.symbol == fromInput.value)) {
			fromInput.value = first;
			fromInput.dispatchEvent(new CustomEvent("change"));
		}
	});

	toCustom.addEventListener("change", function() {
		if (!toCustom.checked && !sample.coins.some((coin) => coin.symbol == toInput.value)) {
			toInput.value = first;
			toInput.dispatchEvent(new CustomEvent("change"));
		}
	});

	fromSelect.value = first;
	toSelect.value = first;
	fromInput.value = first;
	toInput.value = first;
	await updateResult();

	document.querySelector("#invert-from-to").addEventListener("mouseup", function() {
		// Invert "custom"
		const fromCustom = form['from-custom'].checked;
		form['from-custom'].checked = form['to-custom'].checked;
		form['to-custom'].checked = fromCustom;

		// Invert currencies
		const fromCoinSymbol = fromInput.value;
		fromSelect.value = toSelect.value;
		fromInput.value = toInput.value;
		toSelect.value = fromCoinSymbol;
		toInput.value = fromCoinSymbol;

		// Invert amounts
		fromAmount.value = toAmount.getAttribute("data-value");
		updateResult();
	});

	document.querySelector("#loading").classList.add("hidden");
	document.querySelector("#content").classList.remove("hidden");
})().catch(console.error);
