'use client'

import { MessageBubble } from './MessageBubble'
import { ChatMessage } from '@/types/chat'

interface MessageBubblesProps {
  messages: ChatMessage[]
  currentUserId?: number
  onAddReaction: (messageId: number, emoji: string) => void
  onDeleteMessage?: (messageId: number) => void
}

export function MessageBubbles({ 
  messages, 
  currentUserId, 
  onAddReaction, 
  onDeleteMessage 
}: MessageBubblesProps) {
  return (
    <div className="space-y-4">
      {messages.map((message) => (
        <MessageBubble
          key={message.id}
          message={message}
          isOwnMessage={message.senderId === currentUserId}
          onAddReaction={onAddReaction}
          onDeleteMessage={onDeleteMessage}
          currentUserId={currentUserId}
        />
      ))}
    </div>
  )
}
