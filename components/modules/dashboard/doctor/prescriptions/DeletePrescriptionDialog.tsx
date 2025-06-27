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
import type { Prescription } from "@/types/prescription"
import { useDeletePrescription } from "@/hooks/usePrescriptions"

interface DeletePrescriptionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  prescription: Prescription
}

export function DeletePrescriptionDialog({ open, onOpenChange, prescription }: DeletePrescriptionDialogProps) {
  const deletePrescription = useDeletePrescription()

  const handleDelete = async () => {
      await deletePrescription.mutateAsync(prescription.id)
      onOpenChange(false)
   
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Êtes-vous absolument sûr ?</AlertDialogTitle>
          <AlertDialogDescription>
            Cette action ne peut pas être annulée. Cela supprimera définitivement la prescription{" "}
            <strong>#{prescription.id}</strong> pour le patient{" "}
            <strong>
              {prescription.patientFirstName} {prescription.patientLastName}
            </strong>{" "}
            du système.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deletePrescription.isPending}>Annuler</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={deletePrescription.isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {deletePrescription.isPending ? "Suppression..." : "Supprimer"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
