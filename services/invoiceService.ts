import { apiClient } from "@/lib/axios"
import { Invoice, InvoiceRequestData } from "@/types/invoice"
import { Patient } from "@/types/patient"

const BASE_URL = '/invoices'

export const invoiceService = {
  getById: async (id: Invoice['id']) => {
    const response = await apiClient.get<Invoice>(`${BASE_URL}/${id}`)
    return response.data
  },
  update: async (id: Invoice['id'], data: InvoiceRequestData) => {
    const response = await apiClient.put<Invoice>(`${BASE_URL}/${id}`, data)
    return response.data
  },
  delete: async (id: Invoice['id']) => {
    const response = await apiClient.delete(`${BASE_URL}/${id}`)
    return response.data
  },
  pay: async (id: Invoice['id']) => {
    const response = await apiClient.put<Invoice>(`${BASE_URL}/${id}/pay`)
    return response.data
  },
  getAll: async () => {
    const response = await apiClient.get<Invoice[]>(`${BASE_URL}`)
    return response.data
  },
  create: async (data: InvoiceRequestData) => {
    const response = await apiClient.post<Invoice>(`${BASE_URL}`,data)
    return response.data
  },
  getUnpaid: async () => {
    const response = await apiClient.get<Invoice[]>(`${BASE_URL}/unpaid`)
    return response.data
  },
  getTotalPaid: async () => {
    const response = await apiClient.get<number>(`${BASE_URL}/total-paid`)
    return response.data
  },
  getByPatient: async (patientId: Patient['id']) => {
    const response = await apiClient.get<Invoice[]>(`${BASE_URL}/patient/${patientId}`)
    return response.data
  },
  getPaid: async () => {
    const response = await apiClient.get<Invoice[]>(`${BASE_URL}/paid`)
    return response.data
  }
}