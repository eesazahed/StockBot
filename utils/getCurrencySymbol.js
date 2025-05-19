const getCurrencySymbol = (toCurrency) => {
  const symbols = {
    USD: "$",
    CAD: "$",
    EUR: "€",
    JPY: "¥",
    GBP: "£",
    AUD: "$",
    CNY: "¥",
    INR: "₹",
    KRW: "₩",
    MXN: "$",
    BRL: "R$",
    RUB: "₽",
    ZAR: "R",
  };

  return symbols[toCurrency] || "";
};

module.exports = { getCurrencySymbol };
