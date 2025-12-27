import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Wrench, ClipboardList, AlertTriangle, Clock, Plus, Users, BarChart3, TrendingUp } from "lucide-react"
import Link from "next/link"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

interface DashboardProps {
  data: any
}



const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export function EmployeeDashboard({ data }: DashboardProps) {
  const requestStatusData = data.requestStats || [
    { name: 'Pending', value: 3 },
    { name: 'In Progress', value: 2 },
    { name: 'Completed', value: 8 },
  ];

  const activityData = data.activityStats || [
    { name: 'Mon', active: 2 },
    { name: 'Tue', active: 4 },
    { name: 'Wed', active: 1 },
    { name: 'Thu', active: 3 },
    { name: 'Fri', active: 5 },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-card shadow-sm border border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">My Equipment</p>
                <p className="text-3xl font-bold text-foreground mt-2">{data.myEquipment}</p>
              </div>
              <Wrench className="h-8 w-8 text-secondary" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card shadow-sm border border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">My Requests</p>
                <p className="text-3xl font-bold text-foreground mt-2">{data.myRequests}</p>
              </div>
              <ClipboardList className="h-8 w-8 text-status-repaired" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card shadow-sm border border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending</p>
                <p className="text-3xl font-bold text-primary mt-2">{data.pendingRequests}</p>
              </div>
              <Clock className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-card shadow-sm border border-border">
          <CardHeader>
            <CardTitle>My Request Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={requestStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {requestStatusData.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card shadow-sm border border-border">
          <CardHeader>
            <CardTitle>My Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={activityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="active" fill="#F36B21" name="Active Requests" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card shadow-sm border border-border">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Button className="bg-primary hover:bg-primary/90" asChild>
              <Link href="/requests/new">
                <Plus className="h-4 w-4 mr-2" />
                Report Issue
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/equipment?assigned=me">My Equipment</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export function TechnicianDashboard({ data }: DashboardProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-card shadow-sm border border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">My Tasks</p>
                <p className="text-3xl font-bold text-foreground mt-2">{data.myTasks}</p>
              </div>
              <ClipboardList className="h-8 w-8 text-secondary" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card shadow-sm border border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Team Queue</p>
                <p className="text-3xl font-bold text-foreground mt-2">{data.teamTasks}</p>
              </div>
              <Wrench className="h-8 w-8 text-secondary" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card shadow-sm border border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Completed Today</p>
                <p className="text-3xl font-bold text-status-repaired mt-2">{data.completedToday}</p>
              </div>
              <Clock className="h-8 w-8 text-status-repaired" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card shadow-sm border border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Overdue</p>
                <p className="text-3xl font-bold text-destructive mt-2">{data.overdueCount}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-destructive" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card shadow-sm border border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>My Work Queue</CardTitle>
            <Button variant="outline" size="sm" asChild>
              <Link href="/requests">View Kanban Board</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.workQueue?.map((task: any) => (
              <div key={task.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">{task.subject}</p>
                  <p className="text-sm text-muted-foreground">{task.equipment}</p>
                </div>
                <Badge>{task.status}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export function ManagerDashboard({ data }: DashboardProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-card shadow-sm border border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Requests</p>
                <p className="text-3xl font-bold text-foreground mt-2">{data.totalRequests}</p>
              </div>
              <ClipboardList className="h-8 w-8 text-secondary" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card shadow-sm border border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Overdue</p>
                <p className="text-3xl font-bold text-destructive mt-2">{data.overdueRequests}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-destructive" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card shadow-sm border border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Performance</p>
                <p className="text-3xl font-bold text-status-repaired mt-2">{data.teamPerformance}%</p>
              </div>
              <Clock className="h-8 w-8 text-status-repaired" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card shadow-sm border border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Preventive</p>
                <p className="text-3xl font-bold text-secondary mt-2">{data.preventiveScheduled}</p>
              </div>
              <Wrench className="h-8 w-8 text-secondary" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card shadow-sm border border-border">
        <CardHeader>
          <CardTitle>Management Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Button className="bg-primary hover:bg-primary/90" asChild>
              <Link href="/requests/new?type=preventive">Schedule Preventive</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/requests">Kanban Board</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/calendar">Calendar</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/reports">Reports</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export function AdminDashboard({ data }: DashboardProps) {

  const requestStatusData = data.requestStats || [
    { name: 'Pending', value: 12 },
    { name: 'In Progress', value: 19 },
    { name: 'Completed', value: 45 },
    { name: 'Scrap', value: 5 },
  ];


  const performanceData = data.performanceStats || [
    { name: 'Mon', requests: 4, completed: 3 },
    { name: 'Tue', requests: 7, completed: 5 },
    { name: 'Wed', requests: 5, completed: 8 },
    { name: 'Thu', requests: 12, completed: 10 },
    { name: 'Fri', requests: 8, completed: 7 },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-card shadow-sm border border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                <p className="text-3xl font-bold text-foreground mt-2">{data.totalUsers || 24}</p>
              </div>
              <Users className="h-8 w-8 text-secondary" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card shadow-sm border border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Equipment</p>
                <p className="text-3xl font-bold text-foreground mt-2">{data.totalEquipment || 85}</p>
              </div>
              <Wrench className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card shadow-sm border border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Requests</p>
                <p className="text-3xl font-bold text-status-in-progress mt-2">{data.activeRequests || 18}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-status-in-progress" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card shadow-sm border border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">System Health</p>
                <p className="text-3xl font-bold text-status-repaired mt-2">98%</p>
              </div>
              <BarChart3 className="h-8 w-8 text-status-repaired" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-card shadow-sm border border-border">
          <CardHeader>
            <CardTitle>Request Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={requestStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {requestStatusData.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card shadow-sm border border-border">
          <CardHeader>
            <CardTitle>Weekly Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={performanceData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="requests" fill="#F36B21" name="New Requests" />
                  <Bar dataKey="completed" fill="#1F3C88" name="Completed" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}