"use client"

import { useState, useEffect } from "react"
import { DrawHeader } from "@/components/lucky-draw/DrawHeader"
import { DrawContainer } from "@/components/lucky-draw/DrawContainer"
import { CustomInputPanel } from "@/components/lucky-draw/CustomInputPanel"
import { ModeToggle, type DrawMode } from "@/components/lucky-draw/ModeToggle"
import { AudioController } from "@/components/lucky-draw/AudioController"
import { useStudentFiltering } from "@/hooks/useStudentFiltering"
import { useLuckyDraw } from "@/hooks/useLuckyDraw"
import { useAudioManager } from "@/hooks/useAudioManager"
import { useWinnerHistory } from "@/hooks/useWinnerHistory"
import { useConfetti } from "@/hooks/useConfetti"
import { studentData } from "@/students"
import { getAvailableStudents } from "@/lib/draw-utils"

export default function LuckyDraw() {
  const [mode, setMode] = useState<DrawMode>('database')

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
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Premium background with subtle gradients */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black to-black"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl opacity-20"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl opacity-20"></div>
      </div>

      {/* Confetti Canvas */}
      <canvas ref={confettiCanvasRef} className="fixed inset-0 pointer-events-none" />

      {/* Main Content */}
      <div className="relative z-10 px-4 md:px-6 lg:px-8 py-12 md:py-16">
        {/* Header */}
        <DrawHeader />

        {/* Mode Toggle */}
        <div className="max-w-7xl mx-auto flex justify-center mb-12">
          <ModeToggle currentMode={mode} onModeChange={setMode} />
        </div>

        {/* Main Container */}
        <div className="max-w-7xl mx-auto">
          {mode === 'database' ? (
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
          ) : (
            <CustomInputPanel />
          )}
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

