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

// Add a function to get exchange rate information
export const getExchangeRateInfo = (fromCurrency, toCurrency) => {
  const fromRate = CURRENCIES[fromCurrency]?.exchangeRate || 1
  const toRate = CURRENCIES[toCurrency]?.exchangeRate || 1

  const rate = toRate / fromRate

  return {
    rate,
    formattedRate: rate.toFixed(4),
    lastUpdated: "2023-05-15", // This would be dynamic in a real application
    source: "Example Exchange Rate API", // This would be the actual source in a real application
  }
}

// Add a function to format currency with more options
export const formatCurrencyWithOptions = (amount, currencyCode = "USD", options = {}) => {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return ""
  }

  const currency = CURRENCIES[currencyCode] || CURRENCIES.USD

  // Default options
  const defaultOptions = {
    style: "currency",
    currency: currency.code,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    notation: options.compact ? "compact" : "standard",
    compactDisplay: "short",
  }

  // Merge options
  const mergedOptions = { ...defaultOptions, ...options }

  try {
    return new Intl.NumberFormat(currency.locale, mergedOptions).format(amount)
  } catch (error) {
    console.error("Error formatting currency:", error)
    return `${currency.symbol}${amount.toFixed(2)}`
  }
}

// Add a function to get currency information
export const getCurrencyInfo = (currencyCode) => {
  const currency = CURRENCIES[currencyCode] || CURRENCIES.USD

  return {
    ...currency,
    formattedExample: formatCurrency(1234.56, currencyCode),
    countries: getCountriesUsingCurrency(currencyCode),
  }
}

// Helper function to get countries using a specific currency
const getCountriesUsingCurrency = (currencyCode) => {
  switch (currencyCode) {
    case "USD":
      return ["United States", "Ecuador", "El Salvador", "Panama"]
    case "EUR":
      return [
        "Germany",
        "France",
        "Italy",
        "Spain",
        "Netherlands",
        "Belgium",
        "Austria",
        "Ireland",
        "Portugal",
        "Finland",
      ]
    case "GBP":
      return ["United Kingdom"]
    case "NGN":
      return ["Nigeria"]
    case "ZAR":
      return ["South Africa"]
    case "KES":
      return ["Kenya"]
    case "EGP":
      return ["Egypt"]
    case "MAD":
      return ["Morocco"]
    case "CHF":
      return ["Switzerland", "Liechtenstein"]
    case "SEK":
      return ["Sweden"]
    default:
      return []
  }
}

// Add a function to get the default currency for a country
export const getDefaultCurrencyForCountry = (countryCode) => {
  switch (countryCode) {
    case "US":
      return "USD"
    case "GB":
      return "GBP"
    case "CA":
      return "USD" // Canada uses CAD but we don't have it in our list
    case "AU":
      return "USD" // Australia uses AUD but we don't have it in our list
    case "DE":
    case "FR":
      return "EUR"
    case "JP":
      return "USD" // Japan uses JPY but we don't have it in our list
    case "CN":
      return "USD" // China uses CNY but we don't have it in our list
    case "IN":
      return "USD" // India uses INR but we don't have it in our list
    case "BR":
      return "USD" // Brazil uses BRL but we don't have it in our list
    case "NG":
      return "NGN"
    case "ZA":
      return "ZAR"
    case "KE":
      return "KES"
    case "EG":
      return "EGP"
    case "MA":
      return "MAD"
    case "GH":
      return "USD" // Ghana uses GHS but we don't have it in our list
    case "SN":
      return "USD" // Senegal uses XOF but we don't have it in our list
    case "MX":
      return "USD" // Mexico uses MXN but we don't have it in our list
    case "AR":
      return "USD" // Argentina uses ARS but we don't have it in our list
    default:
      return "USD"
  }
}

// Add a function to get historical exchange rates (mock data)
export const getHistoricalExchangeRates = (fromCurrency, toCurrency, days = 30) => {
  const rates = []
  const today = new Date()
  const baseRate = getExchangeRateInfo(fromCurrency, toCurrency).rate

  // Generate mock historical data
  for (let i = days; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)

    // Add some random fluctuation to the rate
    const fluctuation = (Math.random() - 0.5) * 0.05 // +/- 2.5%
    const rate = baseRate * (1 + fluctuation)

    rates.push({
      date: date.toISOString().split("T")[0],
      rate: rate,
    })
  }

  return rates
}
