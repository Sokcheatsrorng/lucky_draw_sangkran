'use client'

import { useState, useCallback } from 'react'

export interface Participant {
  id: string
  name: string
  addedAt: Date
}

export function useCustomParticipants(initialParticipants: Participant[] = []) {
  const [participants, setParticipants] = useState<Participant[]>(initialParticipants)
  const [inputValue, setInputValue] = useState('')
  const [error, setError] = useState<string | null>(null)

  const addParticipant = useCallback((name: string) => {
    const trimmedName = name.trim()

    // Validation
    if (!trimmedName) {
      setError('Name cannot be empty')
      return false
    }

    if (trimmedName.length < 2) {
      setError('Name must be at least 2 characters')
      return false
    }

    if (trimmedName.length > 50) {
      setError('Name must be less than 50 characters')
      return false
    }

    if (participants.some((p) => p.name.toLowerCase() === trimmedName.toLowerCase())) {
      setError('This name already exists')
      return false
    }

    const newParticipant: Participant = {
      id: `${Date.now()}-${Math.random()}`,
      name: trimmedName,
      addedAt: new Date(),
    }

    setParticipants((prev) => [...prev, newParticipant])
    setInputValue('')
    setError(null)
    return true
  }, [participants])

  const removeParticipant = useCallback((id: string) => {
    setParticipants((prev) => prev.filter((p) => p.id !== id))
    setError(null)
  }, [])

  const clearAllParticipants = useCallback(() => {
    setParticipants([])
    setInputValue('')
    setError(null)
  }, [])

  const updateParticipantName = useCallback((id: string, newName: string) => {
    const trimmedName = newName.trim()

    if (!trimmedName || trimmedName.length < 2) {
      setError('Invalid name')
      return false
    }

    if (
      participants.some(
        (p) => p.id !== id && p.name.toLowerCase() === trimmedName.toLowerCase()
      )
    ) {
      setError('This name already exists')
      return false
    }

    setParticipants((prev) =>
      prev.map((p) => (p.id === id ? { ...p, name: trimmedName } : p))
    )
    setError(null)
    return true
  }, [participants])

  const getParticipantNames = useCallback(() => {
    return participants.map((p) => p.name)
  }, [participants])

  return {
    participants,
    inputValue,
    setInputValue,
    error,
    setError,
    addParticipant,
    removeParticipant,
    clearAllParticipants,
    updateParticipantName,
    getParticipantNames,
    participantCount: participants.length,
  }
}
