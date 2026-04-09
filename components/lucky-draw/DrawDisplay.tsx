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
      {/* Premium Wheel Card */}
      <div className="relative backdrop-blur-xl bg-gradient-to-b from-white/8 to-white/[0.02] border border-white/[0.08] rounded-3xl p-12 shadow-2xl overflow-visible">
        
        {/* Decorative gradient corners */}
        <div className="absolute -top-px -left-px w-64 h-64 bg-gradient-to-br from-yellow-500/20 to-transparent blur-3xl opacity-50 pointer-events-none"></div>
        <div className="absolute -bottom-px -right-px w-64 h-64 bg-gradient-to-tl from-purple-500/20 to-transparent blur-3xl opacity-50 pointer-events-none"></div>

        {/* Spinning Wheel */}
        <div className="relative z-10 flex items-center justify-center mb-12">
          <SpinningWheel
            students={students}
            isSpinning={isDrawing}
            rotation={rotation}
            winnerIndex={winnerIndex}
          />
        </div>

        {/* Winner Display */}
        <div className="relative z-10 text-center">
          {winner ? (
            <div className="space-y-6 animate-fadeIn">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-500/10 border border-yellow-500/30 rounded-full backdrop-blur-sm">
                <span className="text-2xl">🎉</span>
                <span className="text-sm font-bold text-yellow-400 tracking-widest uppercase">Winner Announced</span>
              </div>

              <div className="space-y-2">
                <h2 className="text-xl md:text-2xl text-white/60 font-light tracking-wide">
                  The Lucky Winner is
                </h2>
                <div className="text-5xl md:text-7xl font-black bg-gradient-to-r from-yellow-300 to-yellow-400 bg-clip-text text-transparent break-words px-4">
                  {winner}
                </div>
              </div>

              <div className="flex justify-center gap-2">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-yellow-500/50 to-transparent"></div>
                <span className="text-yellow-400 font-bold text-lg">✨</span>
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-yellow-500/50 to-transparent"></div>
              </div>

              <p className="text-white/80 font-semibold text-lg">
                Congratulations on your scholarship!
              </p>
            </div>
          ) : isDrawing ? (
            <div className="space-y-8">
              <div className="text-center">
                <div className="text-sm font-bold text-yellow-400 tracking-widest uppercase mb-4 opacity-75">
                  The wheel is spinning...
                </div>
                <div className="flex justify-center gap-1">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: "0s" }}></div>
                  <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                  <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                </div>
              </div>
              <div className="h-1 w-40 bg-gradient-to-r from-transparent via-yellow-400 to-transparent rounded-full mx-auto animate-pulse"></div>
            </div>
          ) : (
            <div className="space-y-6 text-center py-8">
              <h3 className="text-2xl md:text-3xl font-light text-white/70">
                Ready to reveal the lucky winner?
              </h3>
              <p className="text-white/50 text-base font-light">
                Press the button below to spin the wheel and discover who will receive the scholarship
              </p>
              <div className="text-5xl animate-bounce" style={{ animationDelay: "0.2s" }}>
                🎡
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
