'use client'

import { useState } from 'react'
import { Check, CheckCheck, MoreHorizontal } from 'lucide-react'
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
}

export function MessageBubble({
  message,
  isOwnMessage,
  onAddReaction,
  onDeleteMessage,
}: Readonly<MessageBubbleProps>) {
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

  // Use the real sender name from the message
  const senderName = message.senderName || ''

  // Own messages go to the left with gray background
  // Received messages go to the right with blue background
  const shouldShowOnRight = !isOwnMessage
  const shouldShowBlueBackground = !isOwnMessage

  return (
    <div className={`flex gap-3 ${shouldShowOnRight ? 'justify-end' : 'justify-start'}`}>
      {!shouldShowOnRight && (
        <Avatar className="h-8 w-8 mt-1">
          <AvatarImage src="/avatars/default.jpg" />
          <AvatarFallback className="text-xs">
            {senderName.split(' ').map(n => n[0]).join('')}
          </AvatarFallback>
        </Avatar>
      )}
      
      <div className={`flex flex-col max-w-[85%] ${shouldShowOnRight ? 'items-end' : 'items-start'}`}>
        <div className={`relative group ${shouldShowOnRight ? 'order-2' : 'order-1'}`}>
          <div
            className={`px-4 py-2 rounded-lg ${
              shouldShowBlueBackground
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-900'
            }`}
          >
            <p className="text-sm whitespace-pre-wrap break-words leading-relaxed">{message.content}</p>
          </div>
          
          {/* Actions menu */}
          <div className={`absolute top-1 ${shouldShowOnRight ? '-left-12' : '-right-12'} opacity-0 group-hover:opacity-100 transition-opacity`}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  <MoreHorizontal className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align={shouldShowOnRight ? 'end' : 'start'}>
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
        <div className={`flex items-center gap-2 mt-1 ${shouldShowOnRight ? 'order-1' : 'order-2'}`}>
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
        {message.reactions && Array.isArray(message.reactions) && message.reactions.length > 0 && (
          <div className={`flex flex-wrap gap-1 mt-1 ${shouldShowOnRight ? 'justify-end' : 'justify-start'}`}>
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