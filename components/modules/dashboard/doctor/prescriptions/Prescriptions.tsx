"use client"

import { useState, useMemo } from "react"
import { usePrescriptions } from "@/hooks/usePrescriptions"
import { usePatients } from "@/hooks/usePatients"
import { useStaff } from "@/hooks/useUsers"
import { PrescriptionsError, PrescriptionsGrid, PrescriptionsHeader, PrescriptionsLoading, PrescriptionForm } from "@/components/modules/dashboard/doctor/prescriptions"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export function Prescriptions() {
  const [searchQuery, setSearchQuery] = useState("")
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  
  // Récupération des données depuis l'API
  const { data: prescriptions, isLoading: prescriptionsLoading, error: prescriptionsError, refetch: refetchPrescriptions } = usePrescriptions()
  const { getPatients } = usePatients()
  const { getStaff } = useStaff({ role: 'DOCTOR' })

  // Extraction des données et états
  const {data : patients, isLoading: patientsLoading, error: patientsError} = getPatients
  const {data : doctors, isLoading: doctorsLoading, error: doctorsError} = getStaff

  // États de chargement et d'erreur combinés
  const isLoading = prescriptionsLoading ?? patientsLoading ?? doctorsLoading
  const error = prescriptionsError ?? patientsError ?? doctorsError


  const filteredPrescriptions = useMemo(() => {
    if (!prescriptions) return []

    if (!searchQuery.trim()) return prescriptions

    const query = searchQuery.toLowerCase()
    return prescriptions.filter(
      (prescription) =>
        prescription.patientFirstName.toLowerCase().includes(query) ??
        prescription.patientLastName.toLowerCase().includes(query) ??
        prescription.medecinFirstName.toLowerCase().includes(query) ??
        prescription.medecinLastName.toLowerCase().includes(query) ??
        prescription.diagnostic.toLowerCase().includes(query) ??
        prescription.recommandations.toLowerCase().includes(query),
    )
  }, [prescriptions, searchQuery])

  const handleRetry = () => {
    refetchPrescriptions()
  }

  if (isLoading) {
    return <PrescriptionsLoading />
  }

  if (error) {
    return <PrescriptionsError error={error} onRetry={handleRetry} />
  }

  return (
    <div className="space-y-6 relative w-full">
      <PrescriptionsHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        totalCount={prescriptions?.length ?? 0}
        patients={patients ?? []}
        doctors={doctors ?? []}
      />
      <PrescriptionsGrid prescriptions={filteredPrescriptions} patients={patients ?? []} doctors={doctors ?? []} />

      {/* Floating Add Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setShowCreateDialog(true)}
          size="lg"
          className="rounded-full shadow-lg hover:shadow-xl transition-shadow"
        >
          <Plus className="h-5 w-5" />
          <span className="sr-only">Nouvelle prescription</span>
        </Button>
      </div>

      <PrescriptionForm
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        mode="create"
        patients={patients ?? []}
        doctors={doctors ?? []}
      />
    </div>
  )
}
