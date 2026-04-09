'use client'

import { useState, useCallback } from 'react'

export interface Reward {
  id: string
  name: string
  emoji: string
  description: string
  color: string
}

export const DEFAULT_REWARDS: Reward[] = [
  {
    id: 'scholarship-100',
    name: 'Full Scholarship',
    emoji: '🎓',
    description: '100% Tuition Coverage',
    color: 'from-yellow-400 to-yellow-500',
  },
  {
    id: 'scholarship-70',
    name: 'Major Scholarship',
    emoji: '📚',
    description: '70% Tuition Coverage',
    color: 'from-purple-400 to-purple-500',
  },
  {
    id: 'scholarship-50',
    name: 'Partial Scholarship',
    emoji: '🏆',
    description: '50% Tuition Coverage',
    color: 'from-cyan-400 to-cyan-500',
  },
  {
    id: 'laptop',
    name: 'Gaming Laptop',
    emoji: '💻',
    description: 'High-performance laptop',
    color: 'from-blue-400 to-blue-500',
  },
  {
    id: 'internship',
    name: 'Premium Internship',
    emoji: '🚀',
    description: '6-month paid internship',
    color: 'from-orange-400 to-orange-500',
  },
  {
    id: 'mentorship',
    name: 'Executive Mentorship',
    emoji: '⭐',
    description: '1-year mentoring program',
    color: 'from-pink-400 to-pink-500',
  },
]

export function useRewardSelection(availableRewards: Reward[] = DEFAULT_REWARDS) {
  const [rewards, setRewards] = useState<Reward[]>(availableRewards)
  const [selectedRewardId, setSelectedRewardId] = useState<string>(availableRewards[0]?.id || '')

  const getSelectedReward = useCallback((): Reward | undefined => {
    return rewards.find((r) => r.id === selectedRewardId)
  }, [rewards, selectedRewardId])

  const selectReward = useCallback((rewardId: string) => {
    if (rewards.some((r) => r.id === rewardId)) {
      setSelectedRewardId(rewardId)
      return true
    }
    return false
  }, [rewards])

  const addCustomReward = useCallback(
    (name: string, emoji: string, description: string, color: string): boolean => {
      if (!name.trim() || name.length > 30) {
        return false
      }

      const newReward: Reward = {
        id: `custom-${Date.now()}`,
        name: name.trim(),
        emoji,
        description: description.trim(),
        color,
      }

      setRewards((prev) => [...prev, newReward])
      return true
    },
    []
  )

  const removeReward = useCallback((rewardId: string) => {
    setRewards((prev) => prev.filter((r) => r.id !== rewardId))
    // If removed reward was selected, select first available
    if (selectedRewardId === rewardId) {
      setSelectedRewardId(rewards[0]?.id || '')
    }
  }, [rewards, selectedRewardId])

  const resetToDefaults = useCallback(() => {
    setRewards(DEFAULT_REWARDS)
    setSelectedRewardId(DEFAULT_REWARDS[0]?.id || '')
  }, [])

  return {
    rewards,
    selectedRewardId,
    getSelectedReward,
    selectReward,
    addCustomReward,
    removeReward,
    resetToDefaults,
    rewardCount: rewards.length,
  }
}
