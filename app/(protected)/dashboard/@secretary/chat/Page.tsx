'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { ChatInterface } from '@/components/modules/chat'
import { useChat } from '@/hooks/UseChat'
import { ChatParticipant } from '@/types/chat'
import { webSocketService } from '@/services/WebSocketService' // Import the WebSocketService

export default function SecretaryChatPage() {
  const { data: session } = useSession()
  const [selectedParticipant, setSelectedParticipant] = useState<ChatParticipant | null>(null)
  const [isClient, setIsClient] = useState(false)

  // Handle hydration
  useEffect(() => {
    if (typeof window !== 'undefined' && !isClient) {
      setIsClient(true)
    }
  }, [isClient])

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
        sender: session?.user?.name || 'secretary',
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
  const currentUserId = session?.user?.id ? parseInt(session.user.id as string) : null

  // Debug: Log session and currentUserId
  console.log('Secretary Chat - Session:', session)
  console.log('Secretary Chat - Current User ID:', currentUserId)
  console.log('Secretary Chat - Session User ID:', session?.user?.id)
  console.log('Secretary Chat - Session User:', session?.user)
  console.log('Secretary Chat - Messages:', messages)

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
    <div className="space-y-6">
      {/* Debug Section */}
      <div className="p-4 bg-gray-100 rounded-lg">
        <h3 className="font-bold mb-2">Debug Info:</h3>
        <div className="text-sm space-y-1">
          <div><strong>Current User ID:</strong> {currentUserId}</div>
          <div><strong>Messages Count:</strong> {messages.length}</div>
          <div><strong>Selected Participant:</strong> {selectedParticipant?.name || 'None'}</div>
          <div><strong>Raw Messages:</strong></div>
          <pre className="text-xs bg-white p-2 rounded border overflow-auto max-h-32">
            {JSON.stringify(messages.map(m => ({ id: m.id, senderId: m.senderId, content: m.content.substring(0, 30) })), null, 2)}
          </pre>
        </div>
      </div>

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
        title="Chat - Secrétaire"
        participantRole="DOCTOR"
      />
    </div>
  )
}
