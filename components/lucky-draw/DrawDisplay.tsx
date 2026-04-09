'use client'

import React from "react"
import { SpinningWheel } from "./SpinningWheel"

interface DrawDisplayProps {
  students: string[]
  winner: string | null
  isDrawing: boolean
  rotation: number
  winnerIndex: number | null
}

export function DrawDisplay({ 
  students, 
  winner, 
  isDrawing, 
  rotation, 
  winnerIndex 
}: DrawDisplayProps) {
  return (
    <div className="relative w-full">
      {/* Wheel Section */}
      <div className="relative backdrop-blur-md bg-white/[0.05] border border-white/[0.1] rounded-3xl p-8 shadow-2xl overflow-visible">
        
        {/* Spinning Wheel */}
        <div className="flex items-center justify-center">
          <SpinningWheel
            students={students}
            isSpinning={isDrawing}
            rotation={rotation}
            winnerIndex={winnerIndex}
          />
        </div>

        {/* Winner Display */}
        <div className="mt-8 text-center">
          {winner ? (
            <div className="space-y-4 animate-fadeIn">
              <div className="text-yellow-400 text-sm font-semibold tracking-widest uppercase">
                🎉 WINNER 🎉
              </div>
              <div className="text-4xl md:text-5xl lg:text-6xl font-bold text-white break-words px-4">
                {winner}
              </div>
              <div className="h-1 w-24 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 rounded-full mx-auto"></div>
              <div className="text-yellow-200 text-sm mt-4">
                Congratulations! 🎊
              </div>
            </div>
          ) : isDrawing ? (
            <div className="space-y-4">
              <div className="text-yellow-400 text-sm font-semibold tracking-widest uppercase opacity-75">
                Spinning the wheel...
              </div>
              <div className="h-2 w-32 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 rounded-full mx-auto animate-pulse"></div>
            </div>
          ) : (
            <div className="space-y-3 text-center">
              <div className="text-white/60 text-base font-light">
                Ready to find the winner?
              </div>
              <div className="text-white/40 text-sm">
                Click "Start Lucky Draw" to spin the wheel
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
