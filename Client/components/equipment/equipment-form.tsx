"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
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
    <div className="max-w-3xl mx-auto">
      <Card className="bg-card shadow-sm border border-border">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-foreground">
            {equipment ? 'Edit Equipment' : 'Add New Equipment'}
          </CardTitle>
          <p className="text-muted-foreground mt-1">Enter the details for the equipment asset</p>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6 pt-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-foreground">Equipment Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="CNC Machine A1"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="serialNumber" className="text-foreground">Serial Number</Label>
                <Input
                  id="serialNumber"
                  value={formData.serialNumber}
                  onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
                  placeholder="CNC-2024-001"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category" className="text-foreground">Category</Label>
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
                <Label htmlFor="department" className="text-foreground">Department</Label>
                <Input
                  id="department"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  placeholder="Production"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location" className="text-foreground">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="Building A, Floor 1"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="team" className="text-foreground">Maintenance Team</Label>
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
                <Label htmlFor="purchaseDate" className="text-foreground">Purchase Date</Label>
                <Input
                  id="purchaseDate"
                  type="date"
                  value={formData.purchaseDate}
                  onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="warrantyExpiry" className="text-foreground">Warranty Expiry</Label>
                <Input
                  id="warrantyExpiry"
                  type="date"
                  value={formData.warrantyExpiry}
                  onChange={(e) => setFormData({ ...formData, warrantyExpiry: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes" className="text-foreground">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Additional notes about this equipment..."
                rows={4}
                className="resize-none"
              />
            </div>
          </CardContent>

          <CardFooter className="flex justify-end gap-3 border-t border-border bg-muted/50 px-6 py-4 mt-6">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" className="bg-primary hover:bg-primary/90">
              {equipment ? 'Update' : 'Save'} Equipment
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
