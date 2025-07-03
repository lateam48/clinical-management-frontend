"use client"

import React, { useState, useMemo } from 'react';
import { useInvoices } from '@/hooks/useInvoices';
import { Card } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { ChartContainer } from '@/components/ui/chart';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Invoice } from '@/types/invoice';
import { Receipt } from 'lucide-react';
import { InvoiceDetailModal } from './InvoiceDetailModal';

// Enum pour les types de tabs
enum InvoiceTabType {
  ALL = 'all',
  UNPAID = 'unpaid',
  PAID = 'paid'
}

export const AdminInvoiceManagement: React.FC = () => {
  const { getInvoices, getUnpaidInvoices, getPaidInvoices, getTotalPaid } = useInvoices({});
  const [tab, setTab] = useState<InvoiceTabType>(InvoiceTabType.ALL);
  const [search, setSearch] = useState('');
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  let invoices:Invoice[] = [];
  if (tab === InvoiceTabType.ALL) invoices = getInvoices.data || [];
  else if (tab === InvoiceTabType.UNPAID) invoices = getUnpaidInvoices.data || [];
  else if (tab === InvoiceTabType.PAID) invoices = getPaidInvoices.data || [];

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

  // Préparation des données pour le graphique (paiements par jour)
  const paidInvoices = getPaidInvoices.data || [];
  const chartData = useMemo(() => {
    const map = new Map();
    paidInvoices.forEach(inv => {
      const date = new Date(inv.datePaid || inv.issuedAt).toLocaleDateString('fr-FR');
      map.set(date, (map.get(date) || 0) + inv.amount);
    });
    return Array.from(map.entries()).map(([date, total]) => ({ date, total }));
  }, [paidInvoices]);

  const totalPaid = getTotalPaid.data ?? 0;

  const handleTabChange = (value: string) => {
    setTab(value as InvoiceTabType);
  };

  return (
    <Card className="p-6 w-full max-w-6xl mx-auto mt-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold">Factures (lecture seule)</h2>
        <div className="flex items-center gap-3 w-full max-w-xl justify-end">
          <Card className="flex flex-row items-center gap-3 px-6 py-2 bg-blue-50 border border-blue-100 shadow-none rounded-md w-full">
            <Receipt className="text-blue-500 w-5 h-5 mr-2" />
            <div className="flex flex-row items-center justify-between w-full">
              <span className="text-[11px] text-blue-700 font-medium uppercase tracking-wide mr-4">Total encaissé</span>
              <span className="text-lg font-semibold text-blue-900">{totalPaid.toLocaleString()} FCFA</span>
            </div>
          </Card>
        </div>
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-2">Évolution des paiements par jour</h3>
        <div className="bg-muted rounded-lg p-4 mb-8">
          <ChartContainer config={{ total: { label: 'Total encaissé', color: '#2563eb' } }}>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <XAxis dataKey="date" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip />
                <Area type="monotone" dataKey="total" stroke="#2563eb" fill="#2563eb22" name="Total encaissé" />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </div>
      <div className="mb-4">
        <Input
          placeholder="Rechercher une facture (patient, description, montant...)"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="max-w-xs bg-white border border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
        />
      </div>
      <Tabs value={tab} onValueChange={handleTabChange}>
        <TabsList>
          <TabsTrigger value={InvoiceTabType.ALL}>Toutes</TabsTrigger>
          <TabsTrigger value={InvoiceTabType.UNPAID}>Impayées</TabsTrigger>
          <TabsTrigger value={InvoiceTabType.PAID}>Payées</TabsTrigger>
        </TabsList>
        <Separator className="my-4" />
        <TabsContent value={tab}>
          <Separator className="my-8" />
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient</TableHead>
                <TableHead>Montant</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Date émission</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInvoices.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">Aucune facture</TableCell>
                </TableRow>
              )}
              {filteredInvoices.map(invoice => (
                <TableRow key={invoice.id} className="cursor-pointer hover:bg-muted/70 transition-colors" onClick={() => { setSelectedInvoice(invoice); setDetailOpen(true); }}>
                  <TableCell>{invoice.patient.firstName} {invoice.patient.lastName}</TableCell>
                  <TableCell>{invoice.amount} FCFA</TableCell>
                  <TableCell>{invoice.description}</TableCell>
                  <TableCell>{new Date(invoice.issuedAt).toLocaleDateString('fr-FR')} à {new Date(invoice.issuedAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</TableCell>
                  <TableCell>
                    {invoice.paid ? <Badge variant="default">Payée</Badge> : <Badge variant="destructive">Impayée</Badge>}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>
      </Tabs>
      <InvoiceDetailModal invoice={selectedInvoice} open={detailOpen} onOpenChange={setDetailOpen} />
    </Card>
  );
}; 