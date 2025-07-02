export interface Prescription {
    id: number
    diagnostic: string
    recommandations: string
    createdAt: string
    patientId: number
    patientFirstName: string
    patientLastName: string
    patientGender: "MALE" | "FEMALE"
    patientDateOfBirth: string
    medecinId: number
    medecinFirstName: string
    medecinLastName: string
  }
  
  export interface CreatePrescriptionRequest {
    diagnostic: string
    recommandations: string
    patientId: number
    medecinId: number
  }
  
  export interface UpdatePrescriptionRequest {
    diagnostic?: string
    recommandations?: string
    patientId?: number
    medecinId?: number
  }
  
  export interface ApiResponse<T> {
    message: string
    data: T
  }
  
  export interface Patient {
    id: number
    firstName: string
    lastName: string
    gender: "MALE" | "FEMALE"
    dateOfBirth: string
  }
  
  export interface Doctor {
    id: number
    firstName: string
    lastName: string
  }
  