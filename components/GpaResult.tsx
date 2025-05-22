"use client"

import { motion } from "framer-motion"
import { gradeToGPA } from "@/utils/gradeToGPA"

interface GpaResultProps {
  gpa: number
}

export default function GpaResult({ gpa }: GpaResultProps) {
  // Get letter grade based on GPA
  const getLetterGrade = (gpa: number) => {
    // Find the closest grade entry
    let closestGrade = "F"
    let minDifference = 4.0

    Object.entries(gradeToGPA).forEach(([key, value]) => {
      const difference = Math.abs(value.gpa - gpa)
      if (difference < minDifference) {
        minDifference = difference
        closestGrade = value.label
      }
    })

    return closestGrade
  }

  // Calculate percentage
  const percentage = (gpa / 4) * 100

  // Get appropriate color based on GPA
  const getGpaColor = () => {
    if (gpa >= 3.7) return "from-green-500 to-emerald-500"
    if (gpa >= 3.0) return "from-blue-500 to-sky-500"
    if (gpa >= 2.0) return "from-yellow-500 to-amber-500"
    if (gpa >= 1.0) return "from-orange-500 to-amber-600"
    return "from-red-500 to-rose-600"
  }

  // Get performance text based on GPA
  const getPerformanceText = () => {
    if (gpa >= 3.7) return "Excellent"
    if (gpa >= 3.0) return "Very Good"
    if (gpa >= 2.0) return "Good"
    if (gpa >= 1.0) return "Satisfactory"
    return "Needs Improvement"
  }

  return (
    <motion.div
      className={`bg-gradient-to-r ${getGpaColor()} p-6 rounded-lg mb-6 shadow-lg`}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
        <div className="text-center">
          <h3 className="text-lg font-medium mb-1">GPA Score</h3>
          <p className="text-5xl font-bold glow-text">{gpa.toFixed(3)}</p>
          <p className="mt-1 text-sm">out of 4.00</p>
        </div>

        <div className="text-center">
          <h3 className="text-lg font-medium mb-1">Letter Grade</h3>
          <div className="bg-white/20 rounded-full w-20 h-20 mx-auto flex items-center justify-center">
            <p className="text-3xl font-bold">{getLetterGrade(gpa)}</p>
          </div>
          <p className="mt-1 text-sm">{getPerformanceText()}</p>
        </div>

        <div className="text-center">
          <h3 className="text-lg font-medium mb-1">Percentage</h3>
          <div className="relative pt-1">
            <div className="flex mb-2 items-center justify-between">
              <div className="text-white text-2xl font-bold">{percentage.toFixed(1)}%</div>
            </div>
            <div className="overflow-hidden h-4 text-xs flex rounded-full bg-white/20">
              <div
                style={{ width: `${percentage}%` }}
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-white/40"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
