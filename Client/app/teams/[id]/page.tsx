"use client"

import { use } from "react"
import Link from "next/link"
import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowLeft, Users, Mail, Edit, Wrench, Clock, CheckCircle2 } from "lucide-react"
import { getTeamById, maintenanceRequests, getTechnicianById, getEquipmentById } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

export default function TeamDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const team = getTeamById(id)
  const teamRequests = maintenanceRequests.filter((r) => r.maintenanceTeamId === id)
  const openRequests = teamRequests.filter((r) => r.stage !== "repaired" && r.stage !== "scrap")

  if (!team) {
    return (
      <MainLayout title="Team Not Found">
        <div className="flex flex-col items-center justify-center py-12">
          <p className="text-muted-foreground">The team you're looking for doesn't exist.</p>
          <Button asChild className="mt-4">
            <Link href="/teams">Back to Teams</Link>
          </Button>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout title={team.name} subtitle={team.specialization}>
      <div className="space-y-6">
        {/* Back Button */}
        <Button variant="ghost" asChild className="-ml-4">
          <Link href="/teams" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Teams
          </Link>
        </Button>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Team Members */}
          <div className="space-y-6 lg:col-span-2">
            <Card className="bg-card">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Team Members ({team.members.length})
                </CardTitle>
                <Button variant="outline" size="sm">
                  <Edit className="mr-2 h-4 w-4" />
                  Manage Team
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {team.members.map((member) => {
                    const memberRequests = teamRequests.filter((r) => r.assignedTechnicianId === member.id)
                    const memberOpen = memberRequests.filter((r) => r.stage !== "repaired" && r.stage !== "scrap")
                    const memberCompleted = memberRequests.filter((r) => r.stage === "repaired")

                    return (
                      <div
                        key={member.id}
                        className="flex items-center justify-between rounded-lg border border-border p-4"
                      >
                        <div className="flex items-center gap-4">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                            <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-foreground">{member.name}</p>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Mail className="h-3 w-3" />
                              {member.email}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-center">
                            <p className="text-lg font-semibold text-accent">{memberOpen.length}</p>
                            <p className="text-xs text-muted-foreground">Assigned</p>
                          </div>
                          <div className="text-center">
                            <p className="text-lg font-semibold text-primary">{memberCompleted.length}</p>
                            <p className="text-xs text-muted-foreground">Completed</p>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Team Requests */}
            <Card className="bg-card">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Wrench className="h-5 w-5" />
                  Active Requests
                </CardTitle>
                {openRequests.length > 0 && (
                  <Badge variant="secondary" className="bg-accent/20 text-accent">
                    {openRequests.length} Open
                  </Badge>
                )}
              </CardHeader>
              <CardContent>
                {openRequests.length === 0 ? (
                  <p className="text-center text-muted-foreground py-6">No active requests for this team.</p>
                ) : (
                  <div className="space-y-3">
                    {openRequests.map((request) => {
                      const equipment = getEquipmentById(request.equipmentId)
                      const technician = request.assignedTechnicianId
                        ? getTechnicianById(request.assignedTechnicianId)
                        : null

                      return (
                        <div
                          key={request.id}
                          className={cn(
                            "flex items-center justify-between rounded-lg border p-4",
                            request.isOverdue && "border-destructive/50 bg-destructive/5",
                          )}
                        >
                          <div>
                            <p className="font-medium">{request.subject}</p>
                            <p className="text-sm text-muted-foreground">{equipment?.name}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            {technician ? (
                              <Avatar className="h-7 w-7">
                                <AvatarImage src={technician.avatar || "/placeholder.svg"} />
                                <AvatarFallback>{technician.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                            ) : (
                              <span className="text-xs text-muted-foreground">Unassigned</span>
                            )}
                            <Badge variant={request.stage === "new" ? "secondary" : "default"} className="capitalize">
                              {request.stage.replace("-", " ")}
                            </Badge>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Stats */}
          <div className="space-y-6">
            <Card className="bg-card">
              <CardHeader>
                <CardTitle className="text-base">Team Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                    <Clock className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{openRequests.length}</p>
                    <p className="text-sm text-muted-foreground">Open Requests</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{teamRequests.filter((r) => r.stage === "repaired").length}</p>
                    <p className="text-sm text-muted-foreground">Completed</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-2/10">
                    <Wrench className="h-5 w-5 text-chart-2" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{teamRequests.length}</p>
                    <p className="text-sm text-muted-foreground">Total Requests</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
