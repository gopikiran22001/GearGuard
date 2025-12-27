"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { AlertTriangle, Calendar, Clock, Wrench, CheckCircle, X } from "lucide-react"
import type { MaintenanceRequest } from "@/lib/types"
import { getEquipmentById, getTechnicianById, getTeamById } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

interface RequestCardProps {
  request: MaintenanceRequest
  isScrap?: boolean
}

const priorityColors: Record<string, string> = {
  low: "bg-gray-100 text-gray-600",
  medium: "bg-blue-100 text-blue-700",
  high: "bg-orange-100 text-orange-700",
  critical: "bg-red-100 text-red-700",
}

const stageColors: Record<string, string> = {
  new: "bg-blue-50 border-blue-200",
  "in-progress": "bg-orange-50 border-orange-200",
  repaired: "bg-green-50 border-green-200",
  scrap: "bg-gray-100 border-gray-300",
}

export function RequestCard({ request, isScrap = false }: RequestCardProps) {
  const equipment = getEquipmentById(request.equipmentId)
  const technician = request.assignedTechnicianId ? getTechnicianById(request.assignedTechnicianId) : null
  const team = getTeamById(request.maintenanceTeamId)

  return (
    <Card
      className={cn(
        "bg-card border shadow-sm hover:shadow-md transition-all",
        request.isOverdue && !isScrap && "bg-destructive/5 border-destructive/20",
        stageColors[request.stage] || "border-border",
        isScrap && "opacity-75"
      )}
    >
      <CardContent className="p-4">
        <div className="space-y-3">

          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                {request.isOverdue && !isScrap && <AlertTriangle className="h-4 w-4 text-destructive" />}
                {request.stage === 'repaired' && <CheckCircle className="h-4 w-4 text-status-repaired" />}
                {isScrap && <X className="h-4 w-4 text-muted-foreground" />}
                <h4 className={cn(
                  "font-medium text-sm line-clamp-1",
                  isScrap ? "text-muted-foreground" : "text-foreground"
                )}>{request.subject}</h4>
              </div>
              <p className={cn(
                "text-xs line-clamp-1",
                isScrap ? "text-muted-foreground" : "text-muted-foreground"
              )}>{equipment?.name}</p>
            </div>
            {!isScrap && (
              <Badge className={cn("text-xs", priorityColors[request.priority])}>
                {request.priority.toUpperCase()}
              </Badge>
            )}
          </div>


          <div className="flex items-center justify-between pt-2">
            {technician ? (
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={technician.avatar || "/placeholder.svg"} alt={technician.name} />
                  <AvatarFallback className={cn(
                    "text-xs",
                    isScrap ? "bg-muted text-muted-foreground" : "bg-primary/10 text-primary"
                  )}>
                    {technician.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <span className={cn(
                  "text-xs",
                  isScrap ? "text-muted-foreground" : "text-muted-foreground"
                )}>
                  {technician.name.split(" ")[0]}
                </span>
              </div>
            ) : (
              <span className={cn(
                "text-xs",
                isScrap ? "text-muted-foreground" : "text-muted-foreground"
              )}>
                {isScrap ? "Equipment scrapped" : "Unassigned"}
              </span>
            )}

            {request.scheduledDate && !isScrap && (
              <span className={cn(
                "text-xs flex items-center gap-1",
                request.isOverdue ? "text-destructive" : "text-muted-foreground"
              )}>
                <Clock className="h-3 w-3" />
                {request.isOverdue ? 'Overdue' : new Date(request.scheduledDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
              </span>
            )}

            {isScrap && (
              <span className="text-xs text-muted-foreground">Completed</span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
