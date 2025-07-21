"use client"

import React from "react";
import { z } from "zod";
import { useForm, FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PatientRequestData, Gender } from '@/types/patient';
import { Input } from '@/components/ui/input';
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
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';

const patientSchema = z.object({
  firstName: z.string().min(1, "Le prénom est requis").min(2, "Le prénom doit contenir au moins 2 caractères"),
  lastName: z.string().min(1, "Le nom est requis").min(2, "Le nom doit contenir au moins 2 caractères"),
  dateOfBirth: z.string().min(1, "La date de naissance est requise").refine((date) => {
    const today = new Date();
    const birthDate = new Date(date);
    const age = today.getFullYear() - birthDate.getFullYear();
    return age >= 0 && age <= 120;
  }, "La date de naissance doit être valide"),
  gender: z.nativeEnum(Gender, { required_error: "Le sexe est requis" }),
  address: z.string().min(1, "L'adresse est requise").min(5, "L'adresse doit contenir au moins 5 caractères"),
  phoneNumber: z.string()
    .min(1, "Le téléphone est requis")
    .regex(/^(6[0-9]{8}|\+2376[0-9]{8})$/, "Format de téléphone camerounais invalide (ex: 6XXXXXXXX ou +2376XXXXXXXX)"),
  email: z.string()
    .min(1, "L'email est requis")
    .email("Format d'email invalide")
    .toLowerCase(),
  medicalHistory: z.string(),
  allergies: z.string(),
});

type PatientFormProps = {
  initialData?: Partial<PatientRequestData>,
  onSubmit: (data: PatientRequestData) => void,
  onError?: (errors: FieldErrors<PatientRequestData>) => void,
  loading: boolean
};

export function PatientForm({ initialData, onSubmit, onError, loading }: Readonly<PatientFormProps>) {
  const form = useForm<PatientRequestData>({
    resolver: zodResolver(patientSchema),
    mode: "onBlur",
    defaultValues: {
      ...initialData,
      medicalHistory: initialData?.medicalHistory ?? "",
      allergies: initialData?.allergies ?? "",
    },
  });

  React.useEffect(() => {
    form.reset(initialData || {});
  }, [initialData, form.reset, form]);

  // Focus sur le premier champ en erreur
  React.useEffect(() => {
    if (Object.keys(form.formState.errors).length > 0) {
      const firstErrorField = Object.keys(form.formState.errors)[0] as keyof PatientRequestData;
      form.setFocus(firstErrorField);
    }
  }, [form.formState.errors, form.setFocus, form]);

  const handleFormSubmit = form.handleSubmit(
    (data: PatientRequestData) => {
      onSubmit(data);
    },
    (errors) => {
      console.error("Erreurs de validation:", errors);
      onError?.(errors);
    }
  );

  const isLoading = loading || form.formState.isSubmitting;

  return (
    <Form {...form}>
      <form onSubmit={handleFormSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prénom *</FormLabel>
                <FormControl>
                  <Input placeholder="Prénom du patient" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nom *</FormLabel>
                <FormControl>
                  <Input placeholder="Nom du patient" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="dateOfBirth"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date de naissance *</FormLabel>
                <FormControl>
                  <Input type="date" placeholder="Date de naissance" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sexe *</FormLabel>
                <FormControl>
                  <Select
                    value={field.value || ''}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner le sexe" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MALE">Homme</SelectItem>
                      <SelectItem value="FEMALE">Femme</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Adresse *</FormLabel>
                <FormControl>
                  <Input placeholder="Adresse du patient" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Téléphone *</FormLabel>
                <FormControl>
                  <Input placeholder="6XXXXXXXX ou +2376XXXXXXXX" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email *</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="exemple@email.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="medicalHistory"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Antécédents médicaux</FormLabel>
                <FormControl>
                  <Textarea placeholder="Antécédents médicaux du patient..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="allergies"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Allergies</FormLabel>
              <FormControl>
                <Textarea placeholder="Allergies connues du patient..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <DialogFooter>
          <SubmitButton 
            loading={isLoading} 
            label={isLoading ? 'Enregistrement...' : 'Enregistrer'} 
            disabled={!form.formState.isValid || isLoading}
          />
        </DialogFooter>
      </form>
    </Form>
  );
} 