"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TrendingUp, Clock, BarChart3, Users, Download } from "lucide-react"

interface AnalyticsData {
  completionRate: number
  avgResponseTime: number
  totalRequests: number
  activeTechnicians: number
  teamStats: Array<{
    name: string
    requests: number
    percentage: number
    color: string
  }>
  statusDistribution: Array<{
    status: string
    count: number
    percentage: number
    color: string
  }>
}

interface AnalyticsDashboardProps {
  data?: AnalyticsData
}

const defaultData: AnalyticsData = {
  completionRate: 94,
  avgResponseTime: 2.3,
  totalRequests: 156,
  activeTechnicians: 12,
  teamStats: [
    { name: "HVAC Team", requests: 45, percentage: 75, color: "bg-blue-500" },
    { name: "Electrical Team", requests: 36, percentage: 60, color: "bg-green-500" },
    { name: "IT Team", requests: 27, percentage: 45, color: "bg-orange-500" },
    { name: "Mechanical Team", requests: 18, percentage: 30, color: "bg-purple-500" }
  ],
  statusDistribution: [
    { status: "New", count: 47, percentage: 30, color: "#3b82f6" },
    { status: "In Progress", count: 31, percentage: 20, color: "#f97316" },
    { status: "Repaired", count: 73, percentage: 47, color: "#10b981" },
    { status: "Scrap", count: 5, percentage: 3, color: "#6b7280" }
  ]
}

export function AnalyticsDashboard({ data = defaultData }: AnalyticsDashboardProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600 mt-1">Maintenance performance insights and trends</p>
        </div>
        <div className="flex items-center gap-3">
          <Select defaultValue="30">
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Last 30 days" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
              <SelectItem value="365">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-white shadow-sm border border-gray-200">
          <CardContent className="p-6 text-center">
            <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <TrendingUp className="h-6 w-6 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{data.completionRate}%</p>
            <p className="text-sm text-gray-600">Completion Rate</p>
          </CardContent>
        </Card>
        
        <Card className="bg-white shadow-sm border border-gray-200">
          <CardContent className="p-6 text-center">
            <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Clock className="h-6 w-6 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{data.avgResponseTime}</p>
            <p className="text-sm text-gray-600">Avg Response Time (hrs)</p>
          </CardContent>
        </Card>
        
        <Card className="bg-white shadow-sm border border-gray-200">
          <CardContent className="p-6 text-center">
            <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <BarChart3 className="h-6 w-6 text-orange-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{data.totalRequests}</p>
            <p className="text-sm text-gray-600">Total Requests</p>
          </CardContent>
        </Card>
        
        <Card className="bg-white shadow-sm border border-gray-200">
          <CardContent className="p-6 text-center">
            <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{data.activeTechnicians}</p>
            <p className="text-sm text-gray-600">Active Technicians</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Requests by Team */}
        <Card className="bg-white shadow-sm border border-gray-200">
          <CardHeader className="border-b border-gray-100">
            <CardTitle className="text-lg font-semibold">Requests by Maintenance Team</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {data.teamStats.map((team, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 ${team.color} rounded`}></div>
                    <span className="text-sm font-medium">{team.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div 
                        className={`${team.color} h-2 rounded-full`} 
                        style={{ width: `${team.percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium w-8 text-right">{team.requests}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Request Status Distribution */}
        <Card className="bg-white shadow-sm border border-gray-200">
          <CardHeader className="border-b border-gray-100">
            <CardTitle className="text-lg font-semibold">Request Status Distribution</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex items-center justify-center mb-6">
              {/* Simple Pie Chart Representation */}
              <div className="relative w-32 h-32">
                <div 
                  className="w-32 h-32 rounded-full" 
                  style={{
                    background: `conic-gradient(
                      ${data.statusDistribution[0].color} 0deg ${data.statusDistribution[0].percentage * 3.6}deg,
                      ${data.statusDistribution[1].color} ${data.statusDistribution[0].percentage * 3.6}deg ${(data.statusDistribution[0].percentage + data.statusDistribution[1].percentage) * 3.6}deg,
                      ${data.statusDistribution[2].color} ${(data.statusDistribution[0].percentage + data.statusDistribution[1].percentage) * 3.6}deg ${(data.statusDistribution[0].percentage + data.statusDistribution[1].percentage + data.statusDistribution[2].percentage) * 3.6}deg,
                      ${data.statusDistribution[3].color} ${(data.statusDistribution[0].percentage + data.statusDistribution[1].percentage + data.statusDistribution[2].percentage) * 3.6}deg 360deg
                    )`
                  }}
                ></div>
                <div className="absolute inset-4 bg-white rounded-full flex items-center justify-center">
                  <span className="text-lg font-bold text-gray-900">{data.totalRequests}</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              {data.statusDistribution.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="text-sm">{item.status}</span>
                  </div>
                  <span className="text-sm font-medium">{item.count} ({item.percentage}%)</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}