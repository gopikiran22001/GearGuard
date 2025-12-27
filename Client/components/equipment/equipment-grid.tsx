"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Wrench, Users, AlertTriangle, CheckCircle2, Search, Plus } from "lucide-react"
import Link from "next/link"
import { equipmentAPI } from "@/lib/api"
import { toast } from "sonner"
import { useAuth } from "@/contexts/AuthContext"

interface Equipment {
  _id: string
  name: string
  serialNumber: string
  category: string
  department: string
  location: string
  assignedEmployee?: { name: string }
  maintenanceTeam: { name: string }
  status: 'ACTIVE' | 'SCRAPPED'
  openRequestsCount?: number
}

export function EquipmentList() {
  const { user } = useAuth()
  const [equipment, setEquipment] = useState<Equipment[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  const canCreateEquipment = user?.role === 'ADMIN' || user?.role === 'MANAGER'
  const canEditEquipment = user?.role === 'ADMIN' || user?.role === 'MANAGER'
  const canDeleteEquipment = user?.role === 'ADMIN'

  useEffect(() => {
    fetchEquipment()
  }, [departmentFilter, statusFilter])

  const fetchEquipment = async () => {
    try {
      setLoading(true)
      const filters: any = {}
      if (departmentFilter !== "all") filters.department = departmentFilter
      if (statusFilter !== "all") filters.status = statusFilter

      const response = await equipmentAPI.getAll(filters)
      if (response.success) {
        setEquipment(response.equipments)
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch equipment")
    } finally {
      setLoading(false)
    }
  }

  const filteredEquipment = equipment.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.serialNumber.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-700'
      case 'SCRAPPED': return 'bg-gray-100 text-gray-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ACTIVE': return <CheckCircle2 className="h-5 w-5 text-green-600" />
      case 'SCRAPPED': return <AlertTriangle className="h-5 w-5 text-gray-600" />
      default: return <Wrench className="h-5 w-5 text-blue-600" />
    }
  }

  if (loading) {
    return <div className="flex justify-center p-8">Loading equipment...</div>
  }

  return (
    <div className="space-y-6">

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Equipment Management</h1>
          <p className="text-muted-foreground mt-1">Manage and track all equipment assets</p>
        </div>
        {canCreateEquipment && (
          <Button className="bg-primary hover:bg-primary/90" asChild>
            <Link href="/equipment/new">
              <Plus className="h-4 w-4 mr-2" />
              Add Equipment
            </Link>
          </Button>
        )}
      </div>


      <Card className="bg-card shadow-sm border border-border">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search equipment by name, serial number..."
                  className="pl-10 w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                <SelectItem value="IT">IT Department</SelectItem>
                <SelectItem value="Facilities">Facilities</SelectItem>
                <SelectItem value="Production">Production</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="SCRAPPED">Scrapped</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>


      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEquipment.map((item) => {
          const openRequestsCount = item.openRequestsCount || 0

          return (
            <Card key={item._id} className="bg-card shadow-sm border border-border hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-muted rounded-lg flex items-center justify-center">
                      {getStatusIcon(item.status)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{item.name}</h3>
                      <p className="text-sm text-muted-foreground">SN: {item.serialNumber}</p>
                    </div>
                  </div>
                  <Badge className={getStatusColor(item.status)}>
                    {item.status}
                  </Badge>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Department:</span>
                    <span className="font-medium">{item.department}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Location:</span>
                    <span className="font-medium">{item.location}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Team:</span>
                    <span className="font-medium">{item.maintenanceTeam.name}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/equipment/${item._id}`}>View Details</Link>
                  </Button>
                  <div className="flex items-center gap-2">
                    {openRequestsCount > 0 && (
                      <Badge
                        variant={openRequestsCount > 2 ? "destructive" : "outline"}
                        className="text-xs"
                      >
                        {openRequestsCount} Open
                      </Badge>
                    )}
                    <Button
                      size="sm"
                      className={`text-xs ${openRequestsCount > 0
                        ? 'bg-status-in-progress hover:bg-status-in-progress/90'
                        : 'bg-primary hover:bg-primary/90'
                        }`}
                      asChild
                    >
                      <Link href={`/requests?equipment=${item._id}`}>
                        <Wrench className="h-3 w-3 mr-1" />
                        Maintenance {openRequestsCount > 0 ? `(${openRequestsCount})` : ''}
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filteredEquipment.length === 0 && (
        <div className="text-center py-12">
          <Wrench className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No equipment found</h3>
          <p className="text-muted-foreground">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  )
}