"use client"

import { useState } from "react"
import { useCurrency } from "../contexts/CurrencyContext"
import { CURRENCY_GROUPS } from "../utils/currencyUtils"

const CurrencySelector = ({ className = "", compact = false }) => {
  const { currency, setCurrency, allCurrencies } = useCurrency()
  const [isOpen, setIsOpen] = useState(false)

  const handleCurrencyChange = (currencyCode) => {
    setCurrency(currencyCode)
    setIsOpen(false)
  }

  return (
    <div className={`currency-selector ${className}`}>
      {compact ? (
        // Compact version (just shows current currency with dropdown)
        <div className="currency-selector-compact">
          <button
            className="currency-selector-button"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Select currency"
            aria-expanded={isOpen}
          >
            {allCurrencies[currency].symbol} {allCurrencies[currency].code}
            <span className="dropdown-arrow">▼</span>
          </button>

          {isOpen && (
            <div className="currency-dropdown">
              {Object.values(allCurrencies).map((curr) => (
                <button
                  key={curr.code}
                  className={`currency-option ${curr.code === currency ? "selected" : ""}`}
                  onClick={() => handleCurrencyChange(curr.code)}
                >
                  <span className="currency-symbol">{curr.symbol}</span>
                  <span className="currency-code">{curr.code}</span>
                  <span className="currency-name">{curr.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      ) : (
        // Full version (shows grouped currencies)
        <div className="currency-selector-full">
          <label htmlFor="currency-select" className="currency-label">
            Select Currency:
          </label>
          <div className="currency-select-wrapper">
            <select
              id="currency-select"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="currency-select"
            >
              {Object.entries(CURRENCY_GROUPS).map(([region, currencies]) => (
                <optgroup key={region} label={region}>
                  {currencies.map((curr) => (
                    <option key={curr.code} value={curr.code}>
                      {curr.symbol} {curr.code} - {curr.name}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  )
}

export default CurrencySelector
