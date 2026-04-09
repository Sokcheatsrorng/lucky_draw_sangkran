import React from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface StudentListProps {
  students: string[]
  winners: string[]
}

export function StudentList({ students, winners }: StudentListProps) {
  return (
    <Tabs defaultValue="all" className="w-full h-full flex flex-col">
      <TabsList className="grid w-full grid-cols-2 bg-gradient-to-r from-white/5 to-white/[0.02] border border-white/[0.08] rounded-xl p-1">
        <TabsTrigger value="all" className="text-white/60 data-[state=active]:text-yellow-400 data-[state=active]:bg-white/10 rounded-lg">
          All Participants
        </TabsTrigger>
        <TabsTrigger value="winners" className="text-white/60 data-[state=active]:text-yellow-400 data-[state=active]:bg-white/10 rounded-lg">
          Winners
        </TabsTrigger>
      </TabsList>

      <TabsContent value="all" className="flex-1 overflow-hidden mt-6">
        <div className="backdrop-blur-xl bg-gradient-to-b from-white/[0.03] to-white/[0.01] border border-white/[0.06] rounded-2xl h-full overflow-y-auto custom-scrollbar">
          <div className="space-y-2 p-4">
            {students.length > 0 ? (
              students.map((student, index) => {
                const isWinner = winners.includes(student)
                return (
                  <div
                    key={index}
                    className={`px-4 py-3 rounded-lg text-sm font-medium transition-all border ${
                      isWinner
                        ? "bg-yellow-500/15 text-yellow-300 border-yellow-500/30 shadow-lg shadow-yellow-500/10"
                        : "bg-white/[0.03] text-white/70 border-white/[0.08] hover:bg-white/[0.08] hover:border-white/[0.15]"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        {isWinner && <span className="text-lg">🏆</span>}
                        {student}
                      </span>
                      {isWinner && <span className="text-xs font-bold text-yellow-400 tracking-widest">WINNER</span>}
                    </div>
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
