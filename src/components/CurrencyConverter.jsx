"use client"

import { useState, useEffect } from "react"
import { CURRENCIES, CURRENCY_GROUPS, formatCurrency, convertCurrency } from "../utils/currencyUtils"
import ArrowsUpDown from "../components/icons/ArrowsUpDown"
import "./CurrencyConverter.css"


const CurrencyConverter = ({ className = "", standalone = true }) => {
  // State for the converter
  const [amount, setAmount] = useState(1000)
  const [fromCurrency, setFromCurrency] = useState("USD")
  const [toCurrency, setToCurrency] = useState("EUR")
  const [convertedAmount, setConvertedAmount] = useState(0)
  const [isConverting, setIsConverting] = useState(false)
  const [recentConversions, setRecentConversions] = useState([])

  // Calculate conversion when inputs change
  useEffect(() => {
    if (amount && fromCurrency && toCurrency) {
      setIsConverting(true)

      // Simulate API call delay
      const timer = setTimeout(() => {
        const result = convertCurrency(amount, fromCurrency, toCurrency)
        setConvertedAmount(result)
        setIsConverting(false)
      }, 300)

      return () => clearTimeout(timer)
    }
  }, [amount, fromCurrency, toCurrency])

  // Handle amount input change
  const handleAmountChange = (e) => {
    const value = e.target.value
    // Remove non-numeric characters except decimal point
    const numericValue = value.replace(/[^0-9.]/g, "")

    // Ensure only one decimal point
    const parts = numericValue.split(".")
    const cleanValue = parts.length > 2 ? parts[0] + "." + parts.slice(1).join("") : numericValue

    setAmount(cleanValue === "" ? "" : Number(cleanValue))
  }

  // Swap currencies
  const handleSwapCurrencies = () => {
    setFromCurrency(toCurrency)
    setToCurrency(fromCurrency)
  }

  // Save conversion to history
  const saveConversion = () => {
    const newConversion = {
      id: Date.now(),
      fromCurrency,
      toCurrency,
      amount,
      result: convertedAmount,
      timestamp: new Date().toISOString(),
    }

    setRecentConversions((prev) => {
      const updated = [newConversion, ...prev].slice(0, 5)
      // Save to localStorage if available
      try {
        localStorage.setItem("recentConversions", JSON.stringify(updated))
      } catch (error) {
        console.error("Error saving to localStorage:", error)
      }
      return updated
    })
  }

  // Load saved conversions on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("recentConversions")
      if (saved) {
        setRecentConversions(JSON.parse(saved))
      }
    } catch (error) {
      console.error("Error loading from localStorage:", error)
    }
  }, [])

  // Format the timestamp for display
  const formatTimestamp = (timestamp) => {
    try {
      const date = new Date(timestamp)
      return date.toLocaleString(undefined, {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    } catch (error) {
      return "Invalid date"
    }
  }

  return (
    <div className={`currency-converter ${standalone ? "standalone" : ""} ${className}`}>
      {standalone && (
        <div className="converter-header">
          <h2>Currency Converter</h2>
          <p>Convert between different currencies using live exchange rates</p>
        </div>
      )}

      <div className="converter-card">
        <div className="converter-inputs">
          <div className="input-group amount-input">
            <label htmlFor="amount">Amount</label>
            <input
              type="text"
              id="amount"
              value={amount}
              onChange={handleAmountChange}
              placeholder="Enter amount"
              inputMode="decimal"
            />
          </div>

          <div className="currencies-container">
            <div className="input-group">
              <label htmlFor="fromCurrency">From</label>
              <select id="fromCurrency" value={fromCurrency} onChange={(e) => setFromCurrency(e.target.value)}>
                {Object.entries(CURRENCY_GROUPS).map(([region, currencies]) => (
                  <optgroup key={region} label={region}>
                    {currencies.map((currency) => (
                      <option key={currency.code} value={currency.code}>
                        {currency.code} - {currency.name} ({currency.symbol})
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>

            <button className="swap-button" onClick={handleSwapCurrencies} aria-label="Swap currencies">
              <ArrowsUpDown />
            </button>

            <div className="input-group">
              <label htmlFor="toCurrency">To</label>
              <select id="toCurrency" value={toCurrency} onChange={(e) => setToCurrency(e.target.value)}>
                {Object.entries(CURRENCY_GROUPS).map(([region, currencies]) => (
                  <optgroup key={region} label={region}>
                    {currencies.map((currency) => (
                      <option key={currency.code} value={currency.code}>
                        {currency.code} - {currency.name} ({currency.symbol})
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="conversion-result">
          <div className="result-card">
            <div className="result-label">Conversion Result</div>
            <div className="result-amount">
              {isConverting ? (
                <div className="loading-indicator">Converting...</div>
              ) : (
                <>
                  <div className="original-amount">{formatCurrency(amount, fromCurrency)}</div>
                  <div className="converted-amount">{formatCurrency(convertedAmount, toCurrency)}</div>
                </>
              )}
            </div>
            <div className="exchange-rate">
              1 {CURRENCIES[fromCurrency].code} ={" "}
              {formatCurrency(convertCurrency(1, fromCurrency, toCurrency), toCurrency, { minimumFractionDigits: 4 })}
            </div>
          </div>

          <button className="save-button" onClick={saveConversion} disabled={isConverting}>
            Save Conversion
          </button>
        </div>

        {recentConversions.length > 0 && (
          <div className="recent-conversions">
            <h3>Recent Conversions</h3>
            <div className="conversions-list">
              {recentConversions.map((conversion) => (
                <div key={conversion.id} className="conversion-item">
                  <div className="conversion-details">
                    <span className="conversion-amount">
                      {formatCurrency(conversion.amount, conversion.fromCurrency)}
                    </span>
                    <span className="conversion-arrow">→</span>
                    <span className="conversion-result">
                      {formatCurrency(conversion.result, conversion.toCurrency)}
                    </span>
                  </div>
                  <div className="conversion-time">{formatTimestamp(conversion.timestamp)}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="converter-disclaimer">
        <p>
          Note: Exchange rates are for demonstration purposes only. In a production environment, these would be updated
          regularly from an external API.
        </p>
      </div>


    </div>
  )
}

export default CurrencyConverter
