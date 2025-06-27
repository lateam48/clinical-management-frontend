"use client"

import { useState, useMemo } from "react"
import { usePrescriptions } from "@/hooks/usePrescriptions"
import { PrescriptionsError, PrescriptionsGrid, PrescriptionsHeader, PrescriptionsLoading, PrescriptionForm } from "@/components/modules/dashboard/doctor/prescriptions"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

// Mock data - replace with actual API calls
const mockPatients = [
  { id: 1, firstName: "Alex", lastName: "Ken", gender: "MALE" as const, dateOfBirth: "2020-06-26" },
  { id: 2, firstName: "Marie", lastName: "Dupont", gender: "FEMALE" as const, dateOfBirth: "1985-03-15" },
]

const mockDoctors = [
  { id: 2, firstName: "Claudel", lastName: "Noubissie" },
  { id: 3, firstName: "Jean", lastName: "Martin" },
]

export function Prescriptions() {
  const [searchQuery, setSearchQuery] = useState("")
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const { data: prescriptions, isLoading, error, refetch } = usePrescriptions()

  const filteredPrescriptions = useMemo(() => {
    if (!prescriptions) return []

    if (!searchQuery.trim()) return prescriptions

    const query = searchQuery.toLowerCase()
    return prescriptions.filter(
      (prescription) =>
        prescription.patientFirstName.toLowerCase().includes(query) ||
        prescription.patientLastName.toLowerCase().includes(query) ||
        prescription.medecinFirstName.toLowerCase().includes(query) ||
        prescription.medecinLastName.toLowerCase().includes(query) ||
        prescription.diagnostic.toLowerCase().includes(query) ||
        prescription.recommandations.toLowerCase().includes(query),
    )
  }, [prescriptions, searchQuery])

  if (isLoading) {
    return <PrescriptionsLoading />
  }

  if (error) {
    return <PrescriptionsError error={error} onRetry={() => refetch()} />
  }

  return (
    <div className="space-y-6 relative">
      <PrescriptionsHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        totalCount={prescriptions?.length ?? 0}
        patients={mockPatients}
        doctors={mockDoctors}
      />
      <PrescriptionsGrid prescriptions={filteredPrescriptions} patients={mockPatients} doctors={mockDoctors} />

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
        patients={mockPatients}
        doctors={mockDoctors}
      />
    </div>
  )
}
