"use client"

import { useState, useEffect } from "react"
import { useCurrency } from "../contexts/CurrencyContext"
import { getHistoricalExchangeRates } from "../utils/currencyUtils"
import "./CurrencyRateChart.css"

const CurrencyRateChart = ({ className = "" }) => {
  const { currency } = useCurrency()
  const [comparisonCurrency, setComparisonCurrency] = useState("USD")
  const [timeframe, setTimeframe] = useState(30) // days
  const [rateData, setRateData] = useState([])

  useEffect(() => {
    // Skip if comparing the same currency
    if (currency === comparisonCurrency) {
      if (comparisonCurrency === "USD") {
        setComparisonCurrency("EUR")
      } else {
        setComparisonCurrency("USD")
      }
      return
    }

    // Get historical rates
    const historicalRates = getHistoricalExchangeRates(currency, comparisonCurrency, timeframe)
    setRateData(historicalRates)
  }, [currency, comparisonCurrency, timeframe])

  // Calculate min and max values for the chart
  const rates = rateData.map((item) => item.rate)
  const minRate = Math.min(...rates) * 0.98 // Add some padding
  const maxRate = Math.max(...rates) * 1.02

  // Calculate chart dimensions
  const chartWidth = 600
  const chartHeight = 200
  const paddingX = 40
  const paddingY = 20
  const graphWidth = chartWidth - paddingX * 2
  const graphHeight = chartHeight - paddingY * 2

  // Generate path for the chart line
  const generatePath = () => {
    if (rateData.length === 0) return ""

    const points = rateData.map((item, index) => {
      const x = paddingX + (index / (rateData.length - 1)) * graphWidth
      const normalizedRate = (item.rate - minRate) / (maxRate - minRate)
      const y = chartHeight - paddingY - normalizedRate * graphHeight
      return `${x},${y}`
    })

    return `M ${points.join(" L ")}`
  }

  // Generate area under the chart line
  const generateArea = () => {
    if (rateData.length === 0) return ""

    const points = rateData.map((item, index) => {
      const x = paddingX + (index / (rateData.length - 1)) * graphWidth
      const normalizedRate = (item.rate - minRate) / (maxRate - minRate)
      const y = chartHeight - paddingY - normalizedRate * graphHeight
      return `${x},${y}`
    })

    const firstX = paddingX
    const lastX = paddingX + graphWidth
    const baseline = chartHeight - paddingY

    return `M ${firstX},${baseline} L ${points.join(" L ")} L ${lastX},${baseline} Z`
  }

  return (
    <div className={`currency-rate-chart ${className}`}>
      <div className="chart-header">
        <h3>Exchange Rate History</h3>
        <div className="chart-controls">
          <div className="currency-selector">
            <label>Compare {currency} to:</label>
            <select value={comparisonCurrency} onChange={(e) => setComparisonCurrency(e.target.value)}>
              {Object.keys(getHistoricalExchangeRates(currency, "USD", 1)[0])
                .filter((code) => code !== currency)
                .map((code) => (
                  <option key={code} value={code}>
                    {code}
                  </option>
                ))}
            </select>
          </div>
          <div className="timeframe-selector">
            <label>Timeframe:</label>
            <div className="timeframe-buttons">
              <button className={timeframe === 7 ? "active" : ""} onClick={() => setTimeframe(7)}>
                7d
              </button>
              <button className={timeframe === 30 ? "active" : ""} onClick={() => setTimeframe(30)}>
                30d
              </button>
              <button className={timeframe === 90 ? "active" : ""} onClick={() => setTimeframe(90)}>
                90d
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="chart-container">
        <svg width={chartWidth} height={chartHeight} viewBox={`0 0 ${chartWidth} ${chartHeight}`}>
          {/* Y-axis labels */}
          <text x="10" y={paddingY} className="chart-label">
            {maxRate.toFixed(4)}
          </text>
          <text x="10" y={chartHeight - paddingY} className="chart-label">
            {minRate.toFixed(4)}
          </text>

          {/* X-axis labels */}
          <text x={paddingX} y={chartHeight - 5} className="chart-label">
            {rateData.length > 0 ? rateData[0].date : ""}
          </text>
          <text x={chartWidth - paddingX} y={chartHeight - 5} className="chart-label" textAnchor="end">
            {rateData.length > 0 ? rateData[rateData.length - 1].date : ""}
          </text>

          {/* Chart area */}
          <path d={generateArea()} className="chart-area" />

          {/* Chart line */}
          <path d={generatePath()} className="chart-line" />

          {/* Current value dot */}
          {rateData.length > 0 && (
            <circle
              cx={chartWidth - paddingX}
              cy={
                chartHeight -
                paddingY -
                ((rateData[rateData.length - 1].rate - minRate) / (maxRate - minRate)) * graphHeight
              }
              r="4"
              className="current-value-dot"
            />
          )}
        </svg>
      </div>

      <div className="chart-footer">
        <div className="current-rate">
          <span className="rate-label">Current Rate:</span>
          <span className="rate-value">
            1 {currency} = {rateData.length > 0 ? rateData[rateData.length - 1].rate.toFixed(4) : "0.0000"}{" "}
            {comparisonCurrency}
          </span>
        </div>
        <div className="rate-change">
          {rateData.length > 0 && (
            <>
              <span className="change-label">Change ({timeframe}d):</span>
              <span
                className={`change-value ${
                  rateData[rateData.length - 1].rate > rateData[0].rate
                    ? "positive"
                    : rateData[rateData.length - 1].rate < rateData[0].rate
                      ? "negative"
                      : ""
                }`}
              >
                {((rateData[rateData.length - 1].rate / rateData[0].rate - 1) * 100).toFixed(2)}%
              </span>
            </>
          )}
        </div>
      </div>

      <div className="chart-disclaimer">
        <p>
          <strong>Note:</strong> Exchange rates are for demonstration purposes only. In a production environment, these
          would be updated regularly from an external API.
        </p>
      </div>
    </div>
  )
}

export default CurrencyRateChart
