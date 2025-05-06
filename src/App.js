import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import HomePage from "./Home/HomePage"
import LoanApplicationForm from "./Main/LoanApplicationForm"
import CurrencyConverterPage from "./pages/CurrencyConverterPage"
import { CurrencyProvider } from "./contexts/CurrencyContext"

function App() {
  return (
    <CurrencyProvider>
      <Router>
        <div className="app">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/apply" element={<LoanApplicationForm />} />
            <Route path="/currency-converter" element={<CurrencyConverterPage />} />
          </Routes>
        </div>
      </Router>
    </CurrencyProvider>
  )
}

export default App
