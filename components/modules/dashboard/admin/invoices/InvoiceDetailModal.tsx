import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Invoice } from '@/types/invoice';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { FC, useEffect, useState } from 'react';
import { User, Calendar, BadgeCheck, BadgeX, FileText, CreditCard } from 'lucide-react';

interface InvoiceDetailModalProps {
  invoice: Invoice | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const InvoiceDetailModal: FC<InvoiceDetailModalProps> = ({ invoice, open, onOpenChange }) => {
  const [issuedAt, setIssuedAt] = useState('');
  const [datePaid, setDatePaid] = useState('');

  useEffect(() => {
    if (invoice) {
      setIssuedAt(format(new Date(invoice.issuedAt), "dd/MM/yyyy à HH:mm", { locale: fr }));
      setDatePaid(invoice.paid ? format(new Date(invoice.datePaid), "dd/MM/yyyy à HH:mm", { locale: fr }) : '');
    }
  }, [invoice]);

  if (!invoice) return null;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg p-0 overflow-hidden">
        <div className="relative bg-gradient-to-r from-blue-600 to-blue-400 px-6 py-4 flex items-center justify-between">
          <DialogHeader className="p-0">
            <DialogTitle className="text-white text-lg font-bold flex items-center gap-2">
              <FileText className="w-5 h-5" /> Facture #{invoice.id}
            </DialogTitle>
          </DialogHeader>
          {invoice.paid ? (
            <Badge className="bg-green-600 text-white flex items-center gap-1 px-3 py-1 text-xs"><BadgeCheck className="w-4 h-4" /> Payée</Badge>
          ) : (
            <Badge className="bg-red-600 text-white flex items-center gap-1 px-3 py-1 text-xs"><BadgeX className="w-4 h-4" /> Impayée</Badge>
          )}
        </div>
        <div className="px-6 py-5 space-y-4">
          <div className="flex items-center gap-3">
            <User className="w-5 h-5 text-blue-500" />
            <span className="text-muted-foreground text-sm">Patient</span>
            <span className="ml-auto font-medium text-base">{invoice.patient.firstName} {invoice.patient.lastName}</span>
          </div>
          <div className="flex items-center gap-3">
            <CreditCard className="w-5 h-5 text-blue-500" />
            <span className="text-muted-foreground text-sm">Montant</span>
            <span className="ml-auto font-semibold text-base">{invoice.amount} FCFA</span>
          </div>
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-blue-500" />
            <span className="text-muted-foreground text-sm">Date émission</span>
            <span className="ml-auto text-sm">{issuedAt}</span>
          </div>
          {invoice.paid && (
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-green-600" />
              <span className="text-muted-foreground text-sm">Date paiement</span>
              <span className="ml-auto text-sm">{datePaid}</span>
            </div>
          )}
          <Separator />
          <div>
            <span className="text-muted-foreground text-sm">Description</span>
            <div className="mt-1 text-base text-gray-900 whitespace-pre-line bg-muted rounded p-3 border border-muted-foreground/10">
              {invoice.description}
            </div>
          </div>
        </div>
        <DialogFooter className="bg-muted px-6 py-3 flex justify-end">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="font-semibold">Fermer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}; 