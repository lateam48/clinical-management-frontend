import { useMutation, useQuery } from "@tanstack/react-query"
import { invoiceService } from "@/services/invoiceService"
import { InvoicesCacheKeys } from "@/lib/const"
import { Invoice, InvoiceRequestData } from "@/types/invoice"
import { queryClient } from "@/providers"
import { toast } from "sonner"
import { ApiError } from "@/types"
import { Patient } from "@/types/patient"

export const useInvoices = ({ patientId }: { patientId?: Patient['id'] }) => {
  const getInvoices = useQuery({
    queryKey: [InvoicesCacheKeys.Invoices],
    queryFn: () => invoiceService.getAll(),
  })

  const getUnpaidInvoices = useQuery({
    queryKey: [InvoicesCacheKeys.Invoices, InvoicesCacheKeys.Unpaid],
    queryFn: () => invoiceService.getUnpaid(),
  })

  const getPaidInvoices = useQuery({
    queryKey: [InvoicesCacheKeys.Invoices, InvoicesCacheKeys.Paid],
    queryFn: () => invoiceService.getPaid(),
  })

  const getTotalPaid = useQuery({
    queryKey: [InvoicesCacheKeys.Invoices],
    queryFn: () => invoiceService.getTotalPaid(),
  })

  const getByPatient = useQuery({
    queryKey: [InvoicesCacheKeys.Invoices, patientId],
    queryFn: () => invoiceService.getByPatient(patientId as Patient['id']),
    enabled: !!patientId,
  });

  return {
    getInvoices,
    getUnpaidInvoices,
    getPaidInvoices,
    getTotalPaid,
    getByPatient,
  }
}

export const useInvoice = ({ invoiceId }: { invoiceId?: Invoice['id'] }) => {
  const createInvoice = useMutation({
    mutationFn: ({ data }: { data: InvoiceRequestData }) =>
      invoiceService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [InvoicesCacheKeys.Invoices],
      })
    },
    onError: (error: ApiError) => {
      toast.error("Erreur", {
        description: error.response?.data?.message ?? "Impossible de créer la facture",
      })
    },
  })

  const updateInvoice = useMutation({
    mutationFn: ({ id, data }: { id: Invoice['id'], data: InvoiceRequestData }) =>
      invoiceService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [InvoicesCacheKeys.Invoices],
      })
    },
    onError: (error: ApiError) => {
      toast.error("Erreur", {
        description: error.response?.data?.message ?? "Impossible de mettre à jour la facture",
      })
    },
  })

  const deleteInvoice = useMutation({
    mutationFn: (id: Invoice['id']) => invoiceService.delete(id),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: [InvoicesCacheKeys.Invoices],
      }),
  })

  const payInvoice = useMutation({
    mutationFn: (id: Invoice['id']) => invoiceService.pay(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [InvoicesCacheKeys.Invoices],
      }),
        queryClient.invalidateQueries({
          queryKey: [InvoicesCacheKeys.Paid]
        }),
        queryClient.invalidateQueries({
          queryKey: [InvoicesCacheKeys.Unpaid]
        })
    }
  })

  const getInvoice = useQuery({
    queryKey: [InvoicesCacheKeys.Invoices, invoiceId],
    queryFn: () => invoiceService.getById(invoiceId as Invoice['id']),
    enabled: !!invoiceId,
  })

  return {
    getInvoice,
    createInvoice,
    updateInvoice,
    deleteInvoice,
    payInvoice,
  }
}

export default useInvoices; 