"use client"

import { useState } from "react"
import { useCurrency } from "../contexts/CurrencyContext"
import { formatCurrency, convertCurrency } from "../utils/currencyUtils"
import CurrencySelector from "./CurrencySelector"
import CurrencyInput from "./CurrencyInput"

const CurrencyTest = () => {
  const { currency } = useCurrency()
  const [amount, setAmount] = useState(1000)

  const handleAmountChange = (e) => {
    setAmount(e.target.value)
  }

  return (
    <div className="currency-test">
      <h2>Currency Test Component</h2>

      <div className="test-section">
        <h3>Current Currency: {currency}</h3>
        <CurrencySelector />
      </div>

      <div className="test-section">
        <h3>Currency Input</h3>
        <CurrencyInput value={amount} onChange={handleAmountChange} name="testAmount" id="testAmount" />
        <p>Current value: {amount}</p>
      </div>

      <div className="test-section">
        <h3>Formatted Currency Examples</h3>
        <ul>
          <li>1,000: {formatCurrency(1000, currency)}</li>
          <li>1,000,000: {formatCurrency(1000000, currency)}</li>
          <li>1,234.56: {formatCurrency(1234.56, currency)}</li>
        </ul>
      </div>

      <div className="test-section">
        <h3>Currency Conversion Examples</h3>
        <ul>
          <li>1,000 USD = {formatCurrency(convertCurrency(1000, "USD", currency), currency)}</li>
          <li>1,000 EUR = {formatCurrency(convertCurrency(1000, "EUR", currency), currency)}</li>
          <li>1,000 GBP = {formatCurrency(convertCurrency(1000, "GBP", currency), currency)}</li>
        </ul>
      </div>
    </div>
  )
}

export default CurrencyTest
