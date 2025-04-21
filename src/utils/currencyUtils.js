// List of supported currencies with their symbols, codes, and exchange rates (relative to USD)
export const CURRENCIES = {
  USD: {
    code: "USD",
    symbol: "$",
    name: "US Dollar",
    exchangeRate: 1,
    locale: "en-US",
    region: "North America",
  },
  EUR: {
    code: "EUR",
    symbol: "€",
    name: "Euro",
    exchangeRate: 0.92, // Example rate
    locale: "de-DE",
    region: "Europe",
  },
  GBP: {
    code: "GBP",
    symbol: "£",
    name: "British Pound",
    exchangeRate: 0.79, // Example rate
    locale: "en-GB",
    region: "Europe",
  },
  NGN: {
    code: "NGN",
    symbol: "₦",
    name: "Nigerian Naira",
    exchangeRate: 1550, // Example rate
    locale: "en-NG",
    region: "Africa",
  },
  ZAR: {
    code: "ZAR",
    symbol: "R",
    name: "South African Rand",
    exchangeRate: 18.5, // Example rate
    locale: "en-ZA",
    region: "Africa",
  },
  KES: {
    code: "KES",
    symbol: "KSh",
    name: "Kenyan Shilling",
    exchangeRate: 130, // Example rate
    locale: "en-KE",
    region: "Africa",
  },
  EGP: {
    code: "EGP",
    symbol: "E£",
    name: "Egyptian Pound",
    exchangeRate: 48, // Example rate
    locale: "ar-EG",
    region: "Africa",
  },
  MAD: {
    code: "MAD",
    symbol: "DH",
    name: "Moroccan Dirham",
    exchangeRate: 10, // Example rate
    locale: "ar-MA",
    region: "Africa",
  },
  CHF: {
    code: "CHF",
    symbol: "CHF",
    name: "Swiss Franc",
    exchangeRate: 0.88, // Example rate
    locale: "de-CH",
    region: "Europe",
  },
  SEK: {
    code: "SEK",
    symbol: "kr",
    name: "Swedish Krona",
    exchangeRate: 10.5, // Example rate
    locale: "sv-SE",
    region: "Europe",
  },
}

// Group currencies by region
export const CURRENCY_GROUPS = Object.values(CURRENCIES).reduce((groups, currency) => {
  if (!groups[currency.region]) {
    groups[currency.region] = []
  }
  groups[currency.region].push(currency)
  return groups
}, {})

/**
 * Format a number as currency
 * @param {number} amount - The amount to format
 * @param {string} currencyCode - The currency code (USD, EUR, etc.)
 * @param {object} options - Formatting options
 * @returns {string} - Formatted currency string
 */
export const formatCurrency = (amount, currencyCode = "USD", options = {}) => {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return ""
  }

  const currency = CURRENCIES[currencyCode] || CURRENCIES.USD

  try {
    return new Intl.NumberFormat(currency.locale, {
      style: "currency",
      currency: currency.code,
      minimumFractionDigits: options.minimumFractionDigits !== undefined ? options.minimumFractionDigits : 2,
      maximumFractionDigits: options.maximumFractionDigits !== undefined ? options.maximumFractionDigits : 2,
      ...options,
    }).format(amount)
  } catch (error) {
    console.error("Error formatting currency:", error)
    return `${currency.symbol}${amount.toFixed(2)}`
  }
}

/**
 * Convert an amount from one currency to another
 * @param {number} amount - The amount to convert
 * @param {string} fromCurrency - Source currency code
 * @param {string} toCurrency - Target currency code
 * @returns {number} - Converted amount
 */
export const convertCurrency = (amount, fromCurrency = "USD", toCurrency = "USD") => {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return 0
  }

  const sourceCurrency = CURRENCIES[fromCurrency] || CURRENCIES.USD
  const targetCurrency = CURRENCIES[toCurrency] || CURRENCIES.USD

  // Convert to USD first (as base currency), then to target currency
  const amountInUSD = amount / sourceCurrency.exchangeRate
  return amountInUSD * targetCurrency.exchangeRate
}

/**
 * Parse a currency string into a number
 * @param {string} currencyString - The currency string to parse
 * @returns {number} - Parsed number
 */
export const parseCurrencyInput = (currencyString) => {
  if (!currencyString) return ""

  // Remove currency symbols, spaces, and commas
  const cleanedString = currencyString.replace(/[^\d.-]/g, "")

  // Parse as float
  const value = Number.parseFloat(cleanedString)
  return isNaN(value) ? "" : value
}
