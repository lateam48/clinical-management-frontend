"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card"
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
      <Card className="mb-6 w-full">
        <CardHeader>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-2">
              <FileText className="h-6 w-6 sm:h-8 sm:w-8" />
              <div>
                <CardTitle className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight">
                  Gestion des prescriptions
                </CardTitle>
                <CardDescription className="text-sm sm:text-base">
                  Gérez les prescriptions médicales dans le système ({totalCount} au total)
                </CardDescription>
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => setShowCreateDialog(true)} size="default" className="bg-primary hover:bg-primary/90 w-full sm:w-auto">
                <Plus className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Nouvelle prescription</span>
                <span className="sm:hidden">Nouvelle</span>
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="flex items-center space-x-2">
            <div className="relative flex-1 max-w-sm w-full">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher des prescriptions..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-8 w-full"
              />
            </div>
          </div>
        </CardContent>
      </Card>

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
