"use client"

import React from "react";
import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PatientRequestData, Gender } from '@/types/patient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DialogFooter } from '@/components/ui/dialog';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { SubmitButton } from '@/components/global/submit-button';

const patientSchema = z.object({
  firstName: z.string().min(1, "Le prénom est requis"),
  lastName: z.string().min(1, "Le nom est requis"),
  dateOfBirth: z.string().min(1, "La date de naissance est requise"),
  gender: z.enum(["MALE", "FEMALE"]),
  address: z.string().min(1, "L'adresse est requise"),
  phoneNumber: z.string().min(1, "Le téléphone est requis"),
  email: z.string().email("Email invalide"),
  medicalHistory: z.string(),
  allergies: z.string(),
});

type PatientFormProps = {
  initialData?: Partial<PatientRequestData>,
  onSubmit: (data: PatientRequestData) => void,
  loading: boolean
};

export function PatientForm({ initialData, onSubmit, loading }: PatientFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<PatientRequestData>({
    resolver: zodResolver(patientSchema),
    defaultValues: {
      ...initialData,
      medicalHistory: initialData?.medicalHistory ?? "",
      allergies: initialData?.allergies ?? "",
    },
  });

  // Reset form when initialData changes (for edit mode)
  React.useEffect(() => {
    reset(initialData || {});
  }, [initialData, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <div className="flex flex-col gap-2">
          <Label>Prénom</Label>
          <Input className="bg-white border border-gray-300" {...register("firstName")}/>
          {errors.firstName && <span className="text-xs text-red-500">{errors.firstName.message}</span>}
        </div>
        <div className="flex flex-col gap-2">
          <Label>Nom</Label>
          <Input className="bg-white border border-gray-300" {...register("lastName")}/>
          {errors.lastName && <span className="text-xs text-red-500">{errors.lastName.message}</span>}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-6">
        <div className="flex flex-col gap-2">
          <Label>Date de naissance</Label>
          <Input type="date" className="bg-white border border-gray-300" {...register("dateOfBirth")}/>
          {errors.dateOfBirth && <span className="text-xs text-red-500">{errors.dateOfBirth.message}</span>}
        </div>
        <div className="flex flex-col gap-2">
          <Label>Sexe</Label>
          <Controller
            name="gender"
            control={control}
            render={({ field }) => (
              <Select
                value={field.value || ''}
                onValueChange={field.onChange}
              >
                <SelectTrigger className="w-full bg-white border border-gray-300">
                  <SelectValue placeholder="Sélectionner" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MALE">Homme</SelectItem>
                  <SelectItem value="FEMALE">Femme</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.gender && <span className="text-xs text-red-500">{errors.gender.message}</span>}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-6">
        <div className="flex flex-col gap-2">
          <Label>Adresse</Label>
          <Input className="bg-white border border-gray-300" {...register("address")}/>
          {errors.address && <span className="text-xs text-red-500">{errors.address.message}</span>}
        </div>
        <div className="flex flex-col gap-2">
          <Label>Téléphone</Label>
          <Input className="bg-white border border-gray-300" {...register("phoneNumber")}/>
          {errors.phoneNumber && <span className="text-xs text-red-500">{errors.phoneNumber.message}</span>}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-6">
        <div className="flex flex-col gap-2">
          <Label>Email</Label>
          <Input type="email" className="bg-white border border-gray-300" {...register("email")}/>
          {errors.email && <span className="text-xs text-red-500">{errors.email.message}</span>}
        </div>
        <div className="flex flex-col gap-2">
          <Label>Antécédents médicaux</Label>
          <Textarea className="h-24 bg-white border border-gray-300" {...register("medicalHistory")}/>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <Label>Allergies</Label>
        <Textarea className="h-24 bg-white border border-gray-300" {...register("allergies")}/>
      </div>
      <DialogFooter>
        <SubmitButton loading={loading} label={loading ? 'Enregistrement...' : 'Enregistrer'} />
      </DialogFooter>
    </form>
  );
} 