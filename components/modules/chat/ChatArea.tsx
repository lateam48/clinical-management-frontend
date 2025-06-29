'use client'

import { useRef, useEffect } from 'react'
import { MessageCircle, CheckCheck } from 'lucide-react'
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
  onMarkAsRead?: (senderId: number) => void
  isSending?: boolean
  isMarkingAsRead?: boolean
  currentUserId?: number
  unreadCount?: number | { total: number; byConversation: Record<string, number> }
}

export function ChatArea({
  messages,
  selectedParticipant,
  onSendMessage,
  onAddReaction,
  onDeleteMessage,
  onMarkAsRead,
  isSending = false,
  isMarkingAsRead = false,
  currentUserId,
  unreadCount = 0
}: ChatAreaProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const isOwnMessage = (message: ChatMessage) => message.senderId === currentUserId

  // Debug: Check currentUserId and message senderIds
  console.log('ChatArea - currentUserId:', currentUserId)
  messages.forEach((msg, idx) => {
    console.log(`Message[${idx}] senderId:`, msg.senderId, '| isOwn:', msg.senderId === currentUserId)
  })
  console.log('ChatArea - Selected Participant:', selectedParticipant)

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
          <div className="flex items-center gap-2">
            {count > 0 && (
              <Badge variant="secondary">
                {count} non lu{count > 1 ? 's' : ''}
              </Badge>
            )}
            {selectedParticipant && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onMarkAsRead?.(selectedParticipant.id)}
                disabled={isMarkingAsRead || count === 0 || !onMarkAsRead}
                className="h-8 px-3"
              >
                <CheckCheck className="h-4 w-4 mr-1" />
                {isMarkingAsRead ? 'Marquage...' : 'Marquer comme lu'}
              </Button>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-0">
        {/* Messages area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {!selectedParticipant ? (
            <div className="text-center py-8 text-muted-foreground">
              <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Sélectionnez un participant pour voir les messages</p>
              {/* Debug: Show messages even without participant */}
              {messages.length > 0 && (
                <div className="mt-4 text-left">
                  <p className="font-semibold mb-2">Debug - Messages disponibles ({messages.length}):</p>
                  {messages.map((message) => (
                    <div key={message.id} className="p-2 bg-gray-100 rounded mb-2 text-xs">
                      <div><strong>ID:</strong> {message.id}</div>
                      <div><strong>Sender:</strong> {message.senderId} ({message.senderName})</div>
                      <div><strong>Content:</strong> {message.content.substring(0, 50)}...</div>
                      <div><strong>Is Own:</strong> {message.senderId === currentUserId ? 'Yes' : 'No'}</div>
                    </div>
                  ))}
                </div>
              )}
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