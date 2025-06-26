import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/global"
import { Logo } from "@/components/global/logo"

export function HomeNav() {
    return (
        <nav className="border-b bg-background/95 backdrop-blur-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Logo />
                    </div>
                    <div className="flex items-center space-x-4">
                        <ModeToggle />
                        <Link href="/login">
                            <Button variant="outline" className="btn-animate">
                                Connexion
                            </Button>
                        </Link>
                        <Link href="/dashboard">
                            <Button className="btn-animate">S&apos;inscrire</Button>
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    )
}