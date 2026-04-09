'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { useParticipantDraw } from '@/hooks/useParticipantDraw'
import { type Reward } from '@/hooks/useRewardSelection'

interface ParticipantDrawDisplayProps {
  participants: string[]
  selectedReward: Reward | undefined
  onDrawComplete?: (participantName: string, rewardName: string) => void
}

export function ParticipantDrawDisplay({
  participants,
  selectedReward,
  onDrawComplete,
}: ParticipantDrawDisplayProps) {
  const { isDrawing, currentParticipant, drawResult, startDraw, resetDraw } =
    useParticipantDraw()

  const handleStartDraw = () => {
    if (!selectedReward || participants.length === 0) return

    startDraw(
      participants,
      selectedReward.id,
      selectedReward.name,
      (result) => {
        onDrawComplete?.(result.participantName, result.rewardName)
      }
    )
  }

  return (
    <div className="space-y-8">
      {/* Draw Display Card */}
      <div className="relative backdrop-blur-xl bg-gradient-to-b from-white/8 to-white/[0.02] border border-white/[0.08] rounded-3xl p-12 shadow-2xl overflow-visible">
        {/* Decorative corners */}
        <div className="absolute -top-px -left-px w-64 h-64 bg-gradient-to-br from-yellow-500/20 to-transparent blur-3xl opacity-50 pointer-events-none"></div>
        <div className="absolute -bottom-px -right-px w-64 h-64 bg-gradient-to-tl from-purple-500/20 to-transparent blur-3xl opacity-50 pointer-events-none"></div>

        {/* Content */}
        <div className="relative z-10 text-center min-h-[280px] flex flex-col items-center justify-center">
          {drawResult ? (
            <div className="space-y-6 animate-fadeIn w-full">
              {/* Winner Announcement */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-500/10 border border-yellow-500/30 rounded-full backdrop-blur-sm">
                <span className="text-2xl">🎉</span>
                <span className="text-sm font-bold text-yellow-400 tracking-widest uppercase">
                  Winner Announced
                </span>
              </div>

              {/* Reward Icon */}
              <div className="text-6xl animate-bounce" style={{ animationDelay: '0s' }}>
                {selectedReward?.emoji}
              </div>

              {/* Winner Name */}
              <div className="space-y-2">
                <p className="text-white/60 font-light text-lg">The lucky winner is</p>
                <h2 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-yellow-300 to-yellow-400 bg-clip-text text-transparent">
                  {drawResult.participantName}
                </h2>
              </div>

              {/* Reward Name */}
              <div className="space-y-1">
                <p className="text-white/50 text-sm">Wins</p>
                <p className="text-2xl font-bold text-yellow-300">{drawResult.rewardName}</p>
              </div>

              {/* Divider */}
              <div className="flex justify-center gap-2">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-yellow-500/50 to-transparent"></div>
                <span className="text-yellow-400">✨</span>
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-yellow-500/50 to-transparent"></div>
              </div>

              {/* Action Button */}
              <Button
                onClick={resetDraw}
                className="mt-6 px-8 py-3 bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-500/50 text-yellow-400 rounded-lg font-bold"
              >
                Draw Again
              </Button>
            </div>
          ) : isDrawing ? (
            <div className="space-y-8 w-full">
              <div className="text-center">
                <p className="text-sm font-bold text-yellow-400 tracking-widest uppercase mb-6 opacity-75 animate-fadeIn">
                  Selecting Winner...
                </p>
                
                {/* Spinning participant name with background glow */}
                <div className="relative inline-block">
                  <div className="absolute -inset-8 bg-gradient-to-r from-yellow-500/40 via-purple-500/40 to-yellow-500/40 rounded-full blur-3xl animate-pulse"></div>
                  <div className="relative text-5xl font-black text-white/90 min-h-20 flex items-center justify-center px-8 py-4 bg-white/[0.03] rounded-2xl border border-yellow-500/30 animate-pulse">
                    {currentParticipant}
                  </div>
                </div>
              </div>

              {/* Animated dots with stagger */}
              <div className="flex justify-center gap-2">
                <div className="w-4 h-4 bg-yellow-400 rounded-full animate-bounce shadow-lg shadow-yellow-400/50" style={{ animationDelay: '0s' }}></div>
                <div className="w-4 h-4 bg-purple-400 rounded-full animate-bounce shadow-lg shadow-purple-400/50" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-4 h-4 bg-cyan-400 rounded-full animate-bounce shadow-lg shadow-cyan-400/50" style={{ animationDelay: '0.4s' }}></div>
              </div>

              {/* Enhanced progress bar with gradient animation */}
              <div className="w-full max-w-sm mx-auto">
                <div className="h-2 bg-white/10 rounded-full overflow-hidden border border-white/20">
                  <div className="h-full bg-gradient-to-r from-yellow-400 via-purple-500 to-cyan-400 rounded-full animate-pulse shadow-lg shadow-purple-500/50"></div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6 text-center">
              {participants.length === 0 ? (
                <div className="space-y-3">
                  <div className="text-4xl">👥</div>
                  <p className="text-white/60 text-lg">No participants added</p>
                  <p className="text-white/40 text-sm">Add at least one participant to start</p>
                </div>
              ) : !selectedReward ? (
                <div className="space-y-3">
                  <div className="text-4xl">🎁</div>
                  <p className="text-white/60 text-lg">Select a reward</p>
                  <p className="text-white/40 text-sm">Choose a reward before drawing</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="text-5xl animate-bounce" style={{ animationDelay: '0.1s' }}>
                    {selectedReward.emoji}
                  </div>
                  <h3 className="text-2xl md:text-3xl font-light text-white/70">
                    Ready to reveal the winner?
                  </h3>
                  <p className="text-white/50 text-base font-light">
                    {participants.length} participant{participants.length !== 1 ? 's' : ''} waiting
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Draw Button */}
      <div className="flex justify-center">
        <Button
          onClick={handleStartDraw}
          disabled={isDrawing || participants.length === 0 || !selectedReward}
          className={`px-16 py-4 rounded-2xl font-black text-lg tracking-widest transition-all duration-300 uppercase ${
            isDrawing || participants.length === 0 || !selectedReward
              ? 'bg-white/5 text-white/30 cursor-not-allowed border border-white/5'
              : 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-black shadow-2xl hover:shadow-yellow-500/50 hover:scale-110 active:scale-95 border border-yellow-300/20'
          }`}
        >
          {isDrawing ? 'Drawing...' : 'Draw Winner'}
        </Button>
      </div>
    </div>
  )
}
