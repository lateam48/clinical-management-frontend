import { apiClient } from "@/lib/axios"
import type {
  AppointmentResponseDTO,
  AppointmentCreateDTO,
  AppointmentUpdateDTO,
  AppointmentFilters,
  TimeSlotConflict,
} from "@/types/appointment"

export const appointmentService = {
  // Récupérer tous les rendez-vous
  getAll: async (): Promise<AppointmentResponseDTO[]> => {
    const response = await apiClient.get("/appointments")
    return response.data.content
  },

  // Récupérer les rendez-vous avec filtres
  getFiltered: async (filters: AppointmentFilters): Promise<AppointmentResponseDTO[]> => {
    const params = new URLSearchParams()

    if (filters.doctor) params.append("doctorId", filters.doctor)
    if (filters.date) params.append("date", filters.date)
    if (filters.room) params.append("room", filters.room)
    if (filters.status) params.append("status", filters.status)

    const response = await apiClient.get(`/appointments?${params.toString()}`)
    return response.data.content
  },

  // Récupérer un rendez-vous par ID
  getById: async (id: number): Promise<AppointmentResponseDTO> => {
    const response = await apiClient.get(`/appointments/${id}`)
    return response.data
  },

  // Créer un nouveau rendez-vous
  create: async (data: AppointmentCreateDTO): Promise<AppointmentResponseDTO> => {
    const response = await apiClient.post("/appointments", data)
    return response.data
  },

  // Mettre à jour un rendez-vous
  update: async (id: number, data: AppointmentUpdateDTO): Promise<AppointmentResponseDTO> => {
    const response = await apiClient.put(`/appointments/${id}`, data)
    return response.data
  },

  // Supprimer un rendez-vous
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/appointments/${id}`)
  },

  // Annuler un rendez-vous
  cancel: async (id: number, initiatedBy: string, reason?: string): Promise<AppointmentResponseDTO> => {
    const params = new URLSearchParams({ initiatedBy })
    if (reason) params.append("reason", reason)
    const response = await apiClient.post(`/appointments/${id}/cancel?${params.toString()}`)
    return response.data
  },

  // Vérifier les conflits de créneaux
  checkTimeSlotConflict: async (doctor: string, dateTime: string, excludeId?: number): Promise<TimeSlotConflict> => {
    const params = new URLSearchParams({
      doctor,
      dateTime,
    })

    if (excludeId) {
      params.append("excludeId", excludeId.toString())
    }

    const response = await apiClient.get(`/appointments/check-conflict?${params.toString()}`)
    return response.data
  },

  // Obtenir des créneaux alternatifs
  getAlternativeSlots: async (doctor: string, dateTime: string): Promise<string[]> => {
    const params = new URLSearchParams({
      doctor,
      dateTime,
    })

    const response = await apiClient.get(`/appointments/alternative-slots?${params.toString()}`)
    return response.data
  },

  // Marquer comme terminé
  markAsCompleted: async (id: number): Promise<AppointmentResponseDTO> => {
    const response = await apiClient.put(`/appointments/${id}/complete`)
    return response.data
  },

  // Marquer comme absent
  markAsNoShow: async (id: number): Promise<AppointmentResponseDTO> => {
    const response = await apiClient.put(`/appointments/${id}`, { status: "NO_SHOW" })
    return response.data
  },
}
