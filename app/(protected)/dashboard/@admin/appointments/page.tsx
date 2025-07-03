"use client"

import { useAllAppointments } from "@/hooks/useAppointments";
import { AppointmentCard } from "@/components/modules/dashboard/secretary/appointments/AppointmentCard";
import { AppointmentStatus } from "@/types/appointment"
import { EmptyState } from "@/components/global/empty-state"
import { LoadingContent } from "@/components/global/loading-content"
import { Calendar } from "lucide-react"

export default function AdminAppointmentsPage() {
  const { data: appointments, isLoading } = useAllAppointments();

  if (isLoading) return <LoadingContent />;

  // Filtrage par statut
  const scheduled = appointments?.filter(a => a.status === AppointmentStatus.SCHEDULED as string) || [];
  const completed = appointments?.filter(a => a.status === AppointmentStatus.COMPLETED as string) || [];
  const cancelled = appointments?.filter(a =>
    [AppointmentStatus.CANCELLED as string, AppointmentStatus.LATE_CANCELLED as string, AppointmentStatus.CLINIC_CANCELLED as string].includes(a.status)
  ) || [];

  return (
    <div className="space-y-8 gap-4">
      <h1 className="text-2xl font-bold mb-4 space-y-4">Tous les rendez-vous</h1>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold mb-2">Programmé(s)</h2>
        {scheduled.length > 0 ? (
          scheduled.map((appointment) => (
            <AppointmentCard key={appointment.id} appointment={appointment} readOnly />
          ))
        ) : (
          <EmptyState icon={Calendar} title="Aucun rendez-vous programmé" description="Aucun rendez-vous n'est programmé pour le moment." />
        )}
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold mb-2">Terminé(s)</h2>
        {completed.length > 0 ? (
          completed.map((appointment) => (
            <AppointmentCard key={appointment.id} appointment={appointment} readOnly />
          ))
        ) : (
          <EmptyState icon={Calendar} title="Aucun rendez-vous terminé" description="Aucun rendez-vous terminé pour le moment." />
        )}
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold mb-2">Annulé(s)</h2>
        {cancelled.length > 0 ? (
          cancelled.map((appointment) => (
            <AppointmentCard key={appointment.id} appointment={appointment} readOnly />
          ))
        ) : (
          <EmptyState icon={Calendar} title="Aucun rendez-vous annulé" description="Aucun rendez-vous annulé pour le moment." />
        )}
      </div>
    </div>
  );
} 