'use client'

import React, { useEffect, useState } from 'react'
import { CheckCircle } from 'lucide-react'

interface SuccessMessageProps {
  message: string
  duration?: number
  onDismiss?: () => void
}

export function SuccessMessage({ message, duration = 3000, onDismiss }: SuccessMessageProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      onDismiss?.()
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onDismiss])

  if (!isVisible) return null

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-slideDown">
      <div className="flex items-center gap-3 px-4 py-3 bg-green-500/20 border border-green-500/50 rounded-lg text-green-400 shadow-lg shadow-green-500/20">
        <CheckCircle className="w-5 h-5" />
        <span className="font-semibold text-sm">{message}</span>
      </div>
    </div>
  )
}
