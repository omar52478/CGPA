"use client"

import { useState, useEffect } from "react"
import { useAppContext } from "@/context/AppContext"
import SemesterCard from "@/components/SemesterCard"
import { calculateCGPA } from "@/utils/calculations"
import { Button } from "@/components/ui/button"
import { PlusCircle, RotateCcw, Calculator } from 'lucide-react'
import { ChartContainer, LineChart, BarChart } from "@/components/ui/chart"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion } from "framer-motion"

export default function CgpaPage() {
  const { semesters, addSemester, updateSemester, removeSemester, resetSemesters } = useAppContext()

  const [cgpa, setCgpa] = useState(0)
  const [isCalculated, setIsCalculated] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("line")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleCalculate = () => {
    setIsLoading(true)
    // Simulate calculation time for better UX
    setTimeout(() => {
      const calculatedCGPA = calculateCGPA(semesters)
      setCgpa(calculatedCGPA)
      setIsCalculated(true)
      setIsLoading(false)
    }, 500)
  }

  const handleReset = () => {
    resetSemesters()
    setCgpa(0)
    setIsCalculated(false)
  }

  // Recalculate CGPA when semesters change if already calculated
  useEffect(() => {
    if (isCalculated) {
      setCgpa(calculateCGPA(semesters))
    }
  }, [semesters, isCalculated])

  // Prepare data for line chart
  const validSemesters = semesters.filter((semester) => !isNaN(Number(semester.gpa)) && Number(semester.gpa) >= 0)

  // Define chart colors
  const chartColors = {
    line: {
      primary: "rgba(255, 99, 132, 1)",
      secondary: "rgba(54, 162, 235, 1)",
      primaryBg: "rgba(255, 99, 132, 0.3)",
      secondaryBg: "rgba(54, 162, 235, 0.3)",
    },
    bar: {
      primary: [
        "rgba(75, 192, 192, 0.8)",
        "rgba(54, 162, 235, 0.8)",
        "rgba(255, 206, 86, 0.8)",
        "rgba(255, 159, 64, 0.8)",
        "rgba(255, 99, 132, 0.8)",
      ],
      secondary: "rgba(200, 200, 200, 0.3)",
      border: "rgba(255, 255, 255, 0.5)",
    },
  }

  const lineData = {
    labels: validSemesters.map((s) => s.name),
    datasets: [
      {
        label: "Semester GPA",
        data: validSemesters.map((s) => Number(s.gpa)),
        borderColor: chartColors.line.primary,
        backgroundColor: chartColors.line.primaryBg,
        tension: 0.3,
      },
      {
        label: "CGPA Trend",
        data: validSemesters.map((_, index) => {
          const semestersToInclude = validSemesters.slice(0, index + 1)
          return calculateCGPA(semestersToInclude)
        }),
        borderColor: chartColors.line.secondary,
        backgroundColor: chartColors.line.secondaryBg,
        tension: 0.3,
      },
    ],
  }

  // Bar chart data for comparison
  const barData = {
    labels: validSemesters.map((s) => s.name),
    datasets: [
      {
        label: "GPA Value",
        data: validSemesters.map((s) => Number(s.gpa)),
        backgroundColor: validSemesters.map((s, index) => {
          const gpa = Number(s.gpa)
          if (gpa >= 3.7) return chartColors.bar.primary[0]
          if (gpa >= 3.0) return chartColors.bar.primary[1]
          if (gpa >= 2.0) return chartColors.bar.primary[2]
          if (gpa >= 1.0) return chartColors.bar.primary[3]
          return chartColors.bar.primary[4]
        }),
        borderWidth: 1,
        borderColor: chartColors.bar.border,
      },
      {
        label: "Maximum (4.0)",
        data: validSemesters.map(() => 4.0),
        backgroundColor: chartColors.bar.secondary,
        borderWidth: 1,
        borderColor: chartColors.bar.border,
      },
    ],
  }

  // Common chart options
  const commonChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        display: true,
        beginAtZero: true,
        max: 4,
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
        ticks: {
          color: "rgba(255, 255, 255, 0.9)", // Increased contrast
          font: {
            size: 11, // Increased font size
          },
        },
      },
      x: {
        display: true,
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
        ticks: {
          color: "rgba(255, 255, 255, 0.9)", // Increased contrast
          font: {
            size: 11, // Increased font size
          },
          maxRotation: 45, // Rotate labels for better fit
          minRotation: 45,
        },
      },
    },
    plugins: {
      legend: {
        labels: {
          color: "rgba(255, 255, 255, 0.9)", // Increased contrast
          font: {
            family: "'Inter', sans-serif",
            size: 12, // Increased font size
          },
          padding: 15, // More padding
        },
        position: "top",
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleFont: {
          family: "'Inter', sans-serif",
          size: 14, // Increased font size
        },
        bodyFont: {
          family: "'Inter', sans-serif",
          size: 13, // Increased font size
        },
        padding: 12,
        cornerRadius: 8,
        titleColor: "rgba(255, 255, 255, 1)", // Brighter text
        bodyColor: "rgba(255, 255, 255, 1)", // Brighter text
      },
    },
  }

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
            <h2 className="text-xl sm:text-2xl font-bold gradient-text">Your Semesters</h2>
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
          <h2 className="text-xl sm:text-2xl font-bold gradient-text">Your Semesters</h2>

          <div className="flex flex-wrap gap-3 w-full sm:w-auto justify-start sm:justify-end">
            <Button
              variant="outline"
              onClick={addSemester}
              className="flex items-center bg-white bg-opacity-5 border-white border-opacity-20 hover:bg-white hover:bg-opacity-10 h-10"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Semester
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
              {isLoading ? "Calculating..." : "Calculate CGPA"}
            </Button>
          </div>
        </div>

        {/* Result display */}
        {isCalculated && (
          <motion.div
            className="bg-gradient-to-r from-purple-600 to-blue-600 p-4 sm:p-6 rounded-lg mb-4 sm:mb-6 text-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-lg sm:text-xl font-semibold mb-2 text-white">Your CGPA</h3>
            <p className="text-4xl sm:text-5xl font-bold glow-text text-white">{cgpa.toFixed(3)}</p>
            <div className="mt-4 text-sm text-white">
              <p>
                Performance:{" "}
                {cgpa >= 3.7
                  ? "Excellent"
                  : cgpa >= 3.0
                    ? "Very Good"
                    : cgpa >= 2.0
                      ? "Good"
                      : cgpa >= 1.0
                        ? "Satisfactory"
                        : "Needs Improvement"}
              </p>
              <div className="w-full bg-black bg-opacity-30 rounded-full h-2 mt-2">
                <div className="h-2 rounded-full bg-white bg-opacity-80" style={{ width: `${(cgpa / 4) * 100}%` }}></div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Semesters grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 responsive-grid"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {semesters.map((semester) => (
            <motion.div key={semester.id} variants={item}>
              <SemesterCard semester={semester} onUpdate={updateSemester} onRemove={removeSemester} />
            </motion.div>
          ))}
        </motion.div>

        {/* Add button when no semesters */}
        {semesters.length === 0 && (
          <motion.div
            className="text-center py-8 sm:py-12 glass-card mt-6 bg-white bg-opacity-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="mb-4 text-lg text-white">No semesters added yet.</p>
            <Button
              onClick={addSemester}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 h-10"
            >
              <PlusCircle className="mr-2 h-5 w-5" />
              Add Your First Semester
            </Button>
          </motion.div>
        )}
      </div>

      {/* CGPA Charts */}
      {validSemesters.length > 1 && (
        <div className="glass-card p-4 sm:p-6 mt-6 sm:mt-8">
          <h2 className="text-xl sm:text-2xl font-bold gradient-text mb-4 sm:mb-6">CGPA Analytics</h2>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-2 mb-4 sm:mb-6 bg-white bg-opacity-5">
              <TabsTrigger value="line" className="text-white font-medium">
                Line Chart
              </TabsTrigger>
              <TabsTrigger value="bar" className="text-white font-medium">
                Bar Chart
              </TabsTrigger>
            </TabsList>

            <TabsContent value="line" className="h-80 sm:h-96">
              <ChartContainer className="h-full">
                <LineChart
                  data={lineData}
                  options={{
                    ...commonChartOptions,
                    elements: {
                      line: {
                        borderWidth: 3,
                      },
                      point: {
                        radius: 5,
                        hoverRadius: 7,
                        borderWidth: 2,
                      },
                    },
                    interaction: {
                      mode: "index",
                      intersect: false,
                    },
                  }}
                />
              </ChartContainer>
            </TabsContent>

            <TabsContent value="bar" className="h-80 sm:h-96">
              <ChartContainer className="h-full">
                <BarChart data={barData} options={commonChartOptions} />
              </ChartContainer>
            </TabsContent>
          </Tabs>

          <div className="mt-4 sm:mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="glass-card p-4 text-center">
              <h3 className="text-sm text-white mb-2 font-medium">Highest GPA</h3>
              <p className="text-xl sm:text-2xl font-bold text-white">
                {Math.max(...validSemesters.map((s) => Number(s.gpa))).toFixed(3)}
              </p>
              <p className="text-xs mt-1 text-white">
                {
                  validSemesters.find((s) => Number(s.gpa) === Math.max(...validSemesters.map((s) => Number(s.gpa))))
                    ?.name
                }
              </p>
            </div>
            <div className="glass-card p-4 text-center">
              <h3 className="text-sm text-white mb-2 font-medium">Lowest GPA</h3>
              <p className="text-xl sm:text-2xl font-bold text-white">
                {Math.min(...validSemesters.map((s) => Number(s.gpa))).toFixed(3)}
              </p>
              <p className="text-xs mt-1 text-white">
                {
                  validSemesters.find((s) => Number(s.gpa) === Math.min(...validSemesters.map((s) => Number(s.gpa))))
                    ?.name
                }
              </p>
            </div>
            <div className="glass-card p-4 text-center">
              <h3 className="text-sm text-white mb-2 font-medium">Average GPA</h3>
              <p className="text-xl sm:text-2xl font-bold text-white">
                {(validSemesters.reduce((sum, s) => sum + Number(s.gpa), 0) / validSemesters.length).toFixed(3)}
              </p>
              <p className="text-xs mt-1 text-white">Overall Performance</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
