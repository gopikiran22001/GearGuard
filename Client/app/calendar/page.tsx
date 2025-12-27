"use client"

import { useState, useEffect } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { MaintenanceCalendar } from "@/components/calendar/maintenance-calendar"
import { RequestForm } from "@/components/requests/request-form"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, ClipboardList, Loader2 } from "lucide-react"
import Link from "next/link"
import { requestsAPI, teamsAPI } from "@/lib/api"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { toast } from "sonner"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"

export default function CalendarPage() {
  const [requests, setRequests] = useState<any[]>([])
  const [teams, setTeams] = useState<any[]>([])
  const [teamFilter, setTeamFilter] = useState<string>("all")
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Fetch calendar requests (preventive maintenance) and teams
      const [requestsResponse, teamsResponse] = await Promise.all([
        requestsAPI.getCalendar(),
        teamsAPI.getAll()
      ])

      if (requestsResponse.success) {
        // Transform API data to match component expectations
        const transformedRequests = requestsResponse.requests.map((item: any) => ({
          id: item._id,
          subject: item.subject,
          description: item.description,
          type: item.requestType.toLowerCase(),
          stage: item.status.toLowerCase().replace('_', '-'),
          equipmentId: item.equipment[0]?._id || "",
          maintenanceTeamId: item.maintenanceTeam._id,
          assignedTechnicianId: item.assignedTechnician?._id,
          scheduledDate: item.scheduledDate,
          priority: item.priority.toLowerCase(),
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
          completedAt: item.completedDate,
          isOverdue: false,
          _raw: item
        }))

        setRequests(transformedRequests)
      }

      if (teamsResponse.success) {
        setTeams(teamsResponse.teams.map((team: any) => ({
          id: team._id,
          name: team.name,
          specialization: team.specialization
        })))
      }
    } catch (err: any) {
      const errorMessage = err?.message || "Failed to fetch calendar data"
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  // Filter to show primarily preventive maintenance on calendar
  const filteredRequests = requests.filter((request) => {
    const matchesTeam = teamFilter === "all" || request.maintenanceTeamId === teamFilter
    // Show all requests with scheduled dates, prioritizing preventive
    return matchesTeam && (request.scheduledDate || request.type === "preventive")
  })

  const handleFormSubmit = async (data: any) => {
    try {
      const response = await requestsAPI.create({
        subject: data.subject,
        description: data.description,
        equipment: [data.equipmentId],
        maintenanceTeam: data.maintenanceTeamId,
        requestType: data.type?.toUpperCase() || 'PREVENTIVE',
        scheduledDate: data.scheduledDate || selectedDate?.toISOString(),
        priority: data.priority?.toUpperCase() || 'MEDIUM',
        notes: data.notes
      })

      if (response.success) {
        toast.success("Maintenance scheduled successfully!")
        setIsFormOpen(false)
        setSelectedDate(null)
        // Refresh calendar
        fetchData()
      }
    } catch (err: any) {
      toast.error(err?.message || "Failed to schedule maintenance")
    }
  }

  const handleDateClick = (date: Date) => {
    setSelectedDate(date)
    setIsFormOpen(true)
  }

  return (
    <ProtectedRoute>
      <MainLayout title="Maintenance Calendar" subtitle="Schedule and view preventive maintenance">
        <div className="space-y-6">
          {/* Header Actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Select value={teamFilter} onValueChange={setTeamFilter}>
                <SelectTrigger className="w-48 bg-secondary">
                  <SelectValue placeholder="All Teams" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Teams</SelectItem>
                  {teams.map((team) => (
                    <SelectItem key={team.id} value={team.id}>
                      {team.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" asChild>
                <Link href="/requests">
                  <ClipboardList className="mr-2 h-4 w-4" />
                  Kanban View
                </Link>
              </Button>

              <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Schedule Maintenance
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Schedule Preventive Maintenance</DialogTitle>
                    <DialogDescription>
                      {selectedDate
                        ? `Scheduling for ${selectedDate.toLocaleDateString("en-US", { dateStyle: "full" })}`
                        : "Create a new scheduled maintenance request."}
                    </DialogDescription>
                  </DialogHeader>
                  <RequestForm
                    onSubmit={handleFormSubmit}
                    onCancel={() => {
                      setIsFormOpen(false)
                      setSelectedDate(null)
                    }}
                  />
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Error State */}
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Loading State */}
          {loading ? (
            <div className="flex h-64 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <>
              {/* Calendar */}
              <MaintenanceCalendar requests={filteredRequests} onDateClick={handleDateClick} />
            </>
          )}
        </div>
      </MainLayout>
    </ProtectedRoute>
  )
}
