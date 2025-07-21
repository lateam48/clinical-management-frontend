"use client"

import { useState, useMemo } from "react"
import { useUsers } from "@/hooks/useUsers"
import { AdminUsersError, AdminUsersGrid, AdminUsersHeader, AdminUsersLoading, UserForm } from "@/components/modules/dashboard/admin/users"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export function AdminUsers() {
  const [searchQuery, setSearchQuery] = useState("")
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  
  // Récupération des données depuis l'API
  const { getUsers } = useUsers()

  // Extraction des données et états
  const users = getUsers.data
  const isLoading = getUsers.isLoading
  const error = getUsers.error

  const filteredUsers = useMemo(() => {
    if (!users) return []

    if (!searchQuery.trim()) return users

    const query = searchQuery.toLowerCase()
    return users.filter(
      (user) =>
        user.firstName.toLowerCase().includes(query) ||
        user.lastName.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.username.toLowerCase().includes(query) ||
        user.role.toLowerCase().includes(query),
    )
  }, [users, searchQuery])

  const handleRetry = () => {
    getUsers.refetch()
  }

  if (isLoading) {
    return <AdminUsersLoading />
  }

  if (error) {
    return <AdminUsersError error={error} onRetry={handleRetry} />
  }

  return (
    <div className="space-y-6 relative">
      <AdminUsersHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        totalCount={users?.length ?? 0}
      />
      <AdminUsersGrid users={filteredUsers} />

      {/* Floating Add Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setShowCreateDialog(true)}
          size="lg"
          className="rounded-full shadow-lg hover:shadow-xl transition-shadow"
        >
          <Plus className="h-5 w-5" />
          <span className="sr-only">Nouvel utilisateur</span>
        </Button>
      </div>

      <UserForm
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        mode="create"
      />
    </div>
  )
}