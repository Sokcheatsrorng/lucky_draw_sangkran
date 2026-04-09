import { useState, useEffect } from "react"
import { studentData } from "@/students"

interface Student {
  Full_Name: string
  Gender: string
  Class: string
}

export function useStudentFiltering() {
  const [filteredStudents, setFilteredStudents] = useState<string[]>([])
  const [filterGender, setFilterGender] = useState<string>("all")
  const [filterSubject, setFilterSubject] = useState<string>("all")
  const [excludePreviousWinners, setExcludePreviousWinners] = useState(true)

  // Get unique subjects from student data
  const uniqueSubjects = Array.from(
    new Set(studentData.map((student) => student.Class))
  )

  // Apply filters whenever filter states change
  useEffect(() => {
    const result = studentData.filter((student: Student) => {
      const genderMatch = filterGender === "all" || student.Gender === filterGender
      const subjectMatch = filterSubject === "all" || student.Class === filterSubject
      return genderMatch && subjectMatch
    })

    const filteredNames = result.map((student) => student.Full_Name)
    setFilteredStudents(filteredNames)
  }, [filterGender, filterSubject])

  return {
    filteredStudents,
    filterGender,
    setFilterGender,
    filterSubject,
    setFilterSubject,
    excludePreviousWinners,
    setExcludePreviousWinners,
    uniqueSubjects,
  }
}
