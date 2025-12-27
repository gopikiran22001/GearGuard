"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, CalendarIcon, Wrench } from "lucide-react"
import type { MaintenanceRequest } from "@/lib/types"
import { getEquipmentById, getTechnicianById, getTeamById } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

interface MaintenanceCalendarProps {
  requests: MaintenanceRequest[]
  onDateClick: (date: Date) => void
}

export function MaintenanceCalendar({ requests, onDateClick }: MaintenanceCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const firstDayOfMonth = new Date(year, month, 1)
  const lastDayOfMonth = new Date(year, month + 1, 0)
  const startingDayOfWeek = firstDayOfMonth.getDay()
  const daysInMonth = lastDayOfMonth.getDate()

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1))
  }

  const goToToday = () => {
    setCurrentDate(new Date())
  }

  const getRequestsForDate = (day: number): MaintenanceRequest[] => {
    const date = new Date(year, month, day)
    return requests.filter((request) => {
      if (!request.scheduledDate) return false
      const requestDate = new Date(request.scheduledDate)
      return (
        requestDate.getDate() === date.getDate() &&
        requestDate.getMonth() === date.getMonth() &&
        requestDate.getFullYear() === date.getFullYear()
      )
    })
  }

  const isToday = (day: number): boolean => {
    const today = new Date()
    return day === today.getDate() && month === today.getMonth() && year === today.getFullYear()
  }

  const days = []
  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(null)
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i)
  }

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  return (
    <Card className="bg-card">
      <CardContent className="p-6">
        {/* Calendar Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-semibold text-foreground">
              {currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
            </h2>
            <Button variant="outline" size="sm" onClick={goToToday}>
              Today
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={prevMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={nextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Week Days Header */}
        <div className="mb-2 grid grid-cols-7 gap-1">
          {weekDays.map((day) => (
            <div key={day} className="py-2 text-center text-sm font-medium text-muted-foreground">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {days.map((day, index) => {
            if (day === null) {
              return <div key={`empty-${index}`} className="min-h-[120px] rounded-lg bg-secondary/30 p-2" />
            }

            const dayRequests = getRequestsForDate(day)
            const today = isToday(day)

            return (
              <div
                key={day}
                className={cn(
                  "min-h-[120px] cursor-pointer rounded-lg border border-border p-2 transition-colors hover:border-primary/50 hover:bg-secondary/50",
                  today && "border-primary bg-primary/5",
                )}
                onClick={() => onDateClick(new Date(year, month, day))}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={cn("text-sm font-medium", today ? "text-primary" : "text-foreground", "tabular-nums")}
                  >
                    {day}
                  </span>
                  {dayRequests.length > 0 && (
                    <Badge variant="secondary" className="h-5 w-5 p-0 flex items-center justify-center text-xs">
                      {dayRequests.length}
                    </Badge>
                  )}
                </div>

                <div className="mt-2 space-y-1">
                  {dayRequests.slice(0, 3).map((request) => {
                    const team = getTeamById(request.maintenanceTeamId)
                    return (
                      <div
                        key={request.id}
                        className={cn(
                          "rounded px-1.5 py-0.5 text-xs truncate",
                          request.type === "preventive" ? "bg-primary/20 text-primary" : "bg-accent/20 text-accent",
                        )}
                        title={`${request.subject} - ${team?.name}`}
                      >
                        {request.subject}
                      </div>
                    )
                  })}
                  {dayRequests.length > 3 && (
                    <p className="text-xs text-muted-foreground">+{dayRequests.length - 3} more</p>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Legend */}
        <div className="mt-6 flex items-center gap-6 border-t border-border pt-4">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded bg-primary/20" />
            <span className="text-sm text-muted-foreground">Preventive</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded bg-accent/20" />
            <span className="text-sm text-muted-foreground">Corrective</span>
          </div>
        </div>

        {/* Upcoming Maintenance List */}
        <div className="mt-6 border-t border-border pt-6">
          <h3 className="mb-4 flex items-center gap-2 font-semibold text-foreground">
            <CalendarIcon className="h-4 w-4" />
            Upcoming Scheduled Maintenance
          </h3>
          <div className="space-y-3">
            {requests
              .filter((r) => r.scheduledDate && new Date(r.scheduledDate) >= new Date())
              .sort((a, b) => new Date(a.scheduledDate!).getTime() - new Date(b.scheduledDate!).getTime())
              .slice(0, 5)
              .map((request) => {
                const equipment = getEquipmentById(request.equipmentId)
                const technician = request.assignedTechnicianId ? getTechnicianById(request.assignedTechnicianId) : null
                const team = getTeamById(request.maintenanceTeamId)

                return (
                  <div
                    key={request.id}
                    className="flex items-center justify-between rounded-lg border border-border bg-secondary/30 p-3"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "flex h-10 w-10 items-center justify-center rounded-lg",
                          request.type === "preventive" ? "bg-primary/10" : "bg-accent/10",
                        )}
                      >
                        <Wrench
                          className={cn("h-5 w-5", request.type === "preventive" ? "text-primary" : "text-accent")}
                        />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{request.subject}</p>
                        <p className="text-sm text-muted-foreground">
                          {equipment?.name} • {team?.name}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-foreground">
                        {new Date(request.scheduledDate!).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                      <p className="text-sm text-muted-foreground">{technician?.name || "Unassigned"}</p>
                    </div>
                  </div>
                )
              })}

            {requests.filter((r) => r.scheduledDate && new Date(r.scheduledDate) >= new Date()).length === 0 && (
              <p className="text-center text-muted-foreground py-4">No upcoming scheduled maintenance.</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
