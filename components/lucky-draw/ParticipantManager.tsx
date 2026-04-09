'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { X, Plus, Trash2 } from 'lucide-react'
import { HelpTooltip } from './HelpTooltip'
import { useCustomParticipants } from '@/hooks/useCustomParticipants'

interface ParticipantManagerProps {
  onParticipantsChange?: (participants: string[]) => void
}

export function ParticipantManager({ onParticipantsChange }: ParticipantManagerProps) {
  const {
    participants,
    inputValue,
    setInputValue,
    error,
    addParticipant,
    removeParticipant,
    clearAllParticipants,
    participantCount,
    getParticipantNames,
  } = useCustomParticipants()

  const handleAddParticipant = () => {
    if (addParticipant(inputValue)) {
      onParticipantsChange?.(getParticipantNames())
    }
  }

  const handleRemoveParticipant = (id: string) => {
    removeParticipant(id)
    onParticipantsChange?.(getParticipantNames())
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddParticipant()
    }
  }

  const handleClearAll = () => {
    if (window.confirm(`Remove all ${participantCount} participants?`)) {
      clearAllParticipants()
      onParticipantsChange?.([])
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-bold text-white/90 tracking-wide">Add Participants</h3>
          <HelpTooltip text="Enter names of people who will participate in the lucky draw" />
        </div>
        <p className="text-sm text-white/50">Enter participant names to include in the draw</p>
      </div>

      {/* Input Section */}
      <div className="space-y-3">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter participant name..."
            className="flex-1 px-4 py-3 rounded-lg bg-white/[0.03] border border-white/[0.1] text-white placeholder-white/40 focus:outline-none focus:border-yellow-400/50 focus:bg-white/[0.05] transition-all"
          />
          <Button
            onClick={handleAddParticipant}
            disabled={!inputValue.trim()}
            className="px-6 py-3 bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-500/50 text-yellow-400 rounded-lg flex items-center gap-2 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="w-4 h-4" />
            Add
          </Button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="px-4 py-2 bg-red-500/10 border border-red-500/30 rounded-lg text-sm text-red-300 animate-fadeIn">
            {error}
          </div>
        )}
      </div>

      {/* Participants List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-white/60">
            Participants ({participantCount})
          </span>
          {participantCount > 0 && (
            <Button
              onClick={handleClearAll}
              variant="ghost"
              size="sm"
              className="text-red-400/60 hover:text-red-400 hover:bg-red-500/10 text-xs"
            >
              <Trash2 className="w-3 h-3 mr-1" />
              Clear All
            </Button>
          )}
        </div>

        {participantCount > 0 ? (
          <div className="max-h-[300px] overflow-y-auto custom-scrollbar space-y-2">
            {participants.map((participant, index) => (
              <div
                key={participant.id}
                className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-white/[0.03] to-yellow-500/[0.02] border border-white/[0.08] rounded-lg hover:from-white/[0.08] hover:to-yellow-500/[0.05] hover:border-yellow-500/[0.3] transition-all duration-300 animate-slideIn group"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-yellow-400 w-5 text-center">
                    {index + 1}
                  </span>
                  <span className="text-sm font-medium text-white/80">{participant.name}</span>
                </div>
                <button
                  onClick={() => handleRemoveParticipant(participant.id)}
                  className="p-1 bg-red-500/0 hover:bg-red-500/20 rounded-md transition-all duration-200 text-red-400/40 hover:text-red-400 group-hover:opacity-100 opacity-0"
                >
                  <X className="w-4 h-4 group-hover:scale-110 transition-transform" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-white/40">
            <div className="text-3xl mb-2">👥</div>
            <p className="text-sm">No participants yet</p>
            <p className="text-xs text-white/30">Add names above to get started</p>
          </div>
        )}
      </div>
    </div>
  )
}
