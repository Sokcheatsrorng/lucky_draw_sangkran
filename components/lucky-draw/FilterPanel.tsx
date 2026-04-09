import React from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

interface FilterPanelProps {
  filterGender: string
  onFilterGenderChange: (gender: string) => void
  filterSubject: string
  onFilterSubjectChange: (subject: string) => void
  excludePreviousWinners: boolean
  onExcludeWinnersChange: (exclude: boolean) => void
  uniqueSubjects: string[]
  availableCount: number
}

export function FilterPanel({
  filterGender,
  onFilterGenderChange,
  filterSubject,
  onFilterSubjectChange,
  excludePreviousWinners,
  onExcludeWinnersChange,
  uniqueSubjects,
  availableCount,
}: FilterPanelProps) {
  return (
    <Tabs defaultValue="filters" className="w-full">
      <TabsList className="grid w-full grid-cols-2 bg-white/[0.05] border border-white/[0.1]">
        <TabsTrigger value="filters" className="text-white/70">
          Filters
        </TabsTrigger>
        <TabsTrigger value="info" className="text-white/70">
          Info
        </TabsTrigger>
      </TabsList>

      <TabsContent value="filters" className="space-y-6 mt-4">
        {/* Gender Filter */}
        <div className="space-y-3">
          <label className="text-sm font-semibold text-white/90 block">Gender</label>
          <div className="grid grid-cols-2 gap-3">
            {["all", "Male", "Female"].map((option) => (
              <button
                key={option}
                onClick={() => onFilterGenderChange(option)}
                className={`py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                  filterGender === option
                    ? "bg-yellow-500/30 border border-yellow-400/50 text-yellow-300"
                    : "bg-white/[0.05] border border-white/10 text-white/70 hover:bg-white/10"
                }`}
              >
                {option === "all" ? "All" : option}
              </button>
            ))}
          </div>
        </div>

        {/* Subject/Class Filter */}
        <div className="space-y-3">
          <label className="text-sm font-semibold text-white/90 block">Class/Subject</label>
          <select
            value={filterSubject}
            onChange={(e) => onFilterSubjectChange(e.target.value)}
            className="w-full bg-white/[0.05] border border-white/[0.1] rounded-lg px-3 py-2 text-white/90 text-sm focus:outline-none focus:border-yellow-400/50 focus:bg-white/10 transition-all"
          >
            <option value="all">All Classes</option>
            {uniqueSubjects.map((subject) => (
              <option key={subject} value={subject}>
                {subject}
              </option>
            ))}
          </select>
        </div>

        {/* Exclude Previous Winners */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Checkbox
              id="exclude-winners"
              checked={excludePreviousWinners}
              onCheckedChange={(checked) => onExcludeWinnersChange(checked === true)}
              className="border-white/20 bg-white/5"
            />
            <Label
              htmlFor="exclude-winners"
              className="text-sm font-medium text-white/90 cursor-pointer"
            >
              Exclude previous winners
            </Label>
          </div>
          <p className="text-xs text-white/50 ml-6">
            {excludePreviousWinners
              ? "Only new winners can be selected"
              : "Any student can be selected again"}
          </p>
        </div>
      </TabsContent>

      <TabsContent value="info" className="space-y-4 mt-4">
        <div className="backdrop-blur-md bg-white/[0.05] border border-white/[0.1] rounded-lg p-4 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-white/70 text-sm">Available:</span>
            <span className="text-yellow-400 font-semibold">{availableCount}</span>
          </div>
          <div className="h-px bg-white/10"></div>
          <p className="text-xs text-white/50 leading-relaxed">
            {availableCount > 0
              ? "Select filters to narrow down the pool of eligible participants for the lucky draw."
              : "No students match the current filter criteria. Please adjust your filters."}
          </p>
        </div>
      </TabsContent>
    </Tabs>
  )
}
