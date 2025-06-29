"use client"

import { useFilteredAppointments } from "@/hooks/useAppointments";
import { useUserStore } from "@/stores/userStore";
import { AppointmentCard } from "@/components/modules/dashboard/secretary/appointments/AppointmentCard";

export default function DoctorAppointmentsPage() {
  // Récupère l'utilisateur connecté (docteur)
  const user = useUserStore((state) => state.user);

  // Filtre les rendez-vous par doctorId
  const { data: appointments, isLoading, error } = useFilteredAppointments({ doctor: user?.id?.toString() });

  // Logs pour diagnostiquer
  console.log("[DoctorAppointmentsPage] User:", user);
  console.log("[DoctorAppointmentsPage] User ID:", user?.id);
  console.log("[DoctorAppointmentsPage] Filter:", { doctor: user?.id?.toString() });
  console.log("[DoctorAppointmentsPage] Appointments:", appointments);
  console.log("[DoctorAppointmentsPage] Error:", error);

  if (isLoading) return <div>Chargement...</div>;

  if (error) {
    console.error("[DoctorAppointmentsPage] Error loading appointments:", error);
    return <div>Erreur lors du chargement des rendez-vous.</div>;
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold mb-4">Mes rendez-vous</h1>
      {appointments && appointments.length > 0 ? (
        appointments.map((appointment) => (
          <AppointmentCard key={appointment.id} appointment={appointment} onEdit={() => {}} />
        ))
      ) : (
        <div>Aucun rendez-vous trouvé.</div>
      )}
    </div>
  );
} 