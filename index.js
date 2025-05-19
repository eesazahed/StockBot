const dotenv = require("dotenv");
dotenv.config();

const { App } = require("@slack/bolt");
const { fetchStockData } = require("./utils/fetchStockData");
const { getCurrencySymbol } = require("./utils/getCurrencySymbol");

const app = new App({
  token: process.env.SLACK_BOT_TOKEN || "",
  signingSecret: process.env.SLACK_SIGNING_SECRET || "",
  socketMode: true,
  appToken: process.env.SLACK_APP_TOKEN || "",
  port: Number(process.env.PORT) || 3000,
});

app.command("/stock", async ({ command, ack, respond }) => {
  await ack();

  let symbol;
  let toCurrency = "USD";

  if (command.text.split(" ")[0]) {
    symbol = command.text.split(" ")[0].trim().toUpperCase();
  }

  if (!symbol) {
    return await respond(
      "Please provide a valid stock symbol.\n\nExample: `/stock AAPL`"
    );
  }

  if (command.text.split(" ")[1]) {
    toCurrency = command.text.split(" ")[1].trim().toUpperCase();
  }

  const stockData = await fetchStockData({
    symbol,
    toCurrency,
  });
  if (!stockData.success) {
    return await respond(stockData.message);
  }

  const price = Number(stockData.price).toFixed(2);
  const change = Number(stockData.change);
  const percentChange = Number(stockData.percentChange);
  const isMarketOpen = Boolean(stockData.isMarketOpen);

  const isStockUp = change >= 0;
  const plusMinus = isStockUp ? "+" : "-";
  const currencySymbol = getCurrencySymbol(toCurrency);

  return await respond(`
    \n:tw_office: *Symbol:* \`${symbol}\`
    \n:tw_dollar: *Price:* \`${currencySymbol}${price}\`
    \n${
      isStockUp ? ":tw_arrow_up:" : ":tw_arrow_down:"
    } *Change:* \`${plusMinus}${currencySymbol}${Math.abs(change).toFixed(
    2
  )} (${Math.abs(percentChange).toFixed(2)}%)\`
    \n${isMarketOpen ? ":tw_white_check_mark:" : ":tw_no_entry:"} Market is \`${
    isMarketOpen ? "OPEN" : "CLOSED"
  }\`
    \n
    \n<https://finance.yahoo.com/quote/${symbol}/|View Chart>
  `);
});

app.command("/crypto", async ({ command, ack, respond }) => {
  await ack();

  let symbol;
  let toCurrency = "USD";

  if (command.text.split(" ")[0]) {
    symbol = command.text.split(" ")[0].trim().toUpperCase();
  }

  if (!symbol) {
    return await respond(
      "Please provide a valid crypto symbol.\n\nExample: `/crypto BTC`"
    );
  }

  if (command.text.split(" ")[1]) {
    toCurrency = command.text.split(" ")[1].trim().toUpperCase();
  }

  const cryptoData = await fetchStockData({
    symbol,
    toCurrency,
    crypto: "true",
  });
  if (!cryptoData.success) {
    return await respond(cryptoData.message);
  }

  const price = Number(cryptoData.price).toFixed(2);
  const change = Number(cryptoData.change);
  const percentChange = Number(cryptoData.percentChange);
  const isMarketOpen = Boolean(cryptoData.isMarketOpen);

  const isCryptoUp = change >= 0;
  const plusMinus = isCryptoUp ? "+" : "-";
  const currencySymbol = getCurrencySymbol(toCurrency);

  return await respond(`
    \n:tw_office: *Symbol:* \`${symbol}\`
    \n:tw_dollar: *Price:* \`${currencySymbol}${price}\`
    \n${
      isCryptoUp ? ":tw_arrow_up:" : ":tw_arrow_down:"
    } *Change:* \`${plusMinus}${currencySymbol}${Math.abs(change).toFixed(
    2
  )} (${Math.abs(percentChange).toFixed(2)}%)\`
    \n${isMarketOpen ? ":tw_white_check_mark:" : ":tw_no_entry:"} Market is \`${
    isMarketOpen ? "OPEN" : "CLOSED"
  }\`
    \n
    \n<https://finance.yahoo.com/quote/${symbol}-USD/|View Chart>
  `);
});

(async () => {
  await app.start();

  app.logger.info("⚡️ Bolt app is running!");
})();
