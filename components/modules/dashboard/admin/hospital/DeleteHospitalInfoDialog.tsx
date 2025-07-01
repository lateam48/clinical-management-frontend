"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import type { HospitalInfo } from "@/types/hospital"
import { useHospital } from "@/hooks/useHospital"
import { toast } from "sonner"

interface DeleteHospitalInfoDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  hospitalInfo: HospitalInfo
}

export function DeleteHospitalInfoDialog({ open, onOpenChange, hospitalInfo }: DeleteHospitalInfoDialogProps) {
  const { deleteHospitalInfo } = useHospital()

  const handleDelete = async () => {
    try {
      await deleteHospitalInfo.mutateAsync()
      onOpenChange(false)
      toast.success("Informations de l'hôpital supprimées avec succès !")
    } catch {
      toast.error("Échec de la suppression des informations de l'hôpital.")
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Êtes-vous absolument sûr ?</AlertDialogTitle>
          <AlertDialogDescription>
            Cette action ne peut pas être annulée. Cela supprimera définitivement les informations de l{"'"}hôpital{" "}
            <strong>&quot;{hospitalInfo.name}&quot;</strong> ainsi que son logo du système.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteHospitalInfo.isPending}>Annuler</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={deleteHospitalInfo.isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {deleteHospitalInfo.isPending ? "Suppression..." : "Supprimer"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
