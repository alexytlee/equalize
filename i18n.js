// Translation data
const translations = {
  en: {
    "hero.title.licensed": "Licensed",
    "hero.title.cryptoOTC": "Crypto OTC",
    "hero.title.trading": "Trading in Hong Kong",
    "hero.subtitle":
      "Equalize is a fully licensed crypto OTC desk operating in Hong Kong. We provide institutional-grade digital asset trading services with deep liquidity, competitive pricing, and regulatory compliance.",
    "cta.viewPrices": "View Live Market Prices",
    "nav.backToHome": "Back to Home",
    "prices.title": "Live Market Prices",
    "prices.subtitle":
      "Real-time pricing from 6 major exchanges • Updated every 30 seconds",
    "prices.lastUpdated": "Last Updated:",
    "prices.nextUpdate": "Next Update In:",
    "prices.disclaimer":
      "Prices are indicative and for reference only. For large OTC trades and institutional quotes, please contact our trading desk directly.",
    "table.asset": "Asset",
    "table.change": "24h Change",
    "asset.btc": "Bitcoin",
    "asset.eth": "Ethereum",
    "asset.sol": "Solana",
    "asset.usdt": "Tether",
    "asset.usdc": "USD Coin",
    "exchange.coingecko": "CoinGecko",
    "exchange.binance": "Binance",
    "exchange.coinbase": "Coinbase",
    "exchange.kraken": "Kraken",
    "exchange.bitfinex": "Bitfinex",
    "exchange.okx": "OKX",
  },
  "zh-TW": {
    "hero.title.licensed": "持牌",
    "hero.title.cryptoOTC": "加密貨幣場外交易",
    "hero.title.trading": "香港交易",
    "hero.subtitle":
      "Equalize 是一家在香港營運的持牌加密貨幣場外交易服務商。我們提供機構級數位資產交易服務，具有深度流動性、具競爭力的價格和符合監管要求。",
    "cta.viewPrices": "查看即時市場價格",
    "nav.backToHome": "返回首頁",
    "prices.title": "即時市場價格",
    "prices.subtitle": "來自 6 家主要交易所的即時報價 • 每 30 秒更新一次",
    "prices.lastUpdated": "最後更新：",
    "prices.nextUpdate": "下次更新：",
    "prices.disclaimer":
      "價格僅供參考。如需大宗場外交易和機構報價，請直接聯繫我們的交易台。",
    "table.asset": "資產",
    "table.change": "24小時漲跌",
    "asset.btc": "比特幣",
    "asset.eth": "以太坊",
    "asset.sol": "索拉納",
    "asset.usdt": "泰達幣",
    "asset.usdc": "美元穩定幣",
    "exchange.coingecko": "CoinGecko",
    "exchange.binance": "幣安",
    "exchange.coinbase": "Coinbase",
    "exchange.kraken": "Kraken",
    "exchange.bitfinex": "Bitfinex",
    "exchange.okx": "歐易",
  },
  "zh-CN": {
    "hero.title.licensed": "持牌",
    "hero.title.cryptoOTC": "加密货币场外交易",
    "hero.title.trading": "香港交易",
    "hero.subtitle":
      "Equalize 是一家在香港运营的持牌加密货币场外交易服务商。我们提供机构级数字资产交易服务，具有深度流动性、具竞争力的价格和符合监管要求。",
    "cta.viewPrices": "查看实时市场价格",
    "nav.backToHome": "返回首页",
    "prices.title": "实时市场价格",
    "prices.subtitle": "来自 6 家主要交易所的实时报价 • 每 30 秒更新一次",
    "prices.lastUpdated": "最后更新：",
    "prices.nextUpdate": "下次更新：",
    "prices.disclaimer":
      "价格仅供参考。如需大宗场外交易和机构报价，请直接联系我们的交易台。",
    "table.asset": "资产",
    "table.change": "24小时涨跌",
    "asset.btc": "比特币",
    "asset.eth": "以太坊",
    "asset.sol": "索拉纳",
    "asset.usdt": "泰达币",
    "asset.usdc": "美元稳定币",
    "exchange.coingecko": "CoinGecko",
    "exchange.binance": "币安",
    "exchange.coinbase": "Coinbase",
    "exchange.kraken": "Kraken",
    "exchange.bitfinex": "Bitfinex",
    "exchange.okx": "欧易",
  },
};

// Get current language from localStorage or default to 'en'
let currentLang = localStorage.getItem("language") || "en";

// Function to update page text with smooth transitions
function updatePageLanguage(lang) {
  currentLang = lang;
  localStorage.setItem("language", lang);

  // Add transitioning class to elements for fade effect
  const transitionElements = document.querySelectorAll(
    "[data-i18n], .hero-logo"
  );
  transitionElements.forEach((el) => el.classList.add("transitioning"));

  // Wait for fade out, then update content
  setTimeout(() => {
    // Update all elements with data-i18n attribute
    document.querySelectorAll("[data-i18n]").forEach((element) => {
      const key = element.getAttribute("data-i18n");
      if (translations[lang] && translations[lang][key]) {
        element.textContent = translations[lang][key];
      }
    });

    // Update logo based on language with smooth transition
    const logoImg = document.querySelector(".hero-logo");
    if (logoImg) {
      logoImg.classList.add("changing");

      setTimeout(() => {
        if (lang === "zh-TW" || lang === "zh-CN") {
          logoImg.src = "img/equalize-cn.png";
        } else {
          logoImg.src = "img/equalize3.png";
        }

        // Remove changing class after image loads
        logoImg.onload = () => {
          logoImg.classList.remove("changing");
        };
      }, 200);
    }

    // Remove transitioning class to fade back in
    setTimeout(() => {
      transitionElements.forEach((el) => el.classList.remove("transitioning"));
    }, 200);
  }, 150);

  // Update active button
  document.querySelectorAll(".lang-btn").forEach((btn) => {
    btn.classList.remove("active");
    if (btn.getAttribute("data-lang") === lang) {
      btn.classList.add("active");
    }
  });
}

// Initialize language on page load
document.addEventListener("DOMContentLoaded", () => {
  updatePageLanguage(currentLang);

  // Add click handlers to language buttons
  document.querySelectorAll(".lang-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const lang = btn.getAttribute("data-lang");
      updatePageLanguage(lang);
    });
  });
});
