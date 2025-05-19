const { convertCurrency } = require("./convertCurrency");

const fetchStockData = async (options) => {
  try {
    const url = `https://api.twelvedata.com/quote?symbol=${options.symbol}${
      options.crypto ? "/USD" : ""
    }`;

    const response = await fetch(url, {
      headers: {
        Authorization: `apikey ${process.env.STOCK_API_KEY || ""}`,
      },
    });

    const data = await response.json();

    const example = options.crypto ? "/crypto BTC" : "/stock AAPL";

    if (!data.symbol) {
      return {
        message: `Unable to fetch symbol :(\n\nExample: \`${example}\``,
        success: false,
      };
    }

    let price = parseFloat(data.close || "0");
    let change = parseFloat(data.change || "0");
    const percentChange = parseFloat(data.percent_change || "0");
    const isMarketOpen = data.is_market_open || false;

    if (options.toCurrency && options.toCurrency !== "USD") {
      const fromCurrency = "USD";
      const exchangeRate = await convertCurrency(
        fromCurrency,
        options.toCurrency
      );
      if (!exchangeRate.rate) {
        return {
          message: `Currency conversion failed :(\n\nExample: \`${example} CAD\``,
          success: false,
        };
      }

      const rate = exchangeRate.rate;

      price = price * rate;
      change = change * rate;
    }

    return {
      message: "Retrieved stock price",
      success: true,
      price,
      change,
      percentChange,
      isMarketOpen,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return { message: `Error: ${message}`, success: false };
  }
};

module.exports = { fetchStockData };
