"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { CalendarIcon, Clock, User, MapPin, FileText, AlertTriangle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { cn } from "@/lib/utils"

import { ConflictNotification } from "@/components/modules/dashboard/secretary/appointments/ConflictNotification"
import {
  useCreateAppointment,
  useUpdateAppointment,
  useAlternativeSlots,
  useTimeSlotConflict,
} from "@/hooks/useAppointments"
import type { AppointmentResponseDTO } from "@/types/appointment"
import { usePatients } from "@/hooks/usePatients"
import { useStaff } from "@/hooks/useUsers"

const appointmentSchema = z.object({
  dateTime: z.string().min(1, "La date et l'heure sont requises"),
  reason: z.string().min(1, "La raison est requise").max(200, "Maximum 200 caractères"),
  doctorId: z.string().min(1, "Le médecin est requis"),
  room: z.string().min(1, "La salle est requise"),
  patientId: z.number().min(1, "Le patient est requis"),
})

type AppointmentFormData = z.infer<typeof appointmentSchema>

interface AppointmentFormProps {
  appointment?: AppointmentResponseDTO
  selectedSlot?: { start: Date; end: Date }
  onSuccess?: () => void
  onCancel?: () => void
}

const rooms = ["Salle 101", "Salle 102", "Salle 103", "Salle 201", "Salle 202"]

const timeSlots = [
  "08:00",
  "08:30",
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
  "18:00",
]

