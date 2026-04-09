import React from "react"

interface DrawButtonProps {
  onClick: () => void
  disabled?: boolean
  isDrawing?: boolean
  availableStudentCount?: number
}

export function DrawButton({
  onClick,
  disabled = false,
  isDrawing = false,
  availableStudentCount = 0,
}: DrawButtonProps) {
  const isDisabled = disabled || availableStudentCount === 0 || isDrawing

  return (
    <div className="flex flex-col gap-4 items-center w-full">
      <button
        onClick={onClick}
        disabled={isDisabled}
        className={`relative group w-full md:w-auto px-16 py-4 rounded-2xl font-black text-lg tracking-widest transition-all duration-300 overflow-hidden uppercase ${
          isDisabled
            ? "bg-white/5 text-white/30 cursor-not-allowed border border-white/5"
            : "bg-gradient-to-r from-yellow-400 to-yellow-500 text-black shadow-2xl hover:shadow-yellow-500/50 hover:scale-110 active:scale-95 border border-yellow-300/20"
        }`}
      >
        {/* Glow effect */}
        {!isDisabled && (
          <>
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-yellow-500 opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:translate-x-full transition-transform duration-700 -translate-x-full"></div>
          </>
        )}

        <span className="relative flex items-center justify-center gap-3">
          {isDrawing ? (
            <>
              <span className="inline-block animate-spin text-xl">✨</span>
              <span>Spinning...</span>
            </>
          ) : (
            <>
              <span className="text-2xl">🎡</span>
              <span>Start the Draw</span>
            </>
          )}
        </span>
      </button>

      {availableStudentCount > 0 && (
        <p className="text-sm text-white/40 text-center">
          {availableStudentCount} participant{availableStudentCount !== 1 ? "s" : ""} in the draw
        </p>
      )}

      {availableStudentCount === 0 && (
        <p className="text-sm text-white/30 text-center italic">
          No participants available with current filters
        </p>
      )}
    </div>
  )
}
