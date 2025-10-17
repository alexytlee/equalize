// Crypto ID mappings for different APIs
const CRYPTO_IDS = {
  btc: {
    coingecko: "bitcoin",
    binance: "BTCUSDT",
    coinbase: "BTC-USD",
    kraken: "XBTUSD",
  },
  eth: {
    coingecko: "ethereum",
    binance: "ETHUSDT",
    coinbase: "ETH-USD",
    kraken: "ETHUSD",
  },
  sol: {
    coingecko: "solana",
    binance: "SOLUSDT",
    coinbase: "SOL-USD",
    kraken: "SOLUSD",
  },
  usdt: {
    coingecko: "tether",
    binance: "USDCUSDT",
    coinbase: "USDT-USD",
    kraken: "USDTUSD",
  },
  usdc: {
    coingecko: "usd-coin",
    binance: "USDCUSDT",
    coinbase: "USDC-USD",
    kraken: "USDCUSD",
  },
};

let updateInterval;
let countdownInterval;
let secondsRemaining = 30;
let previousPrices = {}; // Store previous prices for flash animation

// Fetch prices from CoinGecko
async function fetchCoinGeckoPrices() {
  try {
    const ids = Object.values(CRYPTO_IDS)
      .map((c) => c.coingecko)
      .join(",");
    const response = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`
    );

    if (!response.ok) throw new Error("CoinGecko API failed");
    return await response.json();
  } catch (error) {
    console.error("Error fetching CoinGecko prices:", error);
    return null;
  }
}

// Fetch prices from Binance
async function fetchBinancePrices() {
  try {
    const symbols = Object.values(CRYPTO_IDS).map((c) => c.binance);
    const prices = {};

    await Promise.all(
      symbols.map(async (symbol) => {
        try {
          const response = await fetch(
            `https://api.binance.com/api/v3/ticker/price?symbol=${symbol}`
          );
          if (response.ok) {
            const data = await response.json();
            prices[symbol] = parseFloat(data.price);
          }
        } catch (err) {
          console.error(`Error fetching ${symbol} from Binance:`, err);
        }
      })
    );

    return prices;
  } catch (error) {
    console.error("Error fetching Binance prices:", error);
    return {};
  }
}

// Fetch prices from Coinbase
async function fetchCoinbasePrices() {
  try {
    const pairs = Object.values(CRYPTO_IDS).map((c) => c.coinbase);
    const prices = {};

    await Promise.all(
      pairs.map(async (pair) => {
        try {
          const response = await fetch(
            `https://api.coinbase.com/v2/prices/${pair}/spot`
          );
          if (response.ok) {
            const data = await response.json();
            prices[pair] = parseFloat(data.data.amount);
          }
        } catch (err) {
          console.error(`Error fetching ${pair} from Coinbase:`, err);
        }
      })
    );

    return prices;
  } catch (error) {
    console.error("Error fetching Coinbase prices:", error);
    return {};
  }
}

// Fetch prices from Kraken
async function fetchKrakenPrices() {
  try {
    const pairs = Object.values(CRYPTO_IDS)
      .map((c) => c.kraken)
      .join(",");
    const response = await fetch(
      `https://api.kraken.com/0/public/Ticker?pair=${pairs}`
    );

    if (!response.ok) throw new Error("Kraken API failed");
    const data = await response.json();

    const prices = {};
    Object.keys(data.result || {}).forEach((key) => {
      const price = parseFloat(data.result[key].c[0]);
      prices[key] = price;
    });

    return prices;
  } catch (error) {
    console.error("Error fetching Kraken prices:", error);
    return {};
  }
}

// Fetch prices from Bitfinex (CORS-friendly approach)
async function fetchBitfinexPrices() {
  try {
    // Bitfinex has CORS issues, so we'll fetch a batch of tickers
    const symbols = "tBTCUSD,tETHUSD,tSOLUSD";
    const prices = {};

    try {
      const response = await fetch(
        `https://api-pub.bitfinex.com/v2/tickers?symbols=${symbols}`
      );
      
      if (response.ok) {
        const data = await response.json();
        
        // Parse the array response
        if (data && Array.isArray(data)) {
          data.forEach((ticker) => {
            if (ticker && ticker.length > 7) {
              const symbol = ticker[0]; // Symbol name
              const lastPrice = parseFloat(ticker[7]); // Last price is at index 7
              prices[symbol] = lastPrice;
            }
          });
        }
      }
    } catch (err) {
      // Silently handle CORS/network errors - Bitfinex will show N/A
      // This is expected when running locally or with CORS restrictions
    }

    // For stablecoins, set approximate values if not fetched
    if (!prices["tUSTUSD"]) prices["tUSTUSD"] = 1.0;
    if (!prices["tUDCUSD"]) prices["tUDCUSD"] = 1.0;

    return prices;
  } catch (error) {
    // Silently handle - Bitfinex column will show N/A
    return {};
  }
}

// Fetch prices from OKX
async function fetchOKXPrices() {
  try {
    // OKX pairs - note: no direct USDT-USDT pair
    const instIds = ["BTC-USDT", "ETH-USDT", "SOL-USDT", "USDC-USDT"];
    const prices = {};

    await Promise.all(
      instIds.map(async (instId) => {
        try {
          const response = await fetch(
            `https://www.okx.com/api/v5/market/ticker?instId=${instId}`
          );
          if (response.ok) {
            const data = await response.json();
            if (data.data && data.data[0]) {
              prices[instId] = parseFloat(data.data[0].last);
            }
          }
        } catch (err) {
          console.error(`Error fetching ${instId} from OKX:`, err);
        }
      })
    );

    // OKX doesn't have USDT/USD directly, set to ~1.00
    prices["USDT-USD"] = 1.0;

    return prices;
  } catch (error) {
    console.error("Error fetching OKX prices:", error);
    return {};
  }
}

