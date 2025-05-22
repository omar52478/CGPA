"use client"

import { useState, useEffect } from "react"
import { useAppContext } from "@/context/AppContext"
import SubjectCard from "@/components/SubjectCard"
import ChartDisplay from "@/components/ChartDisplay"
import GpaResult from "@/components/GpaResult"
import { calculateGPA } from "@/utils/calculations"
import { Button } from "@/components/ui/button"
import { PlusCircle, RotateCcw, Calculator } from 'lucide-react'
import { motion } from "framer-motion"

export default function GpaPage() {
  const { subjects, addSubject, updateSubject, removeSubject, resetSubjects } = useAppContext()

  const [gpa, setGpa] = useState(0)
  const [isCalculated, setIsCalculated] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleCalculate = () => {
    setIsLoading(true)
    // Simulate calculation time for better UX
    setTimeout(() => {
      const calculatedGPA = calculateGPA(subjects)
      setGpa(calculatedGPA)
      setIsCalculated(true)
      setIsLoading(false)
    }, 500)
  }

  const handleReset = () => {
    resetSubjects()
    setGpa(0)
    setIsCalculated(false)
  }

  // Recalculate GPA when subjects change if already calculated
  useEffect(() => {
    if (isCalculated) {
      setGpa(calculateGPA(subjects))
    }
  }, [subjects, isCalculated])

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  // Render a simplified version until client-side hydration is complete
  if (!mounted) {
    return (
      <div>
        <div className="glass-card p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-4">
            <h2 className="text-xl sm:text-2xl font-bold gradient-text">Your Subjects</h2>
          </div>
          <div className="text-center py-8">
            <p>Loading...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="glass-card p-4 sm:p-6 mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-4">
          <h2 className="text-xl sm:text-2xl font-bold gradient-text">Your Subjects</h2>

          <div className="flex flex-wrap gap-3 w-full sm:w-auto justify-start sm:justify-end">
            <Button
              variant="outline"
              onClick={addSubject}
              className="flex items-center bg-white bg-opacity-5 border-white border-opacity-20 hover:bg-white hover:bg-opacity-10 h-10"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Subject
            </Button>

            <Button
              variant="outline"
              onClick={handleReset}
              className="flex items-center bg-white bg-opacity-5 border-white border-opacity-20 hover:bg-white hover:bg-opacity-10 h-10"
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset
            </Button>

            <Button
              onClick={handleCalculate}
              className="flex items-center bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 h-10"
              disabled={isLoading}
            >
              <Calculator className="mr-2 h-4 w-4" />
              {isLoading ? "Calculating..." : "Calculate GPA"}
            </Button>
          </div>
        </div>

        {/* Result display */}
        {isCalculated && <GpaResult gpa={gpa} />}

        {/* Subjects grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 responsive-grid"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {subjects.map((subject) => (
            <motion.div key={subject.id} variants={item}>
              <SubjectCard subject={subject} onUpdate={updateSubject} onRemove={removeSubject} />
            </motion.div>
          ))}
        </motion.div>

        {/* Add button when no subjects */}
        {subjects.length === 0 && (
          <motion.div
            className="text-center py-8 sm:py-12 glass-card mt-6 bg-white bg-opacity-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="mb-4 text-lg text-white">No subjects added yet.</p>
            <Button
              onClick={addSubject}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 h-10"
            >
              <PlusCircle className="mr-2 h-5 w-5" />
              Add Your First Subject
            </Button>
          </motion.div>
        )}
      </div>

      {/* Charts */}
      {subjects.length > 0 && <ChartDisplay subjects={subjects} gpa={gpa} />}
    </div>
  )
}
