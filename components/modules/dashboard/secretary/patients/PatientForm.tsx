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
import { cn } from '@/lib/utils';

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
  onError?: (errors: any) => void,
  loading: boolean
};

export function PatientForm({ initialData, onSubmit, onError, loading }: PatientFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid, isDirty },
    reset,
    control,
    setFocus,
    clearErrors,
  } = useForm<PatientRequestData>({
    resolver: zodResolver(patientSchema),
    mode: "onBlur", // Validation en temps réel lors de la perte de focus
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

  // Focus sur le premier champ en erreur
  React.useEffect(() => {
    if (Object.keys(errors).length > 0) {
      const firstErrorField = Object.keys(errors)[0] as keyof PatientRequestData;
      setFocus(firstErrorField);
    }
  }, [errors, setFocus]);

  const handleFormSubmit = handleSubmit(
    (data: PatientRequestData) => {
      onSubmit(data);
    },
    (errors) => {
      console.error("Erreurs de validation:", errors);
      onError?.(errors);
    }
  );

  const getFieldError = (fieldName: keyof PatientRequestData) => {
    return errors[fieldName]?.message;
  };

  const isFieldError = (fieldName: keyof PatientRequestData) => {
    return !!errors[fieldName];
  };

  return (
    <form onSubmit={handleFormSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <div className="flex flex-col gap-2">
          <Label htmlFor="firstName">Prénom *</Label>
          <Input 
            id="firstName" 
            className={cn(
              "bg-white border placeholder:text-gray-400",
              isFieldError("firstName") 
                ? "border-red-500 focus:border-red-500 focus:ring-red-500" 
                : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            )}
            {...register("firstName")}
            onFocus={() => clearErrors("firstName")}
            placeholder="Prénom du patient"
          />
          {getFieldError("firstName") && (
            <span className="text-xs text-red-500 flex items-center gap-1">
              <span>⚠</span>
              {getFieldError("firstName")}
            </span>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="lastName">Nom *</Label>
          <Input 
            id="lastName" 
            className={cn(
              "bg-white border placeholder:text-gray-400",
              isFieldError("lastName") 
                ? "border-red-500 focus:border-red-500 focus:ring-red-500" 
                : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            )}
            {...register("lastName")}
            onFocus={() => clearErrors("lastName")}
            placeholder="Nom du patient"
          />
          {getFieldError("lastName") && (
            <span className="text-xs text-red-500 flex items-center gap-1">
              <span>⚠</span>
              {getFieldError("lastName")}
            </span>
          )}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-6">
        <div className="flex flex-col gap-2">
          <Label htmlFor="dateOfBirth">Date de naissance *</Label>
          <Input 
            id="dateOfBirth" 
            type="date" 
            className={cn(
              "bg-white border placeholder:text-gray-400",
              isFieldError("dateOfBirth") 
                ? "border-red-500 focus:border-red-500 focus:ring-red-500" 
                : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            )}
            {...register("dateOfBirth")}
            onFocus={() => clearErrors("dateOfBirth")}
            placeholder="Date de naissance"
          />
          {getFieldError("dateOfBirth") && (
            <span className="text-xs text-red-500 flex items-center gap-1">
              <span>⚠</span>
              {getFieldError("dateOfBirth")}
            </span>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="gender">Sexe *</Label>
          <Controller
            name="gender"
            control={control}
            render={({ field }) => (
              <Select
                value={field.value || ''}
                onValueChange={(value) => {
                  field.onChange(value);
                  clearErrors("gender");
                }}
              >
                <SelectTrigger 
                  id="gender" 
                  className={cn(
                    "w-full bg-white border placeholder:text-gray-400",
                    isFieldError("gender") 
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500" 
                      : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  )}
                >
                  <SelectValue placeholder="Sélectionner le sexe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MALE">Homme</SelectItem>
                  <SelectItem value="FEMALE">Femme</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {getFieldError("gender") && (
            <span className="text-xs text-red-500 flex items-center gap-1">
              <span>⚠</span>
              {getFieldError("gender")}
            </span>
          )}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-6">
        <div className="flex flex-col gap-2">
          <Label htmlFor="address">Adresse *</Label>
          <Input 
            id="address" 
            className={cn(
              "bg-white border placeholder:text-gray-400",
              isFieldError("address") 
                ? "border-red-500 focus:border-red-500 focus:ring-red-500" 
                : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            )}
            {...register("address")}
            onFocus={() => clearErrors("address")}
            placeholder="Adresse du patient"
          />
          {getFieldError("address") && (
            <span className="text-xs text-red-500 flex items-center gap-1">
              <span>⚠</span>
              {getFieldError("address")}
            </span>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="phoneNumber">Téléphone *</Label>
          <Input 
            id="phoneNumber" 
            className={cn(
              "bg-white border placeholder:text-gray-400",
              isFieldError("phoneNumber") 
                ? "border-red-500 focus:border-red-500 focus:ring-red-500" 
                : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            )}
            placeholder="6XXXXXXXX ou +2376XXXXXXXX"
            {...register("phoneNumber")}
            onFocus={() => clearErrors("phoneNumber")}
          />
          {getFieldError("phoneNumber") && (
            <span className="text-xs text-red-500 flex items-center gap-1">
              <span>⚠</span>
              {getFieldError("phoneNumber")}
            </span>
          )}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-6">
        <div className="flex flex-col gap-2">
          <Label htmlFor="email">Email *</Label>
          <Input 
            id="email" 
            type="email" 
            className={cn(
              "bg-white border placeholder:text-gray-400",
              isFieldError("email") 
                ? "border-red-500 focus:border-red-500 focus:ring-red-500" 
                : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            )}
            placeholder="exemple@email.com"
            {...register("email")}
            onFocus={() => clearErrors("email")}
          />
          {getFieldError("email") && (
            <span className="text-xs text-red-500 flex items-center gap-1">
              <span>⚠</span>
              {getFieldError("email")}
            </span>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="medicalHistory">Antécédents médicaux</Label>
          <Textarea 
            id="medicalHistory" 
            className="h-24 bg-white border border-gray-300 focus:border-blue-500 focus:ring-blue-500 placeholder:text-gray-400" 
            placeholder="Antécédents médicaux du patient..."
            {...register("medicalHistory")}
          />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="allergies">Allergies</Label>
        <Textarea 
          id="allergies" 
          className="h-24 bg-white border border-gray-300 focus:border-blue-500 focus:ring-blue-500 placeholder:text-gray-400" 
          placeholder="Allergies connues du patient..."
          {...register("allergies")}
        />
      </div>
      
      {/* Résumé des erreurs */}
      {Object.keys(errors).length > 0 && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-700 font-medium mb-2">
            Veuillez corriger les erreurs suivantes :
          </p>
          <ul className="text-xs text-red-600 space-y-1">
            {Object.entries(errors).map(([field, error]) => (
              <li key={field} className="flex items-center gap-1">
                <span>•</span>
                {error?.message}
              </li>
            ))}
          </ul>
        </div>
      )}

      <DialogFooter>
        <SubmitButton 
          loading={loading || isSubmitting} 
          label={loading || isSubmitting ? 'Enregistrement...' : 'Enregistrer'} 
          disabled={!isValid}
        />
      </DialogFooter>
    </form>
  );
} 