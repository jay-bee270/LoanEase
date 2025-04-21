// Format currency values
export const formatCurrency = (value) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

// Calculate monthly payment
export const calculateMonthlyPayment = (loanAmount, interestRate, loanTermYears) => {
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

// Validate email format
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Validate phone number format (US format)
export const isValidPhone = (phone) => {
  const phoneRegex = /^$$?([0-9]{3})$$?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/
  return phoneRegex.test(phone)
}

// Validate zip code format (US format)
export const isValidZipCode = (zipCode) => {
  const zipRegex = /^\d{5}(-\d{4})?$/
  return zipRegex.test(zipCode)
}

// Validate loan application form
export const validateLoanForm = (formData) => {
  const errors = {}

  // Personal Information Validation
  if (!formData.firstName.trim()) {
    errors.firstName = "First name is required"
  }

  if (!formData.lastName.trim()) {
    errors.lastName = "Last name is required"
  }

  if (!formData.email.trim()) {
    errors.email = "Email is required"
  } else if (!isValidEmail(formData.email)) {
    errors.email = "Please enter a valid email address"
  }

  if (!formData.phone.trim()) {
    errors.phone = "Phone number is required"
  } else if (!isValidPhone(formData.phone)) {
    errors.phone = "Please enter a valid phone number"
  }

  // Address Validation
  if (!formData.address.trim()) {
    errors.address = "Street address is required"
  }

  if (!formData.city.trim()) {
    errors.city = "City is required"
  }

  if (!formData.state.trim()) {
    errors.state = "State is required"
  }

  if (!formData.zipCode.trim()) {
    errors.zipCode = "ZIP code is required"
  } else if (!isValidZipCode(formData.zipCode)) {
    errors.zipCode = "Please enter a valid ZIP code"
  }

  // Loan Details Validation
  if (!formData.loanAmount.trim()) {
    errors.loanAmount = "Loan amount is required"
  } else if (isNaN(formData.loanAmount) || Number.parseFloat(formData.loanAmount) <= 0) {
    errors.loanAmount = "Please enter a valid loan amount"
  }

  if (!formData.interestRate.trim()) {
    errors.interestRate = "Interest rate is required"
  } else if (isNaN(formData.interestRate) || Number.parseFloat(formData.interestRate) < 0) {
    errors.interestRate = "Please enter a valid interest rate"
  }

  if (!formData.loanTerm.trim()) {
    errors.loanTerm = "Loan term is required"
  } else if (isNaN(formData.loanTerm) || Number.parseFloat(formData.loanTerm) <= 0) {
    errors.loanTerm = "Please enter a valid loan term"
  }

  if (!formData.loanPurpose.trim()) {
    errors.loanPurpose = "Loan purpose is required"
  }

  // Employment Information Validation
  if (!formData.employmentStatus.trim()) {
    errors.employmentStatus = "Employment status is required"
  }

  if (formData.employmentStatus !== "Unemployed" && !formData.employerName.trim()) {
    errors.employerName = "Employer name is required"
  }

  if (formData.employmentStatus !== "Unemployed" && !formData.monthlyIncome.trim()) {
    errors.monthlyIncome = "Monthly income is required"
  } else if (
    formData.employmentStatus !== "Unemployed" &&
    (isNaN(formData.monthlyIncome) || Number.parseFloat(formData.monthlyIncome) < 0)
  ) {
    errors.monthlyIncome = "Please enter a valid monthly income"
  }

  return errors
}

// Loan purpose options
export const loanPurposeOptions = [
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

// Employment status options
export const employmentStatusOptions = [
  { value: "", label: "Select employment status" },
  { value: "Full-time", label: "Full-time" },
  { value: "Part-time", label: "Part-time" },
  { value: "Self-employed", label: "Self-employed" },
  { value: "Unemployed", label: "Unemployed" },
  { value: "Retired", label: "Retired" },
  { value: "Student", label: "Student" },
]

// US States for dropdown
export const usStates = [
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

