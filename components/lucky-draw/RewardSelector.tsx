'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useRewardSelection, type Reward } from '@/hooks/useRewardSelection'

interface RewardSelectorProps {
  onRewardChange?: (reward: Reward) => void
}

export function RewardSelector({ onRewardChange }: RewardSelectorProps) {
  const { rewards, selectedRewardId, selectReward, getSelectedReward } = useRewardSelection()
  const [showDetails, setShowDetails] = useState(false)

  const selectedReward = getSelectedReward()

  const handleSelectReward = (rewardId: string) => {
    if (selectReward(rewardId)) {
      const reward = rewards.find((r) => r.id === rewardId)
      if (reward) {
        onRewardChange?.(reward)
      }
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h3 className="text-lg font-bold text-white/90 tracking-wide">Select Reward</h3>
        <p className="text-sm text-white/50">Choose the prize for this draw</p>
      </div>

      {/* Current Selection Preview */}
      {selectedReward && (
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-purple-500/20 rounded-2xl blur-lg opacity-75 animate-pulse-slow"></div>
          <div
            className={`relative px-6 py-6 rounded-2xl bg-gradient-to-r ${selectedReward.color} opacity-15 border-2 border-yellow-400/50 transform transition-all hover:border-yellow-400/80 hover:opacity-25 shadow-lg shadow-yellow-500/10`}
          >
            <div className="flex items-center gap-4">
              <span className="text-5xl animate-bounce" style={{ animationDelay: '0s' }}>
                {selectedReward.emoji}
              </span>
              <div>
                <h4 className="text-2xl font-bold text-yellow-300">{selectedReward.name}</h4>
                <p className="text-white/70 text-sm mt-1">{selectedReward.description}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reward Grid */}
      <div className="space-y-3">
        <span className="text-sm font-semibold text-white/60">Available Rewards</span>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {rewards.map((reward, index) => (
            <button
              key={reward.id}
              onClick={() => handleSelectReward(reward.id)}
              className={`group px-4 py-4 rounded-xl transition-all duration-300 border-2 transform hover:scale-105 animate-fadeIn ${
                selectedRewardId === reward.id
                  ? `bg-gradient-to-br ${reward.color} bg-opacity-20 border-yellow-400 shadow-lg shadow-yellow-400/20`
                  : 'bg-white/[0.03] border-white/[0.1] hover:border-white/[0.2] hover:bg-white/[0.08]'
              }`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex flex-col items-center gap-2">
                <span className="text-3xl group-hover:scale-125 transition-transform duration-300">
                  {reward.emoji}
                </span>
                <p className="text-xs font-bold text-white/80 text-center leading-tight">
                  {reward.name}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Details Toggle */}
      <button
        onClick={() => setShowDetails(!showDetails)}
        className="text-sm text-yellow-400/60 hover:text-yellow-400 transition-colors font-semibold"
      >
        {showDetails ? 'Hide Details' : 'Show Details'} →
      </button>

      {/* Detailed View */}
      {showDetails && selectedReward && (
        <div className="px-4 py-4 bg-white/[0.02] border border-white/[0.08] rounded-xl animate-slideDown">
          <div className="space-y-3">
            <div>
              <p className="text-xs text-white/50 uppercase tracking-wider font-bold mb-1">
                Reward Name
              </p>
              <p className="text-white/80 font-semibold">{selectedReward.name}</p>
            </div>
            <div>
              <p className="text-xs text-white/50 uppercase tracking-wider font-bold mb-1">
                Description
              </p>
              <p className="text-white/80 text-sm">{selectedReward.description}</p>
            </div>
            <div>
              <p className="text-xs text-white/50 uppercase tracking-wider font-bold mb-1">
                Emoji
              </p>
              <p className="text-2xl">{selectedReward.emoji}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
