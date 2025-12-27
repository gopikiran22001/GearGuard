"use client"

import { useState, useEffect } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, Users, ChevronRight, Loader2 } from "lucide-react"
import Link from "next/link"
import { teamsAPI, requestsAPI } from "@/lib/api"
import { TeamForm } from "@/components/teams/team-form"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { toast } from "sonner"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"

export default function TeamsPage() {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [teams, setTeams] = useState<any[]>([])
  const [requests, setRequests] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Fetch teams and requests in parallel
      const [teamsResponse, requestsResponse] = await Promise.all([
        teamsAPI.getAll(),
        requestsAPI.getAll()
      ])

      if (teamsResponse.success) {
        setTeams(teamsResponse.teams)
      }

      if (requestsResponse.success) {
        setRequests(requestsResponse.requests)
      }
    } catch (err: any) {
      const errorMessage = err?.message || "Failed to fetch data"
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleFormSubmit = async (data: any) => {
    try {
      const response = await teamsAPI.create({
        name: data.name,
        description: data.description,
        specialization: data.specialization
      })

      if (response.success) {
        toast.success("Team created successfully!")
        setIsFormOpen(false)
        // Refresh teams list
        fetchData()
      }
    } catch (err: any) {
      toast.error(err?.message || "Failed to create team")
    }
  }

  return (
    <ProtectedRoute allowedRoles={['ADMIN', 'MANAGER']}>
      <MainLayout title="Maintenance Teams" subtitle="Manage your maintenance staff and team assignments">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-end">
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Team
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>Create New Team</DialogTitle>
                  <DialogDescription>Add a new maintenance team to your organization.</DialogDescription>
                </DialogHeader>
                <TeamForm onSubmit={handleFormSubmit} onCancel={() => setIsFormOpen(false)} />
              </DialogContent>
            </Dialog>
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
              {/* Teams Grid */}
              {teams.length === 0 ? (
                <div className="flex h-64 items-center justify-center rounded-lg border border-dashed border-border">
                  <p className="text-muted-foreground">No teams found. Create your first team to get started.</p>
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {teams.map((team) => {
                    const teamRequests = requests.filter((r) => r.maintenanceTeam._id === team._id)
                    const openRequests = teamRequests.filter(
                      (r) => r.status !== "REPAIRED" && r.status !== "SCRAP"
                    )
                    const completedRequests = teamRequests.filter((r) => r.status === "REPAIRED")

                    return (
                      <Card key={team._id} className="bg-card transition-all hover:border-primary/50">
                        <CardHeader className="pb-2">
                          <div className="flex items-start justify-between">
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                              <Users className="h-6 w-6 text-primary" />
                            </div>
                            <Button variant="ghost" size="icon" asChild>
                              <Link href={`/teams/${team._id}`}>
                                <ChevronRight className="h-4 w-4" />
                              </Link>
                            </Button>
                          </div>
                          <CardTitle className="mt-3 text-lg font-semibold">{team.name}</CardTitle>
                          <p className="text-sm text-muted-foreground">
                            {team.specialization} {team.description && `• ${team.description}`}
                          </p>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {/* Stats */}
                          <div className="grid grid-cols-3 gap-2">
                            <div className="rounded-lg bg-secondary p-3 text-center">
                              <p className="text-lg font-bold text-foreground">{team.technicians?.length || 0}</p>
                              <p className="text-xs text-muted-foreground">Members</p>
                            </div>
                            <div className="rounded-lg bg-accent/10 p-3 text-center">
                              <p className="text-lg font-bold text-accent">{openRequests.length}</p>
                              <p className="text-xs text-muted-foreground">Open</p>
                            </div>
                            <div className="rounded-lg bg-primary/10 p-3 text-center">
                              <p className="text-lg font-bold text-primary">{completedRequests.length}</p>
                              <p className="text-xs text-muted-foreground">Done</p>
                            </div>
                          </div>

                          {/* Team Members */}
                          <div className="space-y-2">
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                              Team Members
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {team.technicians && team.technicians.length > 0 ? (
                                <>
                                  {team.technicians.slice(0, 4).map((member: any) => (
                                    <Avatar key={member._id} className="h-8 w-8 border-2 border-background">
                                      <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                  ))}
                                  {team.technicians.length > 4 && (
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-xs font-medium">
                                      +{team.technicians.length - 4}
                                    </div>
                                  )}
                                </>
                              ) : (
                                <p className="text-xs text-muted-foreground">No members assigned</p>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </MainLayout>
    </ProtectedRoute>
  )
}
