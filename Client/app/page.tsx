"use client"

import { useEffect, useState } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Wrench, Users, ClipboardList, AlertTriangle, CheckCircle2, Clock, ArrowRight, TrendingUp, Loader2 } from "lucide-react"
import Link from "next/link"
import { equipmentAPI, teamsAPI, requestsAPI } from "@/lib/api"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { toast } from "sonner"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalEquipment: 0,
    totalTeams: 0,
    openRequests: 0,
    overdueRequests: 0,
    completedThisMonth: 0,
  })
  const [recentRequests, setRecentRequests] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Fetch all data in parallel
      const [equipmentResponse, teamsResponse, requestsResponse] = await Promise.all([
        equipmentAPI.getAll({ status: 'ACTIVE' }),
        teamsAPI.getAll(),
        requestsAPI.getAll()
      ])

      // Calculate stats
      const equipment = equipmentResponse.success ? equipmentResponse.equipments : []
      const teams = teamsResponse.success ? teamsResponse.teams : []
      const requests = requestsResponse.success ? requestsResponse.requests : []

      const openRequests = requests.filter(
        (r: any) => r.status !== "REPAIRED" && r.status !== "SCRAP"
      )

      // Calculate overdue (requests past scheduled date that aren't completed)
      const now = new Date()
      const overdueRequests = requests.filter((r: any) => {
        if (!r.scheduledDate || r.status === "REPAIRED" || r.status === "SCRAP") return false
        return new Date(r.scheduledDate) < now
      })

      // Calculate completed this month
      const thisMonth = new Date()
      thisMonth.setDate(1)
      thisMonth.setHours(0, 0, 0, 0)

      const completedThisMonth = requests.filter((r: any) => {
        if (r.status !== "REPAIRED" || !r.completedDate) return false
        return new Date(r.completedDate) >= thisMonth
      })

      setStats({
        totalEquipment: equipment.length,
        totalTeams: teams.length,
        openRequests: openRequests.length,
        overdueRequests: overdueRequests.length,
        completedThisMonth: completedThisMonth.length,
      })

      // Get recent requests (sorted by updatedAt)
      const sortedRequests = [...requests]
        .sort((a: any, b: any) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
        .slice(0, 5)

      // Transform for display
      const transformedRequests = sortedRequests.map((request: any) => ({
        id: request._id,
        subject: request.subject,
        equipmentName: request.equipment[0]?.name || "Unknown Equipment",
        stage: request.status.toLowerCase().replace('_', '-'),
        assignedTechnician: request.assignedTechnician,
        isOverdue: overdueRequests.some((r: any) => r._id === request._id)
      }))

      setRecentRequests(transformedRequests)
    } catch (err: any) {
      const errorMessage = err?.message || "Failed to fetch dashboard data"
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <ProtectedRoute>
      <MainLayout title="Dashboard" subtitle="Overview of your maintenance operations">
        {/* Error State */}
        {error && (
          <Alert variant="destructive" className="mb-6">
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
            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card className="bg-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Active Equipment</p>
                      <p className="mt-2 text-3xl font-bold text-foreground">{stats.totalEquipment}</p>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <Wrench className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Maintenance Teams</p>
                      <p className="mt-2 text-3xl font-bold text-foreground">{stats.totalTeams}</p>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-chart-2/10">
                      <Users className="h-6 w-6 text-chart-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Open Requests</p>
                      <p className="mt-2 text-3xl font-bold text-foreground">{stats.openRequests}</p>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                      <ClipboardList className="h-6 w-6 text-accent" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Overdue</p>
                      <p className="mt-2 text-3xl font-bold text-destructive">{stats.overdueRequests}</p>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-destructive/10">
                      <AlertTriangle className="h-6 w-6 text-destructive" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content Grid */}
            <div className="mt-6 grid gap-6 lg:grid-cols-3">
              {/* Recent Requests */}
              <Card className="bg-card lg:col-span-2">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg font-semibold">Recent Requests</CardTitle>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/requests" className="flex items-center gap-1">
                      View All <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentRequests.length === 0 ? (
                      <p className="text-center text-muted-foreground py-8">No recent requests</p>
                    ) : (
                      recentRequests.map((request) => (
                        <div
                          key={request.id}
                          className="flex items-center justify-between rounded-lg border border-border bg-secondary/50 p-4"
                        >
                          <div className="flex items-center gap-4">
                            <div
                              className={`h-2 w-2 rounded-full ${request.isOverdue
                                  ? "bg-destructive"
                                  : request.stage === "new"
                                    ? "bg-chart-2"
                                    : request.stage === "in-progress"
                                      ? "bg-accent"
                                      : request.stage === "repaired"
                                        ? "bg-primary"
                                        : "bg-muted-foreground"
                                }`}
                            />
                            <div>
                              <p className="font-medium text-foreground">{request.subject}</p>
                              <p className="text-sm text-muted-foreground">{request.equipmentName}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            {request.assignedTechnician ? (
                              <Avatar className="h-8 w-8">
                                <AvatarFallback>{request.assignedTechnician.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                            ) : (
                              <span className="text-sm text-muted-foreground">Unassigned</span>
                            )}
                            <Badge
                              variant={
                                request.stage === "new"
                                  ? "secondary"
                                  : request.stage === "in-progress"
                                    ? "default"
                                    : request.stage === "repaired"
                                      ? "outline"
                                      : "destructive"
                              }
                              className="capitalize"
                            >
                              {request.stage.replace("-", " ")}
                            </Badge>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card className="bg-card">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">Performance</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">{stats.completedThisMonth}</p>
                      <p className="text-sm text-muted-foreground">Completed This Month</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                      <Clock className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">
                        {stats.openRequests > 0 ? `${stats.openRequests} Active` : "All Clear"}
                      </p>
                      <p className="text-sm text-muted-foreground">Current Workload</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-2/10">
                      <TrendingUp className="h-5 w-5 text-chart-2" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">
                        {stats.overdueRequests === 0 ? "100%" : "On Track"}
                      </p>
                      <p className="text-sm text-muted-foreground">System Health</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </MainLayout>
    </ProtectedRoute>
  )
}
