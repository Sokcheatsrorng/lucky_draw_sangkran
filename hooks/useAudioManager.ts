import { useState, useRef, useEffect } from "react"

export function useAudioManager() {
  const [isMuted, setIsMuted] = useState(false)
  const [audioLoaded, setAudioLoaded] = useState(false)

  const backgroundMusicRef = useRef<HTMLAudioElement | null>(null)
  const drawMusicRef = useRef<HTMLAudioElement | null>(null)
  const winnerMusicRef = useRef<HTMLAudioElement | null>(null)

  // Initialize audio elements after component mounts (client-side only)
  useEffect(() => {
    backgroundMusicRef.current = new Audio("/background.mp3")
    drawMusicRef.current = new Audio("/draw.mp3")
    winnerMusicRef.current = new Audio("/winner.mp3")

    if (backgroundMusicRef.current && drawMusicRef.current && winnerMusicRef.current) {
      backgroundMusicRef.current.volume = 0.3
      drawMusicRef.current.volume = 0.5
      winnerMusicRef.current.volume = 0.7
      setAudioLoaded(true)
    }

    return () => {
      backgroundMusicRef.current?.pause()
      drawMusicRef.current?.pause()
      winnerMusicRef.current?.pause()
    }
  }, [])

  const playBackgroundMusic = () => {
    if (!audioLoaded || isMuted || !backgroundMusicRef.current) return

    backgroundMusicRef.current.currentTime = 0
    backgroundMusicRef.current.loop = true

    const playPromise = backgroundMusicRef.current.play()
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Audio play was prevented by browser
      })
    }
  }

  const playDrawMusic = () => {
    if (!audioLoaded || isMuted || !drawMusicRef.current) return

    drawMusicRef.current.currentTime = 0

    const playPromise = drawMusicRef.current.play()
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Audio play was prevented by browser
      })
    }
  }

  const playWinnerMusic = () => {
    if (!audioLoaded || isMuted || !winnerMusicRef.current) return

    winnerMusicRef.current.currentTime = 0

    const playPromise = winnerMusicRef.current.play()
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Audio play was prevented by browser
      })
    }
  }

  const stopAllMusic = () => {
    backgroundMusicRef.current?.pause()
    drawMusicRef.current?.pause()
    winnerMusicRef.current?.pause()
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
    if (!isMuted) {
      stopAllMusic()
    }
  }

  return {
    isMuted,
    toggleMute,
    audioLoaded,
    playBackgroundMusic,
    playDrawMusic,
    playWinnerMusic,
    stopAllMusic,
  }
}
