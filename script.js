// References to HTML elements on the page
let basecurrency = document.getElementById("base-currency");
let targetCurrency = document.getElementById("target-currency");
let amountInput = document.getElementById("amount");
let convertedAmount = document.getElementById("converted-amount");
let historicalRates = document.getElementById("historical-rates");
let historicalRatesContainer = document.getElementById("historical-rates-container");
let saveFavorite = document.getElementById("save-favorite");
let favoriteCurrencyPairs = document.getElementById("favorite-currency-pairs");
let date1 = document.getElementById("date1");
let historicalRatesFirst = document.getElementById("historical-rates-first");

// Set up headers and options for API requests
const myHeaders = new Headers();
myHeaders.append("apikey", "IuXBdwySmO3UZ2ICFbxCUsjdfStJCSfL");

const requestOptions = {
  method: "GET",
  redirect: "follow",
  headers: myHeaders,
};

// Fetch the currencies and populate the dropdown menus
function fetchAvailableCurrencies() {
  fetch("https://api.apilayer.com/exchangerates_data/symbols", requestOptions)
    .then((response) => response.json())
    .then((result) => {
      populateCurrencyDropdowns(result.symbols);
    })
    .catch((error) => console.log("error", error));
}

function populateCurrencyDropdowns(symbols) {
  for (const currencyCode in symbols) {
    const option = document.createElement("option");
    option.value = currencyCode;
    option.text = `${currencyCode} - ${symbols[currencyCode]}`;

    basecurrency.add(option.cloneNode(true));
    targetCurrency.add(option);
  }
}

// Convert the currency based on the user's inputs using API
function convertCurrency() {
  const from = basecurrency.value;
  const to = targetCurrency.value;
  const amount = amountInput.value;

  const url = `https://api.apilayer.com/exchangerates_data/convert?from=${from}&to=${to}&amount=${amount}`;

  fetch(url, requestOptions)
    .then((response) => response.json())
    .then((result) => {
      if (result.success) {
        convertedAmount.textContent = result.result.toFixed(2);
      } else {
        console.error("Conversion error", result.error);
      }
    })
    .catch((error) => console.log("error", error));
}

// Fetch historical exchange rates for the specified dates and currencies
function fetchHistoricalRates() {
  const from = basecurrency.value;
  const to = targetCurrency.value;

  const url1 = `https://api.apilayer.com/exchangerates_data/${date1.value}?symbols=${to}&base=${from}`;

  fetch(url1, requestOptions)
    .then((response) => response.json())
    .then((result1) => {
      if (result1.success) {
        historicalRatesFirst.textContent = ` 1 ${from} = ${result1.rates[to]} ${to}`;
      } else {
        console.error("Historical rates error", result1.error);
      }
    })
    .catch((error) => console.log("error", error));
}

// Save the user's favorite currency pair to local storage and display a button for it
let favorites = [];

function saveFavoriteCurrencyPair() {
  const from = basecurrency.value;
  const to = targetCurrency.value;
  const favorite = `${from}_${to}`;
  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

  if (!favorites.includes(favorite)) {
    favorites.push(favorite);
    localStorage.setItem("favorites", JSON.stringify(favorites));

    const button = document.createElement("button");
    button.textContent = `${from} to ${to}`;
    button.dataset.from = from;
    button.dataset.to = to;
    button.addEventListener("click", () => {
      basecurrency.value = button.dataset.from;
      targetCurrency.value = button.dataset.to;
      convertCurrency();
    });

    favoriteCurrencyPairs.appendChild(button);
  }
}

//Event Listeners
saveFavorite.addEventListener("click", saveFavoriteCurrencyPair);

document.addEventListener("DOMContentLoaded", function () {
  fetchAvailableCurrencies();
});

amount.addEventListener("input", convertCurrency);
basecurrency.addEventListener("change", convertCurrency);
targetCurrency.addEventListener("change", convertCurrency);
historicalRates.addEventListener("click", fetchHistoricalRates);
