"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Wrench, Users, Calendar, MapPin, User, AlertTriangle, CheckCircle, Clock } from "lucide-react"
import Link from "next/link"
import { equipmentAPI, requestsAPI } from "@/lib/api"
import { toast } from "sonner"

interface EquipmentDetailsProps {
  equipmentId: string
}

export function EquipmentDetails({ equipmentId }: EquipmentDetailsProps) {
  const [equipment, setEquipment] = useState<any>(null)
  const [requests, setRequests] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchEquipmentData()
  }, [equipmentId])

  const fetchEquipmentData = async () => {
    try {
      setLoading(true)
      
      // Fetch equipment details and related requests
      const [equipmentResponse, requestsResponse] = await Promise.all([
        equipmentAPI.getById(equipmentId),
        requestsAPI.getByEquipment(equipmentId)
      ])

      if (equipmentResponse.success) {
        setEquipment(equipmentResponse.equipment)
      }

      if (requestsResponse.success) {
        setRequests(requestsResponse.requests)
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch equipment data")
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-700'
      case 'SCRAPPED': return 'bg-gray-100 text-gray-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getRequestStatusColor = (status: string) => {
    switch (status) {
      case 'NEW': return 'bg-blue-100 text-blue-700'
      case 'IN_PROGRESS': return 'bg-orange-100 text-orange-700'
      case 'REPAIRED': return 'bg-green-100 text-green-700'
      case 'SCRAP': return 'bg-gray-100 text-gray-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const openRequestsCount = requests.filter(r => 
    r.status !== 'REPAIRED' && r.status !== 'SCRAP'
  ).length

  if (loading) {
    return <div className="flex justify-center p-8">Loading...</div>
  }

  if (!equipment) {
    return <div className="text-center p-8">Equipment not found</div>
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Equipment Header */}
      <Card className="bg-white shadow-sm border border-gray-200">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 bg-blue-100 rounded-xl flex items-center justify-center">
                <Wrench className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{equipment.name}</h1>
                <p className="text-gray-600 mt-1">{equipment.category}</p>
                <div className="flex items-center gap-4 mt-2">
                  <Badge className={getStatusColor(equipment.status)}>
                    {equipment.status}
                  </Badge>
                  <span className="text-sm text-gray-600">SN: {equipment.serialNumber}</span>
                </div>
              </div>
            </div>
            
            {/* Smart Maintenance Button */}
            <Button 
              className={`px-6 ${
                openRequestsCount > 0 
                  ? 'bg-orange-600 hover:bg-orange-700' 
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
              asChild
            >
              <Link href={`/requests?equipment=${equipmentId}`}>
                <Wrench className="h-4 w-4 mr-2" />
                Maintenance {openRequestsCount > 0 ? `(${openRequestsCount} Open)` : ''}
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Equipment Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Information */}
        <Card className="bg-white shadow-sm border border-gray-200">
          <CardHeader className="border-b border-gray-100">
            <CardTitle className="text-lg font-semibold">Equipment Information</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Serial Number</label>
                <p className="font-medium text-gray-900 mt-1">{equipment.serialNumber}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Department</label>
                <p className="font-medium text-gray-900 mt-1">{equipment.department}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Location</label>
                <div className="flex items-center gap-2 mt-1">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <p className="font-medium text-gray-900">{equipment.location}</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Category</label>
                <p className="font-medium text-gray-900 mt-1">{equipment.category}</p>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600">Assigned Employee</label>
              <div className="flex items-center gap-2 mt-1">
                <User className="h-4 w-4 text-gray-500" />
                <p className="font-medium text-gray-900">
                  {equipment.assignedEmployee?.name || 'Unassigned'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Maintenance & Warranty */}
        <Card className="bg-white shadow-sm border border-gray-200">
          <CardHeader className="border-b border-gray-100">
            <CardTitle className="text-lg font-semibold">Maintenance & Warranty</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Purchase Date</label>
                <div className="flex items-center gap-2 mt-1">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <p className="font-medium text-gray-900">
                    {new Date(equipment.purchaseDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Warranty Expires</label>
                <p className="font-medium text-green-600 mt-1">
                  {new Date(equipment.warrantyExpiry).toLocaleDateString()}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Maintenance Team</label>
                <div className="flex items-center gap-2 mt-1">
                  <Users className="h-4 w-4 text-blue-600" />
                  <span className="font-medium text-gray-900">
                    {equipment.maintenanceTeam?.name}
                  </span>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Default Technician</label>
                <div className="flex items-center gap-2 mt-1">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="text-xs">
                      {equipment.defaultTechnician?.name?.charAt(0) || 'N'}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium text-gray-900">
                    {equipment.defaultTechnician?.name || 'None assigned'}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Maintenance History */}
      <Card className="bg-white shadow-sm border border-gray-200">
        <CardHeader className="border-b border-gray-100">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold">Maintenance History</CardTitle>
            <Button variant="outline" size="sm" asChild>
              <Link href={`/requests/new?equipment=${equipmentId}`}>
                New Request
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {requests.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No maintenance requests found
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subject</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Technician</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {requests.map((request) => (
                    <tr key={request._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {new Date(request.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant="outline" className="text-xs">
                          {request.requestType}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{request.subject}</td>
                      <td className="px-6 py-4">
                        <Badge className={`${getRequestStatusColor(request.status)} text-xs`}>
                          {request.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {request.assignedTechnician ? (
                            <>
                              <Avatar className="h-6 w-6">
                                <AvatarFallback className="text-xs">
                                  {request.assignedTechnician.name.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-sm text-gray-600">
                                {request.assignedTechnician.name}
                              </span>
                            </>
                          ) : (
                            <span className="text-sm text-gray-500">Unassigned</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}