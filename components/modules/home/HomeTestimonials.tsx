import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Star } from "lucide-react"

export function HomeTestimonials() {
    const testimonials = [
        {
            name: "Dr. Samuel Njoya",
            role: "Médecin généraliste",
            company: "Clinique Bon Berger, Douala",
            content:
                "BelviCare a révolutionné la gestion de nos dossiers patients et la prise de rendez-vous. L'interface est simple et efficace !",
            rating: 5,
        },
        {
            name: "Estelle Mbarga",
            role: "Secrétaire médicale",
            company: "Polyclinique Muna, Yaoundé",
            content:
                "Grâce à BelviCare, je gère facilement les rendez-vous et les factures. Le calendrier en temps réel est un vrai plus !",
            rating: 5,
        },
        {
            name: "Jean-Baptiste Fotsing",
            role: "Administrateur",
            company: "Centre Médical La Grâce, Bafoussam",
            content:
                "La sécurité et la gestion des accès par rôle sont parfaites pour notre structure. Je recommande BelviCare à toutes les cliniques du Cameroun !",
            rating: 5,
        },
    ]

    return (
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12 animate-fade-in">
                    <h2 className="text-3xl font-bold text-foreground mb-4">Ce que disent nos utilisateurs</h2>
                    <p className="text-muted-foreground">Témoignages d&apos;étudiants et d&apos;entreprises qui nous font confiance</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {testimonials.map((testimonial, index) => (
                        <Card key={index} className="card-hover animate-slide-in" style={{ animationDelay: `${index * 0.1}s` }}>
                            <CardHeader>
                                <div className="flex items-center space-x-3">
                                    <Avatar>
                                        <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                                            {testimonial.name
                                                .split(" ")
                                                .map((n) => n[0])
                                                .join("")}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <CardTitle className="text-lg">{testimonial.name}</CardTitle>
                                        <CardDescription>{testimonial.role}</CardDescription>
                                        <p className="text-xs text-muted-foreground">{testimonial.company}</p>
                                    </div>
                                </div>
                                <div className="flex space-x-1">
                                    {[...Array(testimonial.rating)].map((_, i) => (
                                        <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                                    ))}
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground italic">&quot;{testimonial.content}&quot;</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    )
}