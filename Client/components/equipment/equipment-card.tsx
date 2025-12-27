"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Calendar, Wrench, ChevronRight } from "lucide-react"
import type { Equipment } from "@/lib/types"
import { getTeamById, getOpenRequestsCount } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

interface EquipmentCardProps {
  equipment: Equipment
  variant?: "grid" | "list"
}

const categoryIcons: Record<string, string> = {
  machinery: "M",
  vehicle: "V",
  computer: "C",
  tool: "T",
  other: "O",
}

const categoryColors: Record<string, string> = {
  machinery: "bg-chart-1/20 text-chart-1",
  vehicle: "bg-chart-2/20 text-chart-2",
  computer: "bg-chart-3/20 text-chart-3",
  tool: "bg-chart-4/20 text-chart-4",
  other: "bg-muted text-muted-foreground",
}

export function EquipmentCard({ equipment, variant = "grid" }: EquipmentCardProps) {
  const team = getTeamById(equipment.maintenanceTeamId)
  const openRequests = getOpenRequestsCount(equipment.id)

  if (variant === "list") {
    return (
      <Card className="bg-card transition-colors hover:bg-card/80">
        <CardContent className="flex items-center justify-between p-4">
          <div className="flex items-center gap-4">
            <div
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-lg font-bold",
                categoryColors[equipment.category],
              )}
            >
              {categoryIcons[equipment.category]}
            </div>
            <div>
              <p className="font-medium text-foreground">{equipment.name}</p>
              <p className="text-sm text-muted-foreground">{equipment.serialNumber}</p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-sm">
              <span className="text-muted-foreground">Department:</span>{" "}
              <span className="text-foreground">{equipment.department}</span>
            </div>
            <div className="text-sm">
              <span className="text-muted-foreground">Location:</span>{" "}
              <span className="text-foreground">{equipment.location}</span>
            </div>
            <div className="text-sm">
              <span className="text-muted-foreground">Team:</span> <span className="text-foreground">{team?.name}</span>
            </div>
            {openRequests > 0 && (
              <Badge variant="secondary" className="bg-accent/20 text-accent">
                {openRequests} Open
              </Badge>
            )}
            <Button variant="ghost" size="icon" asChild>
              <Link href={`/equipment/${equipment.id}`}>
                <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Link href={`/equipment/${equipment.id}`}>
      <Card className="h-full bg-card transition-all hover:border-primary/50 hover:bg-card/80">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <div
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-lg font-bold",
                categoryColors[equipment.category],
              )}
            >
              {categoryIcons[equipment.category]}
            </div>
            {openRequests > 0 && (
              <Badge variant="secondary" className="bg-accent/20 text-accent">
                <Wrench className="mr-1 h-3 w-3" />
                {openRequests}
              </Badge>
            )}
          </div>
          <CardTitle className="mt-3 text-base font-semibold text-foreground">{equipment.name}</CardTitle>
          <p className="text-xs text-muted-foreground">{equipment.serialNumber}</p>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span className="truncate">{equipment.location}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>
              Purchased {new Date(equipment.purchaseDate).toLocaleDateString("en-US", { dateStyle: "medium" })}
            </span>
          </div>
          <div className="flex items-center justify-between pt-2">
            <Badge variant="outline" className="text-xs capitalize">
              {equipment.department}
            </Badge>
            <span className="text-xs text-muted-foreground">{team?.name}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
