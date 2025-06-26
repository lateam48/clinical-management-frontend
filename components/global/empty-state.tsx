"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { LucideIcon } from "lucide-react"

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  action?: {
    label: string
    onClick: () => void
  }
}

export function EmptyState({ icon: Icon, title, description, action }: Readonly<EmptyStateProps>) {
  return (
    <Card className="flex flex-col items-center justify-center py-12 px-4 text-center bg-background/80">
      <CardContent className="flex flex-col items-center">
        <Icon className="h-10 w-10 mb-4 text-muted-foreground" />
        <h2 className="text-xl font-semibold mb-2">{title}</h2>
        <p className="text-muted-foreground mb-4 max-w-md">{description}</p>
        {action && (
          <Button variant="outline" onClick={action.onClick}>{action.label}</Button>
        )}
      </CardContent>
    </Card>
  )
} 