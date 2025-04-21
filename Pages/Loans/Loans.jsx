"use client"

import { useState, useEffect } from "react"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import "./Loans.css"
import Layoutone from "../../Layout/Layoutone"
import {
  formatCurrency,
  formatDate,
  formatPercentage,
  calculateMonthlyPayment,
  validateLoanForm,
  getLoanSummary,
} from "../../utils/helpers"
import { Link } from "react-router-dom"

function LoanManagement() {
  // Initial loan data
  const initialLoans = [
    {
      id: 1,
      title: "Car Loan",
      amount: 15000,
      interestRate: 5.5,
      dueDate: "2024-12-31",
      dateIssued: "2023-01-01",
      status: "Active",
    },
    {
      id: 2,
      title: "Personal Loan",
      amount: 5000,
      interestRate: 7.2,
      dueDate: "2025-06-30",
      status: "Active",
    },
    {
      id: 3,
      title: "Home Loan",
      amount: 120000,
      interestRate: 3.8,
      dueDate: "2035-10-15",
      status: "Active",
    },
    {
      id: 4,
      title: "Student Loan",
      amount: 20000,
      interestRate: 4.5,
      dueDate: "2030-08-01",
      status: "Paid",
    },
    {
      id: 5,
      title: "Business Loan",
      amount: 75000,
      interestRate: 6.0,
      dueDate: "2027-03-22",
      status: "Active",
    },
    {
      id: 6,
      title: "Credit Card Loan",
      amount: 3000,
      interestRate: 18.9,
      dueDate: "2024-11-10",
      status: "Defaulted",
    },
    {
      id: 7,
      title: "Land Loan",
      amount: 50000,
      interestRate: 8.5,
      dueDate: "2028-05-15",
      status: "Pending",
    },
  ]

  // State management
  const [loans, setLoans] = useState(() => {
    const savedLoans = localStorage.getItem("loans")
    return savedLoans ? JSON.parse(savedLoans) : initialLoans
  })

  const [newLoan, setNewLoan] = useState({
    title: "",
    amount: "",
    interestRate: "",
    dueDate: "",
    dateIssued: "",
    status: "Active",
  })

  const [searchQuery, setSearchQuery] = useState("")
  const [isEditing, setIsEditing] = useState(false)
  const [currentLoan, setCurrentLoan] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [formErrors, setFormErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const loansPerPage = 5
  const statusOptions = ["Active", "Paid", "Defaulted", "Pending"]

  // Save loans to localStorage when they change
  useEffect(() => {
    localStorage.setItem("loans", JSON.stringify(loans))
  }, [loans])

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setNewLoan({ ...newLoan, [name]: value })

    // Clear error for this field when user types
    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: null })
    }
  }

  // Handle edit form input changes
  const handleEditChange = (e) => {
    const { name, value } = e.target
    setCurrentLoan({ ...currentLoan, [name]: value })

    // Clear error for this field when user types
    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: null })
    }
  }

  // Add new loan
  const addLoan = (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Validate form
    const errors = validateLoanForm(newLoan)
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      setIsSubmitting(false)
      return
    }

    // Create new loan object
    const loanToAdd = {
      id: loans.length > 0 ? Math.max(...loans.map((loan) => loan.id)) + 1 : 1,
      title: newLoan.title,
      amount: Number.parseFloat(newLoan.amount),
      interestRate: Number.parseFloat(newLoan.interestRate),
      dueDate: newLoan.dueDate,
      dateIssued: newLoan.dateIssued,
      status: newLoan.status,
    }

    // Add to loans array
    setLoans([...loans, loanToAdd])

    // Reset form
    setNewLoan({
      title: "",
      amount: "",
      interestRate: "",
      dueDate: "",
      dateIssued: "",
      status: "Active",
    })

    setFormErrors({})
    setIsSubmitting(false)
    toast.success("Loan added successfully")
  }

  // Delete loan
  const deleteLoan = (id) => {
    if (window.confirm("Are you sure you want to delete this loan?")) {
      setLoans(loans.filter((loan) => loan.id !== id))
      toast.success("Loan deleted successfully")
    }
  }

  // Start editing a loan
  const startEditing = (loan) => {
    setIsEditing(true)
    setCurrentLoan(loan)
    setFormErrors({})
  }

  // Save edited loan
  const saveLoan = (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Validate form
    const errors = validateLoanForm(currentLoan)
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      setIsSubmitting(false)
      return
    }

    // Update loan in array
    setLoans(
      loans.map((loan) =>
        loan.id === currentLoan.id
          ? {
              ...currentLoan,
              amount: Number.parseFloat(currentLoan.amount),
              interestRate: Number.parseFloat(currentLoan.interestRate),
            }
          : loan,
      ),
    )

    // Reset editing state
    setIsEditing(false)
    setCurrentLoan(null)
    setFormErrors({})
    setIsSubmitting(false)
    toast.success("Loan updated successfully")
  }

  // Cancel editing
  const cancelEditing = () => {
    setIsEditing(false)
    setCurrentLoan(null)
    setFormErrors({})
  }

  // Filter loans based on search query
  const filteredLoans = loans.filter((loan) => loan.title.toLowerCase().includes(searchQuery.toLowerCase()))

  // Paginate loans
  const indexOfLastLoan = currentPage * loansPerPage
  const indexOfFirstLoan = indexOfLastLoan - loansPerPage
  const currentLoans = filteredLoans.slice(indexOfFirstLoan, indexOfLastLoan)
  const totalPages = Math.ceil(filteredLoans.length / loansPerPage)

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  // Get loan summary
  const summary = getLoanSummary(loans)

  return (
    <Layoutone>
      <div className="loan-management">
        <h2>Loan Management</h2>
        <div className="loan-actions-header">
          <Link to="/apply-for-loan" className="apply-loan-button">
            Apply for a New Loan
          </Link>
        </div>

        {/* Loan Summary */}
        <div className="loan-summary">
          <div className="summary-card">
            <h4>Total Loans</h4>
            <p>{summary.totalLoans}</p>
          </div>
          <div className="summary-card">
            <h4>Active Loans</h4>
            <p>{summary.activeLoans}</p>
          </div>
          <div className="summary-card">
            <h4>Total Amount</h4>
            <p>{formatCurrency(summary.totalAmount)}</p>
          </div>
          <div className="summary-card">
            <h4>Paid Loans</h4>
            <p>{summary.paidLoans}</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search for loans by title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search loans"
          />
        </div>

        {/* Loan Form */}
        <div className="loan-form">
          <h3>{isEditing ? "Edit Loan" : "Add New Loan"}</h3>
          <form onSubmit={isEditing ? saveLoan : addLoan}>
            <div className="form-group">
              <label htmlFor="title">Loan Title</label>
              <input
                type="text"
                id="title"
                name="title"
                value={isEditing ? currentLoan.title : newLoan.title}
                onChange={isEditing ? handleEditChange : handleInputChange}
                aria-invalid={formErrors.title ? "true" : "false"}
                aria-describedby={formErrors.title ? "title-error" : undefined}
              />
              {formErrors.title && (
                <div className="error-message" id="title-error">
                  {formErrors.title}
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="amount">Amount ($)</label>
              <input
                type="number"
                id="amount"
                name="amount"
                value={isEditing ? currentLoan.amount : newLoan.amount}
                onChange={isEditing ? handleEditChange : handleInputChange}
                aria-invalid={formErrors.amount ? "true" : "false"}
                aria-describedby={formErrors.amount ? "amount-error" : undefined}
              />
              {formErrors.amount && (
                <div className="error-message" id="amount-error">
                  {formErrors.amount}
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="interestRate">Interest Rate (%)</label>
              <input
                type="number"
                step="0.01"
                id="interestRate"
                name="interestRate"
                value={isEditing ? currentLoan.interestRate : newLoan.interestRate}
                onChange={isEditing ? handleEditChange : handleInputChange}
                aria-invalid={formErrors.interestRate ? "true" : "false"}
                aria-describedby={formErrors.interestRate ? "interestRate-error" : undefined}
              />
              {formErrors.interestRate && (
                <div className="error-message" id="interestRate-error">
                  {formErrors.interestRate}
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="dateIssued">Date Issued</label>
              <input
                type="date"
                id="dateIssued"
                name="dateIssued"
                value={isEditing ? currentLoan.dateIssued : newLoan.dateIssued}
                onChange={isEditing ? handleEditChange : handleInputChange}
                aria-invalid={formErrors.dateIssued ? "true" : "false"}
                aria-describedby={formErrors.dateIssued ? "dateIssued-error" : undefined}
              />
              {formErrors.dateIssued && (
                <div className="error-message" id="dateIssued-error">
                  {formErrors.dateIssued}
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="dueDate">Due Date</label>
              <input
                type="date"
                id="dueDate"
                name="dueDate"
                value={isEditing ? currentLoan.dueDate : newLoan.dueDate}
                onChange={isEditing ? handleEditChange : handleInputChange}
                aria-invalid={formErrors.dueDate ? "true" : "false"}
                aria-describedby={formErrors.dueDate ? "dueDate-error" : undefined}
              />
              {formErrors.dueDate && (
                <div className="error-message" id="dueDate-error">
                  {formErrors.dueDate}
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="status">Status</label>
              <select
                id="status"
                name="status"
                value={isEditing ? currentLoan.status : newLoan.status}
                onChange={isEditing ? handleEditChange : handleInputChange}
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-actions">
              <button type="submit" className="primary" disabled={isSubmitting}>
                {isSubmitting ? "Processing..." : isEditing ? "Save Changes" : "Add Loan"}
              </button>

              {isEditing && (
                <button type="button" className="secondary" onClick={cancelEditing}>
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Loan List */}
        <div className="loan-list">
          <h3>Your Loans</h3>

          {filteredLoans.length === 0 ? (
            <div className="loan-list-empty">
              <p>No loans found. Add a new loan to get started.</p>
            </div>
          ) : (
            <>
              <div className="loan-table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Amount</th>
                      <th>Interest Rate</th>
                      <th>Issue Date</th>
                      <th>Due Date</th>
                      <th>Status</th>
                      <th>Monthly Payment</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentLoans.map((loan) => (
                      <tr key={loan.id}>
                        <td>{loan.title}</td>
                        <td>{formatCurrency(loan.amount)}</td>
                        <td>{formatPercentage(loan.interestRate)}</td>
                        <td>{formatDate(loan.dateIssued)}</td>
                        <td>{formatDate(loan.dueDate)}</td>
                        <td className={`status-cell status-${loan.status.toLowerCase()}`}>{loan.status}</td>
                        <td>{calculateMonthlyPayment(loan)}</td>
                        <td>
                          <div className="loan-actions">
                            <button
                              className="primary"
                              onClick={() => startEditing(loan)}
                              aria-label={`Edit ${loan.title}`}
                            >
                              Edit
                            </button>
                            <button
                              className="danger"
                              onClick={() => deleteLoan(loan.id)}
                              aria-label={`Delete ${loan.title}`}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="pagination">
                  <button onClick={() => paginate(1)} disabled={currentPage === 1} aria-label="Go to first page">
                    First
                  </button>
                  <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    aria-label="Go to previous page"
                  >
                    Prev
                  </button>

                  {[...Array(totalPages).keys()].map((number) => (
                    <button
                      key={number + 1}
                      onClick={() => paginate(number + 1)}
                      className={currentPage === number + 1 ? "active" : ""}
                      aria-label={`Go to page ${number + 1}`}
                      aria-current={currentPage === number + 1 ? "page" : undefined}
                    >
                      {number + 1}
                    </button>
                  ))}

                  <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    aria-label="Go to next page"
                  >
                    Next
                  </button>
                  <button
                    onClick={() => paginate(totalPages)}
                    disabled={currentPage === totalPages}
                    aria-label="Go to last page"
                  >
                    Last
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        <ToastContainer position="bottom-right" />
      </div>
    </Layoutone>
  )
}

export default LoanManagement

