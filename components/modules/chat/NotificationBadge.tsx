'use client'

import { Badge } from '@/components/ui/badge'

interface NotificationBadgeProps {
  count?: number
  className?: string
}

export function NotificationBadge({ count = 0, className }: Readonly<NotificationBadgeProps>) {
  if (count === 0) return null

  return (
    <Badge 
      variant="destructive" 
      className={`absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs ${className}`}
    >
      {count > 99 ? '99+' : count}
    </Badge>
  )
}
