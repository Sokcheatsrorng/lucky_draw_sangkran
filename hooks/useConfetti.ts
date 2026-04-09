import { useRef, useCallback } from "react"
import confetti from "canvas-confetti"

export function useConfetti() {
  const confettiCanvasRef = useRef<HTMLCanvasElement>(null)

  const triggerConfetti = useCallback(() => {
    if (!confettiCanvasRef.current) return

    const myConfetti = confetti.create(confettiCanvasRef.current, {
      resize: true,
      useWorker: true,
    })

    myConfetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    })

    setTimeout(() => {
      myConfetti({
        particleCount: 50,
        spread: 100,
        origin: { y: 0.4 },
      })
    }, 500)
  }, [])

  return {
    confettiCanvasRef,
    triggerConfetti,
  }
}
