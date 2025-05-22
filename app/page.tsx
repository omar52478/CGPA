"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import ThreeCanvas from "@/components/ThreeCanvas"
import GpaPage from "@/components/pages/GpaPage"
import CgpaPage from "@/components/pages/CgpaPage"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import LoadingScreen from "@/components/LoadingScreen"
import { usePageTransition } from "@/hooks/usePageTransition"

export default function Home() {
  const router = useRouter()
  const pathname = usePathname()
  const { isLoading } = usePageTransition()
  const [initialLoading, setInitialLoading] = useState(true)

  useEffect(() => {
    // Redirect to GPA page if on root with a small delay to avoid flickering
    if (pathname === "/") {
      // Use a small timeout to avoid the flash of content
      const redirectTimer = setTimeout(() => {
        router.push("/gpa")
      }, 10)

      return () => clearTimeout(redirectTimer)
    }

    // Set initial loading to false after a short delay
    const timer = setTimeout(() => {
      setInitialLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [pathname, router])

  // Show loading screen during initial load or page transitions
  if (pathname === "/" || initialLoading || isLoading) {
    return <LoadingScreen isLoading={true} />
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-900 to-purple-700 text-white relative overflow-hidden">
      {/* ThreeCanvas is always rendered, but visibility is controlled by context */}
      <ThreeCanvas />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 flex-grow z-10 relative max-w-7xl">
        <Header />

        <div className="mt-6 sm:mt-10 mb-8 sm:mb-12">
          {pathname === "/gpa" && <GpaPage />}
          {pathname === "/cgpa" && <CgpaPage />}
        </div>

        <Footer />
      </div>

      {/* Decorative elements */}
      <div className="absolute top-20 left-0 w-64 h-64 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute top-40 right-10 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-20 left-20 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
    </div>
  )
}
