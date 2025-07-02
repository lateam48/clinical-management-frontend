"use client"

import { HospitalInfoCard } from "./HospitalInfoCard"
import type { HospitalInfo } from "@/types/hospital"

interface HospitalInfoGridProps {
  hospitalInfos: HospitalInfo[]
}

export function HospitalInfoGrid({ hospitalInfos }: HospitalInfoGridProps) {
  if (hospitalInfos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="mx-auto max-w-md">
          <h3 className="text-lg font-semibold">Aucune information d{"'"}hôpital trouvée</h3>
          <p className="text-muted-foreground">
            Aucune information d{"'"}hôpital n{"'"}est configurée. Créez les informations de votre hôpital pour commencer.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {hospitalInfos.map((hospitalInfo) => (
        <HospitalInfoCard key={hospitalInfo.id} hospitalInfo={hospitalInfo} />
      ))}
    </div>
  )
}
