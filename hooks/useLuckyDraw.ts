import { useState, useRef, useCallback } from "react"

const SPIN_DURATION = 4000 // Duration of spin animation in ms
const BASE_SPIN_SPEED = 15 // Degrees per frame

export function useLuckyDraw() {
  const [winner, setWinner] = useState<string | null>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [rotation, setRotation] = useState(0)
  const [winnerIndex, setWinnerIndex] = useState<number | null>(null)

  const drawIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const startTimeRef = useRef<number>(0)

  const startDraw = useCallback(
    (availableStudents: string[], onDrawComplete: (winner: string) => void) => {
      if (availableStudents.length === 0 || isDrawing) return

      setIsDrawing(true)
      setWinner(null)
      setRotation(0)

      // Select random winner (but don't reveal yet)
      const selectedWinnerIndex = Math.floor(Math.random() * availableStudents.length)
      const selectedWinner = availableStudents[selectedWinnerIndex]

      startTimeRef.current = Date.now()
      let lastRotation = 0

      // Animate spinning wheel
      drawIntervalRef.current = setInterval(() => {
        const elapsed = Date.now() - startTimeRef.current
        const progress = Math.min(elapsed / SPIN_DURATION, 1)

        // Easing out cubic for deceleration effect
        const easeOutCubic = 1 - Math.pow(1 - progress, 3)

        // Calculate rotation: spin multiple times then slow down to winner
        const totalSpins = 5 // Number of full rotations
        const segmentAngle = 360 / availableStudents.length
        const winnerRotation = selectedWinnerIndex * segmentAngle

        // Start rotation from a random offset
        const randomOffset = Math.random() * 360
        const targetRotation = randomOffset + totalSpins * 360 + winnerRotation

        const currentRotation = targetRotation * easeOutCubic
        setRotation(currentRotation % 360)
        lastRotation = currentRotation

        // Animation complete
        if (progress === 1) {
          if (drawIntervalRef.current) {
            clearInterval(drawIntervalRef.current)
          }

          // Calculate final rotation and winner
          const finalRotation = (lastRotation % 360 + 360) % 360
          const normalizedWinnerRotation = (winnerRotation % 360 + 360) % 360

          // Find which segment points to the top (pointer position)
          const pointerPosition = 0 // Top of wheel
          const closestSegmentIndex = Math.round(
            ((pointerPosition - (finalRotation % 360) + 360) % 360) / segmentAngle
          ) % availableStudents.length

          setWinnerIndex(closestSegmentIndex)
          setWinner(availableStudents[selectedWinnerIndex])
          setIsDrawing(false)
          onDrawComplete(selectedWinner)
        }
      }, 16) // ~60fps
    },
    [isDrawing]
  )

  const resetDraw = useCallback(() => {
    if (drawIntervalRef.current) {
      clearInterval(drawIntervalRef.current)
    }
    setWinner(null)
    setRotation(0)
    setWinnerIndex(null)
    setIsDrawing(false)
  }, [])

  return {
    winner,
    isDrawing,
    rotation,
    winnerIndex,
    startDraw,
    resetDraw,
  }
}
