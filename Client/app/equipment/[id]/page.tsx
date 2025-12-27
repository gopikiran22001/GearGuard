"use client"

import { use } from "react"
import Link from "next/link"
import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowLeft, MapPin, Calendar, Shield, Wrench, Users, Edit, AlertTriangle, Clock } from "lucide-react"
import { getEquipmentById, getTeamById, getTechnicianById, getRequestsByEquipment } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

const categoryColors: Record<string, string> = {
  machinery: "bg-chart-1/20 text-chart-1",
  vehicle: "bg-chart-2/20 text-chart-2",
  computer: "bg-chart-3/20 text-chart-3",
  tool: "bg-chart-4/20 text-chart-4",
  other: "bg-muted text-muted-foreground",
}

export default function EquipmentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const equipment = getEquipmentById(id)
  const team = equipment ? getTeamById(equipment.maintenanceTeamId) : null
  const defaultTechnician = equipment?.defaultTechnicianId ? getTechnicianById(equipment.defaultTechnicianId) : null
  const requests = equipment ? getRequestsByEquipment(equipment.id) : []
  const openRequests = requests.filter((r) => r.stage !== "repaired" && r.stage !== "scrap")

  if (!equipment) {
    return (
      <MainLayout title="Equipment Not Found">
        <div className="flex flex-col items-center justify-center py-12">
          <p className="text-muted-foreground">The equipment you're looking for doesn't exist.</p>
          <Button asChild className="mt-4">
            <Link href="/equipment">Back to Equipment</Link>
          </Button>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout title={equipment.name} subtitle={equipment.serialNumber}>
      <div className="space-y-6">
        {/* Back Button */}
        <Button variant="ghost" asChild className="-ml-4">
          <Link href="/equipment" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Equipment
          </Link>
        </Button>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Info */}
          <div className="space-y-6 lg:col-span-2">
            <Card className="bg-card">
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center gap-4">
                  <div
                    className={cn(
                      "flex h-12 w-12 items-center justify-center rounded-lg text-lg font-bold",
                      categoryColors[equipment.category],
                    )}
                  >
                    {equipment.category.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <CardTitle className="text-xl">{equipment.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{equipment.serialNumber}</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Button>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Location</p>
                      <p className="font-medium">{equipment.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Purchase Date</p>
                      <p className="font-medium">
                        {new Date(equipment.purchaseDate).toLocaleDateString("en-US", { dateStyle: "long" })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Shield className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Warranty</p>
                      <p className="font-medium">
                        {equipment.warrantyExpiry
                          ? new Date(equipment.warrantyExpiry).toLocaleDateString("en-US", { dateStyle: "long" })
                          : "No warranty"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Department</p>
                      <p className="font-medium">{equipment.department}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Maintenance Requests - Smart Button Feature */}
            <Card className="bg-card">
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center gap-2">
                  <CardTitle>Maintenance Requests</CardTitle>
                  {openRequests.length > 0 && (
                    <Badge variant="secondary" className="bg-accent/20 text-accent">
                      {openRequests.length} Open
                    </Badge>
                  )}
                </div>
                <Button size="sm" asChild>
                  <Link href={`/requests?equipment=${equipment.id}`}>
                    <Wrench className="mr-2 h-4 w-4" />
                    View All Requests
                  </Link>
                </Button>
              </CardHeader>
              <CardContent>
                {requests.length === 0 ? (
                  <p className="text-center text-muted-foreground py-6">No maintenance requests for this equipment.</p>
                ) : (
                  <div className="space-y-3">
                    {requests.slice(0, 5).map((request) => {
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
                          <div className="flex items-center gap-3">
                            {request.isOverdue && <AlertTriangle className="h-4 w-4 text-destructive" />}
                            <div>
                              <p className="font-medium">{request.subject}</p>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Clock className="h-3 w-3" />
                                {new Date(request.createdAt).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            {technician && (
                              <Avatar className="h-7 w-7">
                                <AvatarImage src={technician.avatar || "/placeholder.svg"} />
                                <AvatarFallback>{technician.name.charAt(0)}</AvatarFallback>
                              </Avatar>
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
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Assigned Team */}
            <Card className="bg-card">
              <CardHeader>
                <CardTitle className="text-base">Maintenance Team</CardTitle>
              </CardHeader>
              <CardContent>
                {team && (
                  <div className="space-y-4">
                    <div>
                      <p className="font-medium text-foreground">{team.name}</p>
                      <p className="text-sm text-muted-foreground">{team.specialization}</p>
                    </div>
                    {defaultTechnician && (
                      <div className="border-t border-border pt-4">
                        <p className="mb-2 text-sm text-muted-foreground">Default Technician</p>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            <AvatarImage src={defaultTechnician.avatar || "/placeholder.svg"} />
                            <AvatarFallback>{defaultTechnician.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{defaultTechnician.name}</p>
                            <p className="text-xs text-muted-foreground">{defaultTechnician.email}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="bg-card">
              <CardHeader>
                <CardTitle className="text-base">Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Total Requests</span>
                  <span className="font-medium">{requests.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Open Requests</span>
                  <span className="font-medium text-accent">{openRequests.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Completed</span>
                  <span className="font-medium text-primary">
                    {requests.filter((r) => r.stage === "repaired").length}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
