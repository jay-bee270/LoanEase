"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import "./LoanApplicationForm.css"
import LoanCalculatorChart from "../components/loan-calculator-chart"
import { useCurrency } from "../contexts/CurrencyContext"
import { formatCurrency } from "../utils/currencyUtils"
import CurrencySelector from "../components/CurrencySelector"
import CurrencyInput from "../components/CurrencyInput"

// Validation functions
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

const isValidPhone = (phone) => {
  // Remove all non-digit characters
  const digitsOnly = phone.replace(/\D/g, "")
  // Check if we have exactly 10 digits
  return digitsOnly.length === 10
}

const isValidZipCode = (zipCode) => {
  const zipRegex = /^\d{5}(-\d{4})?$/
  return zipRegex.test(zipCode)
}

// Form options
const loanPurposeOptions = [
  { value: "", label: "Select loan purpose" },
  { value: "home", label: "Home Purchase" },
  { value: "auto", label: "Auto Purchase" },
  { value: "education", label: "Education" },
  { value: "debt_consolidation", label: "Debt Consolidation" },
  { value: "home_improvement", label: "Home Improvement" },
  { value: "business", label: "Business" },
  { value: "medical", label: "Medical Expenses" },
  { value: "other", label: "Other" },
]

const employmentStatusOptions = [
  { value: "", label: "Select employment status" },
  { value: "Full-time", label: "Full-time" },
  { value: "Part-time", label: "Part-time" },
  { value: "Self-employed", label: "Self-employed" },
  { value: "Unemployed", label: "Unemployed" },
  { value: "Retired", label: "Retired" },
  { value: "Student", label: "Student" },
]

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

// Validation function
const validateLoanForm = (formData) => {
  const errors = {}

  // Only validate fields that exist in the formData object
  if ("firstName" in formData) {
    if (!formData.firstName?.trim()) {
      errors.firstName = "First name is required"
    }
  }

  if ("lastName" in formData) {
    if (!formData.lastName?.trim()) {
      errors.lastName = "Last name is required"
    }
  }

  if ("email" in formData) {
    if (!formData.email?.trim()) {
      errors.email = "Email is required"
    } else if (!isValidEmail(formData.email)) {
      errors.email = "Please enter a valid email address"
    }
  }

  if ("phone" in formData) {
    if (!formData.phone?.trim()) {
      errors.phone = "Phone number is required"
    } else if (!isValidPhone(formData.phone)) {
      errors.phone = "Please enter a valid phone number"
    }
  }

  // Address Validation
  if ("address" in formData) {
    if (!formData.address?.trim()) {
      errors.address = "Street address is required"
    }
  }

  if ("city" in formData) {
    if (!formData.city?.trim()) {
      errors.city = "City is required"
    }
  }

  if ("state" in formData) {
    if (!formData.state?.trim()) {
      errors.state = "State is required"
    }
  }

  if ("zipCode" in formData) {
    if (!formData.zipCode?.trim()) {
      errors.zipCode = "ZIP code is required"
    } else if (!isValidZipCode(formData.zipCode)) {
      errors.zipCode = "Please enter a valid ZIP code"
    }
  }

  // Loan Details Validation
  if ("loanAmount" in formData) {
    if (!formData.loanAmount?.toString().trim()) {
      errors.loanAmount = "Loan amount is required"
    } else if (isNaN(formData.loanAmount) || Number.parseFloat(formData.loanAmount) <= 0) {
      errors.loanAmount = "Please enter a valid loan amount"
    }
  }

  if ("interestRate" in formData) {
    if (!formData.interestRate?.toString().trim()) {
      errors.interestRate = "Interest rate is required"
    } else if (isNaN(formData.interestRate) || Number.parseFloat(formData.interestRate) < 0) {
      errors.interestRate = "Please enter a valid interest rate"
    }
  }

  if ("loanTerm" in formData) {
    if (!formData.loanTerm?.toString().trim()) {
      errors.loanTerm = "Loan term is required"
    } else if (isNaN(formData.loanTerm) || Number.parseFloat(formData.loanTerm) <= 0) {
      errors.loanTerm = "Please enter a valid loan term"
    }
  }

  if ("loanPurpose" in formData) {
    if (!formData.loanPurpose?.trim()) {
      errors.loanPurpose = "Loan purpose is required"
    }
  }

  // Employment Information Validation
  if ("employmentStatus" in formData) {
    if (!formData.employmentStatus?.trim()) {
      errors.employmentStatus = "Employment status is required"
    }
  }

  if ("employerName" in formData && "employmentStatus" in formData) {
    if (formData.employmentStatus !== "Unemployed" && !formData.employerName?.trim()) {
      errors.employerName = "Employer name is required"
    }
  }

  if ("monthlyIncome" in formData && "employmentStatus" in formData) {
    if (formData.employmentStatus !== "Unemployed" && !formData.monthlyIncome?.toString().trim()) {
      errors.monthlyIncome = "Monthly income is required"
    } else if (
      formData.employmentStatus !== "Unemployed" &&
      (isNaN(formData.monthlyIncome) || Number.parseFloat(formData.monthlyIncome) < 0)
    ) {
      errors.monthlyIncome = "Please enter a valid monthly income"
    }
  }

  return errors
}

