"use client"

import { useAllAppointments } from "@/hooks/useAppointments";
import { AppointmentCard } from "@/components/modules/dashboard/secretary/appointments/AppointmentCard";

export default function AdminAppointmentsPage() {
  const { data: appointments, isLoading } = useAllAppointments();

  if (isLoading) return <div>Chargement...</div>;

  // Filtrage par statut
  const scheduled = appointments?.filter(a => a.status === "SCHEDULED") || [];
  const completed = appointments?.filter(a => a.status === "COMPLETED") || [];
  const cancelled = appointments?.filter(a =>
    ["CANCELLED", "LATE_CANCELLED", "CLINIC_CANCELLED"].includes(a.status)
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
          <div className="text-muted-foreground">Aucun rendez-vous programmé.</div>
        )}
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold mb-2">Terminé(s)</h2>
        {completed.length > 0 ? (
          completed.map((appointment) => (
            <AppointmentCard key={appointment.id} appointment={appointment} readOnly />
          ))
        ) : (
          <div className="text-muted-foreground">Aucun rendez-vous terminé.</div>
        )}
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold mb-2">Annulé(s)</h2>
        {cancelled.length > 0 ? (
          cancelled.map((appointment) => (
            <AppointmentCard key={appointment.id} appointment={appointment} readOnly />
          ))
        ) : (
          <div className="text-muted-foreground">Aucun rendez-vous annulé.</div>
        )}
      </div>
    </div>
  );
} 