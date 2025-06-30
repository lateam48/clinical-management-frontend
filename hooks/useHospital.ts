import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { hospitalService } from "@/services/hospitalService"
import type { CreateHospitalInfoRequest, UpdateHospitalInfoRequest } from "@/types/hospital"
import { toast } from "sonner"
import { HospitalCacheKeys } from "@/lib/const"
import { ApiError } from "@/types"

export const useHospital = () => {
  const queryClient = useQueryClient()

  const getHospitalInfo = useQuery({
    queryKey: [HospitalCacheKeys.Hospital],
    queryFn: hospitalService.getAllHospitalInfo,
  })

  const createHospitalInfo = useMutation({
    mutationFn: (data: CreateHospitalInfoRequest) => hospitalService.createHospitalInfo(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [HospitalCacheKeys.Hospital] })
      toast.success("Informations de l'hôpital créées avec succès")
    },
    onError: (error: ApiError) => {
      toast.error(error.response?.data?.message ?? "Échec de la création des informations de l'hôpital")
    },
  })

  const updateHospitalInfo = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateHospitalInfoRequest }) =>
      hospitalService.updateHospitalInfo(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [HospitalCacheKeys.Hospital] })
      toast.success("Informations de l'hôpital mises à jour avec succès")
    },
    onError: (error: ApiError) => {
      toast.error(error.response?.data?.message ?? "Échec de la mise à jour des informations de l'hôpital")
    },
  })

  const deleteHospitalInfo = useMutation({
    mutationFn: () => hospitalService.deleteHospitalInfo(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [HospitalCacheKeys.Hospital] })
      toast.success("Informations de l'hôpital supprimées avec succès")
    },
    onError: (error: ApiError) => {
      toast.error(error.response?.data?.message ?? "Échec de la suppression des informations de l'hôpital")
    },
  })

  return {
    getHospitalInfo,
    createHospitalInfo,
    updateHospitalInfo,
    deleteHospitalInfo,
  }
}
