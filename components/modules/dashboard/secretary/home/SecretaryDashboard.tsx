"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Users, Receipt, MessageCircle } from "lucide-react"
import { PatientManagement } from "@/components/modules/dashboard/secretary/patients"
import { usePatients } from "@/hooks/usePatients"
import { useInvoices } from "@/hooks/useInvoices"
import { Skeleton } from "@/components/ui/skeleton"

export function SecretaryDashboard() {
    const { getPatients } = usePatients();
    const { getUnpaidInvoices } = useInvoices({});

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Tableau de bord Secrétaire</h1>
                <p className="text-muted-foreground">Gérez les rendez-vous, patients, factures et messages avec BelviCare.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Rendez-vous aujourd{'’'}hui</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">22</div>
                        <p className="text-xs text-muted-foreground">Planifiés</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Patients</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        {getPatients.isLoading ? (
                            <Skeleton className="h-8 w-16" />
                        ) : getPatients.isError ? (
                            <div className="text-2xl font-bold text-red-500">Erreur</div>
                        ) : (
                            <div className="text-2xl font-bold">{getPatients.data?.length || 0}</div>
                        )}
                        <p className="text-xs text-muted-foreground">Enregistrés</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Factures impayées</CardTitle>
                        <Receipt className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        {getUnpaidInvoices.isLoading ? (
                            <Skeleton className="h-8 w-16" />
                        ) : getUnpaidInvoices.isError ? (
                            <div className="text-2xl font-bold text-red-500">Erreur</div>
                        ) : (
                            <div className="text-2xl font-bold">{getUnpaidInvoices.data?.length || 0}</div>
                        )}
                        <p className="text-xs text-muted-foreground">À traiter</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Messages</CardTitle>
                        <MessageCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">3</div>
                        <p className="text-xs text-muted-foreground">Non lus</p>
                    </CardContent>
                </Card>
            </div>

            <PatientManagement />
        </div>
    )
}
