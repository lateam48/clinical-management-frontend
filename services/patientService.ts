import { apiClient } from '@/lib/axios';
import { Patient, PatientRequestData, PatientResponseData } from '@/types/patient';
const BASE_URL = '/patients'

export const patientService = {
  getAll: async () => {
    const response = await apiClient.get<PatientResponseData[]>(`${BASE_URL}`)
    return response.data
  },
  create: async (data: PatientRequestData) => {
    const response = await apiClient.post<PatientResponseData>(`${BASE_URL}`, data)
    return response.data
  },
  getById: async (id: Patient['id']) => {
    const response = await apiClient.get<PatientResponseData>(`${BASE_URL}/${id}`)
    return response.data
  },
  update: async (id: Patient['id'], data: PatientRequestData) => {
    const response = await apiClient.put<PatientResponseData>(`${BASE_URL}/${id}`, data)
    return response.data
  },
  delete: async (id: Patient['id']) => {
    const response = await apiClient.delete(`${BASE_URL}/${id}`)
    return response.data
  }
}