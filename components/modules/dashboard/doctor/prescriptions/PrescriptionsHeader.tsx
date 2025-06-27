"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search, FileText } from "lucide-react"
import { PrescriptionForm } from "./PrescriptionForm"
import type { Patient, Doctor } from "@/types/prescription"

interface PrescriptionsHeaderProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  totalCount: number
  patients?: Patient[]
  doctors?: Doctor[]
}

export function PrescriptionsHeader({
  searchQuery,
  onSearchChange,
  totalCount,
  patients = [],
  doctors = [],
}: PrescriptionsHeaderProps) {
  const [showCreateDialog, setShowCreateDialog] = useState(false)

  return (
    <>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <FileText className="h-8 w-8" />
            Gestion des prescriptions
          </h1>
          <p className="text-muted-foreground">
            Gérez les prescriptions médicales dans le système ({totalCount} au total)
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setShowCreateDialog(true)} size="default" className="bg-primary hover:bg-primary/90">
            <Plus className="mr-2 h-4 w-4" />
            Nouvelle prescription
          </Button>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher des prescriptions..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      <PrescriptionForm
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        mode="create"
        patients={patients}
        doctors={doctors}
      />
    </>
  )
}
