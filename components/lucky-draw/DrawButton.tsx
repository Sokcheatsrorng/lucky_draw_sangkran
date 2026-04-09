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
    <div className="flex flex-col gap-4">
      <button
        onClick={onClick}
        disabled={isDisabled}
        className={`relative group px-12 py-6 rounded-xl font-bold text-lg tracking-wide transition-all duration-300 overflow-hidden ${
          isDisabled
            ? "bg-white/5 text-white/40 cursor-not-allowed border border-white/10"
            : "bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-white shadow-2xl hover:shadow-3xl hover:scale-105 border border-yellow-300/30"
        }`}
      >
        {/* Shimmer effect */}
        {!isDisabled && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:translate-x-full transition-transform duration-700 -translate-x-full"></div>
        )}

        <span className="relative flex items-center justify-center gap-2">
          {isDrawing ? (
            <>
              <span className="inline-block animate-spin">⚡</span>
              Drawing...
            </>
          ) : (
            <>
              🎲 Start Lucky Draw
            </>
          )}
        </span>
      </button>

      {availableStudentCount === 0 && !isDisabled && (
        <p className="text-sm text-red-400/70 text-center">
          No students available with current filters
        </p>
      )}

      {availableStudentCount > 0 && (
        <p className="text-sm text-white/50 text-center">
          {availableStudentCount} student{availableStudentCount !== 1 ? "s" : ""} available
        </p>
      )}
    </div>
  )
}
