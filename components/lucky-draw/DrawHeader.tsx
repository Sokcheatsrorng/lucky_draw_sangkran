import React from "react"

interface DrawHeaderProps {
  title?: string
  subtitle?: string
}

export function DrawHeader({ title = "Lucky Draw", subtitle = "ISTAD Sangkran 2024" }: DrawHeaderProps) {
  return (
    <div className="text-center mb-12 animate-fadeIn">
      <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-yellow-400 via-orange-500 to-yellow-400 bg-clip-text text-transparent mb-3">
        {title}
      </h1>
      <p className="text-xl text-white/70 font-light tracking-wide">{subtitle}</p>
      <div className="mt-6 flex justify-center gap-2">
        <div className="w-12 h-1 bg-gradient-to-r from-yellow-400 to-transparent rounded-full"></div>
        <div className="w-12 h-1 bg-gradient-to-r from-red-500 to-transparent rounded-full"></div>
        <div className="w-12 h-1 bg-gradient-to-r from-teal-400 to-transparent rounded-full"></div>
      </div>
    </div>
  )
}
