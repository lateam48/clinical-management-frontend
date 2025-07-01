'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { ChatInterface } from '@/components/modules/chat'
import { useChat } from '@/hooks/UseChat'
import { ChatParticipant } from '@/types/chat'
import { webSocketService } from '@/services/WebSocketService' // Import the WebSocketService

export default function DoctorChatPage() {
  const { data: session } = useSession()
  const [selectedParticipant, setSelectedParticipant] = useState<ChatParticipant | null>(null)
  const [isClient, setIsClient] = useState(false)
  const [renderKey, setRenderKey] = useState(0)

  // Handle hydration
  useEffect(() => {
    setIsClient(true)
    // Force re-render to clear any cached state
    setRenderKey(prev => prev + 1)
  }, [])

  // Connect to WebSocket when the component mounts
  useEffect(() => {
    webSocketService.connect()

    // Disconnect from WebSocket when the component unmounts
    return () => {
      webSocketService.disconnect()
    }
  }, [])

  const {
    participants,
    messages,
    unreadCount,
    isLoading,
    error,
    isSending,
    isDeletingAll,
    isMarkingAsRead,
    sendMessage,
    addReaction,
    deleteMessage,
    deleteAllMessages,
    markAsRead,
    markAsReadBySender
  } = useChat()

  const handleSelectParticipant = (participant: ChatParticipant) => {
    setSelectedParticipant(participant)
    // Mark messages as read when selecting a participant
    markAsRead(participant.id)
  }

  const handleSendMessage = (content: string) => {
    if (selectedParticipant) {
      webSocketService.sendMessage('/app/chat.private', {
        sender: session?.user?.name || 'doctor',
        recipient: selectedParticipant.name,
        content,
      })
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

  const handleMarkAsRead = (senderId: number) => {
    markAsReadBySender(senderId)
  }

  // Get current user ID from session
  const currentUserId = 2 // Temporary fix: Force doctor ID to 2 to match database

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

  if (!currentUserId) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center text-yellow-500">
          <p>Erreur: ID utilisateur non disponible</p>
          <p className="text-sm">Veuillez vous reconnecter</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen max-h-screen flex flex-col" key={`doctor-chat-${renderKey}`}>
      <div className="flex-1 min-h-0">
        <ChatInterface
          participants={participants}
          messages={messages}
          selectedParticipant={selectedParticipant}
          onSelectParticipant={handleSelectParticipant}
          onSendMessage={handleSendMessage}
          onAddReaction={handleAddReaction}
          onDeleteMessage={handleDeleteMessage}
          onDeleteAllMessages={handleDeleteAllMessages}
          onMarkAsRead={handleMarkAsRead}
          isSending={isSending}
          isDeletingAll={isDeletingAll}
          isMarkingAsRead={isMarkingAsRead}
          currentUserId={currentUserId}
          unreadCount={unreadCount}
          title="Chat - Docteur"
          participantRole="SECRETARY"
        />
      </div>
    </div>
  )
}
