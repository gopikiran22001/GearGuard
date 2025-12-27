// Core types for GearGuard maintenance tracker

export type RequestStage = "new" | "in-progress" | "repaired" | "scrap"
export type RequestType = "corrective" | "preventive"
export type EquipmentCategory = "machinery" | "vehicle" | "computer" | "tool" | "other"

export interface Technician {
  id: string
  name: string
  email: string
  avatar?: string
  teamId: string
}

export interface MaintenanceTeam {
  id: string
  name: string
  specialization: string
  members: Technician[]
}

export interface Equipment {
  id: string
  name: string
  serialNumber: string
  category: EquipmentCategory
  department: string
  assignedTo?: string
  location: string
  purchaseDate: string
  warrantyExpiry?: string
  maintenanceTeamId: string
  defaultTechnicianId?: string
  isActive: boolean
  notes?: string
}

export interface MaintenanceRequest {
  id: string
  subject: string
  description?: string
  type: RequestType
  stage: RequestStage
  equipmentId: string
  maintenanceTeamId: string
  assignedTechnicianId?: string
  scheduledDate?: string
  createdAt: string
  updatedAt: string
  completedAt?: string
  duration?: number // in minutes
  isOverdue: boolean
  priority: "low" | "medium" | "high" | "critical"
}

export interface KanbanColumn {
  id: RequestStage
  title: string
  requests: MaintenanceRequest[]
}
