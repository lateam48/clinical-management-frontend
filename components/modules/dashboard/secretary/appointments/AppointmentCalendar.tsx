"use client"

import { useState, useCallback, useEffect, useMemo } from "react"
import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid"
import timeGridPlugin from "@fullcalendar/timegrid"
import interactionPlugin from "@fullcalendar/interaction"
import listPlugin from "@fullcalendar/list"
import frLocale from "@fullcalendar/core/locales/fr"
import type { EventClickArg, DateSelectArg, EventDropArg, EventContentArg } from "@fullcalendar/core"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Calendar, Clock, User, MapPin, Filter } from "lucide-react"

import { AppointmentForm } from "./AppointmentForm"
import { AppointmentDetails } from "./AppointmentDetails"
import { ConflictNotification } from "./ConflictNotification"

import {
  useAllAppointments,
  useUpdateAppointment,
  useTimeSlotConflict,
} from "@/hooks/useAppointments"
import type { AppointmentResponseDTO, CalendarEvent, CalendarView } from "@/types/appointment"
import { useStaff } from "@/hooks/useUsers"

// Définir la fonction en dehors du composant
function renderEventContent(eventInfo: EventContentArg) {
  return (
    <div className="p-1 text-xs">
      <div className="font-medium truncate">{eventInfo.event.extendedProps.patientName}</div>
      <div className="flex items-center gap-1 text-xs opacity-90">
        <Clock className="h-3 w-3" />
        {eventInfo.timeText}
      </div>
      <div className="flex items-center gap-1 text-xs opacity-90">
        <MapPin className="h-3 w-3" />
        {eventInfo.event.extendedProps.room}
      </div>
    </div>
  )
}

