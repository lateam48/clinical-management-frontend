import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { prescriptionsService } from "@/services/prescriptionsServices"
import type { CreatePrescriptionRequest, UpdatePrescriptionRequest } from "@/types/prescription"
import { toast } from "sonner"
import { ApiError } from "@/types"
import { PrescriptionsCacheKeys } from "@/lib/const"


export function usePrescriptions() {
  return useQuery({
    queryKey: [PrescriptionsCacheKeys.Prescriptions],
    queryFn: prescriptionsService.getAllPrescriptions,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function usePrescription(id: number) {
  return useQuery({
    queryKey: ["prescription", id],
    queryFn: () => prescriptionsService.getPrescriptionById(id),
    enabled: !!id,
  })
}

export function useCreatePrescription() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreatePrescriptionRequest) => prescriptionsService.createPrescription(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PrescriptionsCacheKeys.Prescriptions] })
      toast.success("Prescription créée avec succès")
    },
    onError: (error: ApiError) => {
      toast.error(error.response?.data?.message ?? "Échec de la création de la prescription")
    },
  })
}

export function useUpdatePrescription() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdatePrescriptionRequest }) =>
      prescriptionsService.updatePrescription(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PrescriptionsCacheKeys.Prescriptions] })
      toast.success("Prescription mise à jour avec succès")
    },
    onError: (error: ApiError) => {
      toast.error(error.response?.data?.message ?? "Échec de la mise à jour de la prescription")
    },
  })
}

export function useDeletePrescription() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => prescriptionsService.deletePrescription(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PrescriptionsCacheKeys.Prescriptions] })
      toast.success("Prescription supprimée avec succès")
    },
    onError: (error: ApiError) => {
      toast.error(error.response?.data?.message ?? "Échec de la suppression de la prescription")
    },
  })
}

export function useGeneratePrescriptionPdf() {
  return useMutation({
    mutationFn: (id: number) => prescriptionsService.generatePrescriptionPdf(id),
    onSuccess: (blob, id) => {
      // Create download link
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `prescription_${id}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      toast.success("PDF généré et téléchargé avec succès")
    },
    onError: (error: ApiError) => {
      toast.error(error.response?.data?.message ?? "Échec de la génération du PDF")
    },
  })
}
