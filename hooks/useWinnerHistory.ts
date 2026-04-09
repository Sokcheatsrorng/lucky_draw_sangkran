import { useState, useEffect } from "react"

export interface WinnerRecord {
  name: string
  timestamp: string
  category: string
}

const STORAGE_KEY = "luckyDrawWinners"

export function useWinnerHistory() {
  const [winnerHistory, setWinnerHistory] = useState<WinnerRecord[]>([])

  // Load winner history from localStorage on mount
  useEffect(() => {
    try {
      const savedWinners = localStorage.getItem(STORAGE_KEY)
      if (savedWinners) {
        const parsedWinners = JSON.parse(savedWinners)
        setWinnerHistory(parsedWinners)
      }
    } catch (error) {
      console.error("Failed to load winner history:", error)
    }
  }, [])

  // Save winner history to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(winnerHistory))
    } catch (error) {
      console.error("Failed to save winner history:", error)
    }
  }, [winnerHistory])

  const addWinner = (name: string, category: string) => {
    const newRecord: WinnerRecord = {
      name,
      timestamp: new Date().toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      category,
    }
    setWinnerHistory([...winnerHistory, newRecord])
  }

  const resetWinners = () => {
    setWinnerHistory([])
  }

  const getWinnerNames = () => {
    return winnerHistory.map((record) => record.name)
  }

  return {
    winnerHistory,
    addWinner,
    resetWinners,
    getWinnerNames,
  }
}
