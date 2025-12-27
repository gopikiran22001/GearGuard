"use client"

import type React from "react"

import { useState } from "react"
import { RequestCard } from "./request-card"
import type { MaintenanceRequest, RequestStage } from "@/lib/types"
import { cn } from "@/lib/utils"

interface KanbanBoardProps {
  requests: MaintenanceRequest[]
  onStageChange: (requestId: string, newStage: RequestStage) => void
}

const columns: { id: RequestStage; title: string; color: string }[] = [
  { id: "new", title: "New", color: "bg-chart-2" },
  { id: "in-progress", title: "In Progress", color: "bg-accent" },
  { id: "repaired", title: "Repaired", color: "bg-primary" },
  { id: "scrap", title: "Scrap", color: "bg-destructive" },
]

export function KanbanBoard({ requests, onStageChange }: KanbanBoardProps) {
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
    if (draggedId) {
      onStageChange(draggedId, columnId)
    }
    setDraggedId(null)
    setDragOverColumn(null)
  }

  return (
    <div className="grid gap-4 lg:grid-cols-4">
      {columns.map((column) => {
        const columnRequests = requests.filter((r) => r.stage === column.id)

        return (
          <div
            key={column.id}
            className={cn(
              "flex flex-col rounded-lg border border-border bg-card/50 p-4 transition-colors",
              dragOverColumn === column.id && "border-primary bg-primary/5",
            )}
            onDragOver={(e) => handleDragOver(e, column.id)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, column.id)}
          >
            {/* Column Header */}
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={cn("h-3 w-3 rounded-full", column.color)} />
                <h3 className="font-semibold text-foreground">{column.title}</h3>
              </div>
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-secondary text-xs font-medium">
                {columnRequests.length}
              </span>
            </div>

            {/* Cards */}
            <div className="flex-1 space-y-3">
              {columnRequests.length === 0 ? (
                <div className="flex h-24 items-center justify-center rounded-lg border border-dashed border-border">
                  <p className="text-sm text-muted-foreground">No requests</p>
                </div>
              ) : (
                columnRequests.map((request) => (
                  <div
                    key={request.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, request.id)}
                    onDragEnd={handleDragEnd}
                    className={cn("cursor-grab active:cursor-grabbing", draggedId === request.id && "opacity-50")}
                  >
                    <RequestCard request={request} />
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
