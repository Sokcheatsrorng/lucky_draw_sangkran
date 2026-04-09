import React from "react"

interface AudioControllerProps {
  isMuted: boolean
  onToggleMute: () => void
  isLoading?: boolean
}

export function AudioController({ isMuted, onToggleMute, isLoading = false }: AudioControllerProps) {
  return (
    <button
      onClick={onToggleMute}
      disabled={isLoading}
      className={`fixed bottom-8 right-8 z-50 p-4 rounded-full transition-all duration-300 backdrop-blur-md border border-white/20 ${
        isMuted
          ? "bg-red-500/20 hover:bg-red-500/30 text-red-400"
          : "bg-green-500/20 hover:bg-green-500/30 text-green-400"
      } ${isLoading ? "opacity-50 cursor-not-allowed" : "hover:scale-110 cursor-pointer"}`}
      title={isMuted ? "Unmute" : "Mute"}
    >
      <span className="text-2xl">{isMuted ? "🔇" : "🔊"}</span>
    </button>
  )
}
