import { apiClient } from "@/lib/axios"
import type {
  AppointmentRequestDTO,
  AppointmentResponseDTO,
  AppointmentFilters,
  PaginatedResponse,
  AppointmentStatus,
} from "@/types/appointment"

export const appointmentService = {
  // Créer un rendez-vous
  async createAppointment(data: AppointmentRequestDTO): Promise<AppointmentResponseDTO> {
    const response = await apiClient.post("/appointments", data)
    return response.data
  },

  // Obtenir un rendez-vous par ID
  async getAppointment(id: number): Promise<AppointmentResponseDTO> {
    const response = await apiClient.get(`/appointments/${id}`)
    return response.data
  },

  // Lister les rendez-vous avec pagination
  async listAppointments(page = 0, size = 10): Promise<PaginatedResponse<AppointmentResponseDTO>> {
    const response = await apiClient.get("/appointments", {
      params: { page, size },
    })
    return response.data
  },

  // Mettre à jour un rendez-vous
  async updateAppointment(id: number, data: AppointmentRequestDTO): Promise<AppointmentResponseDTO> {
    const response = await apiClient.put(`/appointments/${id}`, data)
    return response.data
  },

  // Supprimer un rendez-vous
  async deleteAppointment(id: number): Promise<void> {
    await apiClient.delete(`/appointments/${id}`)
  },

  // Annuler un rendez-vous
  async cancelAppointment(id: number, initiatedBy: string): Promise<string> {
    const response = await apiClient.post(`/appointments/${id}/cancel`, null, {
      params: { initiatedBy },
    })
    return response.data
  },

  // Filtrer les rendez-vous
  async filterAppointments(
    filters: AppointmentFilters,
    page = 0,
    size = 10,
  ): Promise<PaginatedResponse<AppointmentResponseDTO>> {
    const response = await apiClient.get("/appointments/filter", {
      params: { ...filters, page, size },
    })
    return response.data
  },

  // Obtenir les statuts disponibles
  async getStatuses(): Promise<AppointmentStatus[]> {
    const response = await apiClient.get("/appointments/statuses")
    return response.data
  },

  // Obtenir des créneaux alternatifs
  async getAlternativeSlots(doctor: string, dateTime: string): Promise<string[]> {
    const response = await apiClient.get("/appointments/alternatives", {
      params: { doctor, dateTime },
    })
    return response.data
  },
}
