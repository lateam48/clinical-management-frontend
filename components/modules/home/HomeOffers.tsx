import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, Star, Building, MapPin, Clock, Users, Briefcase } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function HomeOffers() {
    const features = [
        {
            title: "Calendrier en temps réel",
            description: "Planification dynamique des rendez-vous avec prévention des doubles réservations (FullCalendar intégré).",
            icon: Clock,
        },
        {
            title: "Chat interne sécurisé",
            description: "Communication instantanée entre administrateurs, docteurs et secrétaires pour une meilleure coordination.",
            icon: Star,
        },
        {
            title: "Gestion des patients",
            description: "Accès rapide aux dossiers médicaux, historique des consultations et prescriptions.",
            icon: Users,
        },
        {
            title: "Gestion des rendez-vous",
            description: "Création, modification, annulation et suivi des rendez-vous en toute simplicité.",
            icon: Briefcase,
        },
        {
            title: "Facturation et paiements",
            description: "Suivi des factures, paiements et relances pour les impayés.",
            icon: Building,
        },
        {
            title: "Sécurité et accès",
            description: "Navigation sécurisée basée sur les rôles (Admin, Docteur, Secrétaire).",
            icon: MapPin,
        },
    ]

    return (
        <section className="py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12 animate-fade-in">
                    <h2 className="text-3xl font-bold text-foreground mb-4">Fonctionnalités principales</h2>
                    <p className="text-muted-foreground">Découvrez les atouts de BelviCare pour votre clinique</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {features.map((feature, index) => (
                        <Card key={feature.title} className="card-hover animate-slide-in" style={{ animationDelay: `${index * 0.1}s` }}>
                            <CardHeader>
                                <div className="flex items-center mb-2">
                                    <feature.icon className="h-6 w-6 text-primary mr-2" />
                                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                                </div>
                                <CardDescription>{feature.description}</CardDescription>
                            </CardHeader>
                        </Card>
                    ))}
                </div>
                <div className="text-center mt-8">
                    <Link href="/dashboard">
                        <Button className="btn-animate">
                            Découvrir BelviCare
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    )
}