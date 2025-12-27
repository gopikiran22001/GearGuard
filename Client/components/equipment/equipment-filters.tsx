"use client"

import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { EquipmentCategory } from "@/lib/types"

interface EquipmentFiltersProps {
  searchQuery: string
  onSearchChange: (value: string) => void
  categoryFilter: EquipmentCategory | "all"
  onCategoryChange: (value: EquipmentCategory | "all") => void
  departmentFilter: string
  onDepartmentChange: (value: string) => void
  departments: string[]
}

export function EquipmentFilters({
  searchQuery,
  onSearchChange,
  categoryFilter,
  onCategoryChange,
  departmentFilter,
  onDepartmentChange,
  departments,
}: EquipmentFiltersProps) {
  return (
    <div className="flex items-center gap-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search equipment..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-64 bg-secondary pl-9"
        />
      </div>

      <Select value={categoryFilter} onValueChange={(v) => onCategoryChange(v as EquipmentCategory | "all")}>
        <SelectTrigger className="w-40 bg-secondary">
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Categories</SelectItem>
          <SelectItem value="machinery">Machinery</SelectItem>
          <SelectItem value="vehicle">Vehicle</SelectItem>
          <SelectItem value="computer">Computer</SelectItem>
          <SelectItem value="tool">Tool</SelectItem>
          <SelectItem value="other">Other</SelectItem>
        </SelectContent>
      </Select>

      <Select value={departmentFilter} onValueChange={onDepartmentChange}>
        <SelectTrigger className="w-40 bg-secondary">
          <SelectValue placeholder="Department" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Departments</SelectItem>
          {departments.map((dept) => (
            <SelectItem key={dept} value={dept}>
              {dept}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
