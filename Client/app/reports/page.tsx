"use client"

import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts"
import { maintenanceRequests, maintenanceTeams, equipment } from "@/lib/mock-data"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

export default function ReportsPage() {
  const [timeRange, setTimeRange] = useState("month")

  // Requests per Team data
  const requestsByTeam = maintenanceTeams.map((team) => {
    const teamRequests = maintenanceRequests.filter((r) => r.maintenanceTeamId === team.id)
    return {
      name: team.name,
      total: teamRequests.length,
      open: teamRequests.filter((r) => r.stage !== "repaired" && r.stage !== "scrap").length,
      completed: teamRequests.filter((r) => r.stage === "repaired").length,
    }
  })

  // Requests by Equipment Category data
  const categories = ["machinery", "vehicle", "computer", "tool", "other"]
  const requestsByCategory = categories.map((category) => {
    const categoryEquipment = equipment.filter((e) => e.category === category)
    const categoryRequests = maintenanceRequests.filter((r) =>
      categoryEquipment.some((e) => e.id === r.equipmentId),
    ).length
    return {
      name: category.charAt(0).toUpperCase() + category.slice(1),
      value: categoryRequests,
    }
  })

  // Requests by Stage data
  const requestsByStage = [
    { name: "New", value: maintenanceRequests.filter((r) => r.stage === "new").length, fill: "#3b82f6" },
    {
      name: "In Progress",
      value: maintenanceRequests.filter((r) => r.stage === "in-progress").length,
      fill: "#eab308",
    },
    { name: "Repaired", value: maintenanceRequests.filter((r) => r.stage === "repaired").length, fill: "#22c55e" },
    { name: "Scrap", value: maintenanceRequests.filter((r) => r.stage === "scrap").length, fill: "#ef4444" },
  ]

  // Request Type distribution
  const requestsByType = [
    { name: "Corrective", value: maintenanceRequests.filter((r) => r.type === "corrective").length, fill: "#f97316" },
    { name: "Preventive", value: maintenanceRequests.filter((r) => r.type === "preventive").length, fill: "#06b6d4" },
  ]

  // Priority distribution
  const requestsByPriority = [
    { name: "Low", value: maintenanceRequests.filter((r) => r.priority === "low").length },
    { name: "Medium", value: maintenanceRequests.filter((r) => r.priority === "medium").length },
    { name: "High", value: maintenanceRequests.filter((r) => r.priority === "high").length },
    { name: "Critical", value: maintenanceRequests.filter((r) => r.priority === "critical").length },
  ]

  // Monthly trend data (mock)
  const monthlyTrend = [
    { month: "Jul", requests: 12, completed: 10 },
    { month: "Aug", requests: 18, completed: 15 },
    { month: "Sep", requests: 15, completed: 14 },
    { month: "Oct", requests: 22, completed: 18 },
    { month: "Nov", requests: 19, completed: 17 },
    { month: "Dec", requests: 25, completed: 20 },
  ]

  const COLORS = ["#22c55e", "#3b82f6", "#eab308", "#ef4444", "#8b5cf6"]

  return (
    <MainLayout title="Reports & Analytics" subtitle="Maintenance performance insights and statistics">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-40 bg-secondary">
                <SelectValue placeholder="Time Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="quarter">This Quarter</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="bg-card">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-foreground">{maintenanceRequests.length}</p>
                <p className="text-sm text-muted-foreground">Total Requests</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-primary">
                  {maintenanceRequests.filter((r) => r.stage === "repaired").length}
                </p>
                <p className="text-sm text-muted-foreground">Completed</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-accent">
                  {maintenanceRequests.filter((r) => r.stage !== "repaired" && r.stage !== "scrap").length}
                </p>
                <p className="text-sm text-muted-foreground">In Progress</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-destructive">
                  {maintenanceRequests.filter((r) => r.isOverdue).length}
                </p>
                <p className="text-sm text-muted-foreground">Overdue</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row 1 */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Requests by Team */}
          <Card className="bg-card">
            <CardHeader>
              <CardTitle>Requests by Team</CardTitle>
              <CardDescription>Maintenance workload distribution across teams</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  open: { label: "Open", color: "hsl(var(--chart-3))" },
                  completed: { label: "Completed", color: "hsl(var(--chart-1))" },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={requestsByTeam} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis
                      dataKey="name"
                      type="category"
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                      width={80}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Bar dataKey="open" fill="hsl(47 100% 50%)" name="Open" radius={[0, 4, 4, 0]} />
                    <Bar dataKey="completed" fill="hsl(165 70% 45%)" name="Completed" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Requests by Stage (Pie) */}
          <Card className="bg-card">
            <CardHeader>
              <CardTitle>Requests by Stage</CardTitle>
              <CardDescription>Current status distribution of all requests</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  new: { label: "New", color: "#3b82f6" },
                  inProgress: { label: "In Progress", color: "#eab308" },
                  repaired: { label: "Repaired", color: "#22c55e" },
                  scrap: { label: "Scrap", color: "#ef4444" },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={requestsByStage}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={4}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}`}
                      labelLine={false}
                    >
                      {requestsByStage.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row 2 */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Monthly Trend */}
          <Card className="bg-card">
            <CardHeader>
              <CardTitle>Monthly Trend</CardTitle>
              <CardDescription>Request volume and completion rate over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  requests: { label: "Requests", color: "hsl(var(--chart-2))" },
                  completed: { label: "Completed", color: "hsl(var(--chart-1))" },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlyTrend} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorRequests" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="requests"
                      stroke="#3b82f6"
                      fillOpacity={1}
                      fill="url(#colorRequests)"
                      name="Requests"
                    />
                    <Area
                      type="monotone"
                      dataKey="completed"
                      stroke="#22c55e"
                      fillOpacity={1}
                      fill="url(#colorCompleted)"
                      name="Completed"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Request Type Distribution */}
          <Card className="bg-card">
            <CardHeader>
              <CardTitle>Request Types</CardTitle>
              <CardDescription>Corrective vs Preventive maintenance</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  corrective: { label: "Corrective", color: "#f97316" },
                  preventive: { label: "Preventive", color: "#06b6d4" },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={requestsByType}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {requestsByType.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row 3 */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Requests by Equipment Category */}
          <Card className="bg-card">
            <CardHeader>
              <CardTitle>Requests by Equipment Category</CardTitle>
              <CardDescription>Maintenance needs across asset types</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  value: { label: "Requests", color: "hsl(var(--chart-1))" },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={requestsByCategory} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="value" fill="hsl(165 70% 45%)" name="Requests" radius={[4, 4, 0, 0]}>
                      {requestsByCategory.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Priority Distribution */}
          <Card className="bg-card">
            <CardHeader>
              <CardTitle>Priority Distribution</CardTitle>
              <CardDescription>Urgency levels of maintenance requests</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  value: { label: "Requests", color: "hsl(var(--chart-2))" },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={requestsByPriority} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="value" name="Requests" radius={[4, 4, 0, 0]}>
                      <Cell fill="#22c55e" />
                      <Cell fill="#eab308" />
                      <Cell fill="#f97316" />
                      <Cell fill="#ef4444" />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  )
}
