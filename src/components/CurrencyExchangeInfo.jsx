"use client"

import { useState } from "react"
import { useCurrency } from "../contexts/CurrencyContext"
import { getExchangeRateInfo, formatCurrency, CURRENCIES } from "../utils/currencyUtils"
import "./CurrencyExchangeInfo.css"

const CurrencyExchangeInfo = ({ className = "" }) => {
  const { currency } = useCurrency()
  const [showAllRates, setShowAllRates] = useState(false)
  const [baseCurrency, setBaseCurrency] = useState("USD")

  // Get exchange rates for the current currency
  const getExchangeRates = () => {
    if (currency === baseCurrency) {
      return Object.keys(CURRENCIES)
        .filter((code) => code !== baseCurrency)
        .map((code) => ({
          code,
          name: CURRENCIES[code].name,
          symbol: CURRENCIES[code].symbol,
          rate: getExchangeRateInfo(baseCurrency, code).rate,
        }))
    } else {
      return Object.keys(CURRENCIES)
        .filter((code) => code !== currency)
        .map((code) => ({
          code,
          name: CURRENCIES[code].name,
          symbol: CURRENCIES[code].symbol,
          rate: getExchangeRateInfo(currency, code).rate,
        }))
    }
  }

  const rates = getExchangeRates()
  const displayRates = showAllRates ? rates : rates.slice(0, 5)

  const toggleBaseCurrency = () => {
    setBaseCurrency(baseCurrency === "USD" ? currency : "USD")
  }

  return (
    <div className={`currency-exchange-info ${className}`}>
      <div className="exchange-info-header">
        <h3>Exchange Rate Information</h3>
        <div className="base-currency-toggle">
          <span>Base: </span>
          <button
            className={`base-currency-button ${baseCurrency === "USD" ? "active" : ""}`}
            onClick={() => setBaseCurrency("USD")}
          >
            USD
          </button>
          <button
            className={`base-currency-button ${baseCurrency === currency ? "active" : ""}`}
            onClick={() => setBaseCurrency(currency)}
          >
            {currency}
          </button>
        </div>
      </div>

      <div className="exchange-rate-display">
        <div className="current-rate">
          <span className="rate-label">1 {baseCurrency} =</span>
          <span className="rate-value">
            {formatCurrency(
              getExchangeRateInfo(baseCurrency, baseCurrency === "USD" ? currency : "USD").rate,
              baseCurrency === "USD" ? currency : "USD",
              { minimumFractionDigits: 4, maximumFractionDigits: 4, style: "decimal" },
            )}{" "}
            {baseCurrency === "USD" ? currency : "USD"}
          </span>
        </div>

        <div className="rate-updated">
          <span>Last updated: May 15, 2023</span>
          <span className="rate-source">Source: Example Exchange Rate API</span>
        </div>
      </div>

      <div className="exchange-rates-list">
        <h4>{baseCurrency === "USD" ? `1 USD in Other Currencies` : `1 ${currency} in Other Currencies`}</h4>
        <div className="rates-grid">
          {displayRates.map((rate) => (
            <div key={rate.code} className="rate-item">
              <div className="rate-currency">
                <span className="rate-symbol">{rate.symbol}</span>
                <span className="rate-code">{rate.code}</span>
              </div>
              <div className="rate-amount">
                {formatCurrency(rate.rate, rate.code, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 4,
                  style: "decimal",
                })}
              </div>
            </div>
          ))}
        </div>
        {rates.length > 5 && (
          <button className="show-more-button" onClick={() => setShowAllRates(!showAllRates)}>
            {showAllRates ? "Show Less" : `Show ${rates.length - 5} More`}
          </button>
        )}
      </div>

      <div className="exchange-rate-disclaimer">
        <p>
          <strong>Note:</strong> Exchange rates are for demonstration purposes only. In a production environment, these
          would be updated regularly from an external API.
        </p>
      </div>
    </div>
  )
}

export default CurrencyExchangeInfo
