"use client"

import { useState } from "react"
import { useCurrency } from "../contexts/CurrencyContext"
import { CURRENCY_GROUPS, getCurrencyInfo, getExchangeRateInfo } from "../utils/currencyUtils"

const CurrencySelector = ({ className = "", compact = false }) => {
  const { currency, setCurrency, allCurrencies } = useCurrency()
  const [isOpen, setIsOpen] = useState(false)
  const [showCurrencyInfo, setShowCurrencyInfo] = useState(false);
  const [selectedCurrencyInfo, setSelectedCurrencyInfo] = useState(null);

  const handleCurrencyChange = (currencyCode) => {
    setCurrency(currencyCode)
    setIsOpen(false)
  }

  const handleInfoClick = (e, currencyCode) => {
    e.stopPropagation();
    setSelectedCurrencyInfo(getCurrencyInfo(currencyCode));
    setShowCurrencyInfo(true);
  };

  const handleCloseInfo = () => {
    setShowCurrencyInfo(false);
    setSelectedCurrencyInfo(null);
  };

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
                  <button 
                    className="currency-info-button"
                    onClick={(e) => handleInfoClick(e, curr.code)}
                    aria-label={`Information about ${curr.code}`}
                  >
                    ℹ️
                  </button>
                </button>
              ))}
            </div>
          )}

          {showCurrencyInfo && selectedCurrencyInfo && (
            <div className="currency-info-modal">
              <div className="currency-info-content">
                <button className="close-button" onClick={handleCloseInfo}>×</button>
                <h3>{selectedCurrencyInfo.name} ({selectedCurrencyInfo.code})</h3>
                <p><strong>Symbol:</strong> {selectedCurrencyInfo.symbol}</p>
                <p><strong>Example:</strong> {selectedCurrencyInfo.formattedExample}</p>
                {selectedCurrencyInfo.countries.length > 0 && (
                  <>
                    <p><strong>Used in:</strong></p>
                    <ul className="currency-countries-list">
                      {selectedCurrencyInfo.countries.map((country, index) => (
                        <li key={index}>{country}</li>
                      ))}
                    </ul>
                  </>
                )}
                {currency !== "USD" && (
                  <div className="exchange-rate-box">
                    <p><strong>Exchange Rate:</strong></p>
                    <p>1 {selectedCurrencyInfo.code} = {getExchangeRateInfo(selectedCurrencyInfo.code, "USD").formattedRate} USD</p>
                    <p>1 USD = {getExchangeRateInfo("USD", selectedCurrencyInfo.code).formattedRate} {selectedCurrencyInfo.code}</p>
                    <p className="rate-note">Rates are for demonstration purposes only</p>
                  </div>
                )}
              </div>
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
