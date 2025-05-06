"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import "./LoanApplicationForm.css"
import LoanCalculatorChart from "../components/loan-calculator-chart"
import { useCurrency } from "../contexts/CurrencyContext"
import { formatCurrency, convertCurrency } from "../utils/currencyUtils"
import CurrencySelector from "../components/CurrencySelector"
import CurrencyInput from "../components/CurrencyInput"
import CountryCurrencyPairing from "../components/CountryCurrencyPairing"
import CurrencyExchangeInfo from "../components/CurrencyExchangeInfo"
import LoanCurrencyComparison from "../components/LoanCurrencyComparison"
import CurrencyRateChart from "../components/CurrencyRateChart"
import Footer from "../components/Footer"

// Import the getDefaultCurrencyForCountry function from currencyUtils
import { getDefaultCurrencyForCountry } from "../utils/currencyUtils"

// Add this component at the top of the file, after the imports
const CustomAlert = ({ message, onClose }) => {
  // Close alert when Escape key is pressed
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === "Escape") {
        onClose()
      }
    }

    window.addEventListener("keydown", handleEscKey)
    return () => {
      window.removeEventListener("keydown", handleEscKey)
    }
  }, [onClose])

  // Auto-close alert after 8 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, 8000)

    return () => {
      clearTimeout(timer)
    }
  }, [onClose])

  return (
    <div className="custom-alert" role="alert" aria-live="assertive" tabIndex={-1}>
      <div className="custom-alert-header">
        <div className="custom-alert-title">
          <span aria-hidden="true">⚠️</span> Form Error
        </div>
        <button className="custom-alert-close" onClick={onClose} aria-label="Close error message">
          ×
        </button>
      </div>
      <div className="custom-alert-message">{message}</div>
      <button className="custom-alert-button" onClick={onClose} aria-label="Acknowledge and close error message">
        OK
      </button>
    </div>
  )
}

// Update the validation functions to handle international formats
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Update phone validation to be more flexible for international numbers
const isValidPhone = (phone, country) => {
  // Remove all non-digit characters except + for international prefix
  const cleanedNumber = phone.replace(/[^\d+]/g, "")

  // Basic validation - just ensure we have enough digits for a valid phone number
  // Most international numbers are between 8 and 15 digits
  return cleanedNumber.length >= 8 && cleanedNumber.length <= 15
}

// Update postal code validation to be country-aware
const isValidPostalCode = (postalCode, country) => {
  if (!postalCode || !country) return false

  // Country-specific postal code validation
  switch (country) {
    case "US":
      return /^\d{5}(-\d{4})?$/.test(postalCode) // US ZIP code
    case "CA":
      return /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/.test(postalCode) // Canadian postal code
    case "GB":
      return /^[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}$/.test(postalCode) // UK postcode
    case "AU":
      return /^\d{4}$/.test(postalCode) // Australian postcode
    default:
      // For other countries, just ensure it's not empty and reasonable length
      return postalCode.length > 0 && postalCode.length < 12
  }
}

// Add a list of countries
const countries = [
  { value: "", label: "Select country" },
  { value: "US", label: "United States" },
  { value: "CA", label: "Canada" },
  { value: "GB", label: "United Kingdom" },
  { value: "AU", label: "Australia" },
  { value: "DE", label: "Germany" },
  { value: "FR", label: "France" },
  { value: "JP", label: "Japan" },
  { value: "CN", label: "China" },
  { value: "IN", label: "India" },
  { value: "BR", label: "Brazil" },
  { value: "NG", label: "Nigeria" },
  { value: "ZA", label: "South Africa" },
  { value: "KE", label: "Kenya" },
  { value: "EG", label: "Egypt" },
  { value: "MA", label: "Morocco" },
  { value: "GH", label: "Ghana" },
  { value: "SN", label: "Senegal" },
  { value: "MX", label: "Mexico" },
  { value: "AR", label: "Argentina" },
  // Add more countries as needed
]

// Add a list of US states
const usStates = [
  { value: "", label: "Select state" },
  { value: "AL", label: "Alabama" },
  { value: "AK", label: "Alaska" },
  { value: "AZ", label: "Arizona" },
  { value: "AR", label: "Arkansas" },
  { value: "CA", label: "California" },
  { value: "CO", label: "Colorado" },
  { value: "CT", label: "Connecticut" },
  { value: "DE", label: "Delaware" },
  { value: "DC", label: "District Of Columbia" },
  { value: "FL", label: "Florida" },
  { value: "GA", label: "Georgia" },
  { value: "HI", label: "Hawaii" },
  { value: "ID", label: "Idaho" },
  { value: "IL", label: "Illinois" },
  { value: "IN", label: "Indiana" },
  { value: "IA", label: "Iowa" },
  { value: "KS", label: "Kansas" },
  { value: "KY", label: "Kentucky" },
  { value: "LA", label: "Louisiana" },
  { value: "ME", label: "Maine" },
  { value: "MD", label: "Maryland" },
  { value: "MA", label: "Massachusetts" },
  { value: "MI", label: "Michigan" },
  { value: "MN", label: "Minnesota" },
  { value: "MS", label: "Mississippi" },
  { value: "MO", label: "Missouri" },
  { value: "MT", label: "Montana" },
  { value: "NE", label: "Nebraska" },
  { value: "NV", label: "Nevada" },
  { value: "NH", label: "New Hampshire" },
  { value: "NJ", label: "New Jersey" },
  { value: "NM", label: "New Mexico" },
  { value: "NY", label: "New York" },
  { value: "NC", label: "North Carolina" },
  { value: "ND", label: "North Dakota" },
  { value: "OH", label: "Ohio" },
  { value: "OK", label: "Oklahoma" },
  { value: "OR", label: "Oregon" },
  { value: "PA", label: "Pennsylvania" },
  { value: "RI", label: "Rhode Island" },
  { value: "SC", label: "South Carolina" },
  { value: "SD", label: "South Dakota" },
  { value: "TN", label: "Tennessee" },
  { value: "TX", label: "Texas" },
  { value: "UT", label: "Utah" },
  { value: "VT", label: "Vermont" },
  { value: "VA", label: "Virginia" },
  { value: "WA", label: "Washington" },
  { value: "WV", label: "West Virginia" },
  { value: "WI", label: "Wisconsin" },
  { value: "WY", label: "Wyoming" },
]

