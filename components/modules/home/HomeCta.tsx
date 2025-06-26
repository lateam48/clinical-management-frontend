import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function HomeCta() {
    return (
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-primary text-primary-foreground">
            <div className="max-w-4xl mx-auto text-center animate-fade-in">
                <h2 className="text-3xl font-bold mb-4">Prêt à commencer votre aventure professionnelle?</h2>
                <p className="text-primary-foreground/80 mb-8 text-lg">
                    Rejoignez des milliers d&apos;étudiants camerounais qui ont trouvé leur stage idéal sur notre plateforme.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link href="/dashboard">
                        <Button size="lg" variant="secondary" className="btn-animate">
                            Créer mon compte gratuitement
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                    </Link>
                    <Link href="/login">
                        <Button size="lg" variant="outline" className="border-primary-foreground text-primary btn-animate">
                            Se connecter
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    )
}