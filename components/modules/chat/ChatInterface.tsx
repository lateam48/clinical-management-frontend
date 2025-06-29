'use client'

import { useState } from 'react'
import { Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ParticipantList } from './ParticipantList'
import { ChatArea } from './ChatArea'
import { ChatMessage, ChatParticipant } from '@/types/chat'

interface ChatInterfaceProps {
  participants: ChatParticipant[]
  messages: ChatMessage[]
  selectedParticipant: ChatParticipant | null
  onSelectParticipant: (participant: ChatParticipant) => void
  onSendMessage: (content: string) => void
  onAddReaction: (messageId: string, emoji: string) => void
  onDeleteMessage?: (messageId: string) => void
  onDeleteAllMessages?: () => void
  isSending?: boolean
  isDeletingAll?: boolean
  currentUserId?: number
  unreadCount?: number
  title: string
  participantRole: 'DOCTOR' | 'SECRETARY'
}

export function ChatInterface({
  participants,
  messages,
  selectedParticipant,
  onSelectParticipant,
  onSendMessage,
  onAddReaction,
  onDeleteMessage,
  onDeleteAllMessages,
  isSending = false,
  isDeletingAll = false,
  currentUserId,
  unreadCount = 0,
  title,
  participantRole
}: ChatInterfaceProps) {
  const [isClient, setIsClient] = useState(false)

  // Handle hydration
  if (typeof window !== 'undefined' && !isClient) {
    setIsClient(true)
  }

  // Filter participants by role
  const availableParticipants = participants.filter(participant => participant.role === participantRole)

  const getParticipantTitle = () => {
    return participantRole === 'SECRETARY' ? 'Secrétaires' : 'Docteurs'
  }

  const getParticipantPlaceholder = () => {
    return participantRole === 'SECRETARY' ? 'Sélectionner un secrétaire' : 'Sélectionner un docteur'
  }

  const getParticipantEmptyMessage = () => {
    return participantRole === 'SECRETARY' ? 'Aucun secrétaire disponible' : 'Aucun docteur disponible'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{title}</h1>
          <p className="text-muted-foreground">Chat privé avec les {participantRole === 'SECRETARY' ? 'secrétaires' : 'docteurs'}</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary">
            {unreadCount} message{unreadCount > 1 ? 's' : ''} non lu{unreadCount > 1 ? 's' : ''}
          </Badge>
          {onDeleteAllMessages && (
            <Button 
              variant="destructive" 
              size="sm"
              onClick={onDeleteAllMessages}
              disabled={isDeletingAll}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Tout supprimer
            </Button>
          )}
        </div>
      </div>

      {/* Chat layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Participants */}
        <ParticipantList
          participants={availableParticipants}
          selectedParticipant={selectedParticipant}
          onSelectParticipant={onSelectParticipant}
          title={getParticipantTitle()}
          placeholder={getParticipantPlaceholder()}
          emptyMessage={getParticipantEmptyMessage()}
          currentUserId={currentUserId}
        />

        {/* Chat area */}
        <div className="lg:col-span-2">
          <ChatArea
            messages={messages}
            selectedParticipant={selectedParticipant}
            onSendMessage={onSendMessage}
            onAddReaction={onAddReaction}
            onDeleteMessage={onDeleteMessage}
            isSending={isSending}
            currentUserId={currentUserId}
            unreadCount={unreadCount}
          />
        </div>
      </div>
    </div>
  )
} 