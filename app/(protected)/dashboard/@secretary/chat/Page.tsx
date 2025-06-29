'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { ChatInterface } from '@/components/modules/chat'
import { useChat } from '@/hooks/UseChat'
import { ChatParticipant } from '@/types/chat'
import { UserRoles } from '@/types'

export default function SecretaryChatPage() {
  const { data: session } = useSession()
  const [selectedParticipant, setSelectedParticipant] = useState<ChatParticipant | null>(null)
  const [isClient, setIsClient] = useState(false)

  // Handle hydration
  if (typeof window !== 'undefined' && !isClient) {
    setIsClient(true)
  }

  const {
    participants,
    messages,
    unreadCount,
    isLoading,
    error,
    isSending,
    isDeletingAll,
    sendMessage,
    addReaction,
    deleteMessage,
    deleteAllMessages,
    markAsRead
  } = useChat()

  const handleSelectParticipant = (participant: ChatParticipant) => {
    setSelectedParticipant(participant)
    // Mark messages as read when selecting a participant
    markAsRead(participant.id)
  }

  const handleSendMessage = (content: string) => {
    if (selectedParticipant) {
      sendMessage(content)
    }
  }

  const handleAddReaction = (messageId: number, emoji: string) => {
    addReaction(messageId, emoji)
  }

  const handleDeleteMessage = (messageId: number) => {
    deleteMessage(messageId)
  }

  const handleDeleteAllMessages = () => {
    deleteAllMessages()
  }

  // Get current user ID from session
  const currentUserId = session?.user?.id ? parseInt(session.user.id as string) : 3 // Default to 3 for secretary

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2" />
          <p>Chargement du chat...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center text-red-500">
          <p>Erreur: {error}</p>
        </div>
      </div>
    )
  }

  return (
    <ChatInterface
      participants={participants}
      messages={messages}
      selectedParticipant={selectedParticipant}
      onSelectParticipant={handleSelectParticipant}
      onSendMessage={handleSendMessage}
      onAddReaction={handleAddReaction}
      onDeleteMessage={handleDeleteMessage}
      onDeleteAllMessages={handleDeleteAllMessages}
      isSending={isSending}
      isDeletingAll={isDeletingAll}
      currentUserId={currentUserId}
      unreadCount={unreadCount}
      title="Chat - Secrétaire"
      participantRole="DOCTOR"
    />
  )
} 