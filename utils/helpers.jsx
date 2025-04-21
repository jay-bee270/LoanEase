// Format currency values
export const formatCurrency = (value) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

// Format date values
export const formatDate = (dateString) => {
  const options = { year: "numeric", month: "long", day: "numeric" }
  return new Date(dateString).toLocaleDateString("en-US", options)
}

// Format percentage values
export const formatPercentage = (value) => {
  return `${value.toFixed(2)}%`
}

// Calculate monthly payment
export const calculateMonthlyPayment = (loan) => {
  try {
    const P = loan.amount
    const annualRate = loan.interestRate
    const r = annualRate / 100 / 12

    // Calculate number of months between issue date and due date
    const issueDate = new Date(loan.dateIssued)
    const dueDate = new Date(loan.dueDate)
    const monthDiff =
      (dueDate.getFullYear() - issueDate.getFullYear()) * 12 + (dueDate.getMonth() - issueDate.getMonth())

    const n = monthDiff

    if (n <= 0) return "Invalid dates"
    if (r === 0) return formatCurrency(P / n)

    const M = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
    return isNaN(M) ? "Calculation error" : formatCurrency(M)
  } catch (error) {
    console.error("Error calculating payment:", error)
    return "Error"
  }
}

// Validate loan form
export const validateLoanForm = (loan) => {
  const errors = {}

  if (!loan.title.trim()) errors.title = "Title is required"
  if (!loan.amount) errors.amount = "Amount is required"
  else if (loan.amount <= 0) errors.amount = "Amount must be greater than 0"

  if (!loan.interestRate && loan.interestRate !== 0) errors.interestRate = "Interest rate is required"
  else if (loan.interestRate < 0) errors.interestRate = "Interest rate cannot be negative"

  if (!loan.dueDate) errors.dueDate = "Due date is required"
  else {
    const dueDate = new Date(loan.dueDate)
    const today = new Date()
    if (dueDate <= today) errors.dueDate = "Due date must be in the future"
  }

  if (!loan.dateIssued) errors.dateIssued = "Issue date is required"
  else if (loan.dueDate && new Date(loan.dateIssued) >= new Date(loan.dueDate)) {
    errors.dateIssued = "Issue date must be before due date"
  }

  return errors
}

// Get loan status color
export const getLoanStatusColor = (status) => {
  const statusMap = {
    Active: "primary",
    Paid: "success",
    Defaulted: "error",
    Pending: "warning",
  }

  return statusMap[status] || "primary"
}

// Get loan summary statistics
export const getLoanSummary = (loans) => {
  const totalAmount = loans.reduce((sum, loan) => sum + loan.amount, 0)
  const activeLoans = loans.filter((loan) => loan.status === "Active").length
  const paidLoans = loans.filter((loan) => loan.status === "Paid").length
  const totalLoans = loans.length

  return { totalAmount, activeLoans, paidLoans, totalLoans }
}

