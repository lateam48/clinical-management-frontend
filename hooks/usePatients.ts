import { useMutation, useQuery } from "@tanstack/react-query"
import { patientService } from '@/services/patientService';
import { PatientsCacheKeys } from "@/lib/const";
import { Patient } from "@/types/patient";
import { PatientRequestData } from '../types/patient';
import { queryClient } from "@/providers";
import { toast } from "sonner";
import { ApiError } from "@/types";

export const usePatients = () => {
  const getPatients = useQuery({
    queryKey: [PatientsCacheKeys.Patients],
    queryFn: () => patientService.getAll()
  })
  return {
    getPatients
  }
}

export const usePatient = ({ patientId }: { patientId?: Patient['id'] }) => {
  const createPatient = useMutation({
    mutationFn: ({ data }: { data: PatientRequestData }) =>
      patientService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [PatientsCacheKeys.Patients]
      })
    },
    onError: (error: ApiError) => {
      toast.error("Erreur", {
        description: error.response?.data?.message ?? "Impossible de créer le patient",
      })
    }
  })

  const updatePatient = useMutation({
    mutationFn: ({ id, data }: { id: Patient['id'], data: PatientRequestData }) =>
      patientService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [PatientsCacheKeys.Patients]
      })
    },
    onError: (error: ApiError) => {
      toast.error("Erreur", {
        description: error.response?.data?.message ?? "Impossible de mettre à jour le patient",
      })
    }
  })

  const deletePatient = useMutation({
    mutationFn: (id: Patient['id']) => patientService.delete(id),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: [PatientsCacheKeys.Patients]
      })
  })

  const getUser = useQuery({
    queryKey: [PatientsCacheKeys.Patients, patientId],
    queryFn: () =>
      patientService.getById(patientId as Patient['id']),
    enabled: !!patientId
  })

  return {
    getUser,
    deletePatient,
    updatePatient,
    createPatient
  }
}