"use client"

import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import "./HomePage.css"
import familyImg from "../assets/family.webp"
import Personal from "../assets/personal.jpeg"
import Home from "../assets/home.jpeg"
import Auto from "../assets/auto.jpeg"
import Education from "../assets/education.jpeg"
import Business from "../assets/business.jpeg"
import Calculator from "../assets/calculator1.jpeg"
import CurrencySelector from "../components/CurrencySelector"
import { useCurrency } from "../contexts/CurrencyContext"
import { formatCurrency } from "../utils/currencyUtils"

const HomePage = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState("personal")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  const { currency } = useCurrency()

  // Refs for scroll reveal
  const featuresRef = useRef(null)
  const loanTypesRef = useRef(null)
  const calculatorRef = useRef(null)
  const testimonialsRef = useRef(null)
  const faqRef = useRef(null)
  const ctaRef = useRef(null)

  // Handle navigation
  const handleApplyNow = () => {
    // Ensuring this function works correctly to navigate to apply page
    navigate("/apply")
  }

  const handleTabChange = (tab) => {
    setActiveTab(tab)
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
    // Toggle body class to prevent scrolling when menu is open
    if (!isMobileMenuOpen) {
      document.body.classList.add("menu-open")
    } else {
      document.body.classList.remove("menu-open")
    }
  }

  // Scroll reveal effect
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)

      // Add scrolled class to navbar when scrolled down
      const navbar = document.querySelector(".navbar")
      if (navbar) {
        if (window.scrollY > 50) {
          navbar.classList.add("scrolled")
        } else {
          navbar.classList.remove("scrolled")
        }
      }

      const revealElements = document.querySelectorAll(".reveal, .reveal-left, .reveal-right, .reveal-up")

      revealElements.forEach((element) => {
        const elementTop = element.getBoundingClientRect().top
        const elementVisible = 150

        if (elementTop < window.innerHeight - elementVisible) {
          element.classList.add("active")
        }
      })
    }

    window.addEventListener("scroll", handleScroll)
    handleScroll() // Initial check

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  // Close mobile menu when a link is clicked
  const handleMobileLinkClick = () => {
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false)
      document.body.classList.remove("menu-open")
    }
  }

  // Scroll to section function
  const scrollToSection = (id) => {
    const section = document.getElementById(id)
    if (section) {
      section.scrollIntoView({ behavior: "smooth" })
    }
    handleMobileLinkClick()
  }

  // Sample loan amounts for different loan types
  const loanAmounts = {
    personal: 25000,
    home: 350000,
    auto: 35000,
    "small-business": 150000,
    education: 50000,
  }

  useEffect(() => {
    return () => {
      // Clean up - remove class when component unmounts
      document.body.classList.remove("menu-open")
    }
  }, [])

  return (
    <div className={`homepage ${isMobileMenuOpen ? "mobile-menu-open" : ""}`}>
      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="navbar-container">
          <div className="logo">
            <span className="logo-text">LoanEase</span>
            <span className="logo-accent">Financial Freedom</span>
          </div>

          <button
            className="mobile-menu-btn"
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
            aria-expanded={isMobileMenuOpen}
          >
            <span className="menu-icon"></span>
          </button>

          <div className={`nav-links ${isMobileMenuOpen ? "active" : ""}`}>
            <div className="nav-group">
              <a href="#features" onClick={() => scrollToSection("features")} className="nav-link">
                <span className="nav-link-text">Features</span>
              </a>
              <a href="#loan-types" onClick={() => scrollToSection("loan-types")} className="nav-link">
                <span className="nav-link-text">Loan Types</span>
              </a>
              <a href="#testimonials" onClick={() => scrollToSection("testimonials")} className="nav-link">
                <span className="nav-link-text">Testimonials</span>
              </a>
              <a href="#faq" onClick={() => scrollToSection("faq")} className="nav-link">
                <span className="nav-link-text">FAQ</span>
              </a>
            </div>

            <div className="nav-actions">
              <CurrencySelector compact={true} className="nav-currency-selector" />
              <button className="nav-cta" onClick={handleApplyNow}>
                Apply Now
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="fade-in">Simple, Fast, and Transparent Loans</h1>
          <p className="slide-up">
            Get the financial support you need with our streamlined loan application process. No hidden fees,
            competitive rates, and quick approvals.
          </p>
          <button className="cta-button slide-up" onClick={handleApplyNow}>
            Start Your Application
          </button>
        </div>
        <div className="hero-image scale-in">
          <img src={familyImg || "/placeholder.svg"} alt="Happy family planning their finances" loading="eager" />
        </div>
      </section>

      {/* Features Section */}
      <section className="features" id="features" ref={featuresRef}>
        <h2 className="reveal">Why Choose LoanEase?</h2>
        <div className="features-grid">
          <div className="feature-card reveal-up" style={{ transitionDelay: "0.1s" }}>
            <div className="feature-icon">⏱️</div>
            <h3>Quick Process</h3>
            <p>Complete your application in minutes and get a decision within 24 hours.</p>
          </div>
          <div className="feature-card reveal-up" style={{ transitionDelay: "0.2s" }}>
            <div className="feature-icon">🔒</div>
            <h3>Secure & Confidential</h3>
            <p>Your data is protected with bank-level security and encryption.</p>
          </div>
          <div className="feature-card reveal-up" style={{ transitionDelay: "0.3s" }}>
            <div className="feature-icon">💰</div>
            <h3>Competitive Rates</h3>
            <p>We offer some of the most competitive interest rates in the market.</p>
          </div>
          <div className="feature-card reveal-up" style={{ transitionDelay: "0.4s" }}>
            <div className="feature-icon">📱</div>
            <h3>100% Online</h3>
            <p>Apply, track, and manage your loan entirely online from any device.</p>
          </div>
        </div>
      </section>

      {/* Loan Types Section */}
      <section className="loan-types" id="loan-types" ref={loanTypesRef}>
        <h2 className="reveal">Find the Right Loan for You</h2>
        <div className="loan-tabs reveal">
          <button
            className={`tab-button ${activeTab === "personal" ? "active" : ""}`}
            onClick={() => handleTabChange("personal")}
            aria-pressed={activeTab === "personal"}
          >
            Personal Loans
          </button>

          <button
            className={`tab-button ${activeTab === "home" ? "active" : ""}`}
            onClick={() => handleTabChange("home")}
            aria-pressed={activeTab === "home"}
          >
            Home Loans
          </button>

          <button
            className={`tab-button ${activeTab === "auto" ? "active" : ""}`}
            onClick={() => handleTabChange("auto")}
            aria-pressed={activeTab === "auto"}
          >
            Auto Loans
          </button>

          <button
            className={`tab-button ${activeTab === "small-business" ? "active" : ""}`}
            onClick={() => handleTabChange("small-business")}
            aria-pressed={activeTab === "small-business"}
          >
            Small Business Loans
          </button>

          <button
            className={`tab-button ${activeTab === "education" ? "active" : ""}`}
            onClick={() => handleTabChange("education")}
            aria-pressed={activeTab === "education"}
          >
            Education Loans
          </button>
        </div>

        <div className="loan-content">
          {activeTab === "personal" && (
            <div className="loan-details">
              <div className="loan-info reveal-left">
                <h3>Personal Loans</h3>
                <p>
                  Our personal loans offer flexibility for various needs, from debt consolidation to unexpected
                  expenses. With fixed rates starting at 5.99% APR and loan amounts from{" "}
                  {formatCurrency(1000, currency)} to {formatCurrency(50000, currency)}, you can get the funds you need
                  with terms that work for you.
                </p>
                <ul>
                  <li>
                    Loan amounts: {formatCurrency(1000, currency)} - {formatCurrency(50000, currency)}
                  </li>
                  <li>Terms: 12 - 60 months</li>
                  <li>APR: Starting at 5.99%</li>
                  <li>No prepayment penalties</li>
                </ul>
                <button className="apply-button" onClick={handleApplyNow} aria-label="Apply for Personal Loan">
                  Apply for Personal Loan
                </button>
              </div>
              <div className="loan-image reveal-right">
                <img src={Personal || "/placeholder.svg"} alt="Personal loan illustration" loading="lazy" />
              </div>
            </div>
          )}

          {activeTab === "home" && (
            <div className="loan-details">
              <div className="loan-info reveal-left">
                <h3>Home Loans</h3>
                <p>
                  Whether you're a first-time buyer or refinancing, our home loans offer competitive rates and flexible
                  terms. Our mortgage specialists will guide you through the process to find the best option for your
                  needs.
                </p>
                <ul>
                  <li>Fixed and adjustable rate options</li>
                  <li>Terms: 15, 20, or 30 years</li>
                  <li>Down payments as low as 3%</li>
                  <li>Refinancing options available</li>
                </ul>
                <button className="apply-button" onClick={handleApplyNow} aria-label="Apply for Home Loan">
                  Apply for Home Loan
                </button>
              </div>
              <div className="loan-image reveal-right">
                <img src={Home || "/placeholder.svg"} alt="Home loan illustration" loading="lazy" />
              </div>
            </div>
          )}

          {activeTab === "auto" && (
            <div className="loan-details">
              <div className="loan-info reveal-left">
                <h3>Auto Loans</h3>
                <p>
                  Drive away in your dream car with our competitive auto loans. We offer financing for new and used
                  vehicles with quick approvals and flexible terms to fit your budget.
                </p>
                <ul>
                  <li>
                    Loan amounts: {formatCurrency(5000, currency)} - {formatCurrency(100000, currency)}
                  </li>
                  <li>Terms: 24 - 84 months</li>
                  <li>APR: Starting at 3.49%</li>
                  <li>New and used vehicle financing</li>
                </ul>
                <button className="apply-button" onClick={handleApplyNow} aria-label="Apply for Auto Loan">
                  Apply for Auto Loan
                </button>
              </div>
              <div className="loan-image reveal-right">
                <img src={Auto || "/placeholder.svg"} alt="Auto loan illustration" loading="lazy" />
              </div>
            </div>
          )}

          {activeTab === "small-business" && (
            <div className="loan-details">
              <div className="loan-info reveal-left">
                <h3>Small Business Loans</h3>
                <p>
                  Small business loans can help launch your startup, cover overhead costs, purchase equipment, refinance
                  debt — and more. Here, you can compare business loan rates, calculate costs and explore your options
                  to find the right loan for you.
                </p>
                <ul>
                  <li>
                    Loan amounts: {formatCurrency(5000, currency)} - {formatCurrency(500000, currency)}
                  </li>
                  <li>Terms: 12 - 120 months</li>
                  <li>APR: Starting at 4.99%</li>
                  <li>Equipment financing and working capital options</li>
                </ul>
                <button className="apply-button" onClick={handleApplyNow} aria-label="Apply for Small Business Loan">
                  Apply for Small Business Loan
                </button>
              </div>
              <div className="loan-image reveal-right">
                <img src={Business || "/placeholder.svg"} alt="Small business loan illustration" loading="lazy" />
              </div>
            </div>
          )}

          {activeTab === "education" && (
            <div className="loan-details">
              <div className="loan-info reveal-left">
                <h3>Education Loans</h3>
                <p>
                  Invest in your future with our education loans. We offer competitive rates for undergraduate,
                  graduate, and professional studies with flexible repayment options.
                </p>
                <ul>
                  <li>
                    Loan amounts: {formatCurrency(1000, currency)} - {formatCurrency(100000, currency)}
                  </li>
                  <li>Deferred payments while in school</li>
                  <li>Grace period after graduation</li>
                  <li>No origination fees</li>
                </ul>
                <button className="apply-button" onClick={handleApplyNow} aria-label="Apply for Education Loan">
                  Apply for Education Loan
                </button>
              </div>
              <div className="loan-image reveal-right">
                <img src={Education || "/placeholder.svg"} alt="Education loan illustration" loading="lazy" />
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Calculator Preview Section */}
      <section className="calculator-preview" id="calculator" ref={calculatorRef}>
        <div className="calculator-content reveal-left">
          <h2>See What Your Payments Could Be</h2>
          <p>
            Our loan application includes a powerful calculator that helps you understand your monthly payments and
            total interest over the life of your loan. Adjust loan amount, interest rate, and term to find the perfect
            fit for your budget.
          </p>
          <button className="cta-button" onClick={handleApplyNow} aria-label="Try our loan calculator">
            Try Our Calculator
          </button>
        </div>
        <div className="calculator-image reveal-right">
          <img src={Calculator || "/placeholder.svg"} alt="Loan calculator preview" loading="lazy" />
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials" id="testimonials" ref={testimonialsRef}>
        <h2 className="reveal">What Our Customers Say</h2>
        <div className="testimonial-grid">
          <div className="testimonial-card reveal-up" style={{ transitionDelay: "0.1s" }}>
            <div className="testimonial-rating">★★★★★</div>
            <p className="testimonial-text">
              "The application process was incredibly simple. I got approved quickly and had the funds in my account
              within 48 hours. Highly recommend!"
            </p>
            <div className="testimonial-author">- Deji Adepoju, Doctor, <br /> Lagos </div>
          </div> 
          <div className="testimonial-card reveal-up" style={{ transitionDelay: "0.2s" }}>
            <div className="testimonial-rating">★★★★★</div>
            <p className="testimonial-text">
              "I was hesitant about applying for a loan online, but LoanEase made it so easy and secure. The rates were
              better than my local bank too!"
            </p>
            <div className="testimonial-author">- Youssef B., IT Technician, <br /> Casablanca</div>
          </div>
          <div className="testimonial-card reveal-up" style={{ transitionDelay: "0.3s" }}>
            <div className="testimonial-rating">★★★★★</div>
            <p className="testimonial-text">
              Everything was done on my phone without stress. No long queues or paperwork—just straight to the point.”
            </p>
            <div className="testimonial-author">- James P., Engineer,<br /> London</div>
          </div>
          <div className="testimonial-card reveal-up" style={{ transitionDelay: "0.4s" }}>
            <div className="testimonial-rating">★★★★★</div>
            <p className="testimonial-text">
              I’ve tried other loan apps before, but this one stands out. No stress, no unnecessary documents, and the interest rates are fair
            </p>
            <div className="testimonial-author">– Salisu Aliyu, Entrepreneur,<br /> Sokoto</div>
          </div>
           <div className="testimonial-card reveal-up" style={{ transitionDelay: "0.5s" }}>
            <div className="testimonial-rating">★★★★★</div>
            <p className="testimonial-text">
              I was in a tight spot and needed a loan fast. The application process was straightforward,
              and the funds were available almost immediately. A real lifesaver.
            </p>
            <div className="testimonial-author">- Zwelethu M., Hairstylist,<br /> Cape Town
            </div>
          </div>
              <div className="testimonial-card reveal-up" style={{ transitionDelay: "0.6s" }}>
            <div className="testimonial-rating">★★★★★</div>
            <p className="testimonial-text">
              "The loan calculator helped me understand exactly what I could afford. No surprises or hidden fees.
              Transparent from start to finish." 
            </p>
            <div className="testimonial-author">- Kazi Njoroge, Fashion Designer <br /> Mombasa</div> 
          </div>
          </div>
      </section>
      {/* FAQ Section */}
      <section className="faq" id="faq" ref={faqRef}>
        <h2 className="reveal">Frequently Asked Questions</h2>
        <div className="faq-grid">
          <div className="faq-item reveal-left" style={{ transitionDelay: "0.1s" }}>
            <h3>How long does the application process take?</h3>
            <p>
              Our online application takes just 5-10 minutes to complete. Most applicants receive a decision within 24
              hours, and funds can be deposited as quickly as 1-2 business days after approval.
            </p>
          </div>
          <div className="faq-item reveal-right" style={{ transitionDelay: "0.1s" }}>
            <h3>What documents do I need to apply?</h3>
            <p>
              You'll need a valid ID, proof of income (such as pay stubs or tax returns), and bank account information.
              Depending on the loan type, additional documentation may be required.
            </p>
          </div>
          <div className="faq-item reveal-left" style={{ transitionDelay: "0.2s" }}>
            <h3>Will applying affect my credit score?</h3>
            <p>
              When you apply, we perform a soft credit check which doesn't affect your score. A hard credit check is
              only performed if you proceed with a formal application after pre-approval.
            </p>
          </div>
          <div className="faq-item reveal-right" style={{ transitionDelay: "0.2s" }}>
            <h3>Can I pay off my loan early?</h3>
            <p>
              Yes! We don't charge prepayment penalties, so you're free to pay off your loan early and save on interest.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section" id="cta" ref={ctaRef}>
        <h2 className="reveal">Ready to Get Started?</h2>
        <p className="reveal-up">Apply now and get a decision as soon as today.</p>
        <button
          className="cta-button large reveal-up"
          style={{ transitionDelay: "0.2s" }}
          onClick={handleApplyNow}
          aria-label="Start loan application"
        >
          Start Your Application
        </button>
      </section>

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
              <a href="#rates">Current Rates</a>
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

export default HomePage
