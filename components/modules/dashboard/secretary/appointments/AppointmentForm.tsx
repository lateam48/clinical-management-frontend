"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { CalendarIcon, Clock, User, MapPin, FileText } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

import { useCreateAppointment, useUpdateAppointment, useAlternativeSlots } from "@/hooks/useAppointments"
import type { AppointmentResponseDTO } from "@/types/appointment"

const appointmentSchema = z.object({
  dateTime: z.string().min(1, "La date et l'heure sont requises"),
  reason: z.string().min(1, "La raison est requise").max(500, "Maximum 500 caractères"),
  doctor: z.string().min(1, "Le médecin est requis"),
  room: z.string().min(1, "La salle est requise"),
  patientId: z.number().min(1, "Le patient est requis"),
})

type AppointmentFormData = z.infer<typeof appointmentSchema>

interface AppointmentFormProps {
  appointment?: AppointmentResponseDTO
  onSuccess?: () => void
  onCancel?: () => void
}

const doctors = ["Dr. Martin", "Dr. Dubois", "Dr. Moreau", "Dr. Laurent", "Dr. Bernard"]

const rooms = ["Salle 101", "Salle 102", "Salle 103", "Salle 201", "Salle 202"]

const reasons = ["GENERAL", "CONTROL", "SPECIALIST", "SURGERY", "EMERGENCY"]

export function AppointmentForm({ appointment, onSuccess, onCancel }: Readonly<AppointmentFormProps>) {
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [selectedTime, setSelectedTime] = useState("")
  const [showAlternatives, setShowAlternatives] = useState(false)

  const createAppointment = useCreateAppointment()
  const updateAppointment = useUpdateAppointment()

  const form = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      dateTime: appointment?.dateTime ?? "",
      reason: appointment?.reason ?? "",
      doctor: appointment?.doctor ?? "",
      room: appointment?.room ?? "",
      patientId: appointment?.patientId ?? 0,
    },
  })

  const watchedDoctor = form.watch("doctor")
  const watchedDateTime = form.watch("dateTime")

  const { data: alternativeSlots } = useAlternativeSlots(watchedDoctor, watchedDateTime)

  const handleDateTimeChange = (date: Date | undefined, time: string) => {
    if (date && time) {
      const [hours, minutes] = time.split(":")
      const dateTime = new Date(date)
      dateTime.setHours(Number.parseInt(hours), Number.parseInt(minutes), 0, 0)
      form.setValue("dateTime", dateTime.toISOString())
      setSelectedDate(date)
      setSelectedTime(time)
    }
  }

  const handleSubmit = async (data: AppointmentFormData) => {
    try {
      if (appointment) {
        await updateAppointment.mutateAsync({ id: appointment.id, data })
      } else {
        await createAppointment.mutateAsync(data)
      }
      onSuccess?.()
    } catch (error) {
      // Error handling is done in the hooks
      console.error("Form submission error:", error)
    }
  }

  const handleAlternativeSelect = (alternativeDateTime: string) => {
    form.setValue("dateTime", alternativeDateTime)
    const date = new Date(alternativeDateTime)
    setSelectedDate(date)
    setSelectedTime(format(date, "HH:mm"))
    setShowAlternatives(false)
  }

  const isLoading = createAppointment.isPending || updateAppointment.isPending

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarIcon className="h-5 w-5" />
          {appointment ? "Modifier le Rendez-vous" : "Nouveau Rendez-vous"}
        </CardTitle>
        <CardDescription>
          {appointment ? "Modifiez les informations du rendez-vous" : "Planifiez un nouveau rendez-vous"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Patient ID */}
            <FormField
              name="patientId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    ID Patient
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="123"
                      {...field}
                      onChange={(e) => field.onChange(Number.parseInt(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Date et Heure */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4" />
                  Date
                </FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !selectedDate && "text-muted-foreground",
                      )}
                    >
                      {selectedDate ? format(selectedDate, "PPP", { locale: fr }) : "Sélectionner une date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      disabled={(date) => {
                        const day = date.getDay()
                        return day === 0 || day === 6 || date < new Date()
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </FormItem>

              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Heure
                </FormLabel>
                <Select
                  value={selectedTime}
                  onValueChange={(value) => {
                    setSelectedTime(value)
                    if (selectedDate) {
                      handleDateTimeChange(selectedDate, value)
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner l'heure" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 11 }, (_, i) => i + 8).map((hour) => (
                      <SelectItem key={hour} value={`${hour.toString().padStart(2, "0")}:00`}>
                        {hour}:00
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            </div>

            {/* Médecin */}
            <FormField
              name="doctor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Médecin
                  </FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un médecin" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {doctors.map((doctor) => (
                        <SelectItem key={doctor} value={doctor}>
                          {doctor}
                        </SelectItem>
                      ))}
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

            {/* Raison */}
            <FormField
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Type de Consultation
                  </FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner le type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {reasons.map((reason) => (
                        <SelectItem key={reason} value={reason}>
                          {reason}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {alternativeSlots.map((slot, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                        onClick={() => handleAlternativeSelect(slot)}
                      >
                        {format(new Date(slot), "dd/MM HH:mm", { locale: fr })}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end gap-2">
              {onCancel && (
                <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
                  Annuler
                </Button>
              )}
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Enregistrement..." : appointment ? "Mettre à jour" : "Créer"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
