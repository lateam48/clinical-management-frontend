'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Check, CheckCheck, MoreHorizontal, Smile } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ChatMessage } from '@/types/chat'

interface MessageBubbleProps {
  message: ChatMessage
  isOwnMessage: boolean
  onAddReaction: (messageId: number, emoji: string) => void
  onDeleteMessage?: (messageId: number) => void
  currentUserId?: number
}

export function MessageBubble({
  message,
  isOwnMessage,
  onAddReaction,
  onDeleteMessage,
  currentUserId
}: MessageBubbleProps) {
  const { data: session } = useSession()
  const [isClient, setIsClient] = useState(false)

  // Handle hydration
  if (typeof window !== 'undefined' && !isClient) {
    setIsClient(true)
  }

  const formatTime = (timestamp: string) => {
    if (!isClient) return ''
    try {
      const date = new Date(timestamp)
      return date.toLocaleString('fr-FR', { 
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit', 
        minute: '2-digit'
      })
    } catch (error) {
      console.error('Error formatting date:', timestamp, error)
      return 'Invalid Date'
    }
  }

  const handleReaction = (emoji: string) => {
    onAddReaction(message.id, emoji)
  }

  const handleDelete = () => {
    onDeleteMessage?.(message.id)
  }

  // Get the correct sender name based on session and message data
  const getDisplayName = (senderName: string, senderId: number) => {
    // If it's the current user's message, use session name
    if (isOwnMessage && session?.user?.name) {
      return session.user.name
    }
    
    // For other users, map the database names to display names
    switch (senderName?.toLowerCase()) {
      case 'doctor':
        return 'Dr. Martin Dupont'
      case 'secretary':
        return '' // Empty string for secretary
      default:
        return senderName || 'Unknown'
    }
  }
  
  const senderName = getDisplayName(message.senderName, message.senderId)

  return (
    <div className={`flex gap-3 ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
      {!isOwnMessage && (
        <Avatar className="h-8 w-8 mt-1">
          <AvatarImage src="/avatars/default.jpg" />
          <AvatarFallback className="text-xs">
            {senderName.split(' ').map(n => n[0]).join('')}
          </AvatarFallback>
        </Avatar>
      )}
      
      <div className={`flex flex-col max-w-[70%] ${isOwnMessage ? 'items-end' : 'items-start'}`}>
        {!isOwnMessage && (
          <p className="text-xs text-muted-foreground mb-1 font-medium">{senderName}</p>
        )}
        
        <div className={`relative group ${isOwnMessage ? 'order-2' : 'order-1'}`}>
          <div
            className={`px-4 py-2 rounded-lg ${
              isOwnMessage
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted'
            }`}
          >
            <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
          </div>
          
          {/* Actions menu */}
          <div className={`absolute top-1 ${isOwnMessage ? '-left-12' : '-right-12'} opacity-0 group-hover:opacity-100 transition-opacity`}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  <MoreHorizontal className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align={isOwnMessage ? 'end' : 'start'}>
                <DropdownMenuItem onClick={() => handleReaction('👍')}>
                  👍 Réagir
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleReaction('❤️')}>
                  ❤️ Réagir
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleReaction('😊')}>
                  😊 Réagir
                </DropdownMenuItem>
                {isOwnMessage && onDeleteMessage && (
                  <DropdownMenuItem onClick={handleDelete} className="text-destructive">
                    Supprimer
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        {/* Message metadata */}
        <div className={`flex items-center gap-2 mt-1 ${isOwnMessage ? 'order-1' : 'order-2'}`}>
          <span className="text-xs text-muted-foreground">
            {formatTime(message.createdAt)}
          </span>
          
          {isOwnMessage && (
            <div className="flex items-center">
              {message.isRead ? (
                <CheckCheck className="h-3 w-3 text-blue-500" />
              ) : (
                <Check className="h-3 w-3 text-muted-foreground" />
              )}
            </div>
          )}
        </div>
        
        {/* Reactions */}
        {message.reactions && message.reactions.length > 0 && (
          <div className={`flex flex-wrap gap-1 mt-1 ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
            {message.reactions.map((reaction) => (
              <Badge
                key={reaction.id}
                variant="secondary"
                className="text-xs px-2 py-1 cursor-pointer hover:bg-secondary/80"
                onClick={() => handleReaction(reaction.emoji)}
              >
                {reaction.emoji} {reaction.userName}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  )
} 