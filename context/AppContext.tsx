"use client"

import { createContext, useContext, useState, useEffect, type ReactNode, useMemo } from "react"
import { getStorageItem, setStorageItem } from "@/utils/storage"

// Define types
export interface Subject {
  id: number
  name: string
  hours: number
  grade: string
}

export interface Semester {
  id: number
  name: string
  gpa: number | string
  creditHours?: number | string
  subjects?: Subject[]
}

interface AppContextType {
  subjects: Subject[]
  semesters: Semester[]
  is3DBackgroundVisible: boolean
  addSubject: () => void
  updateSubject: (id: number, field: keyof Subject, value: string | number) => void
  removeSubject: (id: number) => void
  resetSubjects: () => void
  addSemester: () => void
  updateSemester: (id: number, field: keyof Semester, value: string | number) => void
  removeSemester: (id: number) => void
  resetSemesters: () => void
  toggle3DBackground: () => void
  calculateAndUpdateSemesterGPA: (semesterId: number, subjects: Subject[]) => void
  updateSemesterCreditHours: (semesterId: number, creditHours: number) => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

// Default values for initial state
const defaultSubjects: Subject[] = [{ id: 1, name: "Subject 1", hours: 3, grade: "4.0" }]
const defaultSemesters: Semester[] = [{ id: 1, name: "Semester 1", gpa: 0, creditHours: 18 }]

export function AppProvider({ children }: { children: ReactNode }) {
  // Initialize state with defaults first, then update from localStorage after mount
  const [subjects, setSubjects] = useState<Subject[]>(defaultSubjects)
  const [semesters, setSemesters] = useState<Semester[]>(defaultSemesters)
  const [is3DBackgroundVisible, setIs3DBackgroundVisible] = useState<boolean>(true)
  const [isInitialized, setIsInitialized] = useState(false)

  // Load data from localStorage after component mounts
  useEffect(() => {
    // Use the optimized storage utility
    setSubjects(getStorageItem<Subject[]>("subjects", defaultSubjects))
    setSemesters(getStorageItem<Semester[]>("semesters", defaultSemesters))
    setIs3DBackgroundVisible(getStorageItem<boolean>("is3DBackgroundVisible", true))

    setIsInitialized(true)
  }, [])

  // Save to localStorage when state changes, but only after initialization
  useEffect(() => {
    if (isInitialized) {
      // Use the optimized storage utility with debouncing
      const timer = setTimeout(() => {
        setStorageItem("subjects", subjects)
        setStorageItem("semesters", semesters)
        setStorageItem("is3DBackgroundVisible", is3DBackgroundVisible)
      }, 300) // Debounce writes to localStorage

      return () => clearTimeout(timer)
    }
  }, [subjects, semesters, is3DBackgroundVisible, isInitialized])

  // Subject functions
  const addSubject = () => {
    setSubjects((prev) => {
      const newId = prev.length > 0 ? Math.max(...prev.map((s) => s.id)) + 1 : 1
      return [...prev, { id: newId, name: `Subject ${newId}`, hours: 3, grade: "4.0" }]
    })
  }

  const updateSubject = (id: number, field: keyof Subject, value: string | number) => {
    setSubjects((prev) => prev.map((subject) => (subject.id === id ? { ...subject, [field]: value } : subject)))
  }

  const removeSubject = (id: number) => {
    setSubjects((prev) => prev.filter((subject) => subject.id !== id))
  }

  const resetSubjects = () => {
    setSubjects([{ id: 1, name: "Subject 1", hours: 3, grade: "4.0" }])
  }

  // Semester functions
  const addSemester = () => {
    setSemesters((prev) => {
      const newId = prev.length > 0 ? Math.max(...prev.map((s) => s.id)) + 1 : 1
      return [...prev, { id: newId, name: `Semester ${newId}`, gpa: 0, creditHours: 18 }]
    })
  }

  const updateSemester = (id: number, field: keyof Semester, value: string | number) => {
    setSemesters((prev) => prev.map((semester) => (semester.id === id ? { ...semester, [field]: value } : semester)))
  }

  const removeSemester = (id: number) => {
    setSemesters((prev) => prev.filter((semester) => semester.id !== id))
  }

  const resetSemesters = () => {
    setSemesters([{ id: 1, name: "Semester 1", gpa: 0, creditHours: 18 }])
  }

  // وظيفة لحساب وتحديث GPA للفصل الدراسي بناءً على المواد
  const calculateAndUpdateSemesterGPA = (semesterId: number, semesterSubjects: Subject[]) => {
    // استخدام وظيفة حساب GPA من ملف calculations.ts
    import("@/utils/calculations").then(({ calculateGPA }) => {
      const gpa = calculateGPA(semesterSubjects)

      // تحديث GPA للفصل الدراسي
      setSemesters((prev) =>
        prev.map((semester) =>
          semester.id === semesterId ? { ...semester, gpa, subjects: semesterSubjects } : semester,
        ),
      )
    })
  }

  // وظيفة لتحديث عدد الساعات المعتمدة للفصل الدراسي
  const updateSemesterCreditHours = (semesterId: number, creditHours: number) => {
    setSemesters((prev) =>
      prev.map((semester) => (semester.id === semesterId ? { ...semester, creditHours } : semester)),
    )
  }

  // 3D Background toggle
  const toggle3DBackground = () => {
    setIs3DBackgroundVisible((prev) => !prev)
  }

  // Memoize context value to prevent unnecessary re-renders
  const value = useMemo(
    () => ({
      subjects,
      semesters,
      is3DBackgroundVisible,
      addSubject,
      updateSubject,
      removeSubject,
      resetSubjects,
      addSemester,
      updateSemester,
      removeSemester,
      resetSemesters,
      toggle3DBackground,
      calculateAndUpdateSemesterGPA,
      updateSemesterCreditHours,
    }),
    [subjects, semesters, is3DBackgroundVisible],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useAppContext() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider")
  }
  return context
}
