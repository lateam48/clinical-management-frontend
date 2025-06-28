"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { MoreHorizontal, Edit, Trash2, FileText, Download, User, Stethoscope, Eye } from "lucide-react"
import type { Doctor, Patient, Prescription } from "@/types/prescription"
import { PrescriptionForm, DeletePrescriptionDialog, PrescriptionDetailsDialog } from "@/components/modules/dashboard/doctor/prescriptions"
import { useGeneratePrescriptionPdf } from "@/hooks/usePrescriptions"

interface PrescriptionCardProps {
  prescription: Prescription
  patients?: Patient[]
  doctors?: Doctor[]
}

export function PrescriptionCard({ prescription, patients = [], doctors = [] }: PrescriptionCardProps) {
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showDetailsDialog, setShowDetailsDialog] = useState(false)

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
    <>
      <Card className="h-full hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2 min-w-0">
            <div className="space-y-2 min-w-0 flex-1">
              <CardTitle className="text-lg flex items-center gap-2 min-w-0">
                <FileText className="h-5 w-5 flex-shrink-0" />
                <span className="truncate">Prescription #{prescription.id}</span>
              </CardTitle>
              <div className="flex flex-wrap gap-1 sm:gap-2">
                <Badge variant="outline" className="text-xs whitespace-nowrap">
                  {formatDate(prescription.createdAt)}
                </Badge>
                <Badge className={`${getGenderBadgeColor(prescription.patientGender)} text-xs whitespace-nowrap`}>
                  {prescription.patientGender === "MALE" ? "Homme" : "Femme"}
                </Badge>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0 flex-shrink-0">
                  <span className="sr-only">Ouvrir le menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setShowDetailsDialog(true)}>
                  <Eye className="mr-2 h-4 w-4" />
                  Voir détails
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setShowEditDialog(true)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Modifier
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleGeneratePdf} disabled={generatePdf.isPending}>
                  <Download className="mr-2 h-4 w-4" />
                  {generatePdf.isPending ? "Génération..." : "Télécharger PDF"}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setShowDeleteDialog(true)} className="text-destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Supprimer
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Patient Info */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium">
              <User className="h-4 w-4 text-muted-foreground" />
              Patient
            </div>
            <div className="ml-6 space-y-1">
              <p className="font-semibold">
                {prescription.patientFirstName} {prescription.patientLastName}
              </p>
              <p className="text-sm text-muted-foreground">
                Né(e) le {new Date(prescription.patientDateOfBirth).toLocaleDateString("fr-FR")}
              </p>
            </div>
          </div>

          <Separator />

          {/* Doctor Info */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Stethoscope className="h-4 w-4 text-muted-foreground" />
              Médecin prescripteur
            </div>
            <div className="ml-6">
              <p className="font-semibold">
                Dr. {prescription.medecinFirstName} {prescription.medecinLastName}
              </p>
            </div>
          </div>

          <Separator />

          {/* Medical Content Preview */}
          <div className="space-y-3">
            <div>
              <p className="text-sm font-bold mb-1">Diagnostic</p>
              <p className="text-sm text-muted-foreground line-clamp-2">{prescription.diagnostic}</p>
            </div>
            <div>
              <p className="text-sm font-bold mb-1">Recommandations</p>
              <p className="text-sm text-muted-foreground line-clamp-2">{prescription.recommandations}</p>
            </div>
          </div>
        </CardContent>

        <CardFooter className="pt-0">
          <div className="flex flex-col sm:flex-row gap-2 w-full">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowDetailsDialog(true)} 
              className="flex-1 min-w-0 text-xs sm:text-sm whitespace-nowrap py-2 sm:py-1.5"
            >
              <Eye className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
              <span className="sm:hidden md:hidden lg:inline">Détails</span>
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowEditDialog(true)} 
              className="flex-1 min-w-0 text-xs sm:text-sm whitespace-nowrap py-2 sm:py-1.5"
            >
              <Edit className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
              <span className="sm:hidden md:hidden lg:inline">Modifier</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleGeneratePdf}
              disabled={generatePdf.isPending}
              className="flex-1 min-w-0 text-xs sm:text-sm bg-transparent whitespace-nowrap py-2 sm:py-1.5"
            >
              <Download className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
              <span className="sm:hidden md:hidden lg:inline">PDF</span>
            </Button>
          </div>
        </CardFooter>
      </Card>

      <PrescriptionForm
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        prescription={prescription}
        mode="edit"
        patients={patients}
        doctors={doctors}
      />

      <DeletePrescriptionDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        prescription={prescription}
      />

      <PrescriptionDetailsDialog
        open={showDetailsDialog}
        onOpenChange={setShowDetailsDialog}
        prescription={prescription}
      />
    </>
  )
}
