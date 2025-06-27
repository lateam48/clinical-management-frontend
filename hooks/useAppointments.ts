import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { appointmentService } from "@/services/appointmentService"
import { toast } from "sonner"
import type { AppointmentRequestDTO, AppointmentFilters } from "@/types/appointment"

// Hook pour lister les rendez-vous
export function useAppointments(page = 0, size = 10) {
  return useQuery({
    queryKey: ["appointments", page, size],
    queryFn: () => appointmentService.listAppointments(page, size),
    staleTime: 30000, // 30 secondes
  })
}

// Hook pour obtenir un rendez-vous par ID
export function useAppointment(id: number) {
  return useQuery({
    queryKey: ["appointment", id],
    queryFn: () => appointmentService.getAppointment(id),
    enabled: !!id,
  })
}

// Hook pour filtrer les rendez-vous
export function useFilteredAppointments(filters: AppointmentFilters, page = 0, size = 10) {
  return useQuery({
    queryKey: ["appointments", "filtered", filters, page, size],
    queryFn: () => appointmentService.filterAppointments(filters, page, size),
    enabled: !!(filters.doctor ?? filters.date ?? filters.room),
  })
}

// Hook pour obtenir les statuts
export function useAppointmentStatuses() {
  return useQuery({
    queryKey: ["appointment-statuses"],
    queryFn: () => appointmentService.getStatuses(),
    staleTime: Number.POSITIVE_INFINITY, // Les statuts ne changent pas
  })
}

// Hook pour obtenir des créneaux alternatifs
export function useAlternativeSlots(doctor: string, dateTime: string) {
  return useQuery({
    queryKey: ["alternative-slots", doctor, dateTime],
    queryFn: () => appointmentService.getAlternativeSlots(doctor, dateTime),
    enabled: !!(doctor && dateTime),
  })
}

// Hook pour créer un rendez-vous
export function useCreateAppointment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: AppointmentRequestDTO) => appointmentService.createAppointment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] })
      toast.success( "Succès", {
        description: "Rendez-vous créé avec succès",
      })
    },
    onError: (error: Error) => {
      toast.error("Erreur", {
        description: error.message || "Erreur lors de la création du rendez-vous",
      })
    },
  })
}

// Hook pour mettre à jour un rendez-vous
export function useUpdateAppointment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: AppointmentRequestDTO }) =>
      appointmentService.updateAppointment(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] })
      queryClient.invalidateQueries({ queryKey: ["appointment", id] })
      toast.success("Succès", {
        description: "Rendez-vous mis à jour avec succès",
      })
    },
    onError: (error: Error) => {
      toast.error("Erreur", {
        description: error.message || "Erreur lors de la mise à jour du rendez-vous",
      })
    },
  })
}

// Hook pour supprimer un rendez-vous
export function useDeleteAppointment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => appointmentService.deleteAppointment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] })
      toast.success("Succès", {
        description: "Rendez-vous supprimé avec succès",
      })
    },
    onError: (error: Error) => {
      toast.error("Erreur",   {
        description: error.message || "Erreur lors de la suppression du rendez-vous",
      })
    },
  })
}

// Hook pour annuler un rendez-vous
export function useCancelAppointment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, initiatedBy }: { id: number; initiatedBy: string }) =>
      appointmentService.cancelAppointment(id, initiatedBy),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] })
      toast.success("Succès", {
        description: "Rendez-vous annulé avec succès",
      })
    },
    onError: (error: Error) => {
      toast.error("Erreur", {
        description: error.message || "Erreur lors de l'annulation du rendez-vous",
      })
    },
  })
}
