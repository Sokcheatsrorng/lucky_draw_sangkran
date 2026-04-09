'use client'

import React, { useState } from 'react'
import { ParticipantManager } from './ParticipantManager'
import { RewardSelector } from './RewardSelector'
import { ParticipantDrawDisplay } from './ParticipantDrawDisplay'
import { useConfetti } from '@/hooks/useConfetti'
import { Reward } from '@/hooks/useRewardSelection'

export function CustomInputPanel() {
  const [participants, setParticipants] = useState<string[]>([])
  const [selectedReward, setSelectedReward] = useState<Reward | undefined>()
  const { confettiCanvasRef, triggerConfetti } = useConfetti()

  const handleParticipantsChange = (newParticipants: string[]) => {
    setParticipants(newParticipants)
  }

  const handleRewardChange = (reward: Reward) => {
    setSelectedReward(reward)
  }

  const handleDrawComplete = (participantName: string, rewardName: string) => {
    triggerConfetti()
  }

  return (
    <div className="space-y-8">
      {/* Confetti Canvas */}
      <canvas ref={confettiCanvasRef} className="fixed inset-0 pointer-events-none" />

      {/* Layout: Two columns on desktop, stacked on mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Panel: Input Controls */}
        <div className="lg:col-span-1 space-y-8">
          {/* Participant Manager */}
          <div className="backdrop-blur-xl bg-gradient-to-b from-white/8 to-white/[0.02] border border-white/[0.08] rounded-2xl p-6 shadow-xl">
            <ParticipantManager onParticipantsChange={handleParticipantsChange} />
          </div>

          {/* Reward Selector */}
          <div className="backdrop-blur-xl bg-gradient-to-b from-white/8 to-white/[0.02] border border-white/[0.08] rounded-2xl p-6 shadow-xl">
            <RewardSelector onRewardChange={handleRewardChange} />
          </div>
        </div>

        {/* Right Panel: Draw Display */}
        <div className="lg:col-span-2">
          <ParticipantDrawDisplay
            participants={participants}
            selectedReward={selectedReward}
            onDrawComplete={handleDrawComplete}
          />
        </div>
      </div>
    </div>
  )
}
