"use client"

import { AlertTriangle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface AppointmentsErrorProps {
  error: Error
  onRetry?: () => void
}

export function AppointmentsError({ error, onRetry }: Readonly<AppointmentsErrorProps>) {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
            <AlertTriangle className="h-6 w-6 text-destructive" />
          </div>
          <CardTitle>Erreur de chargement</CardTitle>
          <CardDescription>Une erreur est survenue lors du chargement des rendez-vous</CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-sm text-muted-foreground">{error.message || "Erreur inconnue"}</p>
          {onRetry && (
            <Button onClick={onRetry} variant="outline">
              <RefreshCw className="mr-2 h-4 w-4" />
              Réessayer
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