export function AppointmentCalendar() {
  // 1. States
  const [currentView, setCurrentView] = useState<CalendarView["type"]>("timeGridWeek")
  const [selectedDoctor, setSelectedDoctor] = useState<string>("")
  const [selectedRoom, setSelectedRoom] = useState<string>("")
  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentResponseDTO>()
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [selectedSlot, setSelectedSlot] = useState<{ start: Date; end: Date }>()
  const [conflictCheck, setConflictCheck] = useState<{
    doctor: string
    dateTime: string
    show: boolean
  }>({ doctor: "", dateTime: "", show: false })
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  // 2. Hooks (toujours AVANT tout return ou condition)
  const { data: appointments, isLoading, refetch } = useAllAppointments()
  const updateAppointment = useUpdateAppointment()

  const { getStaff } = useStaff({ role: 'DOCTOR' })
  const { data: doctors, isLoading: doctorsLoading, error: doctorsError } = getStaff

  

  const { data: conflictData } = useTimeSlotConflict(
    conflictCheck.doctor,
    conflictCheck.dateTime,
    selectedAppointment?.id,
  )

  // 3. Constantes
  const rooms = useMemo(() => ["Salle 101", "Salle 102", "Salle 103", "Salle 201", "Salle 202"], [])
  const calendarViews: CalendarView[] = useMemo(() => [
    { type: "dayGridMonth", title: "Mois" },
    { type: "timeGridWeek", title: "Semaine" },
    { type: "timeGridDay", title: "Jour" },
    { type: "listWeek", title: "Liste" },
  ], [])
  const statusColors = useMemo(() => ({
    SCHEDULED: { bg: "#3b82f6", border: "#2563eb", text: "#ffffff" },
    COMPLETED: { bg: "#10b981", border: "#059669", text: "#ffffff" },
    CANCELLED: { bg: "#ef4444", border: "#dc2626", text: "#ffffff" },
    LATE_CANCELLED: { bg: "#f59e0b", border: "#d97706", text: "#ffffff" },
    CLINIC_CANCELLED: { bg: "#8b5cf6", border: "#7c3aed", text: "#ffffff" },
    NO_SHOW: { bg: "#6b7280", border: "#4b5563", text: "#ffffff" },
  } as const), [])

  const statusLabels = {
    SCHEDULED: "Programmé",
    COMPLETED: "Terminé",
    CANCELLED: "Annulé",
    LATE_CANCELLED: "Annulé tardivement",
    CLINIC_CANCELLED: "Annulé par la clinique",
    NO_SHOW: "Absent",
  } as const

  // Fonction pour obtenir le nom du médecin à partir de son ID
  /**
   * Retourne le nom complet du médecin à partir de son ID.
   * @param doctorId L'identifiant du médecin (string ou number)
   * @returns Le nom complet du médecin ou un message d'erreur.
   */
  const getDoctorName = useCallback(
    (doctorId: string | number | undefined | null): string => {
      if (!doctorId) return "Médecin inconnu"
      if (doctorsLoading) return "Chargement..."
      if (!doctors) return "Médecin inconnu"
      const doctor = doctors.find(d => d.id === Number(doctorId))
      console.log('doctorId:', doctorId, 'typeof:', typeof doctorId, 'doctors:', doctors, 'doctor trouvé:', doctor)
      return doctor ? `${doctor.firstName} ${doctor.lastName}` : "Médecin non trouvé"
    },
    [doctors, doctorsLoading]
  )

  // 4. Mémorisation des events (évite surcharge)
  const calendarEvents: CalendarEvent[] = useMemo(() =>
    (appointments?.filter(a =>
      (!statusFilter || a.status === statusFilter) &&
      (!selectedDoctor || a.doctorId === selectedDoctor) &&
      (!selectedRoom || a.room === selectedRoom) &&
      (
        !selectedDate ||
        (new Date(a.dateTime).toDateString() === new Date(selectedDate).toDateString())
      )
    ) || []).map((appointment) => {
      const startDate = new Date(appointment.dateTime)
      const endDate = new Date(startDate.getTime() + 30 * 60000) // 30 minutes par défaut
      const colors = statusColors[appointment.status] || statusColors.SCHEDULED
      const doctorName = getDoctorName(appointment.doctorId)
      return {
        id: appointment.id.toString(),
        title: `${appointment.patientName} - ${doctorName}`,
        start: startDate.toISOString(),
        end: endDate.toISOString(),
        backgroundColor: colors.bg,
        borderColor: colors.border,
        textColor: colors.text,
        extendedProps: {
          appointment,
          doctor: doctorName,
          room: appointment.room,
          patientName: appointment.patientName,
          reason: appointment.reason,
          status: appointment.status,
        },
      }
    }) || [],
    [appointments, statusColors, getDoctorName, statusFilter, selectedDoctor, selectedRoom, selectedDate]
  )

  // 5. Callbacks
  const handleDateSelect = useCallback((selectInfo: DateSelectArg) => {
    setSelectedSlot({
      start: selectInfo.start,
      end: selectInfo.end,
    })
    setSelectedAppointment(undefined)
    setIsFormOpen(true)
  }, [])

  const handleEventClick = useCallback((clickInfo: EventClickArg) => {
    const appointment = clickInfo.event.extendedProps.appointment as AppointmentResponseDTO
    setSelectedAppointment(appointment)
    setIsDetailsOpen(true)
  }, [])

  const handleEventDrop = useCallback(
    async (dropInfo: EventDropArg) => {
      const appointment = dropInfo.event.extendedProps.appointment as AppointmentResponseDTO
      const newDateTime = dropInfo.event.start
      if (!newDateTime) return
      setConflictCheck({
        doctor: appointment.doctor,
        dateTime: newDateTime.toISOString(),
        show: true,
      })
      try {
        await updateAppointment.mutateAsync({
          id: appointment.id,
          data: {
            dateTime: newDateTime.toISOString(),
            reason: appointment.reason,
            doctorId: appointment.doctorId,
            room: appointment.room,
            patientId: appointment.patientId,
            status: appointment.status,
          },
        })
      } catch (error: unknown) {
        dropInfo.revert()
        console.error("Event drop error:", error)
      }
    },
    [updateAppointment]
  )

  // 6. Effets
  useEffect(() => {
    if (conflictData?.hasConflict && conflictCheck.show) {
      setConflictCheck((prev) => ({ ...prev, show: false }))
    }
  }, [conflictData, conflictCheck.show])

  // 7. Fonctions utilitaires
  const handleFormSuccess = useCallback((): void => {
    setIsFormOpen(false)
    setSelectedAppointment(undefined)
    setSelectedSlot(undefined)
    refetch()
  }, [refetch])

  const handleFormCancel = useCallback((): void => {
    setIsFormOpen(false)
    setSelectedAppointment(undefined)
    setSelectedSlot(undefined)
  }, [])

  const resetFilters = useCallback((): void => {
    setSelectedDoctor("")
    setSelectedRoom("")
    setSelectedDate(null)
  }, [])

  // Obtenir le nom du médecin sélectionné pour l'affichage
  const selectedDoctorName = useMemo(() => {
    if (!selectedDoctor) return ""
    return getDoctorName(selectedDoctor)
  }, [selectedDoctor, getDoctorName])

  // 8. Loading/erreur
  if (doctorsLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-96">
          <div className="text-center">
            <User className="h-12 w-12 mx-auto mb-4 text-muted-foreground animate-pulse" />
            <p className="text-muted-foreground">Chargement des médecins...</p>
          </div>
        </CardContent>
      </Card>
    )
  }
  
  if (doctorsError) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-96">
          <div className="text-center">
            <User className="h-12 w-12 mx-auto mb-4 text-destructive" />
            <p className="text-destructive">Erreur lors du chargement des médecins</p>
            <p className="text-sm text-muted-foreground mt-2">
              {doctorsError.message ?? "Impossible de récupérer la liste des médecins"}
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }
  
  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-96">
          <div className="text-center">
            <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground animate-pulse" />
            <p className="text-muted-foreground">Chargement du calendrier...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  // 9. Rendu principal
  return (
    <div className="space-y-6">
      {/* Header avec filtres */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Calendrier des Rendez-vous
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 items-center justify-between">
            {/* Filtres */}
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <span className="text-sm font-medium">Filtres:</span>
              </div>
              <Select value={selectedDoctor} onValueChange={setSelectedDoctor}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Médecin">
                    {selectedDoctorName || "Médecin"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {doctors && doctors.length > 0 ? (
                    doctors.map((doctor) => (
                      <SelectItem key={doctor.id} value={doctor.id.toString()}>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          {doctor.firstName} {doctor.lastName}
                        </div>
                      </SelectItem>
                    ))
                  ) : (
                    <div className="p-2 text-sm text-muted-foreground">
                      Aucun médecin disponible
                    </div>
                  )}
                </SelectContent>
              </Select>
              <Select value={selectedRoom} onValueChange={setSelectedRoom}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Salle" />
                </SelectTrigger>
                <SelectContent>
                  {rooms.map((room) => (
                    <SelectItem key={room} value={room}>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        {room}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {(selectedDoctor || selectedRoom) && (
                <Button variant="outline" size="sm" onClick={resetFilters}>
                  Réinitialiser
                </Button>
              )}
            </div>
            {/* Vues du calendrier */}
            <div className="flex gap-2">
              {calendarViews.map((view) => (
                <Button
                  key={view.type}
                  variant={currentView === view.type ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentView(view.type)}
                >
                  {view.title}
                </Button>
              ))}
            </div>
          </div>
          {/* Légende des statuts cliquables */}
          <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t">
            <span className="text-sm font-medium">Statuts:</span>
            {Object.entries(statusColors).map(([status, colors]) => (
              <Badge
                key={status}
                style={{
                  backgroundColor: colors.bg,
                  borderColor: colors.border,
                  color: colors.text,
                  cursor: "pointer",
                  opacity: statusFilter && statusFilter !== status ? 0.5 : 1,
                }}
                className={`text-xs ${statusFilter === status ? "ring-2 ring-primary" : ""}`}
                onClick={() => setStatusFilter(statusFilter === status ? undefined : status)}
              >
                {statusLabels[status as keyof typeof statusLabels]}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
      {/* Notification de conflit */}
      {conflictData?.hasConflict && (
        <ConflictNotification
          conflict={conflictData}
          onClose={() => setConflictCheck((prev) => ({ ...prev, show: false }))}
        />
      )}
      {/* Calendrier */}
      <Card>
        <CardContent className="p-6">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "",
            }}
            initialView={currentView}
            locale={frLocale}
            events={calendarEvents}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            weekends={false}
            slotMinTime="08:00:00"
            slotMaxTime="19:00:00"
            slotDuration="00:30:00"
            slotLabelInterval="01:00:00"
            height="auto"
            editable={true}
            droppable={true}
            eventResizableFromStart={false}
            eventDurationEditable={false}
            select={handleDateSelect}
            eventClick={handleEventClick}
            eventDrop={handleEventDrop}
            eventContent={renderEventContent}
            businessHours={{
              daysOfWeek: [1, 2, 3, 4, 5],
              startTime: "08:00",
              endTime: "18:00",
            }}
            selectConstraint="businessHours"
            eventConstraint="businessHours"
          />
        </CardContent>
      </Card>
      {/* Dialog Formulaire */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedAppointment ? "Modifier le rendez-vous" : "Nouveau rendez-vous"}</DialogTitle>
          </DialogHeader>
          <AppointmentForm
            appointment={selectedAppointment}
            selectedSlot={selectedSlot}
            onSuccess={handleFormSuccess}
            onCancel={handleFormCancel}
          />
        </DialogContent>
      </Dialog>
      {/* Dialog Détails */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Détails du rendez-vous</DialogTitle>
          </DialogHeader>
          {selectedAppointment && (
            <AppointmentDetails
              appointment={selectedAppointment}
              onEdit={() => {
                setIsDetailsOpen(false)
                setIsFormOpen(true)
              }}
              onClose={() => setIsDetailsOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
