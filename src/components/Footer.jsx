"use client"
import { useNavigate } from "react-router-dom"
import "./Footer.css"

function Footer() {
  const navigate = useNavigate()

  // Scroll to scroll section
  const scrollToSection = (id) => {
    const section = document.getElementById(id)
    if (section) {
      section.scrollIntoView({ behavior: "smooth" })
    }
  }
  return (
    <div className="footer-wrapper">
      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-logo">
            <span className="logo-text">LoanEase</span>
            <p>Simple, Fast, and Transparent Loans</p>
          </div>
          <div className="footer-links">
            <div className="footer-column">
              <h4>Products</h4>
              <a href="#loan-types" onClick={() => scrollToSection("loan-types")}>
                Personal Loans
              </a>
              <a href="#loan-types" onClick={() => scrollToSection("loan-types")}>
                Home Loans
              </a>
              <a href="#loan-types" onClick={() => scrollToSection("loan-types")}>
                Auto Loans
              </a>
              <a href="#loan-types" onClick={() => scrollToSection("loan-types")}>
                Small Business Loans
              </a>
              <a href="#loan-types" onClick={() => scrollToSection("loan-types")}>
                Education Loans
              </a>
            </div>
            <div className="footer-column">
              <h4>Company</h4>
              <a href="#about">About Us</a>
              <a href="#careers">Careers</a>
              <a href="#press">Press</a>
              <a href="#contact">Contact</a>
            </div>
            <div className="footer-column">
              <h4>Resources</h4>
              <a href="#blog">Blog</a>
              <a href="#faq" onClick={() => scrollToSection("faq")}>
                FAQ
              </a>
              <a href="#calculator" onClick={() => scrollToSection("calculator")}>
                Loan Calculator
              </a>
              <a
                href="/currency-converter"
                onClick={(e) => {
                  e.preventDefault()
                  navigate("/currency-converter")
                }}
              >
                Currency Converter
              </a>
            </div>
            <div className="footer-column">
              <h4>Legal</h4>
              <a href="#privacy">Privacy Policy</a>
              <a href="#terms">Terms of Service</a>
              <a href="#security">Security</a>
              <a href="#licenses">Licenses</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2025 LoanEase. All rights reserved.</p>
          <div className="social-links">
            {/* Facebook */}
            <a href="#facebook" aria-label="Facebook">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="social-icon">
                <defs>
                  <linearGradient id="facebook-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#1877F2" />
                    <stop offset="100%" stopColor="#0E5EDB" />
                  </linearGradient>
                </defs>
                <path
                  fill="none"
                  stroke="url(#facebook-gradient)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"
                />
              </svg>
            </a>

            {/* Twitter */}
            <a href="#twitter" aria-label="Twitter">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="social-icon">
                <defs>
                  <linearGradient id="twitter-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#1DA1F2" />
                    <stop offset="100%" stopColor="#0D8BD9" />
                  </linearGradient>
                </defs>
                <path
                  fill="none"
                  stroke="url(#twitter-gradient)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"
                />
              </svg>
            </a>

            {/* Instagram */}
            <a href="#instagram" aria-label="Instagram">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="social-icon">
                <defs>
                  <linearGradient id="instagram-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#f09433" />
                    <stop offset="25%" stopColor="#e6683c" />
                    <stop offset="50%" stopColor="#dc2743" />
                    <stop offset="75%" stopColor="#cc2366" />
                    <stop offset="100%" stopColor="#bc1888" />
                  </linearGradient>
                </defs>
                <rect
                  x="2"
                  y="2"
                  width="20"
                  height="20"
                  rx="5"
                  ry="5"
                  fill="none"
                  stroke="url(#instagram-gradient)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  fill="none"
                  stroke="url(#instagram-gradient)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"
                />
                <line
                  x1="17.5"
                  y1="6.5"
                  x2="17.51"
                  y2="6.5"
                  stroke="url(#instagram-gradient)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>

            {/* LinkedIn */}
            <a href="#linkedin" aria-label="LinkedIn">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="social-icon">
                <defs>
                  <linearGradient id="linkedin-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#0A66C2" />
                    <stop offset="100%" stopColor="#004182" />
                  </linearGradient>
                </defs>
                <path
                  fill="none"
                  stroke="url(#linkedin-gradient)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"
                />
                <rect
                  x="2"
                  y="9"
                  width="4"
                  height="12"
                  fill="none"
                  stroke="url(#linkedin-gradient)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle
                  cx="4"
                  cy="4"
                  r="2"
                  fill="none"
                  stroke="url(#linkedin-gradient)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Footer
