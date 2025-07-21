"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus, Building } from "lucide-react"
import { HospitalInfoForm } from "@/components/modules/dashboard/admin/hospital/HospitalInfoForm"

interface HospitalInfoHeaderProps {
  totalCount: number
  hasHospitalInfo: boolean
}

export function HospitalInfoHeader({ totalCount, hasHospitalInfo }: HospitalInfoHeaderProps) {
  const [showCreateDialog, setShowCreateDialog] = useState(false)

  return (
    <>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Building className="h-8 w-8" />
            Informations de l{"'"}hôpital
          </h1>
          <p className="text-muted-foreground">
            Gérez les informations et le logo de votre hôpital ({totalCount} configuré{totalCount > 1 ? "s" : ""})
          </p>
        </div>
        <div className="flex gap-2">
          {!hasHospitalInfo && (
            <Button onClick={() => setShowCreateDialog(true)} size="default" className="bg-primary hover:bg-primary/90">
              <Plus className="mr-2 h-4 w-4" />
              Configurer l{"'"}hôpital
            </Button>
          )}
        </div>
      </div>

      <HospitalInfoForm open={showCreateDialog} onOpenChange={setShowCreateDialog} mode="create" />
    </>
  )
}
