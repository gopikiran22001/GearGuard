"use client"

import { useState, useEffect } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { EquipmentCard } from "@/components/equipment/equipment-card"
import { EquipmentFilters } from "@/components/equipment/equipment-filters"
import { EquipmentForm } from "@/components/equipment/equipment-form"
import { Button } from "@/components/ui/button"
import { Plus, LayoutGrid, List, Loader2 } from "lucide-react"
import { equipmentAPI, type Equipment as APIEquipment } from "@/lib/api"
import type { EquipmentCategory } from "@/lib/types"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { toast } from "sonner"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"

export default function EquipmentPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<EquipmentCategory | "all">("all")
  const [departmentFilter, setDepartmentFilter] = useState<string>("all")
  const [isFormOpen, setIsFormOpen] = useState(false)

  // API state
  const [equipment, setEquipment] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch equipment from API
  useEffect(() => {
    fetchEquipment()
  }, [departmentFilter])

  const fetchEquipment = async () => {
    try {
      setLoading(true)
      setError(null)

      const filters: any = {}
      if (departmentFilter !== "all") {
        filters.department = departmentFilter
      }

      const response = await equipmentAPI.getAll(filters)

      if (response.success) {
        // Transform API data to match component expectations
        const transformedEquipment = response.equipments.map((item: APIEquipment) => ({
          id: item._id,
          name: item.name,
          serialNumber: item.serialNumber,
          category: "machinery" as EquipmentCategory, // Default category
          department: item.department,
          location: item.location,
          purchaseDate: item.purchaseDate,
          warrantyExpiry: item.warrantyExpiry,
          maintenanceTeamId: item.maintenanceTeam._id,
          defaultTechnicianId: item.assignedEmployee?._id,
          assignedTo: item.assignedEmployee?.name,
          isActive: item.status === "ACTIVE",
          _raw: item // Keep raw data for updates
        }))

        setEquipment(transformedEquipment)
      }
    } catch (err: any) {
      const errorMessage = err?.message || "Failed to fetch equipment"
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  // Get unique departments from equipment
  const departments = [...new Set(equipment.map((e) => e.department))]

  const filteredEquipment = equipment.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.serialNumber.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter
    const matchesDepartment = departmentFilter === "all" || item.department === departmentFilter

    return matchesSearch && matchesCategory && matchesDepartment && item.isActive
  })

  const handleFormSubmit = async (data: any) => {
    try {
      const response = await equipmentAPI.create({
        name: data.name,
        serialNumber: data.serialNumber,
        purchaseDate: data.purchaseDate,
        warrantyExpiry: data.warrantyExpiry,
        location: data.location,
        department: data.department,
        assignedEmployee: data.assignedEmployee,
        maintenanceTeam: data.maintenanceTeam,
        specifications: data.specifications
      })

      if (response.success) {
        toast.success("Equipment created successfully!")
        setIsFormOpen(false)
        // Refresh equipment list
        fetchEquipment()
      }
    } catch (err: any) {
      toast.error(err?.message || "Failed to create equipment")
    }
  }

  return (
    <ProtectedRoute>
      <MainLayout title="Equipment" subtitle="Manage your company assets and machinery">
        <div className="space-y-6">
          {/* Header Actions */}
          <div className="flex items-center justify-between">
            <EquipmentFilters
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              categoryFilter={categoryFilter}
              onCategoryChange={setCategoryFilter}
              departmentFilter={departmentFilter}
              onDepartmentChange={setDepartmentFilter}
              departments={departments}
            />

            <div className="flex items-center gap-2">
              <div className="flex rounded-lg border border-border bg-secondary p-1">
                <Button variant={viewMode === "grid" ? "default" : "ghost"} size="sm" onClick={() => setViewMode("grid")}>
                  <LayoutGrid className="h-4 w-4" />
                </Button>
                <Button variant={viewMode === "list" ? "default" : "ghost"} size="sm" onClick={() => setViewMode("list")}>
                  <List className="h-4 w-4" />
                </Button>
              </div>

              <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Equipment
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Add New Equipment</DialogTitle>
                    <DialogDescription>Add a new asset to your equipment inventory.</DialogDescription>
                  </DialogHeader>
                  <EquipmentForm onSubmit={handleFormSubmit} onCancel={() => setIsFormOpen(false)} />
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Error State */}
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Loading State */}
          {loading ? (
            <div className="flex h-64 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <>
              {/* Equipment Grid/List */}
              {filteredEquipment.length === 0 ? (
                <div className="flex h-64 items-center justify-center rounded-lg border border-dashed border-border">
                  <p className="text-muted-foreground">No equipment found matching your filters.</p>
                </div>
              ) : viewMode === "grid" ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {filteredEquipment.map((item) => (
                    <EquipmentCard key={item.id} equipment={item} />
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredEquipment.map((item) => (
                    <EquipmentCard key={item.id} equipment={item} variant="list" />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </MainLayout>
    </ProtectedRoute>
  )
}
