export interface AppointmentResponseDTO {
  id: number
  dateTime: string
  reason: string
  doctorId: string  // ID du médecin (pour compatibilité)
  doctor: string    // ID du médecin (utilisé par l'API)
  room: string
  patientId: number
  patientName: string
  status: "SCHEDULED" | "COMPLETED" | "CANCELLED" | "LATE_CANCELLED" | "CLINIC_CANCELLED" | "NO_SHOW"
  cancellationInitiator?: string
  cancellationReason?: string
  createdAt: string
  updatedAt: string
}

export interface AppointmentCreateDTO {
  dateTime: string
  reason: string
  doctorId: string
  room: string
  patientId: number
  status?: string
}

export interface AppointmentUpdateDTO {
  dateTime: string
  reason: string
  doctorId: string
  room: string
  patientId: number
  status?: string
}

export interface AppointmentFilters {
  doctor?: string
  date?: string
  room?: string
  status?: string
}

export interface TimeSlotConflict {
  hasConflict: boolean
  message: string
  conflictingAppointments: AppointmentResponseDTO[]
}

export interface CalendarEvent {
  id: string
  title: string
  start: string
  end: string
  backgroundColor: string
  borderColor: string
  textColor: string
  extendedProps: {
    appointment: AppointmentResponseDTO
    doctor: string
    room: string
    patientName: string
    reason: string
    status: string
  }
}

export interface CalendarView {
  type: "dayGridMonth" | "timeGridWeek" | "timeGridDay" | "listWeek"
  title: string
}

export enum AppointmentStatus {
  SCHEDULED = "SCHEDULED",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
  LATE_CANCELLED = "LATE_CANCELLED",
  CLINIC_CANCELLED = "CLINIC_CANCELLED",
  NO_SHOW = "NO_SHOW",
}

export const AppointmentStatusLabels: Record<AppointmentStatus, string> = {
  [AppointmentStatus.SCHEDULED]: "Programmé",
  [AppointmentStatus.COMPLETED]: "Terminé",
  [AppointmentStatus.CANCELLED]: "Annulé",
  [AppointmentStatus.LATE_CANCELLED]: "Annulé tardivement",
  [AppointmentStatus.CLINIC_CANCELLED]: "Annulé par la clinique",
  [AppointmentStatus.NO_SHOW]: "Absent",
};

export const AppointmentStatusColors: Record<AppointmentStatus, string> = {
  [AppointmentStatus.SCHEDULED]: "bg-blue-100 text-blue-800 border-blue-200",
  [AppointmentStatus.COMPLETED]: "bg-green-100 text-green-800 border-green-200",
  [AppointmentStatus.CANCELLED]: "bg-red-100 text-red-800 border-red-200",
  [AppointmentStatus.LATE_CANCELLED]: "bg-orange-100 text-orange-800 border-orange-200",
  [AppointmentStatus.CLINIC_CANCELLED]: "bg-purple-100 text-purple-800 border-purple-200",
  [AppointmentStatus.NO_SHOW]: "bg-gray-100 text-gray-800 border-gray-200",
};

export const DOCTOR_FILTER_ALL = "all"
