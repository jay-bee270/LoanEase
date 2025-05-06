"use client"

import { useEffect } from "react"
import { Link } from "react-router-dom"
import CurrencyConverter from "../components/CurrencyConverter"
import { initScrollReveal } from "../utils/scrollReveal"
import Footer from "../components/Footer"
import "./CurrencyConverterPage.css"

const CurrencyConverterPage = () => {
  // Initialize scroll reveal effect
  useEffect(() => {
    const cleanup = initScrollReveal()
    return cleanup
  }, [])

  return (
    <div className="currency-converter-page">
      <div className="page-header">
        <div className="header-container">
          <Link to="/" className="back-link">
            <span className="back-arrow">←</span> Back to Home
          </Link>
        </div>
      </div>

      <div className="page-content">
        <div className="reveal">
          <CurrencyConverter />
        </div>
      </div>

      {/* Add Footer component */}
      <Footer />
    </div>
  )
}

export default CurrencyConverterPage
