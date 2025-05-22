"use client"
import { useState, useEffect } from "react"
import CgpaPage from "@/components/pages/CgpaPage"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import ThreeCanvas from "@/components/ThreeCanvas"
import LoadingScreen from "@/components/LoadingScreen"
import { usePageTransition } from "@/hooks/usePageTransition"

export default function CgpaRoute() {
  const { isLoading } = usePageTransition()
  const [initialLoading, setInitialLoading] = useState(true)

  useEffect(() => {
    // Set initial loading to false after a short delay
    const timer = setTimeout(() => {
      setInitialLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  if (initialLoading || isLoading) {
    return <LoadingScreen isLoading={true} />
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-900 to-purple-700 text-white relative">
      <ThreeCanvas />
      <div className="container mx-auto px-4 py-8 flex-grow z-10 relative">
        <Header />
        <CgpaPage />
        <Footer />
      </div>
    </div>
  )
}
