"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { User, Mail, UserCheck, Shield } from "lucide-react"
import type { User as UserType } from "@/types"

interface UserDetailsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: UserType
}

export function UserDetailsDialog({ open, onOpenChange, user }: UserDetailsDialogProps) {
  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "bg-red-100 text-red-800"
      case "DOCTOR":
        return "bg-blue-100 text-blue-800"
      case "SECRETARY":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "Administrateur"
      case "DOCTOR":
        return "Médecin"
      case "SECRETARY":
        return "Secrétaire"
      default:
        return role
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Détails de l&apos;utilisateur
          </DialogTitle>
          <DialogDescription>
            Informations complètes sur l&apos;utilisateur {user.firstName} {user.lastName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* User Identity */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-lg font-semibold">
              <UserCheck className="h-5 w-5" />
              Identité
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Prénom</p>
                <p className="text-base">{user.firstName}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Nom</p>
                <p className="text-base">{user.lastName}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Account Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-lg font-semibold">
              <Shield className="h-5 w-5" />
              Informations de compte
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Nom d&apos;utilisateur</p>
                <p className="text-base">@{user.username}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Rôle</p>
                <Badge className={getRoleBadgeColor(user.role)}>
                  {getRoleLabel(user.role)}
                </Badge>
              </div>
            </div>
          </div>

          <Separator />

          {/* Contact Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-lg font-semibold">
              <Mail className="h-5 w-5" />
              Contact
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Adresse email</p>
              <p className="text-base">{user.email}</p>
            </div>
          </div>

          <Separator />

          {/* System Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-lg font-semibold">
              <User className="h-5 w-5" />
              Informations système
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">ID utilisateur</p>
              <p className="text-base font-mono">{user.id}</p>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>
            Fermer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 