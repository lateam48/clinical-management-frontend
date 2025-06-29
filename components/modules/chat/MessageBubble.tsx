'use client'

import { useState } from 'react'
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
  onAddReaction?: (messageId: string, emoji: string) => void
  onDeleteMessage?: (messageId: string) => void
  currentUserId?: number
}

export function MessageBubble({
  message,
  isOwnMessage,
  onAddReaction,
  onDeleteMessage,
  currentUserId
}: MessageBubbleProps) {
  const [isClient, setIsClient] = useState(false)

  // Handle hydration
  if (typeof window !== 'undefined' && !isClient) {
    setIsClient(true)
  }

  const formatTime = (timestamp: string) => {
    if (!isClient) return ''
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  const handleReaction = (emoji: string) => {
    onAddReaction?.(message.id, emoji)
  }

  const handleDelete = () => {
    onDeleteMessage?.(message.id)
  }

  return (
    <div className={`flex gap-3 ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
      {!isOwnMessage && (
        <Avatar className="h-8 w-8 mt-1">
          <AvatarImage src="/avatars/default.jpg" />
          <AvatarFallback className="text-xs">
            {message.senderName.split(' ').map(n => n[0]).join('')}
          </AvatarFallback>
        </Avatar>
      )}
      
      <div className={`flex flex-col max-w-[70%] ${isOwnMessage ? 'items-end' : 'items-start'}`}>
        {!isOwnMessage && (
          <p className="text-xs text-muted-foreground mb-1">{message.senderName}</p>
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
            {formatTime(message.timestamp)}
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