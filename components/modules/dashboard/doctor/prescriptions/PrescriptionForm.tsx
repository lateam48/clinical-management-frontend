"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Prescription, Patient, Doctor } from "@/types/prescription"
import { useCreatePrescription, useUpdatePrescription } from "@/hooks/usePrescriptions"

const prescriptionSchema = z.object({
  diagnostic: z
    .string()
    .min(1, "Le diagnostic est requis")
    .max(2000, "Le diagnostic ne peut pas dépasser 2000 caractères"),
  recommandations: z
    .string()
    .min(1, "Les recommandations sont requises")
    .max(2000, "Les recommandations ne peuvent pas dépasser 2000 caractères"),
  patientId: z.number().min(1, "Le patient est requis"),
  medecinId: z.number().min(1, "Le médecin est requis"),
})

type PrescriptionFormData = z.infer<typeof prescriptionSchema>

interface PrescriptionFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  prescription?: Prescription
  mode: "create" | "edit"
  patients?: Patient[]
  doctors?: Doctor[]
}

export function PrescriptionForm({
  open,
  onOpenChange,
  prescription,
  mode,
  patients = [],
  doctors = [],
}: PrescriptionFormProps) {
  const createPrescription = useCreatePrescription()
  const updatePrescription = useUpdatePrescription()

  const form = useForm<PrescriptionFormData>({
    resolver: zodResolver(prescriptionSchema),
    defaultValues: {
      diagnostic: prescription?.diagnostic ?? "",
      recommandations: prescription?.recommandations ?? "",
      patientId: prescription?.patientId ?? 0,
      medecinId: prescription?.medecinId ?? 0,
    },
  })

  const onSubmit = async (data: PrescriptionFormData) => {
      if (mode === "create") {
        await createPrescription.mutateAsync(data)
      } else if (prescription) {
        await updatePrescription.mutateAsync({ id: prescription.id, data })
      }
      onOpenChange(false)
      form.reset()
  }

  const isLoading = createPrescription.isPending ?? updatePrescription.isPending

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Créer une nouvelle prescription" : "Modifier la prescription"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Ajoutez une nouvelle prescription au système."
              : "Modifiez les informations de la prescription."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="patientId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Patient</FormLabel>
                    <Select
                      onValueChange={(value: string) => field.onChange(Number.parseInt(value))}
                      value={field.value.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un patient" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {patients.map((patient) => (
                          <SelectItem key={patient.id} value={patient.id.toString()}>
                            {patient.firstName} {patient.lastName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="medecinId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Médecin</FormLabel>
                    <Select
                      onValueChange={(value: string) => field.onChange(Number.parseInt(value))}
                      value={field.value.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un médecin" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {doctors.map((doctor) => (
                          <SelectItem key={doctor.id} value={doctor.id.toString()}>
                            Dr. {doctor.firstName} {doctor.lastName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="diagnostic"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Diagnostic</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Entrez le diagnostic médical..."
                      className="resize-none min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="recommandations"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Recommandations</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Entrez les recommandations thérapeutiques..."
                      className="resize-none min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
