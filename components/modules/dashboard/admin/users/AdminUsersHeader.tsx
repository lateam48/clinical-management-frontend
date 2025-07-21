"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card"
import { Plus, Search, Users } from "lucide-react"
import { UserForm } from "./UserForm"

interface AdminUsersHeaderProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  totalCount: number
}

export function AdminUsersHeader({
  searchQuery,
  onSearchChange,
  totalCount,
}: AdminUsersHeaderProps) {
  const [showCreateDialog, setShowCreateDialog] = useState(false)

  return (
    <>
      <Card className="mb-6">
        <CardHeader>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-2">
              <Users className="h-8 w-8" />
              <div>
                <CardTitle className="text-3xl font-bold tracking-tight">
                  Gestion des utilisateurs
                </CardTitle>
                <CardDescription className="text-base">
                  Gérez les utilisateurs du système ({totalCount} au total)
                </CardDescription>
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => setShowCreateDialog(true)} size="default" className="bg-primary hover:bg-primary/90">
                <Plus className="mr-2 h-4 w-4" />
                Nouvel utilisateur
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="flex items-center space-x-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher des utilisateurs..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <UserForm
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        mode="create"
      />
    </>
  )
} 