"use client"

import { useState, useCallback, Suspense, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { MainLayout } from "@/components/layout/main-layout"
import { KanbanBoard } from "@/components/requests/kanban-board"
import { RequestForm } from "@/components/requests/request-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, Search, Calendar, Loader2 } from "lucide-react"
import Link from "next/link"
import { requestsAPI, teamsAPI, type MaintenanceRequest as APIRequest } from "@/lib/api"
import type { RequestStage } from "@/lib/types"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { toast } from "sonner"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"

function RequestsContent() {
  const searchParams = useSearchParams()
  const equipmentFilter = searchParams.get("equipment")

  const [requests, setRequests] = useState<any[]>([])
  const [teams, setTeams] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [teamFilter, setTeamFilter] = useState<string>("all")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch requests and teams
  useEffect(() => {
    fetchData()
  }, [equipmentFilter, teamFilter, typeFilter])

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Build filters
      const filters: any = {}
      if (teamFilter !== "all") filters.maintenanceTeam = teamFilter
      if (typeFilter !== "all") filters.requestType = typeFilter

      // Fetch requests and teams in parallel
      const [requestsResponse, teamsResponse] = await Promise.all([
        requestsAPI.getAll(filters),
        teamsAPI.getAll()
      ])

      if (requestsResponse.success) {
        // Transform API data to match component expectations
        const transformedRequests = requestsResponse.requests.map((item: APIRequest) => ({
          id: item._id,
          subject: item.subject,
          description: item.description,
          type: item.requestType.toLowerCase(),
          stage: item.status.toLowerCase().replace('_', '-') as RequestStage,
          equipmentId: item.equipment[0]?._id || "",
          maintenanceTeamId: item.maintenanceTeam._id,
          assignedTechnicianId: item.assignedTechnician?._id,
          scheduledDate: item.scheduledDate,
          priority: item.priority.toLowerCase(),
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
          completedAt: item.completedDate,
          duration: item.hoursSpent,
          isOverdue: false, // Calculate based on scheduledDate if needed
          _raw: item // Keep raw data for updates
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
      const errorMessage = err?.message || "Failed to fetch data"
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const filteredRequests = requests.filter((request) => {
    const matchesSearch = request.subject.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesTeam = teamFilter === "all" || request.maintenanceTeamId === teamFilter
    const matchesType = typeFilter === "all" || request.type === typeFilter
    const matchesEquipment = !equipmentFilter || request.equipmentId === equipmentFilter

    return matchesSearch && matchesTeam && matchesType && matchesEquipment
  })

  const handleStageChange = useCallback(async (requestId: string, newStage: RequestStage) => {
    try {
      // Map frontend stage to backend status
      const statusMap: Record<RequestStage, string> = {
        'new': 'NEW',
        'in-progress': 'IN_PROGRESS',
        'repaired': 'REPAIRED',
        'scrap': 'SCRAP'
      }

      const response = await requestsAPI.updateStatus(requestId, {
        status: statusMap[newStage] as any
      })

      if (response.success) {
        // Update local state
        setRequests((prev) =>
          prev.map((r) => {
            if (r.id === requestId) {
              return {
                ...r,
                stage: newStage,
                updatedAt: new Date().toISOString(),
                completedAt: newStage === "repaired" ? new Date().toISOString() : r.completedAt
              }
            }
            return r
          })
        )
        toast.success("Request status updated")
      }
    } catch (err: any) {
      toast.error(err?.message || "Failed to update request status")
    }
  }, [])

  const handleFormSubmit = async (data: any) => {
    try {
      const response = await requestsAPI.create({
        subject: data.subject,
        description: data.description,
        equipment: [data.equipmentId],
        maintenanceTeam: data.maintenanceTeamId,
        requestType: data.type.toUpperCase(),
        scheduledDate: data.scheduledDate,
        priority: data.priority?.toUpperCase() || 'MEDIUM',
        notes: data.notes
      })

      if (response.success) {
        toast.success("Maintenance request created successfully!")
        setIsFormOpen(false)
        // Refresh requests list
        fetchData()
      }
    } catch (err: any) {
      toast.error(err?.message || "Failed to create request")
    }
  }

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search requests..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64 bg-secondary pl-9"
            />
          </div>

          <Select value={teamFilter} onValueChange={setTeamFilter}>
            <SelectTrigger className="w-40 bg-secondary">
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

          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-40 bg-secondary">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="corrective">Corrective</SelectItem>
              <SelectItem value="preventive">Preventive</SelectItem>
            </SelectContent>
          </Select>

          {equipmentFilter && (
            <Button variant="outline" size="sm" asChild>
              <Link href="/requests">Clear Equipment Filter</Link>
            </Button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link href="/calendar">
              <Calendar className="mr-2 h-4 w-4" />
              Calendar View
            </Link>
          </Button>

          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Request
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create Maintenance Request</DialogTitle>
                <DialogDescription>Create a new maintenance request for equipment repair or checkup.</DialogDescription>
              </DialogHeader>
              <RequestForm onSubmit={handleFormSubmit} onCancel={() => setIsFormOpen(false)} />
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
          {/* Kanban Board */}
          <KanbanBoard requests={filteredRequests} onStageChange={handleStageChange} />
        </>
      )}
    </div>
  )
}

export default function RequestsPage() {
  return (
    <ProtectedRoute>
      <MainLayout title="Maintenance Requests" subtitle="Track and manage maintenance work orders">
        <Suspense fallback={null}>
          <RequestsContent />
        </Suspense>
      </MainLayout>
    </ProtectedRoute>
  )
}
