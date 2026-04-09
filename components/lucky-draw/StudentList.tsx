import React from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface StudentListProps {
  students: string[]
  winners: string[]
}

export function StudentList({ students, winners }: StudentListProps) {
  return (
    <Tabs defaultValue="all" className="w-full h-full flex flex-col">
      <TabsList className="grid w-full grid-cols-2 bg-white/[0.05] border border-white/[0.1]">
        <TabsTrigger value="all" className="text-white/70">
          All Students
        </TabsTrigger>
        <TabsTrigger value="winners" className="text-white/70">
          Winners
        </TabsTrigger>
      </TabsList>

      <TabsContent value="all" className="flex-1 overflow-hidden mt-4">
        <div className="backdrop-blur-md bg-white/[0.05] border border-white/[0.1] rounded-lg h-full overflow-y-auto custom-scrollbar">
          <div className="space-y-1 p-2">
            {students.length > 0 ? (
              students.map((student, index) => {
                const isWinner = winners.includes(student)
                return (
                  <div
                    key={index}
                    className={`px-3 py-2 rounded text-sm transition-all ${
                      isWinner
                        ? "bg-yellow-500/20 text-yellow-300 font-medium border-l-2 border-yellow-400"
                        : "text-white/70 hover:bg-white/[0.08]"
                    }`}
                  >
                    {isWinner && <span className="mr-2">⭐</span>}
                    {student}
                  </div>
                )
              })
            ) : (
              <div className="flex items-center justify-center h-32 text-white/40 text-sm">
                No students to display
              </div>
            )}
          </div>
        </div>
      </TabsContent>

      <TabsContent value="winners" className="flex-1 overflow-hidden mt-4">
        <div className="backdrop-blur-md bg-white/[0.05] border border-white/[0.1] rounded-lg h-full overflow-y-auto custom-scrollbar">
          <div className="space-y-1 p-2">
            {winners.length > 0 ? (
              winners.map((winner, index) => (
                <div
                  key={index}
                  className="px-3 py-2 rounded text-sm bg-yellow-500/20 text-yellow-300 font-medium border-l-2 border-yellow-400"
                >
                  <span className="mr-2">✨</span>
                  {winner}
                </div>
              ))
            ) : (
              <div className="flex items-center justify-center h-32 text-white/40 text-sm">
                No winners yet
              </div>
            )}
          </div>
        </div>
      </TabsContent>
    </Tabs>
  )
}
