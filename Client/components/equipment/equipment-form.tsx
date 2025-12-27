"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Equipment, EquipmentCategory } from "@/lib/types"
import { maintenanceTeams } from "@/lib/mock-data"

interface EquipmentFormProps {
  equipment?: Equipment
  onSubmit: (data: Partial<Equipment>) => void
  onCancel: () => void
}

export function EquipmentForm({ equipment, onSubmit, onCancel }: EquipmentFormProps) {
  const [formData, setFormData] = useState<Partial<Equipment>>({
    name: equipment?.name || "",
    serialNumber: equipment?.serialNumber || "",
    category: equipment?.category || "machinery",
    department: equipment?.department || "",
    location: equipment?.location || "",
    purchaseDate: equipment?.purchaseDate || "",
    warrantyExpiry: equipment?.warrantyExpiry || "",
    maintenanceTeamId: equipment?.maintenanceTeamId || "",
    notes: equipment?.notes || "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Equipment Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="CNC Machine A1"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="serialNumber">Serial Number</Label>
          <Input
            id="serialNumber"
            value={formData.serialNumber}
            onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
            placeholder="CNC-2024-001"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select
            value={formData.category}
            onValueChange={(v) => setFormData({ ...formData, category: v as EquipmentCategory })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="machinery">Machinery</SelectItem>
              <SelectItem value="vehicle">Vehicle</SelectItem>
              <SelectItem value="computer">Computer</SelectItem>
              <SelectItem value="tool">Tool</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="department">Department</Label>
          <Input
            id="department"
            value={formData.department}
            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
            placeholder="Production"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            placeholder="Building A, Floor 1"
            required
          />
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
          <Label htmlFor="purchaseDate">Purchase Date</Label>
          <Input
            id="purchaseDate"
            type="date"
            value={formData.purchaseDate}
            onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="warrantyExpiry">Warranty Expiry</Label>
          <Input
            id="warrantyExpiry"
            type="date"
            value={formData.warrantyExpiry}
            onChange={(e) => setFormData({ ...formData, warrantyExpiry: e.target.value })}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          placeholder="Additional notes about this equipment..."
          rows={3}
        />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Save Equipment</Button>
      </div>
    </form>
  )
}
