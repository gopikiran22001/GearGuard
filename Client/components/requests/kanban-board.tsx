"use client"

import type React from "react"
import { useState } from "react"
import { RequestCard } from "./request-card"
import type { MaintenanceRequest, RequestStage } from "@/lib/types"
import { cn } from "@/lib/utils"

interface KanbanBoardProps {
  requests: MaintenanceRequest[]
  onStageChange: (requestId: string, newStage: RequestStage) => void
  canUpdateStatus?: boolean
}

const columns: { id: RequestStage; title: string; color: string; bgColor: string }[] = [
  { id: "new", title: "New", color: "bg-status-new", bgColor: "bg-status-new/10" },
  { id: "in-progress", title: "In Progress", color: "bg-status-in-progress", bgColor: "bg-status-in-progress/10" },
  { id: "repaired", title: "Repaired", color: "bg-status-repaired", bgColor: "bg-status-repaired/10" },
  { id: "scrap", title: "Scrap", color: "bg-status-scrap", bgColor: "bg-status-scrap/10" },
]

export function KanbanBoard({ requests, onStageChange, canUpdateStatus = true }: KanbanBoardProps) {
  const [draggedId, setDraggedId] = useState<string | null>(null)
  const [dragOverColumn, setDragOverColumn] = useState<RequestStage | null>(null)

  const handleDragStart = (e: React.DragEvent, requestId: string) => {
    setDraggedId(requestId)
    e.dataTransfer.effectAllowed = "move"
  }

  const handleDragEnd = () => {
    setDraggedId(null)
    setDragOverColumn(null)
  }

  const handleDragOver = (e: React.DragEvent, columnId: RequestStage) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
    setDragOverColumn(columnId)
  }

  const handleDragLeave = () => {
    setDragOverColumn(null)
  }

  const handleDrop = (e: React.DragEvent, columnId: RequestStage) => {
    e.preventDefault()
    if (draggedId && canUpdateStatus) {
      onStageChange(draggedId, columnId)
    }
    setDraggedId(null)
    setDragOverColumn(null)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-[600px]">
      {columns.map((column) => {
        const columnRequests = requests.filter((r) => r.stage === column.id)
        const isScrapColumn = column.id === 'scrap'

        return (
          <div
            key={column.id}
            className={cn(
              "bg-card rounded-lg border border-border shadow-sm transition-colors",
              dragOverColumn === column.id && "border-primary bg-primary/5",
              isScrapColumn && "opacity-75 bg-muted"
            )}
            onDragOver={(e) => handleDragOver(e, column.id)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, column.id)}
          >

            <div className={cn(
              "p-4 border-b border-border",
              isScrapColumn && "border-border"
            )}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={cn("w-3 h-3 rounded-full", column.color)} />
                  <h3 className={cn(
                    "font-semibold",
                    isScrapColumn ? "text-muted-foreground" : "text-foreground"
                  )}>{column.title}</h3>
                </div>
                <span className={cn(
                  "text-xs font-medium px-2 py-1 rounded-full",
                  isScrapColumn ? "bg-muted text-muted-foreground" : "bg-muted text-muted-foreground"
                )}>
                  {columnRequests.length}
                </span>
              </div>
            </div>


            <div className="p-4 space-y-3">
              {columnRequests.length === 0 ? (
                <div className="flex h-24 items-center justify-center rounded-lg border border-dashed border-border">
                  <p className="text-sm text-muted-foreground">No requests</p>
                </div>
              ) : (
                columnRequests.map((request) => (
                  <div
                    key={request.id}
                    draggable={canUpdateStatus}
                    onDragStart={(e) => canUpdateStatus && handleDragStart(e, request.id)}
                    onDragEnd={handleDragEnd}
                    className={cn(
                      canUpdateStatus ? "cursor-grab active:cursor-grabbing" : "cursor-default",
                      "transition-opacity",
                      draggedId === request.id && "opacity-50"
                    )}
                  >
                    <RequestCard request={request} isScrap={isScrapColumn} />
                  </div>
                ))
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
