import React from "react"
import { WinnerRecord } from "@/hooks/useWinnerHistory"
import { Button } from "@/components/ui/button"

interface DrawHistoryProps {
  history: WinnerRecord[]
  onReset: () => void
}

export function DrawHistory({ history, onReset }: DrawHistoryProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-sm font-bold text-white/80 tracking-wide uppercase">
          Winner History
        </h3>
        <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-500/10 border border-yellow-500/30 rounded-full text-xs font-bold text-yellow-400">
          {history.length}
        </span>
        {history.length > 0 && (
          <Button
            onClick={onReset}
            variant="outline"
            size="sm"
            className="text-xs font-bold bg-white/5 hover:bg-white/10 border-white/10 text-white/60 hover:text-white/80"
          >
            Reset
          </Button>
        )}
      </div>

      <div className="backdrop-blur-xl bg-gradient-to-b from-white/[0.03] to-white/[0.01] border border-white/[0.06] rounded-2xl overflow-y-auto custom-scrollbar max-h-[320px]">
        <div className="space-y-2 p-4">
          {history.length > 0 ? (
            [...history].reverse().map((record, index) => (
              <div
                key={index}
                className="group px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.08] hover:border-white/[0.12] transition-all"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white/90 break-words">{record.name}</p>
                    <p className="text-xs text-white/40 mt-2 flex items-center gap-1">
                      <span>⏰</span>
                      {record.timestamp}
                    </p>
                  </div>
                  {record.category !== "Default" && (
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-yellow-500/15 border border-yellow-500/30 text-yellow-300 whitespace-nowrap">
                      {record.category}
                    </span>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-40 text-white/40 text-sm gap-2">
              <span className="text-4xl opacity-40">📋</span>
              <p>No winners yet</p>
              <p className="text-xs text-white/30">Start spinning to see winners here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
