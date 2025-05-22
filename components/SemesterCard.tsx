"use client"

import type React from "react"

import type { Semester } from "@/context/AppContext"
import { Trash2, Edit2, Check, X } from 'lucide-react'
import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface SemesterCardProps {
  semester: Semester
  onUpdate: (id: number, field: keyof Semester, value: string | number) => void
  onRemove: (id: number) => void
}

export default function SemesterCard({ semester, onUpdate, onRemove }: SemesterCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [tempName, setTempName] = useState(semester.name)
  const [gpaInputValue, setGpaInputValue] = useState<string>(
    semester.gpa && Number(semester.gpa) > 0 ? semester.gpa.toString() : "",
  )
  const [mounted, setMounted] = useState(false)

  // Fix hydration mismatch by only rendering the full component after mounting
  useEffect(() => {
    setMounted(true)
    if (semester.gpa && Number(semester.gpa) > 0) {
      setGpaInputValue(semester.gpa.toString())
    }
  }, [semester.gpa])

  const handleSave = () => {
    onUpdate(semester.id, "name", tempName)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setTempName(semester.name)
    setIsEditing(false)
  }

  // Handle GPA input change
  const handleGpaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value

    // Allow empty input or valid numbers
    if (value === "" || (!isNaN(Number(value)) && Number(value) >= 0 && Number(value) <= 4)) {
      setGpaInputValue(value)
      // Update the semester GPA with the numeric value or 0 if empty
      onUpdate(semester.id, "gpa", value === "" ? 0 : Number(value))
    }
  }

  // Determine color based on GPA
  const getBadgeColor = (gpa: number | string) => {
    const gpaNum = typeof gpa === "string" ? Number.parseFloat(gpa) : gpa
    if (gpaNum >= 3.7) return "bg-gradient-to-r from-green-500 to-emerald-500"
    if (gpaNum >= 3.0) return "bg-gradient-to-r from-green-500 to-teal-500"
    if (gpaNum >= 2.0) return "bg-gradient-to-r from-yellow-500 to-amber-500"
    if (gpaNum >= 1.0) return "bg-gradient-to-r from-orange-500 to-amber-600"
    return "bg-gradient-to-r from-red-500 to-rose-600"
  }

  // Get performance description
  const getPerformanceDescription = (gpa: number | string) => {
    const gpaNum = typeof gpa === "string" ? Number.parseFloat(gpa) : gpa
    if (gpaNum >= 3.7) return "Excellent"
    if (gpaNum >= 3.0) return "Very Good"
    if (gpaNum >= 2.0) return "Good"
    if (gpaNum >= 1.0) return "Satisfactory"
    return "Needs Improvement"
  }

  const gpaValue = Number.parseFloat(semester.gpa.toString()) || 0
  const percentage = Math.round((gpaValue / 4) * 100)

  // If not mounted yet, render a simplified version to avoid hydration mismatch
  if (!mounted) {
    return (
      <div className="glass-card p-4 sm:p-5 hover:shadow-purple-900/20">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center flex-wrap">
            <h3 className="font-medium text-base sm:text-lg truncate mr-2 text-white">{semester.name}</h3>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div className="bg-white bg-opacity-5 p-4 rounded-lg border border-white border-opacity-10">
            <label className="block text-sm mb-2 text-purple-300">GPA (0-4)</label>
          </div>
          <div className="bg-white bg-opacity-5 p-4 rounded-lg border border-white border-opacity-10">
            <label className="block text-sm mb-2 text-purple-300">Credit Hours</label>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="glass-card p-4 sm:p-5 hover:shadow-purple-900/20">
      <div className="flex justify-between items-center mb-4">
        {isEditing ? (
          <div className="flex items-center space-x-2 w-full">
            <input
              type="text"
              className="input flex-grow"
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              placeholder="Semester Name"
              autoFocus
            />
            <button
              className="p-2 bg-green-500 bg-opacity-20 rounded-full hover:bg-green-500 hover:bg-opacity-30 transition-colors"
              onClick={handleSave}
              aria-label="Save changes"
            >
              <Check size={16} className="text-green-400" />
            </button>
            <button
              className="p-2 bg-red-500 bg-opacity-20 rounded-full hover:bg-red-500 hover:bg-opacity-30 transition-colors"
              onClick={handleCancel}
              aria-label="Cancel editing"
            >
              <X size={16} className="text-red-400" />
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center flex-wrap">
              <h3 className="font-medium text-base sm:text-lg truncate mr-2 text-white">{semester.name}</h3>
              <Badge variant="outline" className={`${getBadgeColor(semester.gpa)} text-white mt-1 sm:mt-0`}>
                GPA: {typeof semester.gpa === "number" ? semester.gpa.toFixed(3) : semester.gpa}
              </Badge>
            </div>
            <div className="flex space-x-1 ml-2 flex-shrink-0">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      className="p-2 bg-blue-500 bg-opacity-10 rounded-full hover:bg-blue-500 hover:bg-opacity-20 transition-colors"
                      onClick={() => setIsEditing(true)}
                      aria-label="Edit semester"
                    >
                      <Edit2 size={16} className="text-blue-400" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Edit semester</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      className="p-2 bg-red-500 bg-opacity-10 rounded-full hover:bg-red-500 hover:bg-opacity-20 transition-colors"
                      onClick={() => onRemove(semester.id)}
                      aria-label="Remove semester"
                    >
                      <Trash2 size={16} className="text-red-400" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Remove semester</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div className="bg-white bg-opacity-5 p-4 rounded-lg border border-white border-opacity-10">
          <label className="block text-sm mb-2 text-purple-300">GPA (0-4)</label>
          <input
            type="number"
            className="input w-full bg-gray-800 bg-opacity-50 text-white border border-white border-opacity-20 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200 shadow-inner"
            value={gpaInputValue}
            onChange={handleGpaChange}
            placeholder="0"
            min="0"
            max="4"
            step="0.001"
          />
        </div>

        <div className="bg-white bg-opacity-5 p-4 rounded-lg border border-white border-opacity-10">
          <label className="block text-sm mb-2 text-purple-300">Credit Hours</label>
          <input
            type="number"
            className="input w-full bg-gray-800 bg-opacity-50 text-white border border-white border-opacity-20 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200 shadow-inner"
            value={semester.creditHours || 18}
            onChange={(e) => {
              const value = e.target.value
              const numValue = Number.parseFloat(value)
              // Validate input: must be positive
              if (value === "" || numValue > 0) {
                onUpdate(semester.id, "creditHours", value === "" ? 0 : numValue)
              }
            }}
            min="1"
            step="1"
            placeholder="Enter Credit Hours"
          />
        </div>
      </div>

      <div className="bg-white bg-opacity-10 p-3 rounded-lg">
        <div className="flex justify-between mb-1">
          <span className="text-sm text-white">Performance</span>
          <span className="text-sm font-medium text-white">{percentage}%</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2.5">
          <div
            className={`h-2.5 rounded-full ${getBadgeColor(semester.gpa)}`}
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
        <p className="text-center mt-2 text-sm text-white">{getPerformanceDescription(semester.gpa)}</p>
      </div>
    </div>
  )
}
