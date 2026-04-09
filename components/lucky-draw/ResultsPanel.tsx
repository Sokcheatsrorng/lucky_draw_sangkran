import React from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DrawDisplay } from "./DrawDisplay"
import { DrawButton } from "./DrawButton"
import { DrawHistory } from "./DrawHistory"
import { WinnerRecord } from "@/hooks/useWinnerHistory"

interface ResultsPanelProps {
  students: string[]
  winner: string | null
  isDrawing: boolean
  rotation: number
  winnerIndex: number | null
  availableCount: number
  onDraw: () => void
  history: WinnerRecord[]
  onResetHistory: () => void
}

export function ResultsPanel({
  students,
  winner,
  isDrawing,
  rotation,
  winnerIndex,
  availableCount,
  onDraw,
  history,
  onResetHistory,
}: ResultsPanelProps) {
  return (
    <Tabs defaultValue="draw" className="w-full h-full flex flex-col">
      <TabsList className="grid w-full grid-cols-2 bg-white/[0.05] border border-white/[0.1]">
        <TabsTrigger value="draw" className="text-white/70">
          Draw
        </TabsTrigger>
        <TabsTrigger value="history" className="text-white/70">
          History
        </TabsTrigger>
      </TabsList>

      <TabsContent value="draw" className="flex-1 flex flex-col gap-6 mt-4">
        <DrawDisplay 
          students={students}
          winner={winner} 
          isDrawing={isDrawing}
          rotation={rotation}
          winnerIndex={winnerIndex}
        />
        <DrawButton
          onClick={onDraw}
          disabled={isDrawing}
          isDrawing={isDrawing}
          availableStudentCount={availableCount}
        />
      </TabsContent>

      <TabsContent value="history" className="flex-1 mt-4">
        <DrawHistory history={history} onReset={onResetHistory} />
      </TabsContent>
    </Tabs>
  )
}
