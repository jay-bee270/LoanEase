"use client"

import { useState, useEffect } from "react"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import "./LoanApplication.css"
import Layoutone from "../../Layout/Layoutone"
import {
  formatCurrency,
  calculateMonthlyPayment,
  validateLoanForm,
  loanPurposeOptions,
  employmentStatusOptions,
  usStates,
} from "../../utils/loanUtils"

function LoanApplication() {
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
  }, [formData.loanAmount, formData.interestRate, formData.loanTerm, calculateMonthlyPayment])

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })

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
      currentStepFields = ["firstName", "lastName", "email", "phone", "dateOfBirth"]
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
      toast.error("Please fix the errors before proceeding.")
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
      toast.error("Please fix the errors before submitting.")
      return
    }

    // Simulate API call
    setTimeout(() => {
      console.log("Form submitted:", formData)
      setIsSubmitting(false)
      setIsSubmitted(true)
      toast.success("Loan application submitted successfully!")
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
          <div className="success-icon">✓</div>
          <h2>Application Submitted Successfully!</h2>
          <p>
            Thank you for submitting your loan application. Our team will review your information and contact you within
            1-2 business days regarding the next steps.
          </p>
          <p>
            Your application reference number is: <strong>#{Math.floor(100000 + Math.random() * 900000)}</strong>
          </p>
          <button onClick={startNewApplication}>Start New Application</button>
        </div>
      )
    }

    return (
      <form onSubmit={handleSubmit}>
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
                  />
                  {errors.firstName && touched.firstName && (
                    <div className="error-message" id="firstName-error">
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
                  />
                  {errors.lastName && touched.lastName && (
                    <div className="error-message" id="lastName-error">
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
                  />
                  {errors.email && touched.email && (
                    <div className="error-message" id="email-error">
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
                  />
                  {errors.phone && touched.phone && (
                    <div className="error-message" id="phone-error">
                      {errors.phone}
                    </div>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="dateOfBirth">Date of Birth *</label>
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
                  <div className="error-message" id="dateOfBirth-error">
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
                />
                {errors.address && touched.address && (
                  <div className="error-message" id="address-error">
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
                  />
                  {errors.city && touched.city && (
                    <div className="error-message" id="city-error">
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
                  >
                    {usStates.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  {errors.state && touched.state && (
                    <div className="error-message" id="state-error">
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
                  />
                  {errors.zipCode && touched.zipCode && (
                    <div className="error-message" id="zipCode-error">
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
                    <label htmlFor="loanAmount">Loan Amount ($) *</label>
                    <input
                      type="number"
                      id="loanAmount"
                      name="loanAmount"
                      min="1000"
                      step="1000"
                      value={formData.loanAmount}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={errors.loanAmount && touched.loanAmount ? "error" : ""}
                      aria-invalid={errors.loanAmount && touched.loanAmount ? "true" : "false"}
                      aria-describedby={errors.loanAmount ? "loanAmount-error" : undefined}
                    />
                    {errors.loanAmount && touched.loanAmount && (
                      <div className="error-message" id="loanAmount-error">
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
                    />
                    {errors.interestRate && touched.interestRate && (
                      <div className="error-message" id="interestRate-error">
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
                    />
                    {errors.loanTerm && touched.loanTerm && (
                      <div className="error-message" id="loanTerm-error">
                        {errors.loanTerm}
                      </div>
                    )}
                  </div>
                </div>

                {monthlyPayment !== null && (
                  <div className="calculator-result">
                    <div className="monthly-payment">{formatCurrency(monthlyPayment)}</div>
                    <div className="payment-details">
                      Estimated monthly payment for a {formData.loanTerm}-year loan at {formData.interestRate}% interest
                    </div>
                  </div>
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
                >
                  {loanPurposeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {errors.loanPurpose && touched.loanPurpose && (
                  <div className="error-message" id="loanPurpose-error">
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
                >
                  {employmentStatusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {errors.employmentStatus && touched.employmentStatus && (
                  <div className="error-message" id="employmentStatus-error">
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
                      />
                      {errors.employerName && touched.employerName && (
                        <div className="error-message" id="employerName-error">
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
                      <label htmlFor="monthlyIncome">Monthly Income ($) *</label>
                      <input
                        type="number"
                        id="monthlyIncome"
                        name="monthlyIncome"
                        min="0"
                        step="100"
                        value={formData.monthlyIncome}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={errors.monthlyIncome && touched.monthlyIncome ? "error" : ""}
                        aria-invalid={errors.monthlyIncome && touched.monthlyIncome ? "true" : "false"}
                        aria-describedby={errors.monthlyIncome ? "monthlyIncome-error" : undefined}
                      />
                      {errors.monthlyIncome && touched.monthlyIncome && (
                        <div className="error-message" id="monthlyIncome-error">
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
              <button type="button" className="back-btn" onClick={prevStep}>
                Previous
              </button>
            )}

            {currentStep < 4 ? (
              <button type="button" className="next-btn" onClick={nextStep}>
                Next
              </button>
            ) : (
              <button type="submit" className="submit-btn" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit Application"}
              </button>
            )}
          </div>
        </div>
      </form>
    )
  }

  return (
    <Layoutone>
      <div className="loan-application">
        <div className="loan-application-header">
          <h1>Loan Application</h1>
          <p>Complete the form below to apply for a loan. All fields marked with an asterisk (*) are required.</p>
        </div>

        <div className="loan-form-container">{renderForm()}</div>

        <ToastContainer position="bottom-right" />
      </div>
    </Layoutone>
  )
}

export default LoanApplication

