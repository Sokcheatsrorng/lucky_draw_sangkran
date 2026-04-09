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
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-white/90">
          History ({history.length} winner{history.length !== 1 ? "s" : ""})
        </h3>
        {history.length > 0 && (
          <Button
            onClick={onReset}
            variant="outline"
            size="sm"
            className="text-xs bg-red-500/20 hover:bg-red-500/30 border-red-500/30 text-red-300"
          >
            Clear
          </Button>
        )}
      </div>

      <div className="backdrop-blur-md bg-white/[0.05] border border-white/[0.1] rounded-lg overflow-y-auto custom-scrollbar max-h-[300px]">
        <div className="space-y-1 p-3">
          {history.length > 0 ? (
            [...history].reverse().map((record, index) => (
              <div
                key={index}
                className="px-3 py-2 rounded-lg bg-white/[0.05] border border-white/[0.05] hover:border-white/[0.1] transition-all"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white/90 break-words">{record.name}</p>
                    <p className="text-xs text-white/40 mt-1">{record.timestamp}</p>
                  </div>
                  {record.category !== "Default" && (
                    <span className="inline-block px-2 py-1 rounded text-xs font-medium bg-yellow-500/20 text-yellow-300 whitespace-nowrap">
                      {record.category}
                    </span>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="flex items-center justify-center h-32 text-white/40 text-sm">
              No history yet. Start drawing!
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
