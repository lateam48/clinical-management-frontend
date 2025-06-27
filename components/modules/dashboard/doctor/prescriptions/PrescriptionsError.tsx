"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, RefreshCw } from "lucide-react"

interface PrescriptionsErrorProps {
  error: Error
  onRetry: () => void
}

export function PrescriptionsError({ error, onRetry }: PrescriptionsErrorProps) {
  return (
    <div className="flex items-center justify-center py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
            <AlertCircle className="h-6 w-6 text-destructive" />
          </div>
          <CardTitle>Une erreur s{"'"}est produite</CardTitle>
          <CardDescription>
            {error.message ?? "Échec du chargement des prescriptions. Veuillez réessayer."}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <Button onClick={onRetry} variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Réessayer
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
