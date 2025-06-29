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
