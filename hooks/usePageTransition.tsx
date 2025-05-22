"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"

export function usePageTransition() {
  const pathname = usePathname()
  const [isLoading, setIsLoading] = useState(false)
  const [prevPathname, setPrevPathname] = useState<string | null>(null)

  useEffect(() => {
    // Only trigger loading state when pathname changes
    if (prevPathname && prevPathname !== pathname) {
      setIsLoading(true)
      
      // Simulate minimum loading time to avoid flickering
      const timer = setTimeout(() => {
        setIsLoading(false)
      }, 500)
      
      return () => clearTimeout(timer)
    }
    
    // Update previous pathname
    setPrevPathname(pathname)
  }, [pathname, prevPathname])

  return { isLoading }
}
