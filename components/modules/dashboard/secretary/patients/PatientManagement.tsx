"use client"

import { usePatients, usePatient } from '@/hooks/usePatients';
import { PatientRequestData, PatientResponseData } from '@/types/patient';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useState, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { PatientForm } from './PatientForm';
import { MoreHorizontal, SearchX, UserCircle } from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { toast } from "sonner";
import { Input } from '@/components/ui/input';
import { EmptyState } from '@/components/global/empty-state';

export function PatientManagement() {
  const { getPatients } = usePatients();
  const [open, setOpen] = useState(false);
  const [editPatient, setEditPatient] = useState<PatientResponseData | null>(null);
  const { createPatient, updatePatient, deletePatient } = usePatient({});
  const [viewPatient, setViewPatient] = useState<PatientResponseData | null>(null);
  const [search, setSearch] = useState("");
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean, id?: number }>({ open: false });

  const handleEdit = (patient: PatientResponseData) => {
    setEditPatient(patient);
    setOpen(true);
  };

  const handleDelete = (id: number) => {
    setDeleteDialog({ open: true, id });
  };

  const handleSubmit = (data: PatientRequestData) => {
    if (editPatient) {
      updatePatient.mutate({ id: editPatient.id, data }, {
        onSuccess: () => {
          toast.success("Patient modifié avec succès !");
          setOpen(false);
          setEditPatient(null);
        }
      });
    } else {
      createPatient.mutate({ data }, {
        onSuccess: () => {
          toast.success("Patient créé avec succès !");
          setOpen(false);
          setEditPatient(null);
        }
      });
    }
  };

  // Optimisation du filtrage avec useMemo
  const filteredPatients = useMemo(() => {
    if (!getPatients.data) return [];
    
    const q = search.toLowerCase().trim();
    if (!q) return getPatients.data;
    
    return getPatients.data.filter((patient: PatientResponseData) => {
      return (
        patient.lastName.toLowerCase().includes(q) ||
        patient.firstName.toLowerCase().includes(q) ||
        patient.phoneNumber.toLowerCase().includes(q) ||
        patient.email.toLowerCase().includes(q)
      );
    });
  }, [getPatients.data, search]);

  return (
    <Card>
      <CardHeader className="flex flex-col gap-2 items-start md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-2 w-full">
          <CardTitle>Gestion des patients</CardTitle>
          <Input
            placeholder="Rechercher un patient (nom, prénom, téléphone, email)"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="max-w-md border border-gray-300 bg-white placeholder:text-gray-500 focus:border-primary focus:ring-2 focus:ring-primary/30"
          />
        </div>
        <Button onClick={() => { setEditPatient(null); setOpen(true); }}>Ajouter un patient</Button>
      </CardHeader>
      <Separator />
      <CardContent>
        {getPatients.isLoading ? (
          <Skeleton className="h-32 w-full" />
        ) : (
          filteredPatients && filteredPatients.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[140px] px-4">Nom</TableHead>
                  <TableHead className="min-w-[140px] px-4">Prénom</TableHead>
                  <TableHead className="min-w-[160px] px-4">Date de naissance</TableHead>
                  <TableHead className="min-w-[100px] px-4">Sexe</TableHead>
                  <TableHead className="min-w-[140px] px-4">Téléphone</TableHead>
                  <TableHead className="min-w-[180px] px-4">Email</TableHead>
                  <TableHead className="w-12 px-2 text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPatients.map((patient: PatientResponseData) => (
                  <TableRow key={patient.id}
                    onClick={e => {
                      if ((e.target as HTMLElement).closest('[data-actions-cell]')) return;
                      setViewPatient(patient);
                    }}
                    className="cursor-pointer hover:bg-muted/70 transition-colors"
                  >
                    <TableCell className="px-4">{patient.lastName}</TableCell>
                    <TableCell className="px-4">{patient.firstName}</TableCell>
                    <TableCell className="px-4">{patient.dateOfBirth}</TableCell>
                    <TableCell className="px-4">{patient.gender === 'MALE' ? 'Homme' : 'Femme'}</TableCell>
                    <TableCell className="px-4">{patient.phoneNumber}</TableCell>
                    <TableCell className="px-4">{patient.email}</TableCell>
                    <TableCell className="px-2 text-center" data-actions-cell>
                      <DropdownMenu>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-5 w-5" />
                              </Button>
                            </DropdownMenuTrigger>
                          </TooltipTrigger>
                          <TooltipContent side="left">Actions</TooltipContent>
                        </Tooltip>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={e => { e.stopPropagation(); handleEdit(patient); }}>
                            Modifier
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={e => { e.stopPropagation(); handleDelete(patient.id); }} variant="destructive">
                            Supprimer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="py-12">
              <EmptyState
                icon={SearchX}
                title="Aucun patient trouvé"
                description="Aucun patient ne correspond à votre recherche."
              />
            </div>
          )
        )}
      </CardContent>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editPatient ? 'Modifier le patient' : 'Ajouter un patient'}</DialogTitle>
          </DialogHeader>
          <PatientForm
            initialData={editPatient || {}}
            onSubmit={handleSubmit}
            loading={createPatient.isPending || updatePatient.isPending}
          />
        </DialogContent>
      </Dialog>
      <Dialog open={!!viewPatient} onOpenChange={open => !open && setViewPatient(null)}>
        <DialogContent className="bg-background">
          <DialogHeader className="items-center">
            <UserCircle className="mx-auto mb-2 text-primary" size={48} />
            <DialogTitle className="text-center text-2xl mb-1">Détails du patient</DialogTitle>
            <DialogDescription className="text-center mb-4">
              Informations complètes du patient sélectionné
            </DialogDescription>
          </DialogHeader>
          {viewPatient && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-2 py-2">
              <div className="space-y-2">
                <div>
                  <span className="font-semibold text-muted-foreground">Nom :</span>
                  <span className="ml-2">{viewPatient.lastName}</span>
                </div>
                <div>
                  <span className="font-semibold text-muted-foreground">Prénom :</span>
                  <span className="ml-2">{viewPatient.firstName}</span>
                </div>
                <div>
                  <span className="font-semibold text-muted-foreground">Date de naissance :</span>
                  <span className="ml-2">{viewPatient.dateOfBirth}</span>
                </div>
                <div>
                  <span className="font-semibold text-muted-foreground">Sexe :</span>
                  <span className="ml-2">{viewPatient.gender === 'MALE' ? 'Homme' : 'Femme'}</span>
                </div>
              </div>
              <div className="space-y-2">
                <div>
                  <span className="font-semibold text-muted-foreground">Téléphone :</span>
                  <span className="ml-2">{viewPatient.phoneNumber}</span>
                </div>
                <div>
                  <span className="font-semibold text-muted-foreground">Email :</span>
                  <span className="ml-2">{viewPatient.email}</span>
                </div>
                <div>
                  <span className="font-semibold text-muted-foreground">Adresse :</span>
                  <span className="ml-2">{viewPatient.address}</span>
                </div>
              </div>
              <div className="md:col-span-2 mt-4">
                <div className="mb-2 font-semibold text-primary">Antécédents médicaux</div>
                <div className="bg-background rounded p-3 border text-sm min-h-[48px]">
                  {viewPatient.medicalHistory || <span className="text-muted-foreground">Aucun renseignement</span>}
                </div>
              </div>
              <div className="md:col-span-2">
                <div className="mb-2 font-semibold text-primary">Allergies</div>
                <div className="bg-background rounded p-3 border text-sm min-h-[48px]">
                  {viewPatient.allergies || <span className="text-muted-foreground">Aucune allergie renseignée</span>}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      <Dialog open={deleteDialog.open} onOpenChange={open => setDeleteDialog(s => ({ ...s, open }))}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer ce patient ? Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialog({ open: false })}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={() => {
              if (deleteDialog.id) deletePatient.mutate(deleteDialog.id);
              setDeleteDialog({ open: false });
            }}>
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
} 