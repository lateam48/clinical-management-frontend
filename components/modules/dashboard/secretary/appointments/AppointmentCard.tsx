"use client"

import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Calendar, Clock, User, MapPin, FileText, MoreHorizontal, Edit, Trash2, AlertCircle } from "lucide-react"
import { useCallback } from "react"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import { useDeleteAppointment, useCancelAppointment, useMarkAsCompleted } from "@/hooks/useAppointments"
import { useStaff } from "@/hooks/useUsers"
import type { AppointmentResponseDTO } from "@/types/appointment"
import { AppointmentStatus, AppointmentStatusLabels, AppointmentStatusColors } from "@/types/appointment"

interface AppointmentCardProps {
  appointment: AppointmentResponseDTO
  onEdit?: (appointment: AppointmentResponseDTO) => void
  readOnly?: boolean
}

export function AppointmentCard({ appointment, onEdit, readOnly }: Readonly<AppointmentCardProps>) {
  const deleteAppointment = useDeleteAppointment()
  const cancelAppointment = useCancelAppointment()
  const markAsCompleted = useMarkAsCompleted()

  const { getStaff } = useStaff({ role: 'DOCTOR' })
  const { data: doctors, isLoading: doctorsLoading } = getStaff

  const getDoctorName = useCallback(
    (doctorId: string | number | undefined | null): string => {
      if (!doctorId) return "Médecin inconnu"
      if (doctorsLoading) return "Chargement..."
      if (!doctors) return "Médecin inconnu"
      const doctor = doctors.find(d => d.id === Number(doctorId))
      return doctor ? `${doctor.firstName} ${doctor.lastName}` : "Médecin non trouvé"
    },
    [doctors, doctorsLoading]
  )

  const handleDelete = async (): Promise<void> => {
    await deleteAppointment.mutateAsync(appointment.id)
  }

  const handleCancel = async (): Promise<void> => {
    await cancelAppointment.mutateAsync({
      id: appointment.id,
      initiatedBy: "SECRETARY",
    })
  }

  const handleMarkAsCompleted = async (): Promise<void> => {
    await markAsCompleted.mutateAsync(appointment.id)
  }

  const appointmentDate = new Date(appointment.dateTime)
  const canCancel = appointment.status === "SCHEDULED"
  const canEdit = appointment.status === "SCHEDULED"

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Calendar className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold">{appointment.patientName}</h3>
              <p className="text-sm text-muted-foreground">ID: {appointment.patientId}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={AppointmentStatusColors[appointment.status as AppointmentStatus]}>{AppointmentStatusLabels[appointment.status as AppointmentStatus]}</Badge>
            {!readOnly && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {canEdit && (
                    <DropdownMenuItem onClick={() => onEdit?.(appointment)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Modifier
                    </DropdownMenuItem>
                  )}
                  {canEdit && (
                    <DropdownMenuItem onClick={handleMarkAsCompleted}>
                      ✓
                      Marquer comme terminé
                    </DropdownMenuItem>
                  )}
                  {canCancel && (
                    <>
                      <DropdownMenuSeparator />
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                            <AlertCircle className="h-4 w-4 mr-2" />
                            Annuler
                          </DropdownMenuItem>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="max-w-md w-full p-6">
                          <AlertDialogHeader>
                            <AlertDialogTitle>Annuler le rendez-vous</AlertDialogTitle>
                            <AlertDialogDescription>
                              Êtes-vous sûr de vouloir annuler ce rendez-vous ? Le patient sera notifié.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Non</AlertDialogCancel>
                            <AlertDialogAction onClick={handleCancel}>Oui, annuler</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-red-600">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Supprimer
                      </DropdownMenuItem>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="max-w-md w-full p-6">
                      <AlertDialogHeader>
                        <AlertDialogTitle>Supprimer le rendez-vous</AlertDialogTitle>
                        <AlertDialogDescription>
                          Êtes-vous sûr de vouloir supprimer définitivement ce rendez-vous ? Cette action est irréversible.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
                          Supprimer
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-8">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{format(appointmentDate, "HH:mm", { locale: fr })}</span>
          </div>
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{getDoctorName(appointment.doctor)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{format(appointmentDate, "dd/MM/yyyy", { locale: fr })}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{appointment.room}</span>
          </div>
        </div>

        {appointment.reason && (
          <div className="flex items-start gap-2">
            <FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
            <p className="text-sm text-muted-foreground line-clamp-2">{appointment.reason}</p>
          </div>
        )}

        {appointment.cancellationInitiator && (
          <div className="flex items-center gap-2 p-2 bg-orange-50 rounded-md">
            <AlertCircle className="h-4 w-4 text-orange-600" />
            <span className="text-sm text-orange-700">Annulé par {appointment.cancellationInitiator}</span>
          </div>
        )}

        {!readOnly && (
          <div className="flex gap-2 mt-4">
            {canEdit && (
              <Button onClick={handleMarkAsCompleted} variant="secondary" className="flex items-center gap-2">
                ✓ Marquer comme terminé
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
