import React from "react"

interface DrawDisplayProps {
  currentSelection: string | null
  winner: string | null
  isDrawing: boolean
}

export function DrawDisplay({ currentSelection, winner, isDrawing }: DrawDisplayProps) {
  return (
    <div className="relative">
      {/* Display Card */}
      <div className="relative backdrop-blur-md bg-white/[0.05] border border-white/[0.1] rounded-2xl p-12 shadow-2xl overflow-hidden">
        {/* Gradient background animation */}
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 via-transparent to-teal-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

        {/* Content */}
        <div className="relative z-10 text-center min-h-[280px] flex flex-col items-center justify-center">
          {winner ? (
            <div className="space-y-6 animate-fadeIn">
              <div className="text-yellow-400 text-sm font-semibold tracking-widest uppercase">
                🎉 WINNER 🎉
              </div>
              <div className="text-5xl md:text-6xl font-bold text-white break-words">
                {winner}
              </div>
              <div className="h-1 w-24 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 rounded-full mx-auto"></div>
            </div>
          ) : isDrawing ? (
            <div className="space-y-6 animate-fadeIn">
              <div className="text-yellow-400 text-sm font-semibold tracking-widest uppercase opacity-75">
                Drawing...
              </div>
              <div className="text-4xl md:text-5xl font-bold text-white/80 min-h-16 flex items-center justify-center">
                {currentSelection}
              </div>
              <div className="flex justify-center gap-2 mt-8">
                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: "0s" }}></div>
                <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
              </div>
            </div>
          ) : (
            <div className="space-y-4 text-center">
              <div className="text-white/50 text-lg font-light">
                Press the button below to start
              </div>
              <div className="text-white/30 text-sm">
                Select filters to narrow down participants
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Decorative corners */}
      {winner && (
        <>
          <div className="absolute -top-1 -left-1 w-8 h-8 border-t-2 border-l-2 border-yellow-400 rounded-tl-lg"></div>
          <div className="absolute -top-1 -right-1 w-8 h-8 border-t-2 border-r-2 border-yellow-400 rounded-tr-lg"></div>
          <div className="absolute -bottom-1 -left-1 w-8 h-8 border-b-2 border-l-2 border-yellow-400 rounded-bl-lg"></div>
          <div className="absolute -bottom-1 -right-1 w-8 h-8 border-b-2 border-r-2 border-yellow-400 rounded-br-lg"></div>
        </>
      )}
    </div>
  )
}
