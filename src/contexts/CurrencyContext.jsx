"use client"

import { createContext, useState, useContext, useEffect } from "react"
import { CURRENCIES } from "../utils/currencyUtils"

// Create the context
const CurrencyContext = createContext()

// Custom hook to use the currency context
export const useCurrency = () => {
  const context = useContext(CurrencyContext)
  if (!context) {
    throw new Error("useCurrency must be used within a CurrencyProvider")
  }
  return context
}

// Provider component
export const CurrencyProvider = ({ children }) => {
  // Try to get the currency from localStorage, default to USD
  const [currency, setCurrency] = useState(() => {
    // Check if we're in the browser environment
    if (typeof window !== "undefined") {
      const savedCurrency = localStorage.getItem("preferredCurrency")
      // Verify the saved currency exists in our CURRENCIES object
      return savedCurrency && CURRENCIES[savedCurrency] ? savedCurrency : "USD"
    }
    return "USD" // Default if not in browser
  })

  // Save to localStorage when currency changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("preferredCurrency", currency)
    }
  }, [currency])

  // Try to detect user's location and suggest a currency
  useEffect(() => {
    // Only suggest if no preference has been set yet and we're in browser
    if (typeof window !== "undefined" && !localStorage.getItem("preferredCurrency")) {
      try {
        // Get user's language from browser
        const userLanguage = navigator.language || navigator.userLanguage

        // Find a matching currency based on locale
        const matchingCurrency = Object.values(CURRENCIES).find((curr) =>
          curr.locale.startsWith(userLanguage.split("-")[0]),
        )

        if (matchingCurrency) {
          setCurrency(matchingCurrency.code)
        }
      } catch (error) {
        console.error("Error detecting user locale:", error)
      }
    }
  }, [])

  const value = {
    currency,
    setCurrency,
    currencyData: CURRENCIES[currency] || CURRENCIES.USD,
    allCurrencies: CURRENCIES,
  }

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>
}