const formatPhoneNumber = (value) => {
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

function LoanApplicationForm() {
  // Get currency context
  const { currency, currencyData } = useCurrency()

  // Form state
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",

    // Address Information
    address: "",
    city: "",
    state: "",
    zipCode: "",

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

  // Form validation
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})

  // Form navigation
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  // Payment calculation
  const [monthlyPayment, setMonthlyPayment] = useState(null)

  // Calculate monthly payment when loan details change
  useEffect(() => {
    const { loanAmount, interestRate, loanTerm } = formData
    if (loanAmount && interestRate && loanTerm) {
      const payment = calculateMonthlyPayment(loanAmount, interestRate, loanTerm)
      setMonthlyPayment(payment)
    } else {
      setMonthlyPayment(null)
    }
  }, [formData.loanAmount, formData.interestRate, formData.loanTerm, formData])

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target

    // Special handling for phone numbers
    if (name === "phone") {
      setFormData({ ...formData, [name]: formatPhoneNumber(value) })
    } else {
      setFormData({ ...formData, [name]: value })
    }

    // Mark field as touched
    if (!touched[name]) {
      setTouched({ ...touched, [name]: true })
    }

    // Clear error for this field when user types
    if (errors[name]) {
      setErrors({ ...errors, [name]: null })
    }
  }

  // Handle blur event for validation
  const handleBlur = (e) => {
    const { name } = e.target
    setTouched({ ...touched, [name]: true })

    // Validate single field
    const fieldErrors = validateLoanForm({ [name]: formData[name] })
    if (fieldErrors[name]) {
      setErrors({ ...errors, [name]: fieldErrors[name] })
    }
  }

  // Navigate to next step
  const nextStep = () => {
    // Validate current step fields
    let currentStepFields = []

    if (currentStep === 1) {
      currentStepFields = ["firstName", "lastName", "email", "phone"]
      // Make dateOfBirth optional
    } else if (currentStep === 2) {
      currentStepFields = ["address", "city", "state", "zipCode"]
    } else if (currentStep === 3) {
      currentStepFields = ["loanAmount", "interestRate", "loanTerm", "loanPurpose"]
    }

    // Create a subset of formData with only the current step fields
    const currentStepData = {}
    currentStepFields.forEach((field) => {
      currentStepData[field] = formData[field]
    })

    // Validate current step
    const stepErrors = validateLoanForm(currentStepData)

    // Mark all fields in this step as touched
    const newTouched = { ...touched }
    currentStepFields.forEach((field) => {
      newTouched[field] = true
    })
    setTouched(newTouched)

    // If there are errors, show them and don't proceed
    if (Object.keys(stepErrors).length > 0) {
      setErrors({ ...errors, ...stepErrors })
      alert("Please fix the errors before proceeding.")
      return
    }

    // Proceed to next step
    setCurrentStep(currentStep + 1)
    window.scrollTo(0, 0)
  }

  // Navigate to previous step
  const prevStep = () => {
    setCurrentStep(currentStep - 1)
    window.scrollTo(0, 0)
  }

  // Submit form
  const handleSubmit = (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Validate all fields
    const formErrors = validateLoanForm(formData)

    // Mark all fields as touched
    const allTouched = {}
    Object.keys(formData).forEach((key) => {
      allTouched[key] = true
    })
    setTouched(allTouched)

    // If there are errors, show them and don't submit
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors)
      setIsSubmitting(false)
      alert("Please fix the errors before submitting.")
      return
    }

    // Simulate API call
    setTimeout(() => {
      console.log("Form submitted:", formData)
      setIsSubmitting(false)
      setIsSubmitted(true)
      window.scrollTo(0, 0)
    }, 1500)
  }

  // Start a new application
  const startNewApplication = () => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      dateOfBirth: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
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
    setTouched({})
    setCurrentStep(1)
    setIsSubmitted(false)
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
      <form onSubmit={handleSubmit} noValidate>
        {/* Currency Selector */}
        <div className="currency-settings">
          <h3>Currency Settings</h3>
          <p>Select your preferred currency for this application</p>
          <CurrencySelector />
        </div>

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
                    className={errors.firstName && touched.firstName ? "error" : ""}
                    aria-invalid={errors.firstName && touched.firstName ? "true" : "false"}
                    aria-describedby={errors.firstName ? "firstName-error" : undefined}
                    required
                  />
                  {errors.firstName && touched.firstName && (
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
                    className={errors.lastName && touched.lastName ? "error" : ""}
                    aria-invalid={errors.lastName && touched.lastName ? "true" : "false"}
                    aria-describedby={errors.lastName ? "lastName-error" : undefined}
                    required
                  />
                  {errors.lastName && touched.lastName && (
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
                    className={errors.email && touched.email ? "error" : ""}
                    aria-invalid={errors.email && touched.email ? "true" : "false"}
                    aria-describedby={errors.email ? "email-error" : undefined}
                    required
                  />
                  {errors.email && touched.email && (
                    <div className="error-message" id="email-error" role="alert">
                      {errors.email}
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="phone">Phone Number *</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    placeholder="(123) 456-7890"
                    value={formData.phone}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={errors.phone && touched.phone ? "error" : ""}
                    aria-invalid={errors.phone && touched.phone ? "true" : "false"}
                    aria-describedby={errors.phone ? "phone-error" : undefined}
                    required
                  />
                  {errors.phone && touched.phone && (
                    <div className="error-message" id="phone-error" role="alert">
                      {errors.phone}
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
                  className={errors.dateOfBirth && touched.dateOfBirth ? "error" : ""}
                  aria-invalid={errors.dateOfBirth && touched.dateOfBirth ? "true" : "false"}
                  aria-describedby={errors.dateOfBirth ? "dateOfBirth-error" : undefined}
                />
                {errors.dateOfBirth && touched.dateOfBirth && (
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
              <div className="form-group">
                <label htmlFor="address">Street Address *</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={errors.address && touched.address ? "error" : ""}
                  aria-invalid={errors.address && touched.address ? "true" : "false"}
                  aria-describedby={errors.address ? "address-error" : undefined}
                  required
                />
                {errors.address && touched.address && (
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
                    className={errors.city && touched.city ? "error" : ""}
                    aria-invalid={errors.city && touched.city ? "true" : "false"}
                    aria-describedby={errors.city ? "city-error" : undefined}
                    required
                  />
                  {errors.city && touched.city && (
                    <div className="error-message" id="city-error" role="alert">
                      {errors.city}
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="state">State *</label>
                  <select
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={errors.state && touched.state ? "error" : ""}
                    aria-invalid={errors.state && touched.state ? "true" : "false"}
                    aria-describedby={errors.state ? "state-error" : undefined}
                    required
                  >
                    {usStates.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  {errors.state && touched.state && (
                    <div className="error-message" id="state-error" role="alert">
                      {errors.state}
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="zipCode">ZIP Code *</label>
                  <input
                    type="text"
                    id="zipCode"
                    name="zipCode"
                    placeholder="12345"
                    value={formData.zipCode}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={errors.zipCode && touched.zipCode ? "error" : ""}
                    aria-invalid={errors.zipCode && touched.zipCode ? "true" : "false"}
                    aria-describedby={errors.zipCode ? "zipCode-error" : undefined}
                    required
                  />
                  {errors.zipCode && touched.zipCode && (
                    <div className="error-message" id="zipCode-error" role="alert">
                      {errors.zipCode}
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
                      className={errors.loanAmount && touched.loanAmount ? "error" : ""}
                      aria-invalid={errors.loanAmount && touched.loanAmount ? "true" : "false"}
                      aria-describedby={errors.loanAmount ? "loanAmount-error" : undefined}
                      required
                    />
                    {errors.loanAmount && touched.loanAmount && (
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
                      className={errors.interestRate && touched.interestRate ? "error" : ""}
                      aria-invalid={errors.interestRate && touched.interestRate ? "true" : "false"}
                      aria-describedby={errors.interestRate ? "interestRate-error" : undefined}
                      required
                    />
                    {errors.interestRate && touched.interestRate && (
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
                      className={errors.loanTerm && touched.loanTerm ? "error" : ""}
                      aria-invalid={errors.loanTerm && touched.loanTerm ? "true" : "false"}
                      aria-describedby={errors.loanTerm ? "loanTerm-error" : undefined}
                      required
                    />
                    {errors.loanTerm && touched.loanTerm && (
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
                    </div>

                    <div className="chart-container">
                      <LoanCalculatorChart
                        loanAmount={formData.loanAmount}
                        interestRate={formData.interestRate}
                        loanTerm={formData.loanTerm}
                        currency={currency}
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
                  className={errors.loanPurpose && touched.loanPurpose ? "error" : ""}
                  aria-invalid={errors.loanPurpose && touched.loanPurpose ? "true" : "false"}
                  aria-describedby={errors.loanPurpose ? "loanPurpose-error" : undefined}
                  required
                >
                  {loanPurposeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {errors.loanPurpose && touched.loanPurpose && (
                  <div className="error-message" id="loanPurpose-error" role="alert">
                    {errors.loanPurpose}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 4: Employment Information */}
          {currentStep === 4 && (
            <div className="form-section">
              <h2>Employment Information</h2>

              <div className="form-group">
                <label htmlFor="employmentStatus">Employment Status *</label>
                <select
                  id="employmentStatus"
                  name="employmentStatus"
                  value={formData.employmentStatus}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={errors.employmentStatus && touched.employmentStatus ? "error" : ""}
                  aria-invalid={errors.employmentStatus && touched.employmentStatus ? "true" : "false"}
                  aria-describedby={errors.employmentStatus ? "employmentStatus-error" : undefined}
                  required
                >
                  {employmentStatusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {errors.employmentStatus && touched.employmentStatus && (
                  <div className="error-message" id="employmentStatus-error" role="alert">
                    {errors.employmentStatus}
                  </div>
                )}
              </div>

              {formData.employmentStatus && formData.employmentStatus !== "Unemployed" && (
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
                        className={errors.employerName && touched.employerName ? "error" : ""}
                        aria-invalid={errors.employerName && touched.employerName ? "true" : "false"}
                        aria-describedby={errors.employerName ? "employerName-error" : undefined}
                        required
                      />
                      {errors.employerName && touched.employerName && (
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
                        className={errors.monthlyIncome && touched.monthlyIncome ? "error" : ""}
                        aria-invalid={errors.monthlyIncome && touched.monthlyIncome ? "true" : "false"}
                        aria-describedby={errors.monthlyIncome ? "monthlyIncome-error" : undefined}
                        required
                      />
                      {errors.monthlyIncome && touched.monthlyIncome && (
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

      <div className="loan-form-container">{renderForm()}</div>
    </div>
  )
}

export default LoanApplicationForm
