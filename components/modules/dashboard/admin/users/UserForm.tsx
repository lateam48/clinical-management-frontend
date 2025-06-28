"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { User, RegisterRequest, UpdateUserRequest } from "@/types"
import { useUser } from "@/hooks/useUsers"

const userSchema = z.object({
  username: z
    .string()
    .min(3, "Le nom d'utilisateur doit contenir au moins 3 caractères")
    .max(50, "Le nom d'utilisateur ne peut pas dépasser 50 caractères"),
  email: z
    .string()
    .email("L'adresse email n'est pas valide")
    .min(1, "L'email est requis"),
  password: z
    .string()
    .min(6, "Le mot de passe doit contenir au moins 6 caractères")
    .optional(),
  firstName: z
    .string()
    .min(1, "Le prénom est requis")
    .max(50, "Le prénom ne peut pas dépasser 50 caractères"),
  lastName: z
    .string()
    .min(1, "Le nom est requis")
    .max(50, "Le nom ne peut pas dépasser 50 caractères"),
  role: z.enum(["ADMIN", "DOCTOR", "SECRETARY"], {
    required_error: "Le rôle est requis",
  }),
})

type UserFormData = z.infer<typeof userSchema>

interface UserFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user?: User
  mode: "create" | "edit"
}

export function UserForm({
  open,
  onOpenChange,
  user,
  mode,
}: UserFormProps) {
  // Use useUser hook for both create and update operations
  const { createUser, updateUser } = useUser({ userId: user?.id })

  const form = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      role: "SECRETARY",
    },
  })

  // Reset form when user prop changes
  useEffect(() => {
    if (user && mode === "edit") {
      form.reset({
        username: user.username,
        email: user.email,
        password: "",
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      })
    } else if (mode === "create") {
      form.reset({
        username: "",
        email: "",
        password: "",
        firstName: "",
        lastName: "",
        role: "SECRETARY",
      })
    }
  }, [user, mode, form])

  const onSubmit = async (data: UserFormData) => {
    if (mode === "create") {
      await createUser.mutateAsync({ data: data as RegisterRequest })
    } else if (user) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...updateData } = data
      await updateUser.mutateAsync({ id: user.id, data: updateData as UpdateUserRequest })
    }
    onOpenChange(false)
    form.reset()
  }

  const isLoading = createUser.isPending || updateUser.isPending

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Créer un nouvel utilisateur" : "Modifier l'utilisateur"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Ajoutez un nouvel utilisateur au système."
              : "Modifiez les informations de l'utilisateur."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prénom</FormLabel>
                    <FormControl>
                      <Input placeholder="Entrez le prénom..." {...field} />
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
                    <FormLabel>Nom</FormLabel>
                    <FormControl>
                      <Input placeholder="Entrez le nom..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom d&apos;utilisateur</FormLabel>
                    <FormControl>
                      <Input placeholder="Entrez le nom d&apos;utilisateur..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="Entrez l'email..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {mode === "create" && (
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mot de passe</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Entrez le mot de passe..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rôle</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un rôle" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="ADMIN">Administrateur</SelectItem>
                      <SelectItem value="DOCTOR">Médecin</SelectItem>
                      <SelectItem value="SECRETARY">Secrétaire</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
                Annuler
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Enregistrement..." : mode === "create" ? "Créer" : "Mettre à jour"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
} 