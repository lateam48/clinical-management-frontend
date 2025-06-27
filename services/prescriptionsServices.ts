import { apiClient } from "@/lib/axios"
import type {
  Prescription,
  CreatePrescriptionRequest,
  UpdatePrescriptionRequest,
  ApiResponse,
} from "@/types/prescription"

export const prescriptionsService = {
  // Get all prescriptions
  getAllPrescriptions: async (): Promise<Prescription[]> => {
    const response = await apiClient.get<Prescription[]>("/prescriptions/all")
    return response.data
  },

  // Get prescription by ID
  getPrescriptionById: async (id: number): Promise<Prescription> => {
    const response = await apiClient.get<ApiResponse<Prescription>>(`/prescriptions/${id}`)
    return response.data.data
  },

  // Create new prescription
  createPrescription: async (data: CreatePrescriptionRequest): Promise<Prescription> => {
    const response = await apiClient.post<ApiResponse<Prescription>>("/prescriptions/create", data)
    return response.data.data
  },

  // Update prescription
  updatePrescription: async (id: number, data: UpdatePrescriptionRequest): Promise<Prescription> => {
    const response = await apiClient.put<ApiResponse<Prescription>>(`/prescriptions/update/${id}`, data)
    return response.data.data
  },

  // Delete prescription
  deletePrescription: async (id: number): Promise<void> => {
    await apiClient.delete(`/prescriptions/delete/${id}`)
  },

  // Generate PDF
  generatePrescriptionPdf: async (id: number): Promise<Blob> => {
    const response = await apiClient.get(`/prescriptions/${id}/pdf`, {
      responseType: "blob",
    })
    return response.data
  },
}
