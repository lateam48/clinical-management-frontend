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
import { AlertTriangle } from "lucide-react"
import type { User } from "@/types"
import { useUser } from "@/hooks/useUsers"

interface DeleteUserDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: User
}

export function DeleteUserDialog({ open, onOpenChange, user }: DeleteUserDialogProps) {
  const { deleteUser } = useUser({ userId: user.id })

  const handleDelete = async () => {
    await deleteUser.mutateAsync(user.id)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Supprimer l&apos;utilisateur
          </DialogTitle>
          <DialogDescription>
            Êtes-vous sûr de vouloir supprimer l&apos;utilisateur{" "}
            <strong>{user.firstName} {user.lastName}</strong> ? Cette action est irréversible.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={deleteUser.isPending}>
            Annuler
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={deleteUser.isPending}>
            {deleteUser.isPending ? "Suppression..." : "Supprimer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 