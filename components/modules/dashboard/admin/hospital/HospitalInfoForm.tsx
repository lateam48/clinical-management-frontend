"use client"

import type React from "react"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Upload, X } from "lucide-react"
import type { HospitalInfo } from "@/types/hospital"
import { useCreateHospitalInfo, useUpdateHospitalInfo } from "@/hooks/useHospital"
import { hospitalService } from "@/services/hospitalService"

const hospitalInfoSchema = z.object({
  name: z.string().min(1, "Le nom de l'hôpital est requis").max(100, "Le nom ne peut pas dépasser 100 caractères"),
  address: z.string().min(1, "L'adresse est requise").max(200, "L'adresse ne peut pas dépasser 200 caractères"),
  phone: z.string().min(1, "Le numéro de téléphone est requis").max(20, "Le numéro ne peut pas dépasser 20 caractères"),
  email: z.string().min(1, "L'email est requis").email("Format d'email invalide"),
})

type HospitalInfoFormData = z.infer<typeof hospitalInfoSchema>

interface HospitalInfoFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  hospitalInfo?: HospitalInfo
  mode: "create" | "edit"
}

const ALLOWED_FILE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/svg+xml"]
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

export function HospitalInfoForm({ open, onOpenChange, hospitalInfo, mode }: HospitalInfoFormProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string>("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const createHospitalInfo = useCreateHospitalInfo()
  const updateHospitalInfo = useUpdateHospitalInfo()

  const form = useForm<HospitalInfoFormData>({
    resolver: zodResolver(hospitalInfoSchema),
    defaultValues: {
      name: hospitalInfo?.name ?? "",
      address: hospitalInfo?.address ?? "",
      phone: hospitalInfo?.phone ?? "",
      email: hospitalInfo?.email ?? "",
    },
  })

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      toast.error("Format de fichier non autorisé. Utilisez JPG, PNG ou SVG.")
      return
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      toast.error("Le fichier est trop volumineux. Taille maximale: 5MB.")
      return
    }

    setSelectedFile(file)

    // Create preview URL
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)
  }

  const handleRemoveFile = () => {
    setSelectedFile(null)
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
      setPreviewUrl("")
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const onSubmit = async (data: HospitalInfoFormData) => {
      const requestData = {
        ...data,
        logo: selectedFile ?? undefined,
      }

      if (mode === "create") {
        await createHospitalInfo.mutateAsync(requestData)
      } else if (hospitalInfo) {
        await updateHospitalInfo.mutateAsync({ id: hospitalInfo.id, data: requestData })
      }

      onOpenChange(false)
      form.reset()
      handleRemoveFile()

  }

  const isLoading = createHospitalInfo.isPending ?? updateHospitalInfo.isPending

  // Get current logo URL for edit mode
  const currentLogoUrl = hospitalInfo?.logoPath ? hospitalService.getLogoUrl(hospitalInfo.logoPath) : ""

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Créer les informations de l'hôpital" : "Modifier les informations de l'hôpital"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Ajoutez les informations de l'hôpital au système."
              : "Modifiez les informations de l'hôpital."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom de l{"'"}hôpital</FormLabel>
                    <FormControl>
                      <Input placeholder="Entrez le nom de l'hôpital" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Adresse</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Entrez l'adresse complète" className="resize-none" rows={3} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Téléphone</FormLabel>
                      <FormControl>
                        <Input placeholder="Entrez le numéro de téléphone" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="Entrez l'adresse email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Logo Upload */}
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Logo de l{"'"}hôpital</label>
                <p className="text-xs text-muted-foreground">Formats acceptés: JPG, PNG, SVG. Taille maximale: 5MB.</p>
              </div>

              {/* Current Logo (Edit Mode) */}
              {mode === "edit" && currentLogoUrl && !previewUrl && (
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 border rounded-lg overflow-hidden bg-muted flex items-center justify-center">
                        <img
                          src={currentLogoUrl ?? "/placeholder.svg"}
                          alt="Logo actuel"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Logo actuel</p>
                        <p className="text-xs text-muted-foreground">
                          Sélectionnez un nouveau fichier pour le remplacer
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}    

              {/* File Preview */}
              {previewUrl && (
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 border rounded-lg overflow-hidden bg-muted flex items-center justify-center">
                        <img
                          src={previewUrl ?? "/placeholder.svg"}
                          alt="Aperçu"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{selectedFile?.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {selectedFile ? `${(selectedFile.size / 1024 / 1024).toFixed(2)} MB` : ""}
                        </p>
                      </div>
                      <Button type="button" variant="outline" size="sm" onClick={handleRemoveFile}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* File Upload Button */}
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/svg+xml"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  {previewUrl ?? currentLogoUrl ? "Changer le logo" : "Sélectionner un logo"}
                </Button>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
                Annuler
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Enregistrement..." : mode === "create" ? "Créer" : "Mettre à jour"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
