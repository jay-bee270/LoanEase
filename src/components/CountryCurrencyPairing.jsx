"use client"

import { useState, useEffect } from "react"
import { useCurrency } from "../contexts/CurrencyContext"
import { getDefaultCurrencyForCountry } from "../utils/currencyUtils"
import "./CountryCurrencyPairing.css"

// Map of country codes to flag emoji
const countryFlags = {
  US: "🇺🇸",
  GB: "🇬🇧",
  CA: "🇨🇦",
  AU: "🇦🇺",
  DE: "🇩🇪",
  FR: "🇫🇷",
  JP: "🇯🇵",
  CN: "🇨🇳",
  IN: "🇮🇳",
  BR: "🇧🇷",
  NG: "🇳🇬",
  ZA: "🇿🇦",
  KE: "🇰🇪",
  EG: "🇪🇬",
  MA: "🇲🇦",
  GH: "🇬🇭",
  SN: "🇸🇳",
  MX: "🇲🇽",
  AR: "🇦🇷",
}

// Map of country codes to names
const countryNames = {
  US: "United States",
  GB: "United Kingdom",
  CA: "Canada",
  AU: "Australia",
  DE: "Germany",
  FR: "France",
  JP: "Japan",
  CN: "China",
  IN: "India",
  BR: "Brazil",
  NG: "Nigeria",
  ZA: "South Africa",
  KE: "Kenya",
  EG: "Egypt",
  MA: "Morocco",
  GH: "Ghana",
  SN: "Senegal",
  MX: "Mexico",
  AR: "Argentina",
}

const CountryCurrencyPairing = ({ country, onCurrencyChange, className = "" }) => {
  const { currency, setCurrency } = useCurrency()
  const [suggestedCurrency, setSuggestedCurrency] = useState(null)
  const [showSuggestion, setShowSuggestion] = useState(false)

  useEffect(() => {
    if (country) {
      const defaultCurrency = getDefaultCurrencyForCountry(country)
      if (defaultCurrency !== currency) {
        setSuggestedCurrency(defaultCurrency)
        setShowSuggestion(true)
      } else {
        setShowSuggestion(false)
      }
    } else {
      setShowSuggestion(false)
    }
  }, [country, currency])

  const handleAcceptSuggestion = () => {
    if (suggestedCurrency) {
      setCurrency(suggestedCurrency)
      if (onCurrencyChange) {
        onCurrencyChange(suggestedCurrency)
      }
    }
    setShowSuggestion(false)
  }

  const handleDeclineSuggestion = () => {
    setShowSuggestion(false)
  }

  if (!country || !countryNames[country]) {
    return null
  }

  return (
    <div className={`country-currency-pairing ${className}`}>
      <div className="country-info">
        <span className="country-flag">{countryFlags[country] || "🌍"}</span>
        <span className="country-name">{countryNames[country]}</span>
      </div>

      {showSuggestion && suggestedCurrency && (
        <div className="currency-suggestion">
          <p>
            <span className="suggestion-icon">💡</span> We noticed you selected {countryNames[country]}. Would you like
            to switch to {suggestedCurrency} for your loan calculations?
          </p>
          <div className="suggestion-actions">
            <button className="accept-button" onClick={handleAcceptSuggestion}>
              Yes, use {suggestedCurrency}
            </button>
            <button className="decline-button" onClick={handleDeclineSuggestion}>
              No, keep {currency}
            </button>
          </div>
        </div>
      )}

      {!showSuggestion && (
        <div className="current-currency">
          <span className="currency-label">Using:</span>
          <span className="currency-value">{currency}</span>
        </div>
      )}
    </div>
  )
}

export default CountryCurrencyPairing
