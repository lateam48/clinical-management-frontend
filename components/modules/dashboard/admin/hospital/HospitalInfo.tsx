"use client"

import { useState } from "react"
import { useHospitalInfo } from "@/hooks/useHospital"
import { HospitalInfoHeader, HospitalInfoGrid, HospitalInfoLoading, HospitalInfoError, HospitalInfoForm  } from "@/components/modules/dashboard/admin/hospital"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export function HospitalInfo() {
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const { data: hospitalInfos, isLoading, error, refetch } = useHospitalInfo()

  if (isLoading) {
    return <HospitalInfoLoading />
  }

  if (error) {
    return <HospitalInfoError error={error} onRetry={() => refetch()} />
  }

  const hasHospitalInfo = hospitalInfos && hospitalInfos.length > 0

  return (
    <div className="space-y-6 relative">
      <HospitalInfoHeader totalCount={hospitalInfos?.length ?? 0} hasHospitalInfo={!!hasHospitalInfo} />
      <HospitalInfoGrid hospitalInfos={hospitalInfos ?? []} />

      {/* Floating Add Button - Only show if no hospital info exists */}
      {!hasHospitalInfo && (
        <div className="fixed bottom-6 right-6 z-50">
          <Button
            onClick={() => setShowCreateDialog(true)}
            size="lg"
            className="rounded-full shadow-lg hover:shadow-xl transition-shadow"
          >
            <Plus className="h-5 w-5" />
            <span className="sr-only">Configurer l{"'"}hôpital</span>
          </Button>
        </div>
      )}

      <HospitalInfoForm open={showCreateDialog} onOpenChange={setShowCreateDialog} mode="create" />
    </div>
  )
}
