"use client"

import { useState, useEffect } from "react"

const OptimizedImage = ({ src, alt, className, width, height }) => {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const img = new Image()
    img.src = src
    img.onload = () => {
      setIsLoaded(true)
    }
  }, [src])

  return (
    <img
      src={src || "/placeholder.svg"}
      alt={alt}
      className={`${className} ${isLoaded ? "lazy-loaded" : "lazy-load"}`}
      width={width}
      height={height}
      loading="lazy"
    />
  )
}

export default OptimizedImage
