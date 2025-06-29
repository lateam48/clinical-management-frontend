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
    <Card className="border-red-200 bg-red-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-red-700">
          <AlertTriangle className="h-5 w-5" />
          Erreur de chargement
        </CardTitle>
        <CardDescription className="text-red-600">
          Une erreur s&apos;est produite lors du chargement des rendez-vous.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-3 bg-red-100 rounded-md">
          <p className="text-sm text-red-800 font-mono">{error.message}</p>
        </div>

        {onRetry && (
          <Button onClick={onRetry} variant="outline" className="w-full bg-transparent">
            <RefreshCw className="h-4 w-4 mr-2" />
            Réessayer
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
