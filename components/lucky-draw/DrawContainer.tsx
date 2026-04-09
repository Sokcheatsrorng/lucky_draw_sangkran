import React from "react"
import { StudentPanel } from "./StudentPanel"
import { ResultsPanel } from "./ResultsPanel"
import { WinnerRecord } from "@/hooks/useWinnerHistory"
import { studentData } from "@/students"

interface DrawContainerProps {
  // Student management
  allStudents: string[]
  filteredStudents: string[]
  winners: string[]
  filterGender: string
  onFilterGenderChange: (gender: string) => void
  filterSubject: string
  onFilterSubjectChange: (subject: string) => void
  excludePreviousWinners: boolean
  onExcludeWinnersChange: (exclude: boolean) => void
  uniqueSubjects: string[]

  // Draw state
  currentSelection: string | null
  winner: string | null
  isDrawing: boolean
  onDraw: () => void

  // History
  history: WinnerRecord[]
  onResetHistory: () => void
}

export function DrawContainer({
  allStudents,
  filteredStudents,
  winners,
  filterGender,
  onFilterGenderChange,
  filterSubject,
  onFilterSubjectChange,
  excludePreviousWinners,
  onExcludeWinnersChange,
  uniqueSubjects,
  currentSelection,
  winner,
  isDrawing,
  onDraw,
  history,
  onResetHistory,
}: DrawContainerProps) {
  // Calculate available students (after filtering and excluding winners if needed)
  const availableStudents = excludePreviousWinners
    ? filteredStudents.filter((name) => !winners.includes(name))
    : filteredStudents

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full max-h-[calc(100vh-300px)]">
      {/* Left Panel - Students & Filters */}
      <div className="lg:col-span-1 overflow-hidden">
        <StudentPanel
          allStudents={allStudents}
          filteredStudents={filteredStudents}
          winners={winners}
          filterGender={filterGender}
          onFilterGenderChange={onFilterGenderChange}
          filterSubject={filterSubject}
          onFilterSubjectChange={onFilterSubjectChange}
          excludePreviousWinners={excludePreviousWinners}
          onExcludeWinnersChange={onExcludeWinnersChange}
          uniqueSubjects={uniqueSubjects}
        />
      </div>

      {/* Right Panel - Results & Draw */}
      <div className="lg:col-span-2 overflow-hidden">
        <ResultsPanel
          currentSelection={currentSelection}
          winner={winner}
          isDrawing={isDrawing}
          availableCount={availableStudents.length}
          onDraw={onDraw}
          history={history}
          onResetHistory={onResetHistory}
        />
      </div>
    </div>
  )
}
