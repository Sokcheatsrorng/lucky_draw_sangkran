import { useState, useRef, useCallback } from "react"

const DRAW_ANIMATION_SPEED = 50 // ms between selections
const TOTAL_SELECTIONS = 30 // number of random selections before final winner

export function useLuckyDraw() {
  const [winner, setWinner] = useState<string | null>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [currentSelection, setCurrentSelection] = useState<string | null>(null)

  const drawIntervalRef = useRef<NodeJS.Timeout | null>(null)

  const startDraw = useCallback(
    (availableStudents: string[], onDrawComplete: (winner: string) => void) => {
      if (availableStudents.length === 0 || isDrawing) return

      setIsDrawing(true)
      setWinner(null)
      let selectionCount = 0

      // Animate through random selections
      drawIntervalRef.current = setInterval(() => {
        const randomIndex = Math.floor(Math.random() * availableStudents.length)
        setCurrentSelection(availableStudents[randomIndex])
        selectionCount++

        // Stop after predetermined number of selections
        if (selectionCount >= TOTAL_SELECTIONS) {
          if (drawIntervalRef.current) {
            clearInterval(drawIntervalRef.current)
          }

          // Select final winner
          const winnerIndex = Math.floor(Math.random() * availableStudents.length)
          const selectedWinner = availableStudents[winnerIndex]
          setCurrentSelection(null)
          setWinner(selectedWinner)
          setIsDrawing(false)
          onDrawComplete(selectedWinner)
        }
      }, DRAW_ANIMATION_SPEED)
    },
    [isDrawing]
  )

  const resetDraw = useCallback(() => {
    if (drawIntervalRef.current) {
      clearInterval(drawIntervalRef.current)
    }
    setWinner(null)
    setCurrentSelection(null)
    setIsDrawing(false)
  }, [])

  return {
    winner,
    isDrawing,
    currentSelection,
    startDraw,
    resetDraw,
  }
}
