"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { MaintenanceTeam } from "@/lib/types"

interface TeamFormProps {
  team?: MaintenanceTeam
  onSubmit: (data: Partial<MaintenanceTeam>) => void
  onCancel: () => void
}

export function TeamForm({ team, onSubmit, onCancel }: TeamFormProps) {
  const [formData, setFormData] = useState<Partial<MaintenanceTeam>>({
    name: team?.name || "",
    specialization: team?.specialization || "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Team Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Electricians"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="specialization">Specialization</Label>
        <Textarea
          id="specialization"
          value={formData.specialization}
          onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
          placeholder="Electrical systems and wiring"
          rows={3}
        />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Save Team</Button>
      </div>
    </form>
  )
}
