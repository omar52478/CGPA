export const gradeToGPA = {
  "4.0": { gpa: 4.0, percentage: 96, label: "A+" },
  "3.7": { gpa: 3.7, percentage: 92, label: "A" },
  "3.4": { gpa: 3.4, percentage: 88, label: "A-" },
  "3.2": { gpa: 3.2, percentage: 84, label: "B+" },
  "3.0": { gpa: 3.0, percentage: 80, label: "B" },
  "2.8": { gpa: 2.8, percentage: 76, label: "B-" },
  "2.6": { gpa: 2.6, percentage: 72, label: "C+" },
  "2.4": { gpa: 2.4, percentage: 68, label: "C" },
  "2.2": { gpa: 2.2, percentage: 64, label: "C-" },
  "2.0": { gpa: 2.0, percentage: 60, label: "D+" },
  "1.5": { gpa: 1.5, percentage: 55, label: "D" },
  "1.0": { gpa: 1.0, percentage: 50, label: "D-" },
  "0.0": { gpa: 0.0, percentage: 0, label: "F" },
}

export type GradeKey = keyof typeof gradeToGPA