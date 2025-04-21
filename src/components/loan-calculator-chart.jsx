"use client"

import { useState, useEffect } from "react"
import { Line } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js"
import { formatCurrency, CURRENCIES } from "../utils/currencyUtils"

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

const LoanCalculatorChart = ({ loanAmount, interestRate, loanTerm, currency = "USD" }) => {
  const [chartData, setChartData] = useState(null)

  useEffect(() => {
    if (!loanAmount || !interestRate || !loanTerm) {
      return
    }

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

    // Generate data for chart
    const labels = []
    const principalData = []
    const interestData = []

    let remainingBalance = principal
    let totalInterestPaid = 0

    // Calculate monthly payment
    let monthlyPayment
    if (monthlyRate === 0) {
      monthlyPayment = principal / termMonths
    } else {
      monthlyPayment =
        (principal * monthlyRate * Math.pow(1 + monthlyRate, termMonths)) / (Math.pow(1 + monthlyRate, termMonths) - 1)
    }

    // Generate data points for each year
    for (let year = 0; year <= termYears; year++) {
      // Add label for this year
      labels.push(`Year ${year}`)

      // Calculate remaining balance and interest for this year
      if (year === 0) {
        principalData.push(principal)
        interestData.push(0)
      } else {
        // Calculate for 12 months
        for (let month = 1; month <= 12; month++) {
          if ((year - 1) * 12 + month <= termMonths) {
            const interestPayment = remainingBalance * monthlyRate
            const principalPayment = monthlyPayment - interestPayment

            remainingBalance -= principalPayment
            totalInterestPaid += interestPayment
          }
        }

        principalData.push(Math.max(0, remainingBalance))
        interestData.push(totalInterestPaid)
      }
    }

    // Create chart data with updated color scheme
    setChartData({
      labels,
      datasets: [
        {
          label: "Remaining Principal",
          data: principalData,
          borderColor: "#2e8b57", // Using primary-color
          backgroundColor: "rgba(46, 139, 87, 0.1)", // Transparent primary-color
          tension: 0.3,
        },
        {
          label: "Cumulative Interest",
          data: interestData,
          borderColor: "#34495e", // Using secondary-color
          backgroundColor: "rgba(52, 73, 94, 0.1)", // Transparent secondary-color
          tension: 0.3,
        },
      ],
    })
  }, [loanAmount, interestRate, loanTerm, currency])

  if (!chartData) {
    return <div className="chart-placeholder">Enter loan details to see payment breakdown</div>
  }

  // Get the currency data for formatting
  const currencyData = CURRENCIES[currency] || CURRENCIES.USD

  return (
    <div className="loan-chart-container">
      <h4>Loan Amortization Chart</h4>
      <Line
        data={chartData}
        options={{
          responsive: true,
          plugins: {
            legend: {
              position: "top",
            },
            tooltip: {
              callbacks: {
                label: (context) => {
                  let label = context.dataset.label || ""
                  if (label) {
                    label += ": "
                  }
                  if (context.parsed.y !== null) {
                    label += formatCurrency(context.parsed.y, currency)
                  }
                  return label
                },
              },
            },
          },
          scales: {
            y: {
              ticks: {
                callback: (value) => {
                  return formatCurrency(value, currency, {
                    notation: "compact",
                    maximumSignificantDigits: 3,
                  })
                },
              },
            },
          },
        }}
      />
      <div className="chart-info">
        <p>This chart shows how your loan balance decreases over time and how much interest you'll pay.</p>
      </div>
    </div>
  )
}

export default LoanCalculatorChart
