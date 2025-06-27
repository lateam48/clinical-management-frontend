export interface Patient {
  id: number
  firstName: string
  lastName: string
  dateOfBirth: string
  gender: Gender

  address: string
  phoneNumber: string
  email: string

  medicalHistory: string
  allergies: string

  createdAt: string
  updatedAt: string
}

export type Gender = "MALE" | "FEMALE"

export interface PatientRequestData extends Omit<Patient, "id" | "createdAt" | "updatedAt"> {}

export interface PatientResponseData extends Omit<Patient, "createdAt" | "updatedAt"> {}