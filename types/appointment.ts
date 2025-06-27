export interface AppointmentRequestDTO {
  dateTime: string // ISO string
  reason: string
  doctor: string
  room: string
  patientId: number
}

export interface AppointmentResponseDTO {
  id: number
  dateTime: string // ISO string
  reason: string
  doctor: string
  room: string
  patientId: number
  patientName: string
  status: AppointmentStatus
  cancellationInitiator?: string
  cancellationReason?: string
}

export type AppointmentStatus =
  | "SCHEDULED"
  | "COMPLETED"
  | "CANCELLED"
  | "LATE_CANCELLED"
  | "CLINIC_CANCELLED"
  | "NO_SHOW"

export interface AppointmentFilters {
  doctor?: string
  date?: string
  room?: string
}

export interface PaginatedResponse<T> {
  content: T[]
  totalElements: number
  totalPages: number
  size: number
  number: number
  first: boolean
  last: boolean
}

export interface AlternativeSlot {
  dateTime: string
}
export interface AppointmentSlot {
  dateTime: string // ISO string
  reason: string
  doctor: string
  room: string
}