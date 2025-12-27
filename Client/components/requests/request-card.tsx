"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { AlertTriangle, Calendar, Clock, Wrench } from "lucide-react"
import type { MaintenanceRequest } from "@/lib/types"
import { getEquipmentById, getTechnicianById, getTeamById } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

interface RequestCardProps {
  request: MaintenanceRequest
}

const priorityColors: Record<string, string> = {
  low: "bg-muted text-muted-foreground",
  medium: "bg-accent/20 text-accent",
  high: "bg-chart-4/20 text-chart-4",
  critical: "bg-destructive/20 text-destructive",
}

export function RequestCard({ request }: RequestCardProps) {
  const equipment = getEquipmentById(request.equipmentId)
  const technician = request.assignedTechnicianId ? getTechnicianById(request.assignedTechnicianId) : null
  const team = getTeamById(request.maintenanceTeamId)

  return (
    <Card
      className={cn(
        "bg-card transition-all hover:border-primary/30",
        request.isOverdue && "border-l-4 border-l-destructive",
      )}
    >
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Header */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                {request.isOverdue && <AlertTriangle className="h-4 w-4 text-destructive" />}
                <h4 className="font-medium text-foreground line-clamp-1">{request.subject}</h4>
              </div>
              <p className="mt-1 text-sm text-muted-foreground line-clamp-1">{equipment?.name}</p>
            </div>
            <Badge className={cn("shrink-0 text-xs", priorityColors[request.priority])}>{request.priority}</Badge>
          </div>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <Badge variant="outline" className="text-xs">
              {request.type === "corrective" ? (
                <>
                  <Wrench className="mr-1 h-3 w-3" /> Corrective
                </>
              ) : (
                <>
                  <Calendar className="mr-1 h-3 w-3" /> Preventive
                </>
              )}
            </Badge>
            {request.scheduledDate && (
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {new Date(request.scheduledDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
              </span>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-2 border-t border-border">
            <span className="text-xs text-muted-foreground">{team?.name}</span>
            {technician ? (
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={technician.avatar || "/placeholder.svg"} alt={technician.name} />
                  <AvatarFallback className="text-xs">{technician.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="text-xs text-muted-foreground">{technician.name.split(" ")[0]}</span>
              </div>
            ) : (
              <span className="text-xs text-muted-foreground italic">Unassigned</span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
