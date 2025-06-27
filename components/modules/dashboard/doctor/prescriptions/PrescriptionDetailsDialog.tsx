"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { User, Stethoscope, Calendar, FileText, Download } from "lucide-react"
import type { Prescription } from "@/types/prescription"
import { useGeneratePrescriptionPdf } from "@/hooks/usePrescriptions"

interface PrescriptionDetailsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  prescription: Prescription
}

export function PrescriptionDetailsDialog({ open, onOpenChange, prescription }: PrescriptionDetailsDialogProps) {
  const generatePdf = useGeneratePrescriptionPdf()

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getGenderBadgeColor = (gender: string) => {
    return gender === "MALE" ? "bg-blue-100 text-blue-800" : "bg-pink-100 text-pink-800"
  }

  const handleGeneratePdf = () => {
    generatePdf.mutate(prescription.id)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Détails de la prescription #{prescription.id}
          </DialogTitle>
          <DialogDescription>Informations complètes de la prescription médicale</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header Info */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Créée le {formatDate(prescription.createdAt)}</span>
            </div>
            <Badge className={getGenderBadgeColor(prescription.patientGender)}>
              {prescription.patientGender === "MALE" ? "Homme" : "Femme"}
            </Badge>
          </div>

          <Separator />

          {/* Patient Information */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-muted-foreground" />
              <h3 className="text-lg font-semibold">Informations du patient</h3>
            </div>
            <div className="ml-7 space-y-2">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Nom complet</p>
                  <p className="font-semibold">
                    {prescription.patientFirstName} {prescription.patientLastName}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Date de naissance</p>
                  <p className="font-semibold">
                    {new Date(prescription.patientDateOfBirth).toLocaleDateString("fr-FR")}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Doctor Information */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Stethoscope className="h-5 w-5 text-muted-foreground" />
              <h3 className="text-lg font-semibold">Médecin prescripteur</h3>
            </div>
            <div className="ml-7">
              <p className="font-semibold">
                Dr. {prescription.medecinFirstName} {prescription.medecinLastName}
              </p>
            </div>
          </div>

          <Separator />

          {/* Medical Content */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contenu médical</h3>

            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Diagnostic</h4>
                <div className="bg-muted p-4 rounded-lg">
                  <p className="whitespace-pre-wrap text-sm">{prescription.diagnostic}</p>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Recommandations thérapeutiques</h4>
                <div className="bg-muted p-4 rounded-lg">
                  <p className="whitespace-pre-wrap text-sm">{prescription.recommandations}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Fermer
          </Button>
          <Button onClick={handleGeneratePdf} disabled={generatePdf.isPending}>
            <Download className="mr-2 h-4 w-4" />
            {generatePdf.isPending ? "Génération..." : "Télécharger PDF"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
