"use client"

import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Sidebar from "../Components/Sidebar/Sidebar"
import Header from "../Components/Header/Header"
import { config } from "../Services"
import "./Layout.css"

function Layoutone({ children }) {
  const navigate = useNavigate()
  const isLoggedIn = localStorage.getItem("userid")

  // Check if user is logged in
  useEffect(() => {
    if (!isLoggedIn) {
      navigate(config.routeconfig.login)
    }
  }, [isLoggedIn, navigate])

  if (!isLoggedIn) return null

  return (
    <div className="layout-container">
      <Header />
      <div className="layout-content">
        <Sidebar />
        <main className="main-content">{children}</main>
      </div>
    </div>
  )
}

export default Layoutone

