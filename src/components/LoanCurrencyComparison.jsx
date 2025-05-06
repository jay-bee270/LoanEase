"use client"

import { useState, useEffect } from "react"
import { useCurrency } from "../contexts/CurrencyContext"
import { formatCurrency, convertCurrency } from "../utils/currencyUtils"
import "./LoanCurrencyComparison.css"

const LoanCurrencyComparison = ({ loanAmount, interestRate, loanTerm, className = "" }) => {
  const { currency } = useCurrency()
  const [monthlyPayment, setMonthlyPayment] = useState(null)
  const [totalInterest, setTotalInterest] = useState(null)
  const [totalCost, setTotalCost] = useState(null)
  const [comparisonCurrencies, setComparisonCurrencies] = useState(["USD", "EUR", "GBP"])

  // Calculate loan details
  useEffect(() => {
    if (loanAmount && interestRate && loanTerm) {
      // Convert inputs to numbers
      const principal = Number.parseFloat(loanAmount)
      const annualRate = Number.parseFloat(interestRate)
      const termYears = Number.parseFloat(loanTerm)

      if (isNaN(principal) || isNaN(annualRate) || isNaN(termYears)) {
        return
      }

      // Calculate monthly payment
      const monthlyRate = annualRate / 100 / 12
      const termMonths = termYears * 12

      let payment
      if (monthlyRate === 0) {
        payment = principal / termMonths
      } else {
        payment =
          (principal * monthlyRate * Math.pow(1 + monthlyRate, termMonths)) /
          (Math.pow(1 + monthlyRate, termMonths) - 1)
      }

      setMonthlyPayment(payment)
      setTotalInterest(payment * termMonths - principal)
      setTotalCost(payment * termMonths)
    }
  }, [loanAmount, interestRate, loanTerm])

  // Filter out the current currency from comparison
  useEffect(() => {
    let currencies = ["USD", "EUR", "GBP"]
    if (currencies.includes(currency)) {
      currencies = currencies.filter((c) => c !== currency)
      // Add another currency if needed
      if (currencies.length < 2) {
        currencies.push(currency === "USD" ? "NGN" : currency === "EUR" ? "ZAR" : "NGN")
      }
    }
    setComparisonCurrencies(currencies)
  }, [currency])

  if (!loanAmount || !interestRate || !loanTerm || !monthlyPayment) {
    return null
  }

  return (
    <div className={`loan-currency-comparison ${className}`}>
      <h3>Multi-Currency Comparison</h3>
      <p className="comparison-description">
        See how your loan would look in different currencies. This can help you understand the relative value of your
        loan in global terms.
      </p>

      <div className="comparison-table">
        <div className="comparison-header">
          <div className="comparison-cell header-cell">Currency</div>
          <div className="comparison-cell header-cell">Loan Amount</div>
          <div className="comparison-cell header-cell">Monthly Payment</div>
          <div className="comparison-cell header-cell">Total Interest</div>
          <div className="comparison-cell header-cell">Total Cost</div>
        </div>

        {/* Current currency row */}
        <div className="comparison-row current-currency-row">
          <div className="comparison-cell currency-cell">
            <span className="currency-code">{currency}</span>
            <span className="currency-note">Your selected currency</span>
          </div>
          <div className="comparison-cell">{formatCurrency(loanAmount, currency)}</div>
          <div className="comparison-cell">{formatCurrency(monthlyPayment, currency)}</div>
          <div className="comparison-cell">{formatCurrency(totalInterest, currency)}</div>
          <div className="comparison-cell">{formatCurrency(totalCost, currency)}</div>
        </div>

        {/* Comparison currency rows */}
        {comparisonCurrencies.map((code) => (
          <div key={code} className="comparison-row">
            <div className="comparison-cell currency-cell">
              <span className="currency-code">{code}</span>
            </div>
            <div className="comparison-cell">{formatCurrency(convertCurrency(loanAmount, currency, code), code)}</div>
            <div className="comparison-cell">
              {formatCurrency(convertCurrency(monthlyPayment, currency, code), code)}
            </div>
            <div className="comparison-cell">
              {formatCurrency(convertCurrency(totalInterest, currency, code), code)}
            </div>
            <div className="comparison-cell">{formatCurrency(convertCurrency(totalCost, currency, code), code)}</div>
          </div>
        ))}
      </div>

      <div className="comparison-disclaimer">
        <p>
          <strong>Note:</strong> Exchange rates are for demonstration purposes only. Actual rates may vary and change
          over time. This comparison does not account for potential currency fluctuations over the life of the loan.
        </p>
      </div>
    </div>
  )
}

export default LoanCurrencyComparison
