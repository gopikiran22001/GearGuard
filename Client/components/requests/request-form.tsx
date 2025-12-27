"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { MaintenanceRequest, RequestType } from "@/lib/types"
import { equipment, maintenanceTeams, getEquipmentById } from "@/lib/mock-data"

interface RequestFormProps {
  request?: MaintenanceRequest
  onSubmit: (data: Partial<MaintenanceRequest>) => void
  onCancel: () => void
}

export function RequestForm({ request, onSubmit, onCancel }: RequestFormProps) {
  const [formData, setFormData] = useState<Partial<MaintenanceRequest>>({
    subject: request?.subject || "",
    description: request?.description || "",
    type: request?.type || "corrective",
    equipmentId: request?.equipmentId || "defaultEquipmentId",
    maintenanceTeamId: request?.maintenanceTeamId || "defaultTeamId",
    assignedTechnicianId: request?.assignedTechnicianId || "defaultTechnicianId",
    scheduledDate: request?.scheduledDate?.split("T")[0] || "",
    priority: request?.priority || "medium",
  })

  // Auto-fill logic: When equipment is selected, auto-fill team and technician
  useEffect(() => {
    if (formData.equipmentId) {
      const selectedEquipment = getEquipmentById(formData.equipmentId)
      if (selectedEquipment) {
        setFormData((prev) => ({
          ...prev,
          maintenanceTeamId: selectedEquipment.maintenanceTeamId,
          assignedTechnicianId: selectedEquipment.defaultTechnicianId || "defaultTechnicianId",
        }))
      }
    }
  }, [formData.equipmentId])

  const selectedTeam = maintenanceTeams.find((t) => t.id === formData.maintenanceTeamId)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="subject">Subject</Label>
          <Input
            id="subject"
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            placeholder="What is the issue?"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="type">Request Type</Label>
          <Select value={formData.type} onValueChange={(v) => setFormData({ ...formData, type: v as RequestType })}>
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="corrective">Corrective (Breakdown)</SelectItem>
              <SelectItem value="preventive">Preventive (Scheduled)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="priority">Priority</Label>
          <Select
            value={formData.priority}
            onValueChange={(v) => setFormData({ ...formData, priority: v as MaintenanceRequest["priority"] })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="equipment">Equipment</Label>
          <Select value={formData.equipmentId} onValueChange={(v) => setFormData({ ...formData, equipmentId: v })}>
            <SelectTrigger>
              <SelectValue placeholder="Select equipment" />
            </SelectTrigger>
            <SelectContent>
              {equipment
                .filter((e) => e.isActive)
                .map((item) => (
                  <SelectItem key={item.id} value={item.id}>
                    {item.name} - {item.serialNumber}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">Selecting equipment auto-fills team and technician</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="team">Maintenance Team</Label>
          <Select
            value={formData.maintenanceTeamId}
            onValueChange={(v) => setFormData({ ...formData, maintenanceTeamId: v })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select team" />
            </SelectTrigger>
            <SelectContent>
              {maintenanceTeams.map((team) => (
                <SelectItem key={team.id} value={team.id}>
                  {team.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="technician">Assign Technician</Label>
          <Select
            value={formData.assignedTechnicianId}
            onValueChange={(v) =>
              setFormData({ ...formData, assignedTechnicianId: v === "unassigned" ? undefined : v })
            }
            disabled={!selectedTeam}
          >
            <SelectTrigger>
              <SelectValue placeholder={selectedTeam ? "Select technician" : "Select team first"} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="unassigned">Unassigned</SelectItem>
              {selectedTeam?.members.map((member) => (
                <SelectItem key={member.id} value={member.id}>
                  {member.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {formData.type === "preventive" && (
          <div className="space-y-2">
            <Label htmlFor="scheduledDate">Scheduled Date</Label>
            <Input
              id="scheduledDate"
              type="date"
              value={formData.scheduledDate}
              onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
            />
          </div>
        )}

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Describe the issue in detail..."
            rows={3}
          />
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Create Request</Button>
      </div>
    </form>
  )
}
