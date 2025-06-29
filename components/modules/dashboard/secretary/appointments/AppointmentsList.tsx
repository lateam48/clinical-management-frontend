"use client"

import { useState } from "react"
import { Plus, Calendar, Filter } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { AppointmentCard } from "./AppointmentCard"
import { AppointmentForm } from "./AppointmentForm"
import { AppointmentFiltersComponent } from "./AppointmentFilters"
import { AppointmentsLoading } from "@/components/modules/dashboard/secretary/appointments/AppointmentsLoading"
import { AppointmentsError } from "@/components/modules/dashboard/secretary/appointments/AppointmentsError"

import { useAllAppointments, useFilteredAppointments } from "@/hooks/useAppointments"
import type { AppointmentResponseDTO, AppointmentFilters } from "@/types/appointment"

export function AppointmentsList() {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentResponseDTO>()
  const [filters, setFilters] = useState<AppointmentFilters>({})
  const [activeTab, setActiveTab] = useState("all")

  const { data: allAppointments, isLoading, error, refetch } = useAllAppointments()
  const { data: filteredAppointments } = useFilteredAppointments(filters)

  // Debug : vérifier la structure des données
  console.log("allAppointments:", allAppointments)
  console.log("Type of allAppointments:", typeof allAppointments)
  console.log("Is array:", Array.isArray(allAppointments))

  // Fonction utilitaire pour s'assurer qu'on a un tableau
  const ensureArray = (
    data: AppointmentResponseDTO[] | { data?: AppointmentResponseDTO[]; appointments?: AppointmentResponseDTO[]; content?: AppointmentResponseDTO[] } | undefined
  ): AppointmentResponseDTO[] => {
    if (Array.isArray(data)) return data
    if (data && typeof data === 'object' && Array.isArray(data.content)) return data.content
    if (data && typeof data === 'object' && Array.isArray(data.data)) return data.data
    if (data && typeof data === 'object' && Array.isArray(data.appointments)) return data.appointments
    return []
  }

  const safeAllAppointments = ensureArray(allAppointments)
  const safeFilteredAppointments = ensureArray(filteredAppointments)
  
  const appointments = Object.values(filters).some(Boolean) ? safeFilteredAppointments : safeAllAppointments

  const handleCreateNew = (): void => {
    setSelectedAppointment(undefined)
    setIsFormOpen(true)
  }

  const handleEdit = (appointment: AppointmentResponseDTO): void => {
    setSelectedAppointment(appointment)
    setIsFormOpen(true)
  }

  const handleFormSuccess = (): void => {
    setIsFormOpen(false)
    setSelectedAppointment(undefined)
    refetch()
  }

  const handleFormCancel = (): void => {
    setIsFormOpen(false)
    setSelectedAppointment(undefined)
  }

  const handleSearch = (): void => {
    // La recherche est automatique via useFilteredAppointments
  }

  const handleResetFilters = (): void => {
    setFilters({})
  }

  // Filtrer par statut selon l'onglet actif
  const getFilteredByTab = (appointments: AppointmentResponseDTO[] | undefined) => {
    if (!appointments) return []

    switch (activeTab) {
      case "scheduled":
        return appointments.filter((apt) => apt.status === "SCHEDULED")
      case "completed":
        return appointments.filter((apt) => apt.status === "COMPLETED")
      case "cancelled":
        return appointments.filter(
          (apt) => apt.status === "CANCELLED" || apt.status === "LATE_CANCELLED" || apt.status === "CLINIC_CANCELLED",
        )
      default:
        return appointments
    }
  }

  const tabAppointments = getFilteredByTab(appointments)

  if (isLoading) {
    return <AppointmentsLoading />
  }

  if (error) {
    return <AppointmentsError error={error} onRetry={refetch} />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Rendez-vous</h1>
          <p className="text-muted-foreground">Gérez les rendez-vous des patients</p>
        </div>
        <Button onClick={handleCreateNew} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Nouveau rendez-vous
        </Button>
      </div>

      {/* Filtres */}
      <AppointmentFiltersComponent
        filters={filters}
        onFiltersChange={setFilters}
        onSearch={handleSearch}
        onReset={handleResetFilters}
      />

      {/* Onglets et liste */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Liste des rendez-vous
          </CardTitle>
          <CardDescription>
            {tabAppointments.length} rendez-vous trouvé{tabAppointments.length > 1 ? "s" : ""}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">Tous ({safeAllAppointments.length})</TabsTrigger>
              <TabsTrigger value="scheduled">
                Programmés ({safeAllAppointments.filter((apt) => apt.status === "SCHEDULED").length})
              </TabsTrigger>
              <TabsTrigger value="completed">
                Terminés ({safeAllAppointments.filter((apt) => apt.status === "COMPLETED").length})
              </TabsTrigger>
              <TabsTrigger value="cancelled">
                Annulés (
                {safeAllAppointments.filter(
                  (apt) =>
                    apt.status === "CANCELLED" || apt.status === "LATE_CANCELLED" || apt.status === "CLINIC_CANCELLED",
                ).length}
                )
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-6">
              {tabAppointments.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">Aucun rendez-vous trouvé</h3>
                  <p className="text-muted-foreground mb-4">
                    {Object.values(filters).some(Boolean)
                      ? "Aucun rendez-vous ne correspond aux filtres sélectionnés."
                      : "Commencez par créer votre premier rendez-vous."}
                  </p>
                  {Object.values(filters).some(Boolean) ? (
                    <Button variant="outline" onClick={handleResetFilters}>
                      <Filter className="h-4 w-4 mr-2" />
                      Réinitialiser les filtres
                    </Button>
                  ) : (
                    <Button onClick={handleCreateNew}>
                      <Plus className="h-4 w-4 mr-2" />
                      Nouveau rendez-vous
                    </Button>
                  )}
                </div>
              ) : (
                <div className="grid gap-4">
                  {tabAppointments.map((appointment) => (
                    <AppointmentCard key={appointment.id} appointment={appointment} onEdit={handleEdit} />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Dialog Formulaire */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedAppointment ? "Modifier le rendez-vous" : "Nouveau rendez-vous"}</DialogTitle>
          </DialogHeader>
          <AppointmentForm
            appointment={selectedAppointment}
            onSuccess={handleFormSuccess}
            onCancel={handleFormCancel}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
