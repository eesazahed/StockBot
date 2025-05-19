const convertCurrency = async (fromCurrency, toCurrency) => {
  let rate = null;

  try {
    const url = `https://api.twelvedata.com/exchange_rate?symbol=${fromCurrency}/${toCurrency}`;

    const response = await fetch(url, {
      headers: {
        Authorization: `apikey ${process.env.STOCK_API_KEY || ""}`,
      },
    });

    const data = await response.json();
    rate = parseFloat(data.rate);
    return { rate };
  } catch (error) {
    return { rate };
  }
};

module.exports = { convertCurrency };
