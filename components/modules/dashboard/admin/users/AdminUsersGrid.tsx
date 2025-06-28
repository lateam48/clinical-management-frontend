"use client"

import { UserCard } from "@/components/modules/dashboard/admin/users"
import type { User } from "@/types"

interface AdminUsersGridProps {
  users: User[]
}

export function AdminUsersGrid({ users }: AdminUsersGridProps) {
  if (users.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="mx-auto max-w-md">
          <h3 className="text-lg font-semibold">Aucun utilisateur trouvé</h3>
          <p className="text-muted-foreground">
            Aucun utilisateur ne correspond à vos critères de recherche. Essayez d{"'"}ajuster votre recherche ou créez
            un nouvel utilisateur.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {users.map((user) => (
        <UserCard key={user.id} user={user} />
      ))}
    </div>
  )
} 