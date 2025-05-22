"use client"

import { useRouter, usePathname } from "next/navigation"
import { useAppContext } from "@/context/AppContext"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { BookOpen, BarChart } from "lucide-react"
import { memo } from "react"

// Memoize the Header component to prevent unnecessary re-renders
const Header = memo(function Header() {
  const router = useRouter()
  const pathname = usePathname()
  const { is3DBackgroundVisible, toggle3DBackground } = useAppContext()

  const navigateTo = (path: string) => {
    router.push(path)
  }

  return (
    <header className="relative z-10">
      <div className="glass-card p-6 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <div className="flex items-center space-x-3 mb-4 md:mb-0">
            {pathname === "/gpa" ? (
              <BookOpen className="h-8 w-8 text-purple-400" />
            ) : (
              <BarChart className="h-8 w-8 text-purple-400" />
            )}
            <h1 className="text-3xl font-bold gradient-text">
              {pathname === "/gpa" ? "GPA Calculator" : "CGPA Calculator"}
            </h1>
          </div>

          <div className="flex flex-wrap gap-4 justify-center">
            <div className="flex items-center space-x-2 bg-white bg-opacity-5 p-2 rounded-lg">
              <Switch id="3d-toggle" checked={is3DBackgroundVisible} onCheckedChange={toggle3DBackground} />
              <Label htmlFor="3d-toggle" className="text-sm">
                3D Effects {is3DBackgroundVisible ? "ON" : "OFF"}
              </Label>
            </div>

            <button
              className="btn btn-primary text-sm px-3 py-1.5"
              onClick={() => navigateTo(pathname === "/gpa" ? "/cgpa" : "/gpa")}
            >
              Switch to {pathname === "/gpa" ? "CGPA" : "GPA"} Calculator
            </button>
          </div>
        </div>

        <div className="bg-white bg-opacity-5 p-4 rounded-lg backdrop-blur-sm border border-white border-opacity-10">
          <p className="text-md md:text-lg">
            {pathname === "/gpa"
              ? "Calculate your Grade Point Average (GPA) by adding your subjects, credit hours, and grades below."
              : "Track your Cumulative Grade Point Average (CGPA) by adding your semester GPAs and see your academic progress."}
          </p>
        </div>
      </div>
    </header>
  )
})

export default Header
