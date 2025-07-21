"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { MoreHorizontal, Edit, Trash2, User as UserIcon, Mail, UserCheck, Eye } from "lucide-react"
import type { User } from "@/types"
import { UserForm, DeleteUserDialog, UserDetailsDialog } from "@/components/modules/dashboard/admin/users"

interface UserCardProps {
  user: User
}

export function UserCard({ user }: UserCardProps) {
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showDetailsDialog, setShowDetailsDialog] = useState(false)

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
    <>
      <Card className="h-full hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <UserIcon className="h-5 w-5" />
                {user.firstName} {user.lastName}
              </CardTitle>
              <div className="flex gap-2">
                <Badge className={getRoleBadgeColor(user.role)}>
                  {getRoleLabel(user.role)}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  ID: {user.id}
                </Badge>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Ouvrir le menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setShowDetailsDialog(true)}>
                  <Eye className="mr-2 h-4 w-4" />
                  Voir détails
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setShowEditDialog(true)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Modifier
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setShowDeleteDialog(true)} className="text-destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Supprimer
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* User Info */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium">
              <UserCheck className="h-4 w-4 text-muted-foreground" />
              Informations utilisateur
            </div>
            <div className="ml-6 space-y-1">
              <p className="font-semibold">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-sm text-muted-foreground">
                @{user.username}
              </p>
            </div>
          </div>

          <Separator />

          {/* Contact Info */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Mail className="h-4 w-4 text-muted-foreground" />
              Contact
            </div>
            <div className="ml-6">
              <p className="text-sm">{user.email}</p>
            </div>
          </div>

          <Separator />

          {/* Role Info */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium">
              <UserIcon className="h-4 w-4 text-muted-foreground" />
              Rôle
            </div>
            <div className="ml-6">
              <Badge className={getRoleBadgeColor(user.role)}>
                {getRoleLabel(user.role)}
              </Badge>
            </div>
          </div>
        </CardContent>

        <CardFooter className="pt-0">
          <div className="flex gap-2 w-full">
            <Button variant="outline" size="sm" onClick={() => setShowDetailsDialog(true)} className="flex-1">
              <Eye className="mr-2 h-4 w-4" />
              Détails
            </Button>
            <Button variant="outline" size="sm" onClick={() => setShowEditDialog(true)} className="flex-1">
              <Edit className="mr-2 h-4 w-4" />
              Modifier
            </Button>
          </div>
        </CardFooter>
      </Card>

      <UserForm
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        user={user}
        mode="edit"
      />

      <DeleteUserDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        user={user}
      />

      <UserDetailsDialog
        open={showDetailsDialog}
        onOpenChange={setShowDetailsDialog}
        user={user}
      />
    </>
  )
} 