export function AppointmentForm({ appointment, selectedSlot, onSuccess, onCancel }: Readonly<AppointmentFormProps>) {
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [selectedTime, setSelectedTime] = useState<string>("")
  const [showAlternatives, setShowAlternatives] = useState(false)
  const [checkConflicts, setCheckConflicts] = useState(false)

  const createAppointment = useCreateAppointment()
  const updateAppointment = useUpdateAppointment()

  // Récupérer les médecins depuis l'API
  const { getStaff } = useStaff({ role: 'DOCTOR' })
  const { data: doctors, isLoading: doctorsLoading } = getStaff

  const form = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      dateTime: appointment?.dateTime ?? "",
      reason: appointment?.reason ?? "",
      doctorId: appointment?.doctorId ?? "",
      room: appointment?.room ?? "",
      patientId: appointment?.patientId ?? 0,
    },
  })

  const watchedDoctor = form.watch("doctorId")
  const watchedDateTime = form.watch("dateTime")

  // Hooks pour les créneaux alternatifs et vérification des conflits
  const { data: alternativeSlots } = useAlternativeSlots(watchedDoctor, watchedDateTime)
  const { data: conflictData } = useTimeSlotConflict(watchedDoctor, watchedDateTime, appointment?.id)

  const { getPatients } = usePatients()
  const patients = getPatients.data || []
  const [patientSearch, setPatientSearch] = useState("")

  // Initialiser avec le créneau sélectionné depuis le calendrier
  useEffect(() => {
    if (selectedSlot && !appointment) {
      const date = selectedSlot.start
      const time = format(date, "HH:mm")
      setSelectedDate(date)
      setSelectedTime(time)
      form.setValue("dateTime", date.toISOString())
    }
  }, [selectedSlot, appointment, form])

  // Initialiser avec les données du rendez-vous existant
  useEffect(() => {
    if (appointment) {
      const date = new Date(appointment.dateTime)
      setSelectedDate(date)
      setSelectedTime(format(date, "HH:mm"))
    }
  }, [appointment])

  const handleSubmit = async (data: AppointmentFormData): Promise<void> => {
    // Vérifier les conflits avant la soumission
    if (conflictData?.hasConflict && !checkConflicts) {
      setCheckConflicts(true)
      return
    }

    try {
      // Préparer les données pour l'API
      const apiData = {
        ...data,
        doctorId: data.doctorId, // L'API attend doctorId
      }

      if (appointment) {
        await updateAppointment.mutateAsync({ id: appointment.id, data: apiData })
      } else {
        await createAppointment.mutateAsync(apiData)
      }
      onSuccess?.()
    } catch (error: unknown) {
      // Error handling is done in the hooks
      console.error("Form submission error:", error)
    }
  }

  const handleDateTimeChange = (date: Date, time: string): void => {
    if (date && time) {
      const dateTime = new Date(date)
      const [hours, minutes] = time.split(":").map(Number)
      dateTime.setHours(hours, minutes, 0, 0)
      form.setValue("dateTime", dateTime.toISOString())
      setSelectedDate(date)
      setSelectedTime(time)
      setCheckConflicts(false) // Reset conflict check
    }
  }

  const handleAlternativeSelect = (alternativeDateTime: string): void => {
    const date = new Date(alternativeDateTime)
    setSelectedDate(date)
    setSelectedTime(format(date, "HH:mm"))
    form.setValue("dateTime", alternativeDateTime)
    setShowAlternatives(false)
    setCheckConflicts(false)
  }

  const isLoading = createAppointment.isPending || updateAppointment.isPending

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarIcon className="h-5 w-5" />
          {appointment ? "Modifier le rendez-vous" : "Nouveau rendez-vous"}
        </CardTitle>
        <CardDescription>
          {appointment ? "Modifiez les informations du rendez-vous" : "Planifiez un nouveau rendez-vous"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Notification de conflit */}
        {conflictData?.hasConflict && checkConflicts && (
          <div className="mb-6">
            <ConflictNotification conflict={conflictData} onClose={() => setCheckConflicts(false)} />
            <Alert className="mt-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Un conflit a été détecté. Vous pouvez continuer si vous souhaitez forcer la création du rendez-vous, ou
                choisir un autre créneau.
              </AlertDescription>
            </Alert>
          </div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Patient avec autocomplétion */}
            <FormField
              name="patientId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Patient
                  </FormLabel>
                  <FormControl>
                    <div>
                      <Input
                        type="text"
                        placeholder="Rechercher un patient par nom ou prénom"
                        value={patientSearch}
                        onChange={e => setPatientSearch(e.target.value)}
                        className="mb-2"
                      />
                      <div className="max-h-40 overflow-y-auto border rounded bg-white shadow">
                        {patients
                          .filter(p =>
                            (p.firstName + " " + p.lastName).toLowerCase().includes(patientSearch.toLowerCase())
                          )
                          .map(p => (
                            <button
                              type="button"
                              key={p.id}
                              className={`w-full text-left px-3 py-2 cursor-pointer hover:bg-blue-100 ${field.value === p.id ? 'bg-blue-50 font-semibold' : ''}`}
                              onClick={() => {
                                form.setValue("patientId", p.id)
                                setPatientSearch(p.firstName + " " + p.lastName)
                              }}
                            >
                              {p.firstName} {p.lastName} (ID: {p.id})
                            </button>
                          ))}
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Date et Heure */}
            <FormField
              name="dateTime"
              render={() => (
                <FormItem className="flex flex-col">
                  <FormLabel className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4" />
                    Date et heure
                  </FormLabel>
                  <div className="grid grid-cols-2 gap-4">
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn("pl-3 text-left font-normal", !selectedDate && "text-muted-foreground")}
                          >
                            {selectedDate ? format(selectedDate, "PPP", { locale: fr }) : <span>Choisir une date</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={(date) => {
                            if (date && selectedTime) {
                              handleDateTimeChange(date, selectedTime)
                            } else {
                              setSelectedDate(date)
                            }
                          }}
                          disabled={(date) => date < new Date() || date.getDay() === 0 || date.getDay() === 6}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>

                    <Select
                      value={selectedTime}
                      onValueChange={(time) => {
                        if (selectedDate && time) {
                          handleDateTimeChange(selectedDate, time)
                        } else {
                          setSelectedTime(time)
                        }
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Heure" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeSlots.map((time) => (
                          <SelectItem key={time} value={time}>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4" />
                              {time}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Médecin */}
            <FormField
              name="doctorId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Médecin
                  </FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={doctorsLoading ? "Chargement..." : "Sélectionner un médecin"} />
                      </SelectTrigger>
                    </FormControl>
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
                          {doctorsLoading ? "Chargement des médecins..." : "Aucun médecin disponible"}
                        </div>
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Salle */}
            <FormField
              name="room"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Salle
                  </FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner une salle" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {rooms.map((room) => (
                        <SelectItem key={room} value={room}>
                          {room}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Motif */}
            <FormField
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Motif de consultation
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Consultation générale, contrôle, urgence..."
                      className="resize-none"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Créneaux alternatifs */}
            {alternativeSlots && alternativeSlots.length > 0 && (
              <div className="space-y-2">
                <Button type="button" variant="outline" onClick={() => setShowAlternatives(!showAlternatives)}>
                  {showAlternatives ? "Masquer" : "Voir"} les créneaux alternatifs ({alternativeSlots.length})
                </Button>

                {showAlternatives && (
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Créneaux disponibles pour {watchedDoctor} :</p>
                    <div className="flex flex-wrap gap-2">
                      {alternativeSlots.map((slot) => (
                        <Badge
                          key={slot}
                          variant="secondary"
                          className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                          onClick={() => handleAlternativeSelect(slot)}
                        >
                          {format(new Date(slot), "dd/MM à HH:mm", { locale: fr })}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
                Annuler
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading
                  ? "Enregistrement..."
                  : conflictData?.hasConflict && checkConflicts
                    ? "Forcer la création"
                    : appointment
                      ? "Modifier"
                      : "Créer"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