// Add a list of loan purposes
const loanPurposeOptions = [
  { value: "", label: "Select loan purpose" },
  { value: "debtConsolidation", label: "Debt Consolidation" },
  { value: "homeImprovement", label: "Home Improvement" },
  { value: "carPurchase", label: "Car Purchase" },
  { value: "medicalExpenses", label: "Medical Expenses" },
  { value: "businessLoan", label: "Business Loan" },
  { value: "other", label: "Other" },
]

// Add a list of employment statuses
const employmentStatusOptions = [
  { value: "", label: "Select employment status" },
  { value: "employed", label: "Employed" },
  { value: "selfEmployed", label: "Self-Employed" },
  { value: "unemployed", label: "Unemployed" },
  { value: "retired", label: "Retired" },
]

// Define field groups for each step of the form
const STEP_FIELDS = {
  1: ["firstName", "lastName", "email", "phone", "dateOfBirth"],
  2: ["country", "address", "city", "state", "province", "postalCode"],
  3: ["loanAmount", "interestRate", "loanTerm", "loanPurpose"],
  4: ["employmentStatus", "employerName", "jobTitle", "yearsEmployed", "monthlyIncome", "additionalComments"],
}

// Update the validation function to handle international addresses
const validateLoanForm = (formData, fieldsToValidate = null) => {
  const errors = {}

  // Helper function to check if a field should be validated
  const shouldValidateField = (field) => {
    return !fieldsToValidate || fieldsToValidate.includes(field)
  }

  // Personal Information validation
  if (shouldValidateField("firstName") && !formData.firstName?.trim()) {
    errors.firstName = "First name is required"
  }

  if (shouldValidateField("lastName") && !formData.lastName?.trim()) {
    errors.lastName = "Last name is required"
  }

  if (shouldValidateField("email")) {
    if (!formData.email?.trim()) {
      errors.email = "Email is required"
    } else if (!isValidEmail(formData.email)) {
      errors.email = "Please enter a valid email address"
    }
  }

  if (shouldValidateField("phone")) {
    if (!formData.phone?.trim()) {
      errors.phone = "Phone number is required"
    } else if (!isValidPhone(formData.phone, formData.country)) {
      errors.phone = "Please enter a valid phone number"
    }
  }

  // Address Information validation
  if (shouldValidateField("country") && !formData.country?.trim()) {
    errors.country = "Country is required"
  }

  if (shouldValidateField("address") && !formData.address?.trim()) {
    errors.address = "Street address is required"
  }

  if (shouldValidateField("city") && !formData.city?.trim()) {
    errors.city = "City is required"
  }

  if (shouldValidateField("state") && formData.country === "US" && !formData.state?.trim()) {
    errors.state = "State is required"
  }

  if (
    shouldValidateField("province") &&
    formData.country !== "US" &&
    formData.country?.trim() &&
    !formData.province?.trim()
  ) {
    errors.province = "Province/Region is required"
  }

  if (shouldValidateField("postalCode")) {
    if (!formData.postalCode?.trim()) {
      errors.postalCode = "Postal code is required"
    } else if (!isValidPostalCode(formData.postalCode, formData.country)) {
      errors.postalCode = "Please enter a valid postal code"
    }
  }

  // Loan Details validation
  if (shouldValidateField("loanAmount")) {
    if (formData.loanAmount === "" || formData.loanAmount === null || formData.loanAmount === undefined) {
      errors.loanAmount = "Loan amount is required"
    } else if (isNaN(Number(formData.loanAmount)) || Number(formData.loanAmount) <= 0) {
      errors.loanAmount = "Please enter a valid loan amount"
    }
  }

  if (shouldValidateField("interestRate")) {
    if (formData.interestRate === "" || formData.interestRate === null || formData.interestRate === undefined) {
      errors.interestRate = "Interest rate is required"
    } else if (isNaN(Number(formData.interestRate)) || Number(formData.interestRate) < 0) {
      errors.interestRate = "Please enter a valid interest rate"
    }
  }

  if (shouldValidateField("loanTerm")) {
    if (formData.loanTerm === "" || formData.loanTerm === null || formData.loanTerm === undefined) {
      errors.loanTerm = "Loan term is required"
    } else if (isNaN(Number(formData.loanTerm)) || Number(formData.loanTerm) <= 0) {
      errors.loanTerm = "Please enter a valid loan term"
    }
  }

  if (shouldValidateField("loanPurpose") && !formData.loanPurpose?.trim()) {
    errors.loanPurpose = "Loan purpose is required"
  }

  // Employment Information validation
  if (shouldValidateField("employmentStatus") && !formData.employmentStatus?.trim()) {
    errors.employmentStatus = "Employment status is required"
  }

  if (
    shouldValidateField("employerName") &&
    formData.employmentStatus === "employed" &&
    !formData.employerName?.trim()
  ) {
    errors.employerName = "Employer name is required"
  }

  if (shouldValidateField("monthlyIncome") && formData.employmentStatus === "employed") {
    if (formData.monthlyIncome === "" || formData.monthlyIncome === null || formData.monthlyIncome === undefined) {
      errors.monthlyIncome = "Monthly income is required"
    } else if (isNaN(Number(formData.monthlyIncome)) || Number(formData.monthlyIncome) < 0) {
      errors.monthlyIncome = "Please enter a valid monthly income"
    }
  }

  return errors
}

// Update the phone formatting function to handle international numbers
const formatPhoneNumber = (value, country) => {
  // If it starts with +, it's an international number, so don't format it
  if (value.startsWith("+")) {
    return value
  }

  // For US numbers, apply the standard US format
  if (country === "US") {
    // Remove all non-digit characters
    const digitsOnly = value.replace(/\D/g, "")

    // Format the phone number as (XXX) XXX-XXXX
    if (digitsOnly.length <= 3) {
      return digitsOnly
    } else if (digitsOnly.length <= 6) {
      return `(${digitsOnly.slice(0, 3)}) ${digitsOnly.slice(3)}`
    } else {
      return `(${digitsOnly.slice(0, 3)}) ${digitsOnly.slice(3, 6)}-${digitsOnly.slice(6, 10)}`
    }
  }

  // For other countries, just keep the digits and any + sign
  return value.replace(/[^\d+]/g, "")
}

