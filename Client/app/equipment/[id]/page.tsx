"use client"

import { MainLayout } from "@/components/layout/main-layout"
import { EquipmentDetails } from "@/components/equipment/equipment-details"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"

interface EquipmentPageProps {
  params: {
    id: string
  }
}

export default function EquipmentPage({ params }: EquipmentPageProps) {
  return (
    <ProtectedRoute>
      <MainLayout title="Equipment Details" subtitle="View equipment information and maintenance history">
        <EquipmentDetails equipmentId={params.id} />
      </MainLayout>
    </ProtectedRoute>
  )
}