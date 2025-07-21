"use client"

import React, { useState } from 'react';
import { useInvoices } from '@/hooks/useInvoices';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Plus, MoreHorizontal } from 'lucide-react';
import { Invoice } from '@/types/invoice';
import { InvoiceForm } from './InvoiceForm';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useInvoice } from '@/hooks/useInvoices';
import { SubmitButton } from '@/components/global/submit-button';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { InvoiceDetailModal } from './InvoiceDetailModal';

export const InvoiceManagement: React.FC = () => {
  const { getInvoices, getUnpaidInvoices, getPaidInvoices, getTotalPaid } = useInvoices({});
  const [tab, setTab] = useState<'all' | 'unpaid' | 'paid'>('all');
  const [openForm, setOpenForm] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [confirmPayOpen, setConfirmPayOpen] = useState(false);
  const [invoiceToPay, setInvoiceToPay] = useState<Invoice | null>(null);
  const { payInvoice } = useInvoice({ invoiceId: invoiceToPay?.id });
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [invoiceToDelete, setInvoiceToDelete] = useState<Invoice | null>(null);
  const { deleteInvoice } = useInvoice({ invoiceId: invoiceToDelete?.id });
  const [search, setSearch] = useState('');
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedInvoiceDetail, setSelectedInvoiceDetail] = useState<Invoice | null>(null);

  let invoices: Invoice[] = [];
  if (tab === 'all') invoices = Array.isArray(getInvoices.data) ? getInvoices.data : [];
  else if (tab === 'unpaid') invoices = Array.isArray(getUnpaidInvoices.data) ? getUnpaidInvoices.data : [];
  else if (tab === 'paid') invoices = Array.isArray(getPaidInvoices.data) ? getPaidInvoices.data : [];

  const totalPaid = typeof getTotalPaid.data === 'number' ? getTotalPaid.data : 0;

  const handleEdit = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setOpenForm(true);
  };

  const handleCreate = () => {
    setSelectedInvoice(null);
    setOpenForm(true);
  };

  const handleDelete = (invoice: Invoice) => {
    setInvoiceToDelete(invoice);
    setConfirmDeleteOpen(true);
  };

  const handleMarkAsPaid = (invoice: Invoice) => {
    setInvoiceToPay(invoice);
    setConfirmPayOpen(true);
  };

  // Filtrage par recherche avancée (tous les mots doivent être présents dans au moins un champ)
  const filteredInvoices = invoices.filter(inv => {
    const searchWords = search.toLowerCase().split(/\s+/).filter(Boolean);
    const fields = [
      inv.patient.firstName.toLowerCase(),
      inv.patient.lastName.toLowerCase(),
      inv.description.toLowerCase(),
      String(inv.amount)
    ];
    return searchWords.every(word => fields.some(field => field.includes(word)));
  });

  return (
    <Card className="p-6 w-full max-w-5xl mx-auto mt-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Gestion des factures</h2>
        <Button onClick={handleCreate} variant="default" size="sm">
          <Plus className="w-4 h-4 mr-2" /> Nouvelle facture
        </Button>
      </div>
      <div className="mb-4">
        <Input
          placeholder="Rechercher une facture (patient, description, montant...)"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="max-w-xs bg-white border border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
        />
      </div>
      <Tabs value={tab} onValueChange={(v) => setTab(v as 'all' | 'unpaid' | 'paid')}>
        <TabsList>
          <TabsTrigger value="all">Toutes</TabsTrigger>
          <TabsTrigger value="unpaid">Impayées</TabsTrigger>
          <TabsTrigger value="paid">Payées</TabsTrigger>
        </TabsList>
        <div className="my-4 flex items-center gap-4">
          <Badge variant="outline">Total encaissé : <span className="font-semibold ml-1">{totalPaid} FCFA</span></Badge>
        </div>
        <Separator className="mb-4" />
        <TabsContent value={tab}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient</TableHead>
                <TableHead>Montant</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Date émission</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInvoices.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">Aucune facture</TableCell>
                </TableRow>
              )}
              {filteredInvoices.map(invoice => (
                <TableRow key={invoice.id} className="cursor-pointer hover:bg-muted/70 transition-colors" onClick={() => { setSelectedInvoiceDetail(invoice); setDetailOpen(true); }}>
                  <TableCell>{invoice.patient.firstName} {invoice.patient.lastName}</TableCell>
                  <TableCell>{invoice.amount} FCFA</TableCell>
                  <TableCell>{invoice.description}</TableCell>
                  <TableCell>{new Date(invoice.issuedAt).toLocaleDateString('fr-FR')} à {new Date(invoice.issuedAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</TableCell>
                  <TableCell>
                    {invoice.paid ? <Badge variant="default">Payée</Badge> : <Badge variant="destructive">Impayée</Badge>}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="icon" variant="outline" disabled={invoice.paid}>
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={e => { e.stopPropagation(); handleEdit(invoice); }} disabled={invoice.paid}>
                          Modifier
                        </DropdownMenuItem>
                        {!invoice.paid && (
                          <DropdownMenuItem onClick={e => { e.stopPropagation(); handleMarkAsPaid(invoice); }}>
                            Marquer comme payée
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem variant="destructive" onClick={e => { e.stopPropagation(); handleDelete(invoice); }} disabled={invoice.paid}>
                          Supprimer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>
      </Tabs>
      <InvoiceForm open={openForm} onOpenChange={setOpenForm} invoice={selectedInvoice} />
      <Dialog open={confirmPayOpen} onOpenChange={setConfirmPayOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer le paiement</DialogTitle>
          </DialogHeader>
          <p>Voulez-vous vraiment marquer cette facture comme payée&nbsp;?</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmPayOpen(false)}>
              Annuler
            </Button>
            <SubmitButton
              loading={payInvoice.isPending}
              loadingText="Marquage..."
              variant="default"
              onClick={() => {
                if (invoiceToPay) {
                  payInvoice.mutate(invoiceToPay.id, {
                    onSuccess: () => {
                      toast.success('Facture marquée comme payée');
                      setConfirmPayOpen(false);
                    }
                  });
                }
              }}
            >
              Confirmer
            </SubmitButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={confirmDeleteOpen} onOpenChange={setConfirmDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
          </DialogHeader>
          <p>Voulez-vous vraiment supprimer cette facture&nbsp;? Cette action est irréversible.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDeleteOpen(false)}>
              Annuler
            </Button>
            <SubmitButton
              loading={deleteInvoice.isPending}
              loadingText="Suppression..."
              variant="destructive"
              onClick={() => {
                if (invoiceToDelete) {
                  deleteInvoice.mutate(invoiceToDelete.id, {
                    onSuccess: () => {
                      toast.success('Facture supprimée avec succès');
                      setConfirmDeleteOpen(false);
                    }
                  });
                }
              }}
            >
              Supprimer
            </SubmitButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <InvoiceDetailModal invoice={selectedInvoiceDetail} open={detailOpen} onOpenChange={setDetailOpen} />
    </Card>
  );
}; 