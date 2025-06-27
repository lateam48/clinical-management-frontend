"use client"

import { useState } from "react"
import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

import { AppointmentCard } from "./AppointmentCard"
import { AppointmentForm } from "./AppointmentForm"
import { AppointmentFilters } from "./AppointmentFilters"

import {
  useAppointments,
  useFilteredAppointments,
  useDeleteAppointment,
  useCancelAppointment,
} from "@/hooks/useAppointments"
import type { AppointmentResponseDTO, AppointmentFilters as FiltersType } from "@/types/appointment"
import { AppointmentsLoading } from "@/components/modules/dashboard/secretary/appointments/AppointmentsLoading"
import { AppointmentsError } from "@/components/modules/dashboard/secretary/appointments/AppointmentsError"
import { PaginationControls } from "@/components/ui/pagination-controls"

export function AppointmentsList() {
  const [page, setPage] = useState(0)
  const [filters, setFilters] = useState<FiltersType>({})
  const [showForm, setShowForm] = useState(false)
  const [editingAppointment, setEditingAppointment] = useState<AppointmentResponseDTO>()
  const [deletingId, setDeletingId] = useState<number>()
  const [cancellingId, setCancellingId] = useState<number>()

  const deleteAppointment = useDeleteAppointment()
  const cancelAppointment = useCancelAppointment()

  const hasFilters = !!(filters.doctor ?? filters.date ?? filters.room)

  // Call both hooks unconditionally to follow Rules of Hooks
  const {
    data: allAppointmentsData,
    isLoading: isLoadingAll,
    error: errorAll,
  } = useAppointments(page, 10)

  const {
    data: filteredAppointmentsData,
    isLoading: isLoadingFiltered,
    error: errorFiltered,
  } = useFilteredAppointments(filters, page, 10)

  // Choose which data to use based on filters
  const appointmentsData = hasFilters ? filteredAppointmentsData : allAppointmentsData
  const isLoading = hasFilters ? isLoadingFiltered : isLoadingAll
  const error = hasFilters ? errorFiltered : errorAll

  const handleEdit = (appointment: AppointmentResponseDTO) => {
    setEditingAppointment(appointment)
    setShowForm(true)
  }

  const handleDelete = async () => {
    if (deletingId) {
      await deleteAppointment.mutateAsync(deletingId)
      setDeletingId(undefined)
    }
  }

  const handleCancel = async () => {
    if (cancellingId) {
      await cancelAppointment.mutateAsync({
        id: cancellingId,
        initiatedBy: "SECRETARY",
      })
      setCancellingId(undefined)
    }
  }

  const handleFormSuccess = () => {
    setShowForm(false)
    setEditingAppointment(undefined)
  }

  const handleFormCancel = () => {
    setShowForm(false)
    setEditingAppointment(undefined)
  }

  const resetFilters = () => {
    setFilters({})
    setPage(0)
  }

  if (isLoading) return <AppointmentsLoading />
  if (error) return <AppointmentsError error={error} />

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Rendez-vous</h1>
          <p className="text-muted-foreground">Gérez les rendez-vous de la clinique</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nouveau Rendez-vous
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filtres */}
        <div className="lg:col-span-1">
          <AppointmentFilters filters={filters} onFiltersChange={setFilters} onReset={resetFilters} />
        </div>

        {/* Liste des rendez-vous */}
        <div className="lg:col-span-3 space-y-4">
          {appointmentsData?.content.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Aucun rendez-vous trouvé</p>
            </div>
          ) : (
            <>
              <div className="grid gap-4">
                {appointmentsData?.content.map((appointment) => (
                  <AppointmentCard
                    key={appointment.id}
                    appointment={appointment}
                    onEdit={handleEdit}
                    onDelete={setDeletingId}
                    onCancel={setCancellingId}
                  />
                ))}
              </div>

              {/* Pagination */}
              {appointmentsData && appointmentsData.totalPages > 1 && (
                <PaginationControls currentPage={page} totalPages={appointmentsData.totalPages} onPageChange={setPage} />
              )}
            </>
          )}
        </div>
      </div>

      {/* Dialog Formulaire */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{editingAppointment ? "Modifier le Rendez-vous" : "Nouveau Rendez-vous"}</DialogTitle>
          </DialogHeader>
          <AppointmentForm appointment={editingAppointment} onSuccess={handleFormSuccess} onCancel={handleFormCancel} />
        </DialogContent>
      </Dialog>

      {/* Dialog Suppression */}
      <AlertDialog open={!!deletingId} onOpenChange={() => setDeletingId(undefined)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer le rendez-vous</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer ce rendez-vous ? Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Dialog Annulation */}
      <AlertDialog open={!!cancellingId} onOpenChange={() => setCancellingId(undefined)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Annuler le rendez-vous</AlertDialogTitle>
            <AlertDialogDescription>Êtes-vous sûr de vouloir annuler ce rendez-vous ?</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Non</AlertDialogCancel>
            <AlertDialogAction onClick={handleCancel}>Oui, annuler</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