const calculateMonthlyPayment = (loanAmount, interestRate, loanTermYears) => {
  try {
    // Convert inputs to numbers and validate
    const principal = Number.parseFloat(loanAmount)
    const annualRate = Number.parseFloat(interestRate)
    const termYears = Number.parseFloat(loanTermYears)

    if (isNaN(principal) || isNaN(annualRate) || isNaN(termYears)) {
      return null
    }

    if (principal <= 0 || termYears <= 0) {
      return null
    }

    // Convert annual rate to monthly rate and term years to months
    const monthlyRate = annualRate / 100 / 12
    const termMonths = termYears * 12

    // If interest rate is 0, simple division
    if (monthlyRate === 0) {
      return principal / termMonths
    }

    // Calculate monthly payment using the loan formula
    const monthlyPayment =
      (principal * monthlyRate * Math.pow(1 + monthlyRate, termMonths)) / (Math.pow(1 + monthlyRate, termMonths) - 1)

    return monthlyPayment
  } catch (error) {
    console.error("Error calculating payment:", error)
    return null
  }
}

// Create a separate component for currency tools to isolate it from the form
const CurrencyToolsSection = ({
  showCurrencyTools,
  toggleCurrencyTools,
  showUsdComparison,
  toggleUsdComparison,
  currency,
  formData,
  monthlyPayment,
  exchangeRateInfo,
}) => {
  return (
    <div className="currency-settings-wrapper">
      <div className="currency-settings">
        <h3>Currency Settings</h3>
        <p>
          Select your preferred currency for this application. All loan amounts and payments will be calculated and
          displayed in this currency.
        </p>
        <div className="currency-settings-content">
          <CurrencySelector />
          <div className="currency-info">
            <p className="currency-note">
              <strong>Note:</strong> The currency you select will be used throughout your application. Exchange rates
              are approximate and may vary at the time of loan disbursement.
            </p>
          </div>
          <button
            type="button"
            className="currency-tools-toggle"
            onClick={toggleCurrencyTools}
            aria-expanded={showCurrencyTools}
            aria-controls="currency-tools-section"
          >
            {showCurrencyTools ? "Hide Currency Tools" : "Show Currency Tools"}
          </button>
        </div>
      </div>

      {/* Currency Tools Section - Only shown when toggled */}
      {showCurrencyTools && (
        <div id="currency-tools-section" className="currency-tools-section">
          <CurrencyExchangeInfo />
          <CurrencyRateChart />
        </div>
      )}
    </div>
  )
}

