"use client"

import { MainLayout } from "@/components/layout/main-layout"
import { EquipmentList } from "@/components/equipment/equipment-grid"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"

export default function EquipmentPage() {
  return (
    <ProtectedRoute>
      <MainLayout title="Equipment" subtitle="Manage your company assets and machinery">
        <EquipmentList />
      </MainLayout>
    </ProtectedRoute>
  )
}
