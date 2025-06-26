"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, ArrowLeft, Home } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function UnauthorizedPage() {
    const router = useRouter()

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
                        <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
                    </div>
                    <CardTitle className="text-2xl font-bold">Accès non autorisé</CardTitle>
                    <CardDescription>
                        Vous n&apos;avez pas les permissions nécessaires pour accéder à cette page.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="text-center text-sm text-muted-foreground">
                        Si vous pensez qu&apos;il s&apos;agit d&apos;une erreur, veuillez contacter votre administrateur.
                    </div>
                    <div className="flex flex-col gap-2">
                        <Button onClick={() => router.back()} variant="outline" className="w-full">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Retour
                        </Button>
                        <Link href="/dashboard" className="w-full">
                            <Button variant="secondary" className="w-full">
                                <Home className="mr-2 h-4 w-4" />
                                Accueil
                            </Button>
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}