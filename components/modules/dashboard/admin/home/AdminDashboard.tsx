"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Stethoscope, Calendar, Receipt, BarChart3, Settings } from "lucide-react"
import { useUsers } from "@/hooks/useUsers"
import { useInvoices } from "@/hooks/useInvoices"
import { Skeleton } from "@/components/ui/skeleton"
import { UserRoles } from "@/types"
import { useMemo } from "react"

export function AdminDashboard() {
    const { getUsers } = useUsers();
    const { getTotalPaid, getPaidInvoices } = useInvoices({});

    // Filtrer les docteurs
    const doctors = getUsers.data?.filter(user => user.role === UserRoles.DOCTOR) || [];
    const totalPaid = getTotalPaid.data || 0;

    // Calculer le revenu du mois en cours
    const monthlyRevenue = useMemo(() => {
        if (!getPaidInvoices.data) return 0;
        
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();
        
        return getPaidInvoices.data
            .filter(invoice => {
                const paidDate = new Date(invoice.datePaid || invoice.issuedAt);
                return paidDate.getMonth() === currentMonth && 
                       paidDate.getFullYear() === currentYear;
            })
            .reduce((total, invoice) => total + invoice.amount, 0);
    }, [getPaidInvoices.data]

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Tableau de bord Administrateur</h1>
                <p className="text-muted-foreground">Gérez votre clinique avec BelviCare : utilisateurs, docteurs, secrétaires, rendez-vous, factures et statistiques.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Utilisateurs</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        {getUsers.isLoading ? (
                            <Skeleton className="h-8 w-16" />
                        ) : getUsers.isError ? (
                            <div className="text-2xl font-bold text-red-500">Erreur</div>
                        ) : (
                            <div className="text-2xl font-bold">{getUsers.data?.length || 0}</div>
                        )}
                        <p className="text-xs text-muted-foreground">Utilisateurs enregistrés</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Docteurs</CardTitle>
                        <Stethoscope className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        {getUsers.isLoading ? (
                            <Skeleton className="h-8 w-16" />
                        ) : getUsers.isError ? (
                            <div className="text-2xl font-bold text-red-500">Erreur</div>
                        ) : (
                            <div className="text-2xl font-bold">{doctors.length}</div>
                        )}
                        <p className="text-xs text-muted-foreground">Docteurs actifs</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Rendez-vous</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{isLoading ? "..." : monthAppointments.length}</div>
                        <p className="text-xs text-muted-foreground">+15% ce mois</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Revenus du mois</CardTitle>
                        <Receipt className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        {getPaidInvoices.isLoading ? (
                            <Skeleton className="h-8 w-24" />
                        ) : getPaidInvoices.isError ? (
                            <div className="text-2xl font-bold text-red-500">Erreur</div>
                        ) : (
                            <div className="text-2xl font-bold">{monthlyRevenue.toLocaleString()} FCFA</div>
                        )}
                        <p className="text-xs text-muted-foreground">Revenus {new Date().toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mt-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total encaissé</CardTitle>
                        <BarChart3 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        {getTotalPaid.isLoading ? (
                            <Skeleton className="h-8 w-24" />
                        ) : getTotalPaid.isError ? (
                            <div className="text-2xl font-bold text-red-500">Erreur</div>
                        ) : (
                            <div className="text-2xl font-bold">{totalPaid.toLocaleString()} FCFA</div>
                        )}
                        <p className="text-xs text-muted-foreground">Total des factures payées</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Système</CardTitle>
                        <Settings className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">99.9%</div>
                        <p className="text-xs text-muted-foreground">Temps de fonctionnement</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}