import React from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { StudentList } from "./StudentList"
import { FilterPanel } from "./FilterPanel"

interface StudentPanelProps {
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
}

export function StudentPanel({
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
}: StudentPanelProps) {
  return (
    <Tabs defaultValue="students" className="w-full h-full flex flex-col">
      <TabsList className="grid w-full grid-cols-2 bg-white/[0.05] border border-white/[0.1]">
        <TabsTrigger value="students" className="text-white/70">
          Students
        </TabsTrigger>
        <TabsTrigger value="filters" className="text-white/70">
          Filters
        </TabsTrigger>
      </TabsList>

      <TabsContent value="students" className="flex-1 mt-4 overflow-hidden">
        <StudentList students={filteredStudents} winners={winners} />
      </TabsContent>

      <TabsContent value="filters" className="flex-1 mt-4 overflow-auto custom-scrollbar">
        <FilterPanel
          filterGender={filterGender}
          onFilterGenderChange={onFilterGenderChange}
          filterSubject={filterSubject}
          onFilterSubjectChange={onFilterSubjectChange}
          excludePreviousWinners={excludePreviousWinners}
          onExcludeWinnersChange={onExcludeWinnersChange}
          uniqueSubjects={uniqueSubjects}
          availableCount={filteredStudents.length}
        />
      </TabsContent>
    </Tabs>
  )
}
