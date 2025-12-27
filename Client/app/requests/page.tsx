"use client"

import { useState, useCallback, Suspense, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { MainLayout } from "@/components/layout/main-layout"
import { KanbanBoard } from "@/components/requests/kanban-board"
import { ModernRequestForm } from "@/components/requests/modern-request-form"
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
import { useAuth } from "@/contexts/AuthContext"

function RequestsContent() {
  const { user } = useAuth()
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
  // Role-based permissions
  const canUpdateStatus = user?.role === 'ADMIN' || user?.role === 'MANAGER' || user?.role === 'TECHNICIAN'
  const canAssignTechnician = user?.role === 'ADMIN' || user?.role === 'MANAGER'
  const canViewKanban = user?.role !== 'EMPLOYEE' // Everyone except EMPLOYEE can see Kanban

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
    // Check permissions before allowing status change
    if (!canUpdateStatus) {
      toast.error("You don't have permission to update request status")
      return
    }

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
  }, [canUpdateStatus])

  const handleFormSubmit = async (data: any) => {
    try {
      const response = await requestsAPI.create(data)

      if (response.success) {
        toast.success("Maintenance request created successfully!")
        setIsFormOpen(false)
        fetchData()
      }
    } catch (err: any) {
      toast.error(err?.message || "Failed to create request")
    }
  }

  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Maintenance Requests</h1>
          <p className="text-gray-600 mt-1">Manage and track maintenance workflow</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={teamFilter} onValueChange={setTeamFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by team" />
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
          
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                New Request
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create Maintenance Request</DialogTitle>
                <DialogDescription>Create a new maintenance request for equipment repair or checkup.</DialogDescription>
              </DialogHeader>
              <ModernRequestForm onSubmit={handleFormSubmit} onCancel={() => setIsFormOpen(false)} />
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
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      ) : (
        <>
          {/* Kanban Board - Only for non-EMPLOYEE roles */}
          {canViewKanban ? (
            <KanbanBoard 
              requests={filteredRequests} 
              onStageChange={handleStageChange}
              canUpdateStatus={canUpdateStatus}
            />
          ) : (
            <div className="text-center py-12">
              <div className="bg-blue-50 rounded-lg p-8 max-w-md mx-auto">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Request List View</h3>
                <p className="text-gray-600 mb-4">Your maintenance requests are displayed in a simple list format.</p>
                <div className="space-y-3">
                  {filteredRequests.map((request) => (
                    <div key={request.id} className="bg-white p-4 rounded-lg border border-gray-200 text-left">
                      <h4 className="font-medium text-gray-900">{request.subject}</h4>
                      <p className="text-sm text-gray-600 mt-1">{request.description}</p>
                      <div className="flex items-center justify-between mt-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          request.stage === 'new' ? 'bg-blue-100 text-blue-700' :
                          request.stage === 'in-progress' ? 'bg-orange-100 text-orange-700' :
                          request.stage === 'repaired' ? 'bg-green-100 text-green-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {request.stage.replace('-', ' ').toUpperCase()}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(request.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
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
