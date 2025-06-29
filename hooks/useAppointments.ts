import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { appointmentService } from "@/services/appointmentService"
import { getErrorMessage } from "@/types/api-error"
import type { AppointmentUpdateDTO, AppointmentFilters } from "@/types/appointment"
import { format } from "date-fns"

const QUERY_KEYS = {
  appointments: ["appointments"] as const,
  appointment: (id: number) => ["appointments", id] as const,
  filtered: (filters: AppointmentFilters) => ["appointments", "filtered", filters] as const,
  conflict: (doctor: string, dateTime: string, excludeId?: number) =>
    ["appointments", "conflict", doctor, dateTime, excludeId] as const,
  alternatives: (doctor: string, dateTime: string) => ["appointments", "alternatives", doctor, dateTime] as const,
}

// Hook pour récupérer tous les rendez-vous
export function useAllAppointments() {
  return useQuery({
    queryKey: QUERY_KEYS.appointments,
    queryFn: appointmentService.getAll,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Hook pour récupérer les rendez-vous filtrés
export function useFilteredAppointments(filters: AppointmentFilters) {
  return useQuery({
    queryKey: QUERY_KEYS.filtered(filters),
    queryFn: () => appointmentService.getFiltered(filters),
    enabled: Object.values(filters).some(Boolean),
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

// Hook pour récupérer un rendez-vous par ID
export function useAppointment(id: number) {
  return useQuery({
    queryKey: QUERY_KEYS.appointment(id),
    queryFn: () => appointmentService.getById(id),
    enabled: !!id,
  })
}

// Hook pour créer un rendez-vous
export function useCreateAppointment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: appointmentService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.appointments })
      toast.success("Rendez-vous créé avec succès")
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error))
    },
  })
}

// Hook pour mettre à jour un rendez-vous
export function useUpdateAppointment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: AppointmentUpdateDTO }) => appointmentService.update(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.appointments })
      queryClient.setQueryData(QUERY_KEYS.appointment(data.id), data)
      toast.success("Rendez-vous modifié avec succès")
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error))
    },
  })
}

// Hook pour supprimer un rendez-vous
export function useDeleteAppointment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: appointmentService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.appointments })
      toast.success("Rendez-vous supprimé avec succès")
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error))
    },
  })
}

// Hook pour annuler un rendez-vous
export function useCancelAppointment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, initiatedBy, reason }: { id: number; initiatedBy: string; reason?: string }) =>
      appointmentService.cancel(id, initiatedBy, reason),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.appointments })
      queryClient.setQueryData(QUERY_KEYS.appointment(data.id), data)
      toast.success("Rendez-vous annulé avec succès")
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error))
    },
  })
}

// Hook pour vérifier les conflits de créneaux
export function useTimeSlotConflict(doctor: string, dateTime: string, excludeId?: number) {
  return useQuery({
    queryKey: QUERY_KEYS.conflict(doctor, dateTime, excludeId),
    queryFn: () => appointmentService.checkTimeSlotConflict(doctor, dateTime, excludeId),
    enabled: !!(doctor && dateTime),
    staleTime: 0, // Toujours frais pour les conflits
  })
}

// Hook pour obtenir des créneaux alternatifs
export function useAlternativeSlots(doctor: string, dateTime: string) {
  return useQuery({
    queryKey: QUERY_KEYS.alternatives(doctor, dateTime),
    queryFn: () => appointmentService.getAlternativeSlots(doctor, dateTime),
    enabled: !!(doctor && dateTime),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Hook pour marquer comme terminé
export function useMarkAsCompleted() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: appointmentService.markAsCompleted,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.appointments })
      queryClient.setQueryData(QUERY_KEYS.appointment(data.id), data)
      toast.success("Rendez-vous marqué comme terminé")
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error))
    },
  })
}

// Hook pour marquer comme absent
export function useMarkAsNoShow() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: appointmentService.markAsNoShow,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.appointments })
      queryClient.setQueryData(QUERY_KEYS.appointment(data.id), data)
      toast.success("Rendez-vous marqué comme absent")
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error))
    },
  })
}

export function useTodayAppointments() {
  const today = format(new Date(), "yyyy-MM-dd")
  return useQuery({
    queryKey: ["appointments", "today", today],
    queryFn: () => appointmentService.getFiltered({ date: today }),
  })
}
