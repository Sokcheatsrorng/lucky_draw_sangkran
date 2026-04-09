'use client'

import React, { useState } from 'react'
import { HelpCircle } from 'lucide-react'

interface HelpTooltipProps {
  text: string
  position?: 'top' | 'bottom' | 'left' | 'right'
}

export function HelpTooltip({ text, position = 'top' }: HelpTooltipProps) {
  const [isVisible, setIsVisible] = useState(false)

  const positionClasses = {
    top: '-top-12 left-1/2 -translate-x-1/2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  }

  return (
    <div className="relative inline-block">
      <button
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        className="p-1 text-white/40 hover:text-yellow-400/60 transition-colors"
        aria-label="Help"
      >
        <HelpCircle className="w-4 h-4" />
      </button>

      {isVisible && (
        <div
          className={`absolute z-50 px-3 py-2 bg-black border border-yellow-500/50 rounded-lg text-xs text-white/80 whitespace-nowrap animate-fadeIn ${positionClasses[position]}`}
        >
          {text}
          <div className={`absolute w-2 h-2 bg-black border border-yellow-500/50 rotate-45 ${
            position === 'top' ? '-bottom-1 left-1/2 -translate-x-1/2' :
            position === 'bottom' ? '-top-1 left-1/2 -translate-x-1/2' :
            position === 'left' ? '-right-1 top-1/2 -translate-y-1/2' :
            '-left-1 top-1/2 -translate-y-1/2'
          }`}></div>
        </div>
      )}
    </div>
  )
}
