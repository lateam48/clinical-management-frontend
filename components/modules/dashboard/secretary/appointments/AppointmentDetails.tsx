"use client"

import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Calendar, Clock, User, MapPin, FileText, AlertCircle, Edit, Trash2 } from "lucide-react"
import React from "react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

import { useDeleteAppointment, useCancelAppointment, useMarkAsCompleted } from "@/hooks/useAppointments"
import { useStaffMember } from "@/hooks/useUsers"
import type { AppointmentResponseDTO } from "@/types/appointment"
import { AppointmentStatus, AppointmentStatusLabels, AppointmentStatusColors } from "@/types/appointment"

interface AppointmentDetailsProps {
  appointment: AppointmentResponseDTO
  onEdit: () => void
  onClose: () => void
}

export function AppointmentDetails({ appointment, onEdit, onClose }: Readonly<AppointmentDetailsProps>) {
  const deleteAppointment = useDeleteAppointment()
  const cancelAppointment = useCancelAppointment()
  const markAsCompleted = useMarkAsCompleted()

  const { getStaffMember } = useStaffMember({ staffId: Number(appointment.doctor) })
  const { data: doctor, isLoading, error } = getStaffMember

  const getDoctorName = (): string => {
    if (isLoading) return "Chargement..."
    if (error) {
      return appointment.doctor || "Erreur de chargement"
    }
    if (!doctor) return "Médecin non trouvé"
    return `${doctor.firstName} ${doctor.lastName}`
  }

  const handleDelete = async (): Promise<void> => {
    await deleteAppointment.mutateAsync(appointment.id)
    onClose()
  }

  const handleCancel = async (): Promise<void> => {
    await cancelAppointment.mutateAsync({
      id: appointment.id,
      initiatedBy: "SECRETARY",
    })
    onClose()
  }

  const handleMarkAsCompleted = async (): Promise<void> => {
    await markAsCompleted.mutateAsync(appointment.id)
    onClose()
  }

  const appointmentDate = new Date(appointment.dateTime)
  const canCancel = appointment.status === "SCHEDULED"
  const canEdit = appointment.status === "SCHEDULED"

  return (
    <div className="space-y-8 p-4 md:p-8 rounded-2xl shadow-2xl bg-white max-w-xl mx-auto animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-100 rounded-xl shadow-sm">
            <Calendar className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h3 className="font-bold text-2xl leading-tight">Rendez-vous #{appointment.id}</h3>
            <p className="text-base text-muted-foreground font-medium">
              {format(appointmentDate, "EEEE dd MMMM yyyy", { locale: fr })}
            </p>
          </div>
        </div>
        <Badge className={`px-4 py-1 text-base rounded-full font-semibold shadow ${AppointmentStatusColors[appointment.status as AppointmentStatus]}`}>{AppointmentStatusLabels[appointment.status as AppointmentStatus]}</Badge>
      </div>

      <Separator />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <Clock className="h-5 w-5 text-blue-500" />
            <div>
              <p className="font-semibold">Heure</p>
              <p className="text-base text-muted-foreground">{format(appointmentDate, "HH:mm", { locale: fr })}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <User className="h-5 w-5 text-emerald-500" />
            <div>
              <p className="font-semibold">Patient</p>
              <p className="text-base text-muted-foreground">{appointment.patientName}</p>
              <p className="text-xs text-gray-400">ID: {appointment.patientId}</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <User className="h-5 w-5 text-indigo-500" />
            <div>
              <p className="font-semibold">Médecin</p>
              <p className="text-base text-muted-foreground">{getDoctorName()}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <MapPin className="h-5 w-5 text-pink-500" />
            <div>
              <p className="font-semibold">Salle</p>
              <p className="text-base text-muted-foreground">{appointment.room}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-orange-400" />
          <p className="font-semibold">Motif de consultation</p>
        </div>
        <div className="bg-orange-50 p-4 rounded-xl border border-orange-100 shadow-inner">
          <p className="text-base text-muted-foreground break-words">{appointment.reason}</p>
        </div>
      </div>

      {appointment.cancellationInitiator && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-orange-500" />
            <p className="font-semibold">Informations d&apos;annulation</p>
          </div>
          <div className="bg-orange-50 p-3 rounded-lg space-y-1 border border-orange-200">
            <p className="text-sm">
              <span className="font-medium">Annulé par:</span> {appointment.cancellationInitiator}
            </p>
            {appointment.cancellationReason && (
              <p className="text-sm">
                <span className="font-medium">Raison:</span> {appointment.cancellationReason}
              </p>
            )}
          </div>
        </div>
      )}

      <Separator />

      <div className="flex flex-col md:flex-row justify-between gap-4 mt-2">
        <div>
          <Button onClick={onEdit} variant="outline" className="flex items-center gap-2 bg-white border border-gray-300 px-5 py-2 text-base font-semibold hover:bg-gray-50 shadow-md">
            <Edit className="h-4 w-4" />
            Modifier
          </Button>
        </div>
        <div>
          <Button onClick={handleDelete} variant="destructive" className="flex items-center gap-2 px-5 py-2 text-base font-semibold shadow-md hover:scale-105 transition">
            <Trash2 className="h-4 w-4" />
            Supprimer
          </Button>
        </div>
        <div>
          {canCancel && (
            <Button onClick={handleCancel} variant="outline" className="flex items-center gap-2 bg-white border border-gray-300 px-5 py-2 text-base font-semibold hover:bg-gray-50 shadow-md">
              <AlertCircle className="h-4 w-4" />
              Annuler
            </Button>
          )}

          {canEdit && (
            <Button onClick={handleMarkAsCompleted} variant="secondary" className="flex items-center gap-2 px-5 py-2 text-base font-semibold shadow-md hover:scale-105 transition">
              ✓ terminé
            </Button>
          )}
        </div>
      </div>
    </div>
  )
} 