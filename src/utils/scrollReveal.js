// Utility function to check if an element is in viewport
export const isInViewport = (element, offset = 150) => {
  if (!element) return false
  const rect = element.getBoundingClientRect()
  return (
    rect.top <= window.innerHeight - offset && rect.bottom >= 0 && rect.left <= window.innerWidth && rect.right >= 0
  )
}

// Initialize scroll reveal
export const initScrollReveal = () => {
  const revealElements = document.querySelectorAll(".reveal, .reveal-left, .reveal-right, .reveal-up")

  const checkReveal = () => {
    revealElements.forEach((element) => {
      if (isInViewport(element)) {
        element.classList.add("active")
      }
    })
  }

  // Check on scroll
  window.addEventListener("scroll", checkReveal)

  // Check on initial load
  checkReveal()

  // Cleanup function
  return () => {
    window.removeEventListener("scroll", checkReveal)
  }
}
