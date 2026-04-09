'use client'

import React from 'react'

export type DrawMode = 'database' | 'custom'

interface ModeToggleProps {
  currentMode: DrawMode
  onModeChange: (mode: DrawMode) => void
}

export function ModeToggle({ currentMode, onModeChange }: ModeToggleProps) {
  return (
    <div className="flex gap-2 p-1 bg-white/[0.03] border border-white/[0.08] rounded-xl w-fit">
      <button
        onClick={() => onModeChange('database')}
        className={`flex items-center gap-2 px-6 py-2 rounded-lg font-bold text-sm tracking-wider transition-all duration-300 ${
          currentMode === 'database'
            ? 'bg-yellow-500/20 border border-yellow-500/50 text-yellow-300 shadow-lg shadow-yellow-500/20'
            : 'text-white/60 hover:text-white/80 border border-transparent'
        }`}
      >
        <span className="text-lg">📊</span>
        Database
      </button>

      <button
        onClick={() => onModeChange('custom')}
        className={`flex items-center gap-2 px-6 py-2 rounded-lg font-bold text-sm tracking-wider transition-all duration-300 ${
          currentMode === 'custom'
            ? 'bg-purple-500/20 border border-purple-500/50 text-purple-300 shadow-lg shadow-purple-500/20'
            : 'text-white/60 hover:text-white/80 border border-transparent'
        }`}
      >
        <span className="text-lg">✏️</span>
        Custom
      </button>
    </div>
  )
}
