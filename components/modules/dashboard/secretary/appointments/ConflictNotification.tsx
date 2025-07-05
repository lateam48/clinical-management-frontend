"use client"

import { AlertTriangle, X, Clock, User } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import type { TimeSlotConflict } from "@/types/appointment"

interface ConflictNotificationProps {
  conflict: TimeSlotConflict
  onClose: () => void
}

export function ConflictNotification({ conflict, onClose }: Readonly<ConflictNotificationProps>) {
  if (!conflict.hasConflict) return null

  return (
    <Alert variant="destructive" className="border-red-200 bg-red-50">
      <AlertTriangle className="h-4 w-4" />
      <div className="flex items-start justify-between w-full">
        <div className="space-y-2">
          <AlertDescription className="font-medium">{conflict.message}</AlertDescription>

          {conflict.conflictingAppointments.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm text-red-700">Rendez-vous en conflit :</p>
              <div className="space-y-1">
                {conflict.conflictingAppointments.map((appointment) => (
                  <div key={appointment.id} className="flex items-center gap-2 p-2 bg-red-100 rounded-md text-sm">
                    <Clock className="h-4 w-4 text-red-600" />
                    <span className="font-medium">
                      {format(new Date(appointment.dateTime), "HH:mm", { locale: fr })}
                    </span>
                    <User className="h-4 w-4 text-red-600" />
                    <span>{appointment.patientName}</span>
                    <Badge variant="secondary" className="text-xs">
                      {appointment.doctor}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="text-red-600 hover:text-red-700 hover:bg-red-100"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </Alert>
  )
}
