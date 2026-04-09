import React from "react"

interface DrawHeaderProps {
  title?: string
  subtitle?: string
}

export function DrawHeader({ title = "ISTAD Sangkran", subtitle = "Scholarship Lucky Draw 2024" }: DrawHeaderProps) {
  return (
    <div className="text-center mb-16 animate-fadeIn">
      {/* Premium badge */}
      <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-yellow-500/10 border border-yellow-500/30 rounded-full backdrop-blur-sm">
        <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
        <span className="text-xs font-semibold text-yellow-400 tracking-widest uppercase">Premium Event</span>
      </div>

      {/* Main title with gradient */}
      <h1 className="text-6xl md:text-7xl lg:text-8xl font-black mb-4 leading-tight">
        <span className="bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-300 bg-clip-text text-transparent">
          {title}
        </span>
      </h1>

      {/* Subtitle */}
      <p className="text-lg md:text-xl text-white/60 font-light tracking-wide mb-8">
        {subtitle}
      </p>

      {/* Decorative line */}
      <div className="flex justify-center items-center gap-4">
        <div className="w-16 h-px bg-gradient-to-r from-transparent via-yellow-500/50 to-transparent"></div>
        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
        <div className="w-16 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>
      </div>
    </div>
  )
}