function LoanApplicationForm() {
  // Get currency context
  const { currency, currencyData, setCurrency } = useCurrency()

  // Form state
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",

    // Address Information
    country: "",
    address: "",
    city: "",
    state: "", // For US
    province: "", // For non-US
    postalCode: "", // Renamed from zipCode to be more international

    // Loan Details
    loanAmount: "",
    interestRate: "",
    loanTerm: "",
    loanPurpose: "",

    // Employment Information
    employmentStatus: "",
    employerName: "",
    jobTitle: "",
    yearsEmployed: "",
    monthlyIncome: "",

    // Additional Information
    creditScore: "",
    existingDebts: "",
    additionalComments: "",
  })

  // UI state - separate from validation state
  const [showUsdComparison, setShowUsdComparison] = useState(false)
  const [showCurrencyTools, setShowCurrencyTools] = useState(false)

  // Form validation state
  const [errors, setErrors] = useState({})
  const [validatedSteps, setValidatedSteps] = useState([])
  const [validationTriggered, setValidationTriggered] = useState(false)

  // Flag to explicitly control when validation should run
  const [shouldValidate, setShouldValidate] = useState(false)

  // Form navigation
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  // Payment calculation
  const [monthlyPayment, setMonthlyPayment] = useState(null)

  // Get regions/states based on selected country
  const [regions, setRegions] = useState([])

  // Add a state variable for displaying exchange rate information
  const [exchangeRateInfo, setExchangeRateInfo] = useState("")

  // Add this state for custom alert
  const [alertMessage, setAlertMessage] = useState("")

  // Toggle function for USD comparison - completely isolated from validation
  const toggleUsdComparison = (e) => {
    if (e) {
      // Prevent any form events
      e.preventDefault()
      e.stopPropagation()
    }

    // Toggle USD comparison without affecting validation
    setShowUsdComparison((prev) => !prev)
  }

  // Toggle function for currency tools - completely isolated from validation
  const toggleCurrencyTools = (e) => {
    if (e) {
      // Prevent any form events
      e.preventDefault()
      e.stopPropagation()
    }

    // Toggle the currency tools visibility without affecting validation
    setShowCurrencyTools((prev) => !prev)
  }

  // Update regions when country changes
  useEffect(() => {
    if (formData.country === "US") {
      setRegions(usStates)
    } else if (formData.country === "CA") {
      setRegions([
        { value: "", label: "Select province" },
        { value: "AB", label: "Alberta" },
        { value: "BC", label: "British Columbia" },
        { value: "MB", label: "Manitoba" },
        { value: "NB", label: "New Brunswick" },
        { value: "NL", label: "Newfoundland and Labrador" },
        { value: "NS", label: "Nova Scotia" },
        { value: "ON", label: "Ontario" },
        { value: "PE", label: "Prince Edward Island" },
        { value: "QC", label: "Quebec" },
        { value: "SK", label: "Saskatchewan" },
        { value: "NT", label: "Northwest Territories" },
        { value: "NU", label: "Nunavut" },
        { value: "YT", label: "Yukon" },
      ])
    } else if (formData.country === "AU") {
      setRegions([
        { value: "", label: "Select state/territory" },
        { value: "ACT", label: "Australian Capital Territory" },
        { value: "NSW", label: "New South Wales" },
        { value: "NT", label: "Northern Territory" },
        { value: "QLD", label: "Queensland" },
        { value: "SA", label: "South Australia" },
        { value: "TAS", label: "Tasmania" },
        { value: "VIC", label: "Victoria" },
        { value: "WA", label: "Western Australia" },
      ])
    } else if (formData.country === "GB") {
      // UK doesn't typically use regions in addresses, but we could add counties if needed
      setRegions([{ value: "", label: "Region not required" }])
    } else {
      // Generic empty state for other countries
      setRegions([{ value: "", label: "Enter province/region below" }])
    }
  }, [formData.country])

  // Calculate monthly payment when loan details change
  useEffect(() => {
    const { loanAmount, interestRate, loanTerm } = formData
    if (loanAmount && interestRate && loanTerm) {
      const payment = calculateMonthlyPayment(loanAmount, interestRate, loanTerm)
      setMonthlyPayment(payment)

      // Add exchange rate information if the currency is not USD
      if (currency !== "USD" && payment) {
        const usdPayment = convertCurrency(payment, currency, "USD")
        setExchangeRateInfo(`Equivalent to approximately ${formatCurrency(usdPayment, "USD")} per month`)
      } else {
        setExchangeRateInfo("")
      }
    } else {
      setMonthlyPayment(null)
      setExchangeRateInfo("")
    }
  }, [formData.loanAmount, formData.interestRate, formData.loanTerm, currency, formData, convertCurrency])

  // Run validation only when shouldValidate is true
  useEffect(() => {
    if (shouldValidate) {
      // Get fields for the current step
      const currentStepFields = STEP_FIELDS[currentStep] || []

      // Validate only the fields in the current step
      const stepErrors = validateLoanForm(formData, currentStepFields)

      // Update errors state
      setErrors(stepErrors)

      // Reset shouldValidate flag
      setShouldValidate(false)

      // If there are errors, show alert
      if (Object.keys(stepErrors).length > 0) {
        // Create a user-friendly error message
        const errorFields = Object.keys(stepErrors).map(formatFieldName).join(", ")

        setAlertMessage(`Please fix the following fields: ${errorFields}`)

        // Add shake animation to the form section
        const formSection = document.querySelector(".form-section")
        if (formSection) {
          formSection.classList.add("shake-error")
          setTimeout(() => {
            formSection.classList.remove("shake-error")
          }, 500)
        }
      }
    }
  }, [shouldValidate, currentStep, formData])

  // Handle input changes without validating
  const handleChange = (e) => {
    const { name, value } = e.target

    // Special handling for phone numbers
    if (name === "phone") {
      setFormData({ ...formData, [name]: formatPhoneNumber(value, formData.country) })
    } else {
      setFormData({ ...formData, [name]: value })
    }

    // Add this to the handleChange function, after the existing code
    if (name === "country" && value) {
      // When country changes, suggest the appropriate currency
      const suggestedCurrency = getDefaultCurrencyForCountry(value)
      if (suggestedCurrency !== currency) {
        // Only show the suggestion if it's different from current selection
        const shouldChange = window.confirm(
          `Would you like to change your currency to ${suggestedCurrency} to match your selected country?`,
        )
        if (shouldChange) {
          setCurrency(suggestedCurrency)
        }
      }
    }
  }

  // Simplified handleBlur - no validation on blur
  const handleBlur = () => {
    // No validation on blur - removed validation logic
  }

  // Helper function to format field name for error messages
  const formatFieldName = (field) => {
    return field.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())
  }

  // Update the nextStep function to validate and show errors only when clicked
  const nextStep = (e) => {
    // Prevent default form submission
    if (e) e.preventDefault()

    // Mark this step as validated
    if (!validatedSteps.includes(currentStep)) {
      setValidatedSteps([...validatedSteps, currentStep])
    }

    // Set validation as triggered
    setValidationTriggered(true)

    // Trigger validation
    setShouldValidate(true)

    // Get fields for the current step
    const currentStepFields = STEP_FIELDS[currentStep] || []

    // Validate only the fields in the current step
    const stepErrors = validateLoanForm(formData, currentStepFields)

    // If there are errors, don't proceed
    if (Object.keys(stepErrors).length > 0) {
      return
    }

    // No errors - proceed to next step
    setCurrentStep(currentStep + 1)
    window.scrollTo(0, 0)
  }

  // Navigate to previous step
  const prevStep = (e) => {
    // Prevent default form submission
    if (e) e.preventDefault()

    // When going back, we should clear errors for the current step
    const currentStepFields = STEP_FIELDS[currentStep] || []

    // Remove this step from validated steps
    setValidatedSteps(validatedSteps.filter((step) => step !== currentStep))

    // Clear errors for current step fields
    const newErrors = { ...errors }
    currentStepFields.forEach((field) => {
      delete newErrors[field]
    })
    setErrors(newErrors)

    // Move to previous step
    setCurrentStep(currentStep - 1)
    window.scrollTo(0, 0)
  }

  // Submit form
  const handleSubmit = (e) => {
    // Always prevent default form submission
    e.preventDefault()

    // Mark this step as validated
    if (!validatedSteps.includes(currentStep)) {
      setValidatedSteps([...validatedSteps, currentStep])
    }

    // Set validation as triggered
    setValidationTriggered(true)

    // Trigger validation
    setShouldValidate(true)

    // Get fields for the current step
    const currentStepFields = STEP_FIELDS[currentStep] || []

    // Validate only the fields in the current step
    const stepErrors = validateLoanForm(formData, currentStepFields)

    // If there are errors, don't submit
    if (Object.keys(stepErrors).length > 0) {
      return
    }

    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      console.log("Form submitted:", formData)
      setIsSubmitting(false)
      setIsSubmitted(true)
      window.scrollTo(0, 0)
    }, 1500)
  }

  // Determine if a field should show an error
  const shouldShowError = (field) => {
    // Only show errors if validation has been triggered for the step containing this field
    const stepContainingField = Object.entries(STEP_FIELDS).find(([_, fields]) => fields.includes(field))?.[0]

    return errors[field] && validatedSteps.includes(Number(stepContainingField))
  }

  // Update the startNewApplication function to reset all states
  const startNewApplication = () => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      dateOfBirth: "",
      country: "",
      address: "",
      city: "",
      state: "",
      province: "",
      postalCode: "",
      loanAmount: "",
      interestRate: "",
      loanTerm: "",
      loanPurpose: "",
      employmentStatus: "",
      employerName: "",
      jobTitle: "",
      yearsEmployed: "",
      monthlyIncome: "",
      creditScore: "",
      existingDebts: "",
      additionalComments: "",
    })
    setErrors({})
    setValidationTriggered(false)
    setValidatedSteps([])
    setCurrentStep(1)
    setIsSubmitted(false)
    setShouldValidate(false)
    window.scrollTo(0, 0)
  }

  // Render form based on current step
  const renderForm = () => {
    if (isSubmitted) {
      return (
        <div className="form-success">
          <div className="success-icon" role="img" aria-label="Success">
            ✓
          </div>
          <h2>Application Submitted Successfully!</h2>
          <p>
            Thank you for submitting your loan application. Our team will review your information and contact you within
            1-2 business days regarding the next steps.
          </p>
          <p>
            Your application reference number is: <strong>#{Math.floor(100000 + Math.random() * 900000)}</strong>
          </p>
          <button onClick={startNewApplication} aria-label="Start a new application">
            Start New Application
          </button>
        </div>
      )
    }

    return (
      <>
        {/* Currency Tools Section - Placed OUTSIDE the form to prevent validation interference */}
        <CurrencyToolsSection
          showCurrencyTools={showCurrencyTools}
          toggleCurrencyTools={toggleCurrencyTools}
          showUsdComparison={showUsdComparison}
          toggleUsdComparison={toggleUsdComparison}
          currency={currency}
          formData={formData}
          monthlyPayment={monthlyPayment}
          exchangeRateInfo={exchangeRateInfo}
        />

        <form onSubmit={handleSubmit} noValidate>
          {/* Form Progress */}
          <div className="form-progress">
            <div className={`progress-step ${currentStep >= 1 ? "active" : ""} ${currentStep > 1 ? "completed" : ""}`}>
              <span className="step-number">1</span>
              <span>Personal Info</span>
            </div>
            <div className={`progress-step ${currentStep >= 2 ? "active" : ""} ${currentStep > 2 ? "completed" : ""}`}>
              <span className="step-number">2</span>
              <span>Address</span>
            </div>
            <div className={`progress-step ${currentStep >= 3 ? "active" : ""} ${currentStep > 3 ? "completed" : ""}`}>
              <span className="step-number">3</span>
              <span>Loan Details</span>
            </div>
            <div className={`progress-step ${currentStep >= 4 ? "active" : ""} ${currentStep > 4 ? "completed" : ""}`}>
              <span className="step-number">4</span>
              <span>Employment</span>
            </div>
            <div className="progress-percentage">
              Step {currentStep} of 4 ({Math.round((currentStep / 4) * 100)}%)
            </div>
          </div>

          <div className="form-content">
            {/* Step 1: Personal Information */}
            {currentStep === 1 && (
              <div className="form-section">
                <h2>Personal Information</h2>

                {/* Error Summary - Only show after validation is triggered for this step */}
                {validatedSteps.includes(1) &&
                  Object.keys(errors).length > 0 &&
                  Object.keys(errors).some((key) => STEP_FIELDS[1].includes(key)) && (
                    <div className="error-summary" role="alert" aria-live="assertive">
                      <h4>Please correct the following errors:</h4>
                      <ul>
                        {Object.keys(errors)
                          .filter((key) => STEP_FIELDS[1].includes(key))
                          .map((key) => (
                            <li key={key}>{errors[key]}</li>
                          ))}
                      </ul>
                    </div>
                  )}

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="firstName">First Name *</label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={shouldShowError("firstName") ? "error" : ""}
                      aria-invalid={shouldShowError("firstName") ? "true" : "false"}
                      aria-describedby={shouldShowError("firstName") ? "firstName-error" : undefined}
                      required
                    />
                    {shouldShowError("firstName") && (
                      <div className="error-message" id="firstName-error" role="alert">
                        {errors.firstName}
                      </div>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="lastName">Last Name *</label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={shouldShowError("lastName") ? "error" : ""}
                      aria-invalid={shouldShowError("lastName") ? "true" : "false"}
                      aria-describedby={shouldShowError("lastName") ? "lastName-error" : undefined}
                      required
                    />
                    {shouldShowError("lastName") && (
                      <div className="error-message" id="lastName-error" role="alert">
                        {errors.lastName}
                      </div>
                    )}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="email">Email Address *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={shouldShowError("email") ? "error" : ""}
                      aria-invalid={shouldShowError("email") ? "true" : "false"}
                      aria-describedby={shouldShowError("email") ? "email-error" : undefined}
                      required
                    />
                    {shouldShowError("email") && (
                      <div className="error-message" id="email-error" role="alert">
                        {errors.email}
                      </div>
                    )}
                  </div>

                  {/* Update the phone input field to support international formats */}
                  <div className="form-group">
                    <label htmlFor="phone">Phone Number *</label>
                    <div className="phone-input-container">
                      {formData.country && (
                        <div className="phone-prefix">
                          {formData.country === "US"
                            ? "+1"
                            : formData.country === "CA"
                              ? "+1"
                              : formData.country === "GB"
                                ? "+44"
                                : formData.country === "AU"
                                  ? "+61"
                                  : formData.country === "DE"
                                    ? "+49"
                                    : formData.country === "FR"
                                      ? "+33"
                                      : formData.country === "JP"
                                        ? "+81"
                                        : formData.country === "CN"
                                          ? "+86"
                                          : formData.country === "IN"
                                            ? "+91"
                                            : formData.country === "BR"
                                              ? "+55"
                                              : formData.country === "NG"
                                                ? "+234"
                                                : formData.country === "ZA"
                                                  ? "+27"
                                                  : formData.country === "KE"
                                                    ? "+254"
                                                    : formData.country === "EG"
                                                      ? "+20"
                                                      : formData.country === "MA"
                                                        ? "+212"
                                                        : formData.country === "GH"
                                                          ? "+233"
                                                          : formData.country === "SN"
                                                            ? "+221"
                                                            : formData.country === "MX"
                                                              ? "+52"
                                                              : formData.country === "AR"
                                                                ? "+54"
                                                                : "+"}
                        </div>
                      )}
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        placeholder={formData.country === "US" ? "(123) 456-7890" : "Enter phone number"}
                        value={formData.phone}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`${shouldShowError("phone") ? "error" : ""} ${formData.country ? "with-prefix" : ""}`}
                        aria-invalid={shouldShowError("phone") ? "true" : "false"}
                        aria-describedby={shouldShowError("phone") ? "phone-error" : undefined}
                        required
                      />
                    </div>
                    {shouldShowError("phone") && (
                      <div className="error-message" id="phone-error" role="alert">
                        {errors.phone}
                      </div>
                    )}
                    {formData.country && (
                      <div className="field-hint">
                        {formData.country === "US" || formData.country === "CA"
                          ? "Format: (123) 456-7890"
                          : "Include area code without leading zeros"}
                      </div>
                    )}
                  </div>
                </div>

                {/* Date of Birth field - make it optional */}
                <div className="form-group">
                  <label htmlFor="dateOfBirth">Date of Birth</label> {/* Removed asterisk */}
                  <input
                    type="date"
                    id="dateOfBirth"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={shouldShowError("dateOfBirth") ? "error" : ""}
                    aria-invalid={shouldShowError("dateOfBirth") ? "true" : "false"}
                    aria-describedby={shouldShowError("dateOfBirth") ? "dateOfBirth-error" : undefined}
                  />
                  {shouldShowError("dateOfBirth") && (
                    <div className="error-message" id="dateOfBirth-error" role="alert">
                      {errors.dateOfBirth}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 2: Address Information */}
            {currentStep === 2 && (
              <div className="form-section">
                <h2>Address Information</h2>

                {/* Error Summary - Only show after validation is triggered for this step */}
                {validatedSteps.includes(2) &&
                  Object.keys(errors).length > 0 &&
                  Object.keys(errors).some((key) => STEP_FIELDS[2].includes(key)) && (
                    <div className="error-summary" role="alert" aria-live="assertive">
                      <h4>Please correct the following errors:</h4>
                      <ul>
                        {Object.keys(errors)
                          .filter((key) => STEP_FIELDS[2].includes(key))
                          .map((key) => (
                            <li key={key}>{errors[key]}</li>
                          ))}
                      </ul>
                    </div>
                  )}

                <div className="form-group">
                  <label htmlFor="country">Country *</label>
                  <select
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={shouldShowError("country") ? "error" : ""}
                    aria-invalid={shouldShowError("country") ? "true" : "false"}
                    aria-describedby={shouldShowError("country") ? "country-error" : undefined}
                    required
                  >
                    {countries.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  {shouldShowError("country") && (
                    <div className="error-message" id="country-error" role="alert">
                      {errors.country}
                    </div>
                  )}
                </div>

                {/* Show the CountryCurrencyPairing component when a country is selected */}
                {formData.country && (
                  <CountryCurrencyPairing
                    country={formData.country}
                    onCurrencyChange={(newCurrency) => setCurrency(newCurrency)}
                  />
                )}

                <div className="form-group">
                  <label htmlFor="address">Street Address *</label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={shouldShowError("address") ? "error" : ""}
                    aria-invalid={shouldShowError("address") ? "true" : "false"}
                    aria-describedby={shouldShowError("address") ? "address-error" : undefined}
                    required
                  />
                  {shouldShowError("address") && (
                    <div className="error-message" id="address-error" role="alert">
                      {errors.address}
                    </div>
                  )}
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="city">City *</label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={shouldShowError("city") ? "error" : ""}
                      aria-invalid={shouldShowError("city") ? "true" : "false"}
                      aria-describedby={shouldShowError("city") ? "city-error" : undefined}
                      required
                    />
                    {shouldShowError("city") && (
                      <div className="error-message" id="city-error" role="alert">
                        {errors.city}
                      </div>
                    )}
                  </div>

                  {/* Show state dropdown for US, province field for other countries */}
                  {formData.country === "US" ? (
                    <div className="form-group">
                      <label htmlFor="state">State *</label>
                      <select
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={shouldShowError("state") ? "error" : ""}
                        aria-invalid={shouldShowError("state") ? "true" : "false"}
                        aria-describedby={shouldShowError("state") ? "state-error" : undefined}
                        required
                      >
                        {regions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      {shouldShowError("state") && (
                        <div className="error-message" id="state-error" role="alert">
                          {errors.state}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="form-group">
                      <label htmlFor="province">
                        {formData.country === "CA"
                          ? "Province"
                          : formData.country === "AU"
                            ? "State/Territory"
                            : "Province/Region"}{" "}
                        {formData.country ? "*" : ""}
                      </label>
                      {regions.length > 1 ? (
                        <select
                          id="province"
                          name="province"
                          value={formData.province}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className={shouldShowError("province") ? "error" : ""}
                          aria-invalid={shouldShowError("province") ? "true" : "false"}
                          aria-describedby={shouldShowError("province") ? "province-error" : undefined}
                          required={!!formData.country}
                          disabled={!formData.country}
                        >
                          {regions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type="text"
                          id="province"
                          name="province"
                          value={formData.province}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className={shouldShowError("province") ? "error" : ""}
                          aria-invalid={shouldShowError("province") ? "true" : "false"}
                          aria-describedby={shouldShowError("province") ? "province-error" : undefined}
                          required={!!formData.country}
                          disabled={!formData.country}
                          placeholder={formData.country ? "Enter province/region" : "Select a country first"}
                        />
                      )}
                      {shouldShowError("province") && (
                        <div className="error-message" id="province-error" role="alert">
                          {errors.province}
                        </div>
                      )}
                    </div>
                  )}

                  <div className="form-group">
                    <label htmlFor="postalCode">{formData.country === "US" ? "ZIP Code" : "Postal Code"} *</label>
                    <input
                      type="text"
                      id="postalCode"
                      name="postalCode"
                      placeholder={
                        formData.country === "US"
                          ? "12345"
                          : formData.country === "CA"
                            ? "A1A 1A1"
                            : formData.country === "GB"
                              ? "SW1A 1AA"
                              : formData.country === "AU"
                                ? "2000"
                                : "Postal Code"
                      }
                      value={formData.postalCode}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={shouldShowError("postalCode") ? "error" : ""}
                      aria-invalid={shouldShowError("postalCode") ? "true" : "false"}
                      aria-describedby={shouldShowError("postalCode") ? "postalCode-error" : undefined}
                      required
                    />
                    {shouldShowError("postalCode") && (
                      <div className="error-message" id="postalCode-error" role="alert">
                        {errors.postalCode}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Loan Details */}
            {currentStep === 3 && (
              <div className="form-section">
                <h2>Loan Details</h2>

                {/* Error Summary - Only show after validation is triggered for this step */}
                {validatedSteps.includes(3) &&
                  Object.keys(errors).length > 0 &&
                  Object.keys(errors).some((key) => STEP_FIELDS[3].includes(key)) && (
                    <div className="error-summary" role="alert" aria-live="assertive">
                      <h4>Please correct the following errors:</h4>
                      <ul>
                        {Object.keys(errors)
                          .filter((key) => STEP_FIELDS[3].includes(key))
                          .map((key) => (
                            <li key={key}>{errors[key]}</li>
                          ))}
                      </ul>
                    </div>
                  )}

                <div className="payment-calculator">
                  <h3>Loan Payment Calculator</h3>
                  <p>Enter your loan details below to calculate your estimated monthly payment.</p>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="loanAmount">Loan Amount *</label>
                      <CurrencyInput
                        id="loanAmount"
                        name="loanAmount"
                        value={formData.loanAmount}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={shouldShowError("loanAmount") ? "error" : ""}
                        aria-invalid={shouldShowError("loanAmount") ? "true" : "false"}
                        aria-describedby={shouldShowError("loanAmount") ? "loanAmount-error" : undefined}
                        required
                      />
                      {shouldShowError("loanAmount") && (
                        <div className="error-message" id="loanAmount-error" role="alert">
                          {errors.loanAmount}
                        </div>
                      )}
                    </div>

                    <div className="form-group">
                      <label htmlFor="interestRate">Interest Rate (%) *</label>
                      <input
                        type="number"
                        id="interestRate"
                        name="interestRate"
                        min="0"
                        step="0.1"
                        value={formData.interestRate}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={shouldShowError("interestRate") ? "error" : ""}
                        aria-invalid={shouldShowError("interestRate") ? "true" : "false"}
                        aria-describedby={shouldShowError("interestRate") ? "interestRate-error" : undefined}
                        required
                      />
                      {shouldShowError("interestRate") && (
                        <div className="error-message" id="interestRate-error" role="alert">
                          {errors.interestRate}
                        </div>
                      )}
                    </div>

                    <div className="form-group">
                      <label htmlFor="loanTerm">Loan Term (Years) *</label>
                      <input
                        type="number"
                        id="loanTerm"
                        name="loanTerm"
                        min="1"
                        max="30"
                        value={formData.loanTerm}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={shouldShowError("loanTerm") ? "error" : ""}
                        aria-invalid={shouldShowError("loanTerm") ? "true" : "false"}
                        aria-describedby={shouldShowError("loanTerm") ? "loanTerm-error" : undefined}
                        required
                      />
                      {shouldShowError("loanTerm") && (
                        <div className="error-message" id="loanTerm-error" role="alert">
                          {errors.loanTerm}
                        </div>
                      )}
                    </div>
                  </div>

                  {monthlyPayment !== null && (
                    <>
                      <div className="calculator-result">
                        <div className="monthly-payment">{formatCurrency(monthlyPayment, currency)}</div>
                        <div className="payment-details">
                          Estimated monthly payment for a {formData.loanTerm}-year loan at {formData.interestRate}%
                          interest
                        </div>
                        {exchangeRateInfo && <div className="exchange-rate-info">{exchangeRateInfo}</div>}
                      </div>

                      <div className="chart-container">
                        {currency !== "USD" && (
                          <div className="chart-controls">
                            <label className="comparison-toggle">
                              <input
                                type="checkbox"
                                checked={showUsdComparison}
                                onChange={(e) => {
                                  e.stopPropagation()
                                  toggleUsdComparison()
                                }}
                              />
                              <span className="toggle-label">Show USD comparison</span>
                            </label>
                          </div>
                        )}
                        <LoanCalculatorChart
                          loanAmount={formData.loanAmount}
                          interestRate={formData.interestRate}
                          loanTerm={formData.loanTerm}
                          currency={currency}
                          showUsdComparison={showUsdComparison}
                        />
                      </div>
                    </>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="loanPurpose">Loan Purpose *</label>
                  <select
                    id="loanPurpose"
                    name="loanPurpose"
                    value={formData.loanPurpose}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={shouldShowError("loanPurpose") ? "error" : ""}
                    aria-invalid={shouldShowError("loanPurpose") ? "true" : "false"}
                    aria-describedby={shouldShowError("loanPurpose") ? "loanPurpose-error" : undefined}
                    required
                  >
                    {loanPurposeOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  {shouldShowError("loanPurpose") && (
                    <div className="error-message" id="loanPurpose-error" role="alert">
                      {errors.loanPurpose}
                    </div>
                  )}
                </div>

                {formData.loanAmount && formData.interestRate && formData.loanTerm && (
                  <div className="currency-summary">
                    <h4>Loan Summary</h4>
                    <div className="summary-item">
                      <span className="summary-label">Loan Amount:</span>
                      <span className="summary-value">{formatCurrency(formData.loanAmount, currency)}</span>
                      {currency !== "USD" && (
                        <span className="summary-conversion">
                          ≈ {formatCurrency(convertCurrency(formData.loanAmount, currency, "USD"), "USD")}
                        </span>
                      )}
                    </div>
                    <div className="summary-item">
                      <span className="summary-label">Monthly Payment:</span>
                      <span className="summary-value">{formatCurrency(monthlyPayment, currency)}</span>
                      {currency !== "USD" && (
                        <span className="summary-conversion">
                          ≈ {formatCurrency(convertCurrency(monthlyPayment, currency, "USD"), "USD")}
                        </span>
                      )}
                    </div>
                    <div className="summary-item">
                      <span className="summary-label">Total Interest:</span>
                      <span className="summary-value">
                        {formatCurrency(monthlyPayment * formData.loanTerm * 12 - formData.loanAmount, currency)}
                      </span>
                      {currency !== "USD" && (
                        <span className="summary-conversion">
                          ≈{" "}
                          {formatCurrency(
                            convertCurrency(
                              monthlyPayment * formData.loanTerm * 12 - formData.loanAmount,
                              currency,
                              "USD",
                            ),
                            "USD",
                          )}
                        </span>
                      )}
                    </div>
                    <div className="summary-item">
                      <span className="summary-label">Total Cost:</span>
                      <span className="summary-value">
                        {formatCurrency(monthlyPayment * formData.loanTerm * 12, currency)}
                      </span>
                      {currency !== "USD" && (
                        <span className="summary-conversion">
                          ≈{" "}
                          {formatCurrency(
                            convertCurrency(monthlyPayment * formData.loanTerm * 12, currency, "USD"),
                            "USD",
                          )}
                        </span>
                      )}
                    </div>
                    {currency !== "USD" && (
                      <div className="currency-note">
                        <p>
                          <strong>Note:</strong> USD equivalents are shown for reference only. Actual amounts may vary
                          based on exchange rates at the time of loan disbursement and repayment.
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Add the multi-currency comparison component */}
                {formData.loanAmount && formData.interestRate && formData.loanTerm && (
                  <LoanCurrencyComparison
                    loanAmount={formData.loanAmount}
                    interestRate={formData.interestRate}
                    loanTerm={formData.loanTerm}
                  />
                )}
              </div>
            )}

            {/* Step 4: Employment Information */}
            {currentStep === 4 && (
              <div className="form-section">
                <h2>Employment Information</h2>

                {/* Error Summary - Only show after validation is triggered for this step */}
                {validatedSteps.includes(4) &&
                  Object.keys(errors).length > 0 &&
                  Object.keys(errors).some((key) => STEP_FIELDS[4].includes(key)) && (
                    <div className="error-summary" role="alert" aria-live="assertive">
                      <h4>Please correct the following errors:</h4>
                      <ul>
                        {Object.keys(errors)
                          .filter((key) => STEP_FIELDS[4].includes(key))
                          .map((key) => (
                            <li key={key}>{errors[key]}</li>
                          ))}
                      </ul>
                    </div>
                  )}

                <div className="form-group">
                  <label htmlFor="employmentStatus">Employment Status *</label>
                  <select
                    id="employmentStatus"
                    name="employmentStatus"
                    value={formData.employmentStatus}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={shouldShowError("employmentStatus") ? "error" : ""}
                    aria-invalid={shouldShowError("employmentStatus") ? "true" : "false"}
                    aria-describedby={shouldShowError("employmentStatus") ? "employmentStatus-error" : undefined}
                    required
                  >
                    {employmentStatusOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  {shouldShowError("employmentStatus") && (
                    <div className="error-message" id="employmentStatus-error" role="alert">
                      {errors.employmentStatus}
                    </div>
                  )}
                </div>

                {formData.employmentStatus && formData.employmentStatus !== "unemployed" && (
                  <>
                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="employerName">Employer Name *</label>
                        <input
                          type="text"
                          id="employerName"
                          name="employerName"
                          value={formData.employerName}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className={shouldShowError("employerName") ? "error" : ""}
                          aria-invalid={shouldShowError("employerName") ? "true" : "false"}
                          aria-describedby={shouldShowError("employerName") ? "employerName-error" : undefined}
                          required
                        />
                        {shouldShowError("employerName") && (
                          <div className="error-message" id="employerName-error" role="alert">
                            {errors.employerName}
                          </div>
                        )}
                      </div>

                      <div className="form-group">
                        <label htmlFor="jobTitle">Job Title</label>
                        <input
                          type="text"
                          id="jobTitle"
                          name="jobTitle"
                          value={formData.jobTitle}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="yearsEmployed">Years at Current Employer</label>
                        <input
                          type="number"
                          id="yearsEmployed"
                          name="yearsEmployed"
                          min="0"
                          step="0.5"
                          value={formData.yearsEmployed}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="monthlyIncome">Monthly Income *</label>
                        <CurrencyInput
                          id="monthlyIncome"
                          name="monthlyIncome"
                          value={formData.monthlyIncome}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className={shouldShowError("monthlyIncome") ? "error" : ""}
                          aria-invalid={shouldShowError("monthlyIncome") ? "true" : "false"}
                          aria-describedby={shouldShowError("monthlyIncome") ? "monthlyIncome-error" : undefined}
                          required
                        />
                        {shouldShowError("monthlyIncome") && (
                          <div className="error-message" id="monthlyIncome-error" role="alert">
                            {errors.monthlyIncome}
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}

                <div className="form-group">
                  <label htmlFor="additionalComments">Additional Comments</label>
                  <textarea
                    id="additionalComments"
                    name="additionalComments"
                    rows="4"
                    value={formData.additionalComments}
                    onChange={handleChange}
                    placeholder="Please provide any additional information that might help us process your application."
                  ></textarea>
                </div>
              </div>
            )}

            {/* Form Navigation */}
            <div className="form-navigation">
              {currentStep > 1 && (
                <button type="button" className="back-btn" onClick={prevStep} aria-label="Go to previous step">
                  Previous
                </button>
              )}

              {currentStep < 4 ? (
                <button type="button" className="next-btn" onClick={nextStep} aria-label="Go to next step">
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  className="submit-btn"
                  disabled={isSubmitting}
                  aria-label="Submit application"
                  aria-busy={isSubmitting ? "true" : "false"}
                >
                  {isSubmitting ? "Submitting..." : "Submit Application"}
                </button>
              )}
            </div>
          </div>
        </form>
      </>
    )
  }

  // Add a back button to return to homepage
  return (
    <div className="loan-application">
      <div className="loan-application-header">
        <Link to="/" className="back-link">
          <span className="back-arrow">←</span> Back to Home
        </Link>
        <h1>Loan Application</h1>
        <p>Complete the form below to apply for a loan. All fields marked with an asterisk (*) are required.</p>
      </div>

      <div className="loan-form-container">
        {alertMessage && <CustomAlert message={alertMessage} onClose={() => setAlertMessage("")} />}
        {renderForm()}
      </div>

      {/* Add Footer component */}
      <Footer />
    </div>
  )
}

export default LoanApplicationForm
