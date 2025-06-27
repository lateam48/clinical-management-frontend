"use client"

import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Calendar, Clock, User, MapPin, FileText, MoreHorizontal, Edit, Trash2, XCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import type { AppointmentResponseDTO } from "@/types/appointment"

interface AppointmentCardProps {
  appointment: AppointmentResponseDTO
  onEdit?: (appointment: AppointmentResponseDTO) => void
  onDelete?: (id: number) => void
  onCancel?: (id: number) => void
}

const statusColors = {
  SCHEDULED: "bg-blue-100 text-blue-800",
  COMPLETED: "bg-green-100 text-green-800",
  CANCELLED: "bg-gray-100 text-gray-800",
  LATE_CANCELLED: "bg-orange-100 text-orange-800",
  CLINIC_CANCELLED: "bg-red-100 text-red-800",
  NO_SHOW: "bg-purple-100 text-purple-800",
}

const statusLabels = {
  SCHEDULED: "Programmé",
  COMPLETED: "Terminé",
  CANCELLED: "Annulé",
  LATE_CANCELLED: "Annulé (Tardif)",
  CLINIC_CANCELLED: "Annulé (Clinique)",
  NO_SHOW: "Absent",
}

export function AppointmentCard({ appointment, onEdit, onDelete, onCancel }: Readonly<AppointmentCardProps>) {
  const appointmentDate = new Date(appointment.dateTime)
  const canCancel = appointment.status === "SCHEDULED"
  const canEdit = appointment.status === "SCHEDULED"

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">{format(appointmentDate, "EEEE dd MMMM yyyy", { locale: fr })}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{format(appointmentDate, "HH:mm")}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge className={statusColors[appointment.status]}>{statusLabels[appointment.status]}</Badge>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {canEdit && onEdit && (
                  <DropdownMenuItem onClick={() => onEdit(appointment)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Modifier
                  </DropdownMenuItem>
                )}
                {canCancel && onCancel && (
                  <DropdownMenuItem onClick={() => onCancel(appointment.id)}>
                    <XCircle className="h-4 w-4 mr-2" />
                    Annuler
                  </DropdownMenuItem>
                )}
                {onDelete && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => onDelete(appointment.id)} className="text-destructive">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Supprimer
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">{appointment.patientName}</span>
          <span className="text-sm text-muted-foreground">(ID: {appointment.patientId})</span>
        </div>

        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-muted-foreground" />
          <span>{appointment.doctor}</span>
        </div>

        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          <span>{appointment.room}</span>
        </div>

        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">{appointment.reason}</span>
        </div>

        {appointment.cancellationInitiator && (
          <div className="pt-2 border-t">
            <p className="text-xs text-muted-foreground">Annulé par: {appointment.cancellationInitiator}</p>
            {appointment.cancellationReason && (
              <p className="text-xs text-muted-foreground">Raison: {appointment.cancellationReason}</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
