"use client"

import { PrescriptionCard } from "@/components/modules/dashboard/doctor/prescriptions"
import type { Prescription, Patient, Doctor } from "@/types"

interface PrescriptionsGridProps {
  prescriptions: Prescription[]
  patients?: Patient[]
  doctors?: Doctor[]
}

export function PrescriptionsGrid({ prescriptions, patients = [], doctors = [] }: PrescriptionsGridProps) {
  if (prescriptions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="mx-auto max-w-md">
          <h3 className="text-lg font-semibold">Aucune prescription trouvée</h3>
          <p className="text-muted-foreground">
            Aucune prescription ne correspond à vos critères de recherche. Essayez d{"'"}ajuster votre recherche ou créez
            une nouvelle prescription.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full">
      {prescriptions.map((prescription) => (
        <PrescriptionCard key={prescription.id} prescription={prescription} patients={patients} doctors={doctors} />
      ))}
    </div>
  )
}
