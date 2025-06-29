'use client'

import { useRef, useEffect } from 'react'
import { MessageCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MessageBubble } from './MessageBubble'
import { MessageInput } from './MessageInput'
import { ChatMessage, ChatParticipant } from '@/types/chat'

interface ChatAreaProps {
  messages: ChatMessage[]
  selectedParticipant: ChatParticipant | null
  onSendMessage: (content: string) => void
  onAddReaction: (messageId: number, emoji: string) => void
  onDeleteMessage?: (messageId: number) => void
  isSending?: boolean
  currentUserId?: number
  unreadCount?: number | { total: number; byConversation: Record<string, number> }
}

export function ChatArea({
  messages,
  selectedParticipant,
  onSendMessage,
  onAddReaction,
  onDeleteMessage,
  isSending = false,
  currentUserId,
  unreadCount = 0
}: ChatAreaProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const isOwnMessage = (message: ChatMessage) => message.senderId === currentUserId

  // Extract the count value from unreadCount
  const count = typeof unreadCount === 'object' ? unreadCount.total : (unreadCount || 0)

  return (
    <Card className="flex flex-col h-[600px]">
      <CardHeader className="flex-shrink-0">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Messages
            {selectedParticipant && (
              <span className="text-sm font-normal text-muted-foreground">
                - {selectedParticipant.name}
              </span>
            )}
          </div>
          {count > 0 && (
            <Badge variant="secondary">
              {count} non lu{count > 1 ? 's' : ''}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-0">
        {/* Messages area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {!selectedParticipant ? (
            <div className="text-center py-8 text-muted-foreground">
              <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Sélectionnez un participant pour voir les messages</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>Aucun message dans cette conversation</p>
              <p className="text-sm">Commencez à discuter !</p>
            </div>
          ) : (
            <>
              {messages.map((message) => (
                <MessageBubble
                  key={message.id}
                  message={message}
                  isOwnMessage={isOwnMessage(message)}
                  onAddReaction={onAddReaction}
                  onDeleteMessage={onDeleteMessage}
                  currentUserId={currentUserId}
                />
              ))}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Message input */}
        {selectedParticipant && (
          <MessageInput
            onSendMessage={onSendMessage}
            disabled={!selectedParticipant}
            isLoading={isSending}
            placeholder={`Message à ${selectedParticipant.name}...`}
          />
        )}
      </CardContent>
    </Card>
  )
} 