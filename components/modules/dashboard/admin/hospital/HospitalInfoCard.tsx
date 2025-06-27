"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { MoreHorizontal, Edit, Trash2, Building, MapPin, Phone, Mail, ImageIcon } from "lucide-react"
import type { HospitalInfo } from "@/types/hospital"
import { HospitalInfoForm, DeleteHospitalInfoDialog } from "@/components/modules/dashboard/admin/hospital"
import { hospitalService } from "@/services/hospitalService"

interface HospitalInfoCardProps {
  hospitalInfo: HospitalInfo        
}

export function HospitalInfoCard({ hospitalInfo }: HospitalInfoCardProps) {
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const logoUrl = hospitalInfo.logoPath ? hospitalService.getLogoUrl(hospitalInfo.logoPath) : ""

  return (
    <>
      <Card className="w-full hover:shadow-md transition-shadow">
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <CardTitle className="text-xl flex items-center gap-2">
                <Building className="h-6 w-6" />
                {hospitalInfo.name}
              </CardTitle>
              <Badge variant="secondary" className="text-xs">
                ID: {hospitalInfo.id}
              </Badge>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Ouvrir le menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setShowEditDialog(true)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Modifier
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setShowDeleteDialog(true)} className="text-destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Supprimer
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Logo Section */}
          {logoUrl && (
            <>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <ImageIcon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Logo</span>
                </div>
                <div className="flex justify-center">
                  <div className="w-24 h-24 border rounded-lg overflow-hidden bg-muted flex items-center justify-center">
                    <img
                      src={logoUrl || "/placeholder.svg"}
                      alt={`Logo de ${hospitalInfo.name}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
              <Separator />
            </>
          )}

          {/* Contact Information */}
          <div className="space-y-4">
            <h4 className="font-semibold text-sm">Informations de contact</h4>

            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium">Adresse</p>
                  <p className="text-sm text-muted-foreground">{hospitalInfo.address}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium">Téléphone</p>
                  <p className="text-sm text-muted-foreground">{hospitalInfo.phone}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-sm text-muted-foreground">{hospitalInfo.email}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>

        <div className="p-6 pt-0">
          <Button variant="outline" onClick={() => setShowEditDialog(true)} className="w-full">
            <Edit className="mr-2 h-4 w-4" />
            Modifier les informations
          </Button>
        </div>
      </Card>

      <HospitalInfoForm
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        hospitalInfo={hospitalInfo}
        mode="edit"
      />

      <DeleteHospitalInfoDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        hospitalInfo={hospitalInfo}
      />
    </>
  )
}
