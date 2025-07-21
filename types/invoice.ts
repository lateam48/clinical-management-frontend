import { Patient } from "./patient"

export interface Invoice {
  id: number
  patient: InvoicePatientData
  amount: number
  issuedAt: string
  paid: boolean
  description: string
  datePaid: string
}

export interface InvoicePatientData {
  id: Patient['id']
  firstName: string
  lastName: string
}

export interface InvoiceRequestData {
  patientId: Patient['id']
  amount: number
  description: string
}