"use client"

import type { Subject } from "@/context/AppContext"
import { gradeToGPA, type GradeKey } from "@/utils/gradeToGPA"
import { Trash2, Edit2, Check, X } from 'lucide-react'
import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface SubjectCardProps {
  subject: Subject
  onUpdate: (id: number, field: keyof Subject, value: string | number) => void
  onRemove: (id: number) => void
}

export default function SubjectCard({ subject, onUpdate, onRemove }: SubjectCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [tempName, setTempName] = useState(subject.name)
  const [mounted, setMounted] = useState(false)

  // Fix hydration mismatch by only rendering the full component after mounting
  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSave = () => {
    onUpdate(subject.id, "name", tempName)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setTempName(subject.name)
    setIsEditing(false)
  }

  // Calculate the percentage grade and contribution
  const gradeInfo = gradeToGPA[subject.grade as GradeKey]
  const percentage = gradeInfo?.percentage || 0
  const gradeLabel = gradeInfo?.label || "N/A"
  const gradeValue = gradeInfo?.gpa?.toFixed(1) || "0.0"
  const contribution = ((gradeInfo?.gpa || 0) * Number(subject.hours)).toFixed(2)

  // Determine color based on grade
  const getBadgeColor = (grade: string) => {
    const gpa = Number.parseFloat(grade)
    if (gpa >= 3.7) return "bg-gradient-to-r from-green-500 to-emerald-500"
    if (gpa >= 3.0) return "bg-gradient-to-r from-green-500 to-teal-500"
    if (gpa >= 2.0) return "bg-gradient-to-r from-yellow-500 to-amber-500"
    if (gpa >= 1.0) return "bg-gradient-to-r from-orange-500 to-amber-600"
    return "bg-gradient-to-r from-red-500 to-rose-600"
  }

  // If not mounted yet, render a simplified version to avoid hydration mismatch
  if (!mounted) {
    return (
      <div className="glass-card p-4 sm:p-5 hover:shadow-purple-900/20">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center flex-wrap">
            <h3 className="font-medium text-base sm:text-lg truncate mr-2 text-white">{subject.name}</h3>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div className="bg-white bg-opacity-5 p-3 rounded-lg border border-white border-opacity-10">
            <label className="block text-sm mb-2 text-purple-300">Credit Hours</label>
          </div>
          <div className="bg-white bg-opacity-5 p-3 rounded-lg border border-white border-opacity-10">
            <label className="block text-sm mb-2 text-purple-300">Grade</label>
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
              placeholder="Subject Name"
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
              <h3 className="font-medium text-base sm:text-lg truncate mr-2 text-white">{subject.name}</h3>
              <Badge variant="outline" className={`${getBadgeColor(subject.grade)} text-white mt-1 sm:mt-0`}>
                {gradeLabel} ({gradeValue})
              </Badge>
            </div>
            <div className="flex space-x-1 ml-2 flex-shrink-0">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      className="p-2 bg-blue-500 bg-opacity-10 rounded-full hover:bg-blue-500 hover:bg-opacity-20 transition-colors"
                      onClick={() => setIsEditing(true)}
                      aria-label="Edit subject"
                    >
                      <Edit2 size={16} className="text-blue-400" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Edit subject</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      className="p-2 bg-red-500 bg-opacity-10 rounded-full hover:bg-red-500 hover:bg-opacity-20 transition-colors"
                      onClick={() => onRemove(subject.id)}
                      aria-label="Remove subject"
                    >
                      <Trash2 size={16} className="text-red-400" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Remove subject</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div className="bg-white bg-opacity-5 p-3 rounded-lg border border-white border-opacity-10">
          <label className="block text-sm mb-2 text-purple-300">Credit Hours</label>
          <select
            className="select w-full bg-gray-800 bg-opacity-50 text-white border border-white border-opacity-20 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200 shadow-inner"
            value={subject.hours}
            onChange={(e) => onUpdate(subject.id, "hours", Number(e.target.value))}
          >
            <option value={1}>1</option>
            <option value={2}>2</option>
            <option value={3}>3</option>
          </select>
        </div>

        <div className="bg-white bg-opacity-5 p-3 rounded-lg border border-white border-opacity-10">
          <label className="block text-sm mb-2 text-purple-300">Grade</label>
          <select
            className="select w-full bg-gray-800 bg-opacity-50 text-white border border-white border-opacity-20 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200 shadow-inner"
            value={subject.grade}
            onChange={(e) => onUpdate(subject.id, "grade", e.target.value)}
          >
            {Object.entries(gradeToGPA).map(([key, { label }]) => (
              <option key={key} value={key} className="text-white bg-gray-800">
                {label} ({key})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="bg-white bg-opacity-10 p-2 rounded-lg">
          <p className="text-xs text-white mb-1">Percentage</p>
          <p className="font-medium text-white">{percentage}%</p>
        </div>
        <div className="bg-white bg-opacity-10 p-2 rounded-lg">
          <p className="text-xs text-white mb-1">Grade Value</p>
          <p className="font-medium text-white">{gradeValue}</p>
        </div>
        <div className="bg-white bg-opacity-10 p-2 rounded-lg">
          <p className="text-xs text-white mb-1">Contribution</p>
          <p className="font-medium text-white">{contribution}</p>
        </div>
      </div>
    </div>
  )
}
