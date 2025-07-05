"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Calendar, FileText, MessageCircle } from "lucide-react"
import { useTodayAppointments } from "@/hooks/useAppointments"
import { useUserStore } from "@/stores/userStore"
import { AppointmentStatus } from "@/types/appointment"

export function DoctorDashboard() {
    const { user } = useUserStore();
    const { data: todayAppointments, isLoading } = useTodayAppointments();
    const doctorAppointments = todayAppointments?.filter(a => a.doctor === String(user?.id) && a.status === AppointmentStatus.SCHEDULED) ?? [];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Tableau de bord Docteur</h1>
                <p className="text-muted-foreground">Gérez vos patients, rendez-vous, prescriptions et messages avec BelviCare.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Patients</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">120</div>
                        <p className="text-xs text-muted-foreground">Suivis ce mois</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Rendez-vous à venir</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{isLoading ? "..." : doctorAppointments.length}</div>
                        <p className="text-xs text-muted-foreground">Aujourd&apos;hui</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Prescriptions</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">45</div>
                        <p className="text-xs text-muted-foreground">Ce mois</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Messages</CardTitle>
                        <MessageCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">5</div>
                        <p className="text-xs text-muted-foreground">Non lus</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
