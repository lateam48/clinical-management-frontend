import Link from "next/link"
import { Logo } from "@/components/global/logo"
import { MapPin } from "lucide-react"

export function HomeFooter() {
    return (
        <footer className="bg-background border-t py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="col-span-1 md:col-span-2">
                        <div className="mb-4">
                            <Logo />
                        </div>
                        <p className="text-muted-foreground mb-4">
                            BelviCare, la solution de référence pour la gestion des cliniques au Cameroun. Simplifiez la vie de votre équipe et de vos patients.
                        </p>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                            <MapPin className="h-4 w-4" />
                            <span>Yaoundé & Douala, Cameroun</span>
                        </div>
                    </div>
                    <div>
                        <h3 className="font-semibold text-foreground mb-4">Liens utiles</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li>
                                <Link href="/dashboard" className="hover:text-primary">
                                    S&apos;inscrire
                                </Link>
                            </li>
                            <li>
                                <Link href="/login" className="hover:text-primary">
                                    Se connecter
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-primary">
                                    À propos
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-primary">
                                    Contact
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-semibold text-foreground mb-4">Support</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li>
                                <Link href="#" className="hover:text-primary">
                                    Centre d&apos;aide
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-primary">
                                    FAQ
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-primary">
                                    Conditions d&apos;utilisation
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-primary">
                                    Politique de confidentialité
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
                    <p>&copy; {(new Date()).getFullYear()} BelviCare. Made with ❤️ in Cameroon. Tous droits réservés.</p>
                </div>
            </div>
        </footer>
    )
}