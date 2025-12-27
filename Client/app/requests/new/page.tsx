"use client"

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { MainLayout } from "@/components/layout/main-layout"
import { ModernRequestForm } from "@/components/requests/modern-request-form"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { requestsAPI } from "@/lib/api"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

function NewRequestContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const requestType = searchParams.get("type") || "corrective"

  const handleFormSubmit = async (data: any) => {
    try {
      const response = await requestsAPI.create(data)

      if (response.success) {
        toast.success("Maintenance request created successfully!")
        router.push("/requests")
      }
    } catch (err: any) {
      toast.error(err?.message || "Failed to create request")
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <ModernRequestForm 
        onSubmit={handleFormSubmit} 
        onCancel={() => router.push("/requests")}
        defaultType={requestType as "corrective" | "preventive"}
      />
    </div>
  )
}

export default function NewRequestPage() {
  return (
    <ProtectedRoute>
      <MainLayout title="Create Maintenance Request" subtitle="Submit a new maintenance request">
        <Suspense fallback={<div>Loading...</div>}>
          <NewRequestContent />
        </Suspense>
      </MainLayout>
    </ProtectedRoute>
  )
}