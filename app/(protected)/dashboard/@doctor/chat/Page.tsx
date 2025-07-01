'use client'

import { useState } from 'react'
import { ChatInterface } from '@/components/modules/chat'
import { useChat } from '@/hooks/UseChat'
import { ChatParticipant } from '@/types/chat'
import { webSocketService } from '@/services/WebSocketService' // Import the WebSocketService

export default function DoctorChatPage() {
  const [selectedParticipant, setSelectedParticipant] = useState<ChatParticipant | null>(null)
  const [isClient, setIsClient] = useState(false)

  // Handle hydration
  if (typeof window !== 'undefined' && !isClient) {
    setIsClient(true)
  }

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
      webSocketService.sendMessage('/app/chat.private', {
        sender: session?.user?.name || 'doctor',
        recipient: selectedParticipant.name,
        content,
      })
    }
  }

  const handleAddReaction = (messageId: string, emoji: string) => {
    addReaction(messageId, emoji)
  }

  const handleDeleteMessage = (messageId: string) => {
    deleteMessage(messageId)
  }

  const handleDeleteAllMessages = () => {
    deleteAllMessages()
  }

  // Mock current user ID (in real app, this would come from auth)
  const currentUserId = 1

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
      title="Chat - Docteur"
      participantRole="SECRETARY"
    />
  )
}
