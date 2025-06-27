import React, { useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useInvoice } from '@/hooks/useInvoices';
import { usePatients } from '@/hooks/usePatients';
import { Invoice, InvoiceRequestData } from '@/types/invoice';
import { useForm, Controller } from 'react-hook-form';
import { SelectWithSearch } from '@/components/ui/select-with-search';
import { toast } from 'sonner';

interface InvoiceFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoice: Invoice | null;
}

export const InvoiceForm: React.FC<InvoiceFormProps> = ({ open, onOpenChange, invoice }) => {
  const isEdit = !!invoice;
  const { createInvoice, updateInvoice } = useInvoice({ invoiceId: invoice?.id });
  const { register, handleSubmit, reset, formState: { isSubmitting }, control } = useForm<InvoiceRequestData>({
    defaultValues: invoice ? {
      patientId: invoice.patient.id,
      amount: invoice.amount,
      description: invoice.description,
    } : undefined
  });
  const { getPatients } = usePatients();

  useEffect(() => {
    if (invoice) {
      reset({
        patientId: invoice.patient.id,
        amount: invoice.amount,
        description: invoice.description,
      });
    } else {
      reset({ patientId: undefined, amount: 0, description: '' });
    }
  }, [invoice, reset]);

  const onSubmit = (data: InvoiceRequestData) => {
    if (isEdit && invoice) {
      updateInvoice.mutate({ id: invoice.id, data }, {
        onSuccess: () => {
          toast.success('Facture mise à jour avec succès');
          onOpenChange(false);
        }
      });
    } else {
      createInvoice.mutate({ data }, {
        onSuccess: () => {
          toast.success('Facture créée avec succès');
          onOpenChange(false);
          reset({ patientId: undefined, amount: 0, description: '' });
        }
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Modifier la facture' : 'Nouvelle facture'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="mb-4">
            <Label htmlFor="patientId">Patient</Label>
            <div className="mt-1">
              <Controller
                name="patientId"
                control={control}
                rules={{ required: true }}
                render={({ field }) =>
                  <SelectWithSearch
                    options={getPatients.data?.map((patient) => ({
                      label: `${patient.firstName} ${patient.lastName}`,
                      value: String(patient.id),
                    })) || []}
                    value={field.value ? String(field.value) : ''}
                    onValueChange={field.onChange}
                    placeholder="Sélectionner un patient"
                    disabled={isEdit}
                  />
                }
              />
            </div>
          </div>
          <div className="mb-4">
            <Label htmlFor="amount">Montant</Label>
            <div className="mt-1">
              <Input id="amount" type="number" {...register('amount', { required: true, min: 0 })} className="bg-white border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200" />
            </div>
          </div>
          <div className="mb-4">
            <Label htmlFor="description">Description</Label>
            <div className="mt-1">
              <Textarea id="description" {...register('description', { required: true })} className="bg-white border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200" />
            </div>
          </div>
          <DialogFooter className="flex flex-col gap-2 items-stretch">
            <div className="flex gap-2">
              <Button
                type="submit"
                variant={isEdit ? 'default' : 'default'}
                className={isSubmitting ? 'opacity-70 cursor-not-allowed bg-blue-500 text-white' : 'bg-primary text-primary-foreground'}
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? (isEdit ? 'Mise à jour...' : 'Création...')
                  : (isEdit ? 'Mettre à jour' : 'Créer')}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}; 