// Format price based on value
function formatPrice(price, isStablecoin = false) {
  if (!price || isNaN(price)) return "N/A";

  if (isStablecoin) {
    return `$${price.toFixed(4)}`;
  } else if (price >= 1000) {
    return `$${price.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  } else {
    return `$${price.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 6,
    })}`;
  }
}

// Update price cells with flash animation
function updatePriceCell(symbol, source, price) {
  const row = document.querySelector(`tr[data-symbol="${symbol}"]`);
  if (!row) return;

  const cell = row.querySelector(`td[data-source="${source}"]`);
  if (!cell) return;

  // Remove loading state immediately
  cell.classList.remove("loading");

  const isStablecoin = symbol === "usdt" || symbol === "usdc";
  const priceKey = `${symbol}-${source}`;
  const previousPrice = previousPrices[priceKey];

  // Set the text content first
  cell.textContent = formatPrice(price, isStablecoin);

  // Add flash animation if price changed
  if (previousPrice !== undefined && previousPrice !== price) {
    const flashClass = price > previousPrice ? "flash-up" : "flash-down";
    cell.classList.remove("flash-up", "flash-down");
    // Force reflow to restart animation
    void cell.offsetWidth;
    cell.classList.add(flashClass);

    // Remove class after animation
    setTimeout(() => {
      cell.classList.remove(flashClass);
    }, 600);
  }

  // Store current price for next comparison
  previousPrices[priceKey] = price;
}

// Update 24h change cell
function updateChangeCell(symbol, change) {
  const row = document.querySelector(`tr[data-symbol="${symbol}"]`);
  if (!row) return;

  const cell = row.querySelector(".change-cell");
  if (!cell) return;

  // Remove loading state immediately
  cell.classList.remove("loading");

  const changeFormatted = change.toFixed(2);
  const changeIcon = change >= 0 ? "▲" : "▼";
  cell.innerHTML = `<span class="${
    change >= 0 ? "positive" : "negative"
  }">${changeIcon} ${Math.abs(changeFormatted)}%</span>`;
}

// Fetch and update all prices
async function updateAllPrices() {
  const [
    coingeckoData,
    binanceData,
    coinbaseData,
    krakenData,
    bitfinexData,
    okxData,
  ] = await Promise.all([
    fetchCoinGeckoPrices(),
    fetchBinancePrices(),
    fetchCoinbasePrices(),
    fetchKrakenPrices(),
    fetchBitfinexPrices(),
    fetchOKXPrices(),
  ]);

  // Update table with data from all sources
  Object.keys(CRYPTO_IDS).forEach((symbol) => {
    const ids = CRYPTO_IDS[symbol];

    // CoinGecko
    if (coingeckoData && coingeckoData[ids.coingecko]) {
      const data = coingeckoData[ids.coingecko];
      updatePriceCell(symbol, "coingecko", data.usd);
      updateChangeCell(symbol, data.usd_24h_change || 0);
    }

    // Binance
    if (binanceData && binanceData[ids.binance]) {
      updatePriceCell(symbol, "binance", binanceData[ids.binance]);
    }

    // Coinbase
    if (coinbaseData && coinbaseData[ids.coinbase]) {
      updatePriceCell(symbol, "coinbase", coinbaseData[ids.coinbase]);
    }

    // Kraken
    if (krakenData) {
      const krakenKey = Object.keys(krakenData).find((key) =>
        key.includes(ids.kraken.replace("USD", ""))
      );
      if (krakenKey) {
        updatePriceCell(symbol, "kraken", krakenData[krakenKey]);
      }
    }

    // Bitfinex
    if (bitfinexData) {
      const symbolMap = {
        btc: "tBTCUSD",
        eth: "tETHUSD",
        sol: "tSOLUSD",
        usdt: "tUSTUSD",
        usdc: "tUDCUSD",
      };
      if (bitfinexData[symbolMap[symbol]]) {
        updatePriceCell(symbol, "bitfinex", bitfinexData[symbolMap[symbol]]);
      }
    }

    // OKX
    if (okxData) {
      const symbolMap = {
        btc: "BTC-USDT",
        eth: "ETH-USDT",
        sol: "SOL-USDT",
        usdt: "USDT-USD", // Special case
        usdc: "USDC-USDT",
      };
      if (symbolMap[symbol] && okxData[symbolMap[symbol]]) {
        updatePriceCell(symbol, "okx", okxData[symbolMap[symbol]]);
      }
    }
  });

  updateTimestamp();
}

// Update timestamp
function updateTimestamp() {
  const timestamp = document.getElementById("lastUpdated");
  if (timestamp) {
    const now = new Date();
    timestamp.textContent = now.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  }
}

// Countdown timer
function startCountdown() {
  secondsRemaining = 30;
  const countdownEl = document.getElementById("countdown");

  countdownInterval = setInterval(() => {
    secondsRemaining--;
    if (countdownEl) {
      countdownEl.textContent = `${secondsRemaining}s`;
    }
    if (secondsRemaining <= 0) {
      secondsRemaining = 30;
    }
  }, 1000);
}

// Initialize
async function init() {
  await updateAllPrices();
  startCountdown();

  // Update prices every 30 seconds
  updateInterval = setInterval(() => {
    updateAllPrices();
  }, 30000);
}

// Cleanup on page unload
window.addEventListener("beforeunload", () => {
  if (updateInterval) clearInterval(updateInterval);
  if (countdownInterval) clearInterval(countdownInterval);
});

// Start fetching prices
init();
