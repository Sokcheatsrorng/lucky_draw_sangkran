"use client"

import { useEffect } from "react"
import { DrawHeader } from "@/components/lucky-draw/DrawHeader"
import { DrawContainer } from "@/components/lucky-draw/DrawContainer"
import { AudioController } from "@/components/lucky-draw/AudioController"
import { useStudentFiltering } from "@/hooks/useStudentFiltering"
import { useLuckyDraw } from "@/hooks/useLuckyDraw"
import { useAudioManager } from "@/hooks/useAudioManager"
import { useWinnerHistory } from "@/hooks/useWinnerHistory"
import { useConfetti } from "@/hooks/useConfetti"
import { studentData } from "@/students"
import { getAvailableStudents } from "@/lib/draw-utils"

export default function LuckyDraw() {
  // Initialize all custom hooks
  const studentFiltering = useStudentFiltering()
  const draw = useLuckyDraw()
  const audio = useAudioManager()
  const history = useWinnerHistory()
  const { confettiCanvasRef, triggerConfetti } = useConfetti()

  // Get list of all student names
  const allStudentNames = studentData.map((student) => student.Full_Name)

  // Calculate available students based on filters and winner exclusion
  const availableStudents = getAvailableStudents(
    studentFiltering.filteredStudents,
    history.getWinnerNames(),
    studentFiltering.excludePreviousWinners
  )

  // Start background music on mount
  useEffect(() => {
    audio.playBackgroundMusic()
  }, [audio])

  // Handle draw action
  const handleStartDraw = () => {
    if (availableStudents.length === 0) return

    audio.playDrawMusic()
    draw.startDraw(availableStudents, (selectedWinner) => {
      // Draw completed
      history.addWinner(selectedWinner, "Default")
      audio.playWinnerMusic()
      triggerConfetti()
    })
  }

  // Handle reset
  const handleResetWinners = () => {
    draw.resetDraw()
    history.resetWinners()
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white overflow-x-hidden">
      {/* Confetti Canvas */}
      <canvas ref={confettiCanvasRef} className="fixed inset-0 pointer-events-none" />

      {/* Main Content */}
      <div className="relative z-10 px-4 md:px-6 lg:px-8 py-8 md:py-12">
        {/* Header */}
        <DrawHeader />

        {/* Main Container */}
        <div className="max-w-7xl mx-auto">
          <DrawContainer
            allStudents={allStudentNames}
            filteredStudents={studentFiltering.filteredStudents}
            winners={history.getWinnerNames()}
            filterGender={studentFiltering.filterGender}
            onFilterGenderChange={studentFiltering.setFilterGender}
            filterSubject={studentFiltering.filterSubject}
            onFilterSubjectChange={studentFiltering.setFilterSubject}
            excludePreviousWinners={studentFiltering.excludePreviousWinners}
            onExcludeWinnersChange={studentFiltering.setExcludePreviousWinners}
            uniqueSubjects={studentFiltering.uniqueSubjects}
            winner={draw.winner}
            isDrawing={draw.isDrawing}
            rotation={draw.rotation}
            winnerIndex={draw.winnerIndex}
            onDraw={handleStartDraw}
            history={history.winnerHistory}
            onResetHistory={handleResetWinners}
          />
        </div>

        {/* Footer */}
        <div className="max-w-7xl mx-auto mt-16 text-center">
          <p className="text-sm text-white/40">
            Sangkran 2024 Lucky Draw • ISTAD Scholarship Program
          </p>
        </div>
      </div>

      {/* Audio Controller */}
      <AudioController
        isMuted={audio.isMuted}
        onToggleMute={audio.toggleMute}
        isLoading={!audio.audioLoaded}
      />
    </div>
  )
}

