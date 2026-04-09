'use client'

import React, { useEffect, useRef } from 'react'

interface SpinningWheelProps {
  students: string[]
  isSpinning: boolean
  rotation: number
  winnerIndex: number | null
}

export function SpinningWheel({
  students,
  isSpinning,
  rotation,
  winnerIndex,
}: SpinningWheelProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const COLORS = [
    '#F59E0B', // Gold
    '#DC2626', // Red
    '#14B8A6', // Teal
    '#8B5CF6', // Purple
    '#EC4899', // Pink
    '#06B6D4', // Cyan
    '#EF8139', // Orange
    '#6366F1', // Indigo
  ]

  // Draw the spinning wheel
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height
    const centerX = width / 2
    const centerY = height / 2
    const radius = Math.min(width, height) / 2 - 20

    // Clear canvas
    ctx.fillStyle = 'rgba(17, 24, 39, 0.5)'
    ctx.fillRect(0, 0, width, height)

    // Save the current state
    ctx.save()

    // Translate to center and rotate
    ctx.translate(centerX, centerY)
    ctx.rotate((rotation * Math.PI) / 180)

    // Draw segments
    const segmentAngle = 360 / students.length
    students.forEach((student, index) => {
      const startAngle = (index * segmentAngle * Math.PI) / 180
      const endAngle = ((index + 1) * segmentAngle * Math.PI) / 180

      // Draw segment
      ctx.beginPath()
      ctx.arc(0, 0, radius, startAngle, endAngle)
      ctx.lineTo(0, 0)
      ctx.fillStyle = COLORS[index % COLORS.length]
      ctx.fill()

      // Draw border
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)'
      ctx.lineWidth = 2
      ctx.stroke()

      // Draw text
      const textAngle = (startAngle + endAngle) / 2
      const textX = Math.cos(textAngle) * (radius * 0.6)
      const textY = Math.sin(textAngle) * (radius * 0.6)

      ctx.save()
      ctx.translate(textX, textY)
      ctx.rotate(textAngle + Math.PI / 2)

      ctx.fillStyle = 'white'
      ctx.font = 'bold 11px sans-serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'

      // Split long names
      const maxLength = 15
      const displayName = student.length > maxLength ? student.substring(0, maxLength) + '...' : student
      ctx.fillText(displayName, 0, 0)

      ctx.restore()
    })

    // Draw center circle
    ctx.beginPath()
    ctx.arc(0, 0, 40, 0, 2 * Math.PI)
    ctx.fillStyle = '#1F2937'
    ctx.fill()
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)'
    ctx.lineWidth = 3
    ctx.stroke()

    // Draw center text
    ctx.fillStyle = 'white'
    ctx.font = 'bold 16px sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('SPIN', 0, -8)

    ctx.restore()
  }, [students, rotation])

  return (
    <div className="relative flex items-center justify-center">
      {/* Canvas wrapper */}
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={500}
          height={500}
          className={`w-full max-w-md h-auto transition-transform ${
            isSpinning ? 'animate-none' : ''
          }`}
          style={{
            filter: 'drop-shadow(0 25px 50px rgba(0, 0, 0, 0.5))',
          }}
        />

        {/* Pointer at top */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full z-20">
          <div 
            className="w-0 h-0"
            style={{
              borderLeft: '12px solid transparent',
              borderRight: '12px solid transparent',
              borderTop: '16px solid #F59E0B',
            }}
          ></div>
        </div>

        {/* Glow effect when spinning */}
        {isSpinning && (
          <div className="absolute inset-0 rounded-full border-4 border-yellow-400 animate-pulse opacity-50"></div>
        )}
      </div>
    </div>
  )
}
