import { apiClient } from "@/lib/axios"
import type { HospitalInfo, CreateHospitalInfoRequest, UpdateHospitalInfoRequest } from "@/types/hospital"

export const hospitalService = {
  // Get all hospital information
  getAllHospitalInfo: async (): Promise<HospitalInfo[]> => {
    const response = await apiClient.get<HospitalInfo[]>("/hospital/info")
    return response.data
  },

  // Create hospital information with logo
  createHospitalInfo: async (data: CreateHospitalInfoRequest): Promise<HospitalInfo> => {
    const formData = new FormData()

    if (data.name) formData.append("name", data.name)
    if (data.address) formData.append("address", data.address)
    if (data.phone) formData.append("phone", data.phone)
    if (data.email) formData.append("email", data.email)
    if (data.logo) formData.append("logo", data.logo)

    const response = await apiClient.post<HospitalInfo>("/hospital/info", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    return response.data
  },

  // Update hospital information with logo
  updateHospitalInfo: async (id: number, data: UpdateHospitalInfoRequest): Promise<HospitalInfo> => {
    const formData = new FormData()

    if (data.name) formData.append("name", data.name)
    if (data.address) formData.append("address", data.address)
    if (data.phone) formData.append("phone", data.phone)
    if (data.email) formData.append("email", data.email)
    if (data.logo) formData.append("logo", data.logo)

    const response = await apiClient.put<HospitalInfo>(`/hospital/info/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    return response.data
  },

  // Delete hospital information
  deleteHospitalInfo: async (): Promise<void> => {
    await apiClient.delete("/hospital/info")
  },

  // Get logo URL for display
  getLogoUrl: (logoPath: string): string => {
    if (!logoPath) return ""
    // Assuming you have a base URL for your MinIO or file storage
    return `${process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:9090"}/files/${logoPath}`
  },
}
