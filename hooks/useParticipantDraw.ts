'use client'

import { useState, useRef, useCallback } from 'react'

export interface DrawResult {
  participantName: string
  rewardId: string
  rewardName: string
  timestamp: Date
}

export function useParticipantDraw() {
  const [isDrawing, setIsDrawing] = useState(false)
  const [currentParticipant, setCurrentParticipant] = useState<string | null>(null)
  const [drawResult, setDrawResult] = useState<DrawResult | null>(null)
  const [drawHistory, setDrawHistory] = useState<DrawResult[]>([])

  const drawIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const startTimeRef = useRef<number>(0)

  const DRAW_DURATION = 3000 // 3 seconds
  const ANIMATION_SPEED = 80 // ms between selections

  const startDraw = useCallback(
    (
      participants: string[],
      rewardId: string,
      rewardName: string,
      onComplete: (result: DrawResult) => void
    ) => {
      if (participants.length === 0 || isDrawing) return

      setIsDrawing(true)
      setDrawResult(null)
      let animationCount = 0
      const targetCount = Math.floor(DRAW_DURATION / ANIMATION_SPEED)

      startTimeRef.current = Date.now()

      // Animation loop
      drawIntervalRef.current = setInterval(() => {
        // Show random participant
        const randomIndex = Math.floor(Math.random() * participants.length)
        setCurrentParticipant(participants[randomIndex])
        animationCount++

        // Check if animation should end
        if (animationCount >= targetCount) {
          if (drawIntervalRef.current) {
            clearInterval(drawIntervalRef.current)
          }

          // Select final winner
          const winnerIndex = Math.floor(Math.random() * participants.length)
          const winnerName = participants[winnerIndex]

          const result: DrawResult = {
            participantName: winnerName,
            rewardId,
            rewardName,
            timestamp: new Date(),
          }

          setCurrentParticipant(null)
          setDrawResult(result)
          setIsDrawing(false)
          setDrawHistory((prev) => [...prev, result])

          onComplete(result)
        }
      }, ANIMATION_SPEED)
    },
    [isDrawing]
  )

  const resetDraw = useCallback(() => {
    if (drawIntervalRef.current) {
      clearInterval(drawIntervalRef.current)
    }
    setIsDrawing(false)
    setCurrentParticipant(null)
    setDrawResult(null)
  }, [])

  const clearHistory = useCallback(() => {
    setDrawHistory([])
  }, [])

  const getLastDraw = useCallback(() => {
    return drawHistory.length > 0 ? drawHistory[drawHistory.length - 1] : null
  }, [drawHistory])

  return {
    isDrawing,
    currentParticipant,
    drawResult,
    drawHistory,
    startDraw,
    resetDraw,
    clearHistory,
    getLastDraw,
  }
}
