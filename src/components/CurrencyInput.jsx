"use client"

import { useState, useEffect } from "react"
import { useCurrency } from "../contexts/CurrencyContext"
import { formatCurrency, parseCurrencyInput, convertCurrency } from "../utils/currencyUtils"

const CurrencyInput = ({
  value,
  onChange,
  name,
  id,
  placeholder = "0.00",
  className = "",
  required = false,
  min,
  max,
  disabled = false,
  onBlur,
  ...props
}) => {
  const { currency, currencyData } = useCurrency()
  const [displayValue, setDisplayValue] = useState("")
  const [showConversion, setShowConversion] = useState(false);
  const [conversionValue, setConversionValue] = useState(null);

  // Update display value when the actual value or currency changes
  useEffect(() => {
    if (value === "" || value === null || value === undefined) {
      setDisplayValue("")
    } else {
      // Format the value according to the selected currency
      const numValue = Number.parseFloat(value)
      if (!isNaN(numValue)) {
        setDisplayValue(
          formatCurrency(numValue, currency, {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
            // Don't use the currency symbol in the input
            style: "decimal",
          }).trim(),
        )
      } else {
        setDisplayValue("")
      }
    }
  }, [value, currency])

  useEffect(() => {
    if (value !== "" && value !== null && value !== undefined) {
      const numValue = Number.parseFloat(value);
      if (!isNaN(numValue) && currency !== "USD") {
        const usdValue = convertCurrency(numValue, currency, "USD");
        setConversionValue(usdValue);
      } else {
        setConversionValue(null);
      }
    } else {
      setConversionValue(null);
    }
  }, [value, currency]);

  const handleChange = (e) => {
    const inputValue = e.target.value
    // Parse the input value to a number
    const parsedValue = parseCurrencyInput(inputValue)

    // Update the display value
    setDisplayValue(inputValue)

    // Call the onChange handler with the parsed value
    if (onChange) {
      onChange({
        ...e,
        target: {
          ...e.target,
          name,
          value: parsedValue,
        },
      })
    }
  }

  const handleBlur = (e) => {
    // Format the value on blur
    if (value !== "" && value !== null && value !== undefined) {
      const numValue = Number.parseFloat(value)
      if (!isNaN(numValue)) {
        setDisplayValue(
          formatCurrency(numValue, currency, {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
            // Don't use the currency symbol in the input
            style: "decimal",
          }).trim(),
        )
      }
    }

    if (onBlur) {
      onBlur(e)
    }
  }

  return (
    <div className="currency-input-container">
      <div className="currency-input-wrapper">
        <div className="currency-input-symbol">{currencyData.symbol}</div>
        <input
          type="text"
          id={id}
          name={name}
          value={displayValue}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder={placeholder}
          className={`currency-input ${className}`}
          required={required}
          disabled={disabled}
          inputMode="decimal"
          onFocus={() => setShowConversion(true)}
          onMouseEnter={() => setShowConversion(true)}
          onMouseLeave={() => setShowConversion(false)}
          {...props}
        />
      </div>
      {showConversion && conversionValue !== null && currency !== "USD" && (
        <div className="currency-conversion-hint">
          ≈ {formatCurrency(conversionValue, "USD")}
        </div>
      )}
    </div>
  )
}

export default CurrencyInput
