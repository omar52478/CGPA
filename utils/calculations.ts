import type { Subject, Semester } from "@/context/AppContext"
import { gradeToGPA, type GradeKey } from "./gradeToGPA"

export function calculateGPA(subjects: Subject[]): number {
  if (!subjects || subjects.length === 0) {
    return 0
  }

  let totalPoints = 0
  let totalHours = 0

  for (const subject of subjects) {
    // Skip invalid data
    if (!subject.hours || isNaN(Number(subject.hours)) || Number(subject.hours) <= 0 || !subject.grade) {
      continue
    }

    const hours = Number(subject.hours)
    const gradeValue = gradeToGPA[subject.grade as GradeKey]?.gpa || 0

    totalPoints += hours * gradeValue
    totalHours += hours
  }

  if (totalHours === 0) {
    return 0
  }

  // Round to 3 decimal places for more accuracy
  return Math.round((totalPoints / totalHours) * 1000) / 1000
}

export function calculateCGPA(semesters: Semester[]): number {
  if (!semesters || semesters.length === 0) {
    return 0
  }

  // For CGPA, we need to consider all subjects across all semesters
  // We can't just average the semester GPAs because each semester might have different credit hours

  // First, get all subjects from all semesters
  let totalPoints = 0
  let totalHours = 0

  // For each semester, we need to calculate the total points and hours
  for (const semester of semesters) {
    // Skip invalid data
    if (isNaN(Number(semester.gpa)) || Number(semester.gpa) < 0) {
      continue
    }

    // If we have the semester's credit hours, use them
    if (semester.creditHours && !isNaN(Number(semester.creditHours)) && Number(semester.creditHours) > 0) {
      const hours = Number(semester.creditHours)
      const gpa = Number(semester.gpa)

      totalPoints += hours * gpa
      totalHours += hours
    }
  }

  if (totalHours === 0) {
    // If we don't have credit hours information, fall back to simple average
    const validSemesters = semesters.filter((semester) => !isNaN(Number(semester.gpa)) && Number(semester.gpa) >= 0)

    if (validSemesters.length === 0) {
      return 0
    }

    const totalGPA = validSemesters.reduce((sum, semester) => sum + Number(semester.gpa), 0)

    // Round to 3 decimal places for more accuracy
    return Math.round((totalGPA / validSemesters.length) * 1000) / 1000
  }

  // Round to 3 decimal places for more accuracy
  return Math.round((totalPoints / totalHours) * 1000) / 1000
}

export function getSubjectContribution(subject: Subject): number {
  if (!subject.hours || isNaN(Number(subject.hours)) || Number(subject.hours) <= 0 || !subject.grade) {
    return 0
  }

  const hours = Number(subject.hours)
  const gradeValue = gradeToGPA[subject.grade as GradeKey]?.gpa || 0

  return hours * gradeValue
}

export function getMaxPossibleContribution(subject: Subject): number {
  if (!subject.hours || isNaN(Number(subject.hours)) || Number(subject.hours) <= 0) {
    return 0
  }

  return Number(subject.hours) * 4.0
}