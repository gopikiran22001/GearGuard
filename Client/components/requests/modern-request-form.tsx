"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Users, AlertCircle } from "lucide-react"
import { toast } from "sonner"
import { equipmentAPI, teamsAPI, usersAPI } from "@/lib/api"
import { useEffect } from "react"

interface RequestFormProps {
  onSubmit: (data: any) => void
  onCancel: () => void
  defaultType?: "corrective" | "preventive"
}

export function ModernRequestForm({ onSubmit, onCancel, defaultType = "corrective" }: RequestFormProps) {
  const [formData, setFormData] = useState({
    type: defaultType,
    equipmentId: "",
    subject: "",
    description: "",
    scheduledDate: "",
    estimatedDuration: "",
    priority: "medium"
  })
  const [equipment, setEquipment] = useState<any[]>([])
  const [teams, setTeams] = useState<any[]>([])
  const [selectedEquipment, setSelectedEquipment] = useState<any>(null)
  const [autoAssignedTeam, setAutoAssignedTeam] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [equipmentResponse, teamsResponse] = await Promise.all([
        equipmentAPI.getAll({ status: 'ACTIVE' }),
        teamsAPI.getAll()
      ])

      if (equipmentResponse.success) {
        setEquipment(equipmentResponse.equipments)
      }
      if (teamsResponse.success) {
        setTeams(teamsResponse.teams)
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to load form data")
    } finally {
      setLoading(false)
    }
  }

  const handleEquipmentChange = (equipmentId: string) => {
    const selected = equipment.find(eq => eq._id === equipmentId)
    setSelectedEquipment(selected)

    if (selected) {
      const team = teams.find(t => t._id === selected.maintenanceTeam._id)
      setAutoAssignedTeam(team)
    }

    setFormData(prev => ({ ...prev, equipmentId }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.equipmentId || !formData.subject) {
      toast.error("Please fill in all required fields")
      return
    }

    if (formData.type === "preventive" && !formData.scheduledDate) {
      toast.error("Scheduled date is required for preventive maintenance")
      return
    }

    onSubmit({
      ...formData,
      equipment: [formData.equipmentId],
      maintenanceTeam: autoAssignedTeam?._id,
      requestType: formData.type.toUpperCase()
    })
  }

  if (loading) {
    return <div className="flex justify-center p-8">Loading form...</div>
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="bg-card shadow-sm border border-border">
        <CardHeader className="border-b border-border">
          <CardTitle className="text-xl font-semibold text-foreground">Create Maintenance Request</CardTitle>
          <p className="text-muted-foreground mt-1">Submit a new maintenance request for equipment</p>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="p-6 space-y-6">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-foreground">Request Type</Label>
              <RadioGroup
                value={formData.type}
                onValueChange={(value: "corrective" | "preventive") => setFormData(prev => ({ ...prev, type: value }))}
                className="flex gap-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="corrective" id="corrective" />
                  <Label htmlFor="corrective" className="text-sm">Corrective (Breakdown/Repair)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="preventive" id="preventive" />
                  <Label htmlFor="preventive" className="text-sm">Preventive (Scheduled)</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-foreground">Equipment <span className="text-destructive">*</span></Label>
              <Select value={formData.equipmentId} onValueChange={handleEquipmentChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select equipment that needs maintenance" />
                </SelectTrigger>
                <SelectContent>
                  {equipment.map((eq) => (
                    <SelectItem key={eq._id} value={eq._id}>
                      {eq.name} - {eq.location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {autoAssignedTeam && (
              <div className="space-y-2">
                <Label className="text-sm font-medium text-foreground">Maintenance Team</Label>
                <div className="flex items-center gap-3 p-3 bg-muted border border-border rounded-lg">
                  <Users className="h-5 w-5 text-secondary" />
                  <div>
                    <p className="font-medium text-foreground">{autoAssignedTeam.name}</p>
                    <p className="text-xs text-muted-foreground">Auto-assigned based on equipment type</p>
                  </div>
                </div>
                <div className="flex items-start gap-2 text-xs text-muted-foreground">
                  <AlertCircle className="h-4 w-4 mt-0.5 text-secondary" />
                  <p>Maintenance team is automatically assigned based on the selected equipment</p>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label className="text-sm font-medium text-foreground">Subject <span className="text-destructive">*</span></Label>
              <Input
                placeholder="Brief description of the issue or maintenance needed"
                value={formData.subject}
                onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-foreground">Description</Label>
              <Textarea
                placeholder="Detailed description of the problem, symptoms, or maintenance requirements..."
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full min-h-[100px]"
              />
            </div>

            {formData.type === "preventive" && (
              <div className="space-y-2">
                <Label className="text-sm font-medium text-foreground">
                  Scheduled Date <span className="text-destructive">*</span>
                </Label>
                <Input
                  type="date"
                  value={formData.scheduledDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, scheduledDate: e.target.value }))}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  Required for preventive maintenance requests
                </p>
              </div>
            )}

            <div className="space-y-2">
              <Label className="text-sm font-medium text-foreground">Priority</Label>
              <Select value={formData.priority} onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value }))}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low - Can wait</SelectItem>
                  <SelectItem value="medium">Medium - Normal priority</SelectItem>
                  <SelectItem value="high">High - Urgent</SelectItem>
                  <SelectItem value="critical">Critical - Emergency</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>

          <CardFooter className="border-t border-border bg-muted/50 px-6 py-4">
            <div className="flex items-center justify-between w-full">
              <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
              <Button type="submit" className="bg-primary hover:bg-primary/90 px-8">
                Create Request
              </Button>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}