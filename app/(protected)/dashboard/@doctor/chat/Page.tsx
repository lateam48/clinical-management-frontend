'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { ChatInterface } from '@/components/modules/chat'
import { useChat } from '@/hooks/UseChat'
import { ChatParticipant } from '@/types/chat'
import { UserRoles } from '@/types'

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
    console.log('=== SELECTING PARTICIPANT ===')
    console.log('Selected participant:', participant)
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

  const handleMarkAsRead = (senderId: number) => {
    markAsReadBySender(senderId)
  }

  // Get current user ID from session
  const currentUserId = 2 // Temporary fix: Force doctor ID to 2 to match database

  // Debug: Log session and currentUserId
  console.log('=== DOCTOR CHAT DEBUG ===')
  console.log('Doctor Chat - Current User ID:', currentUserId)
  console.log('Doctor Chat - Session User ID:', session?.user?.id)
  console.log('Doctor Chat - Session User:', session?.user)
  console.log('Doctor Chat - Render Key:', renderKey)
  console.log('Doctor Chat - Is Client:', isClient)
  console.log('========================')

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
      {/* Debug Section */}
      <div className="p-4 bg-red-100 border border-red-300 rounded-lg flex-shrink-0 mb-4">
        <h3 className="font-bold mb-2 text-red-800">🚨 CRITICAL DEBUG INFO:</h3>
        <div className="text-sm space-y-1 text-red-700">
          <div><strong>Current User ID:</strong> {currentUserId}</div>
          <div><strong>Render Key:</strong> {renderKey}</div>
          <div><strong>Is Client:</strong> {isClient ? 'Yes' : 'No'}</div>
          <div><strong>Messages Count:</strong> {messages.length}</div>
          <div><strong>Selected Participant:</strong> {selectedParticipant?.name || 'None'} (ID: {selectedParticipant?.id || 'None'})</div>
          <div><strong>Available Participants:</strong> {participants.length}</div>
          <div><strong>Raw Messages:</strong></div>
          <pre className="text-xs bg-white p-2 rounded border overflow-auto max-h-32">
            {JSON.stringify(messages.map(m => ({ id: m.id, senderId: m.senderId, content: m.content.substring(0, 30) })), null, 2)}
          </pre>
          
          {/* Temporary test buttons */}
          <div className="mt-4 space-y-2">
            <h4 className="font-semibold">🧪 TEST BUTTONS:</h4>
            <button 
              onClick={() => {
                const firstSecretary = participants.find(p => p.role === 'SECRETARY')
                if (firstSecretary) {
                  console.log('Force selecting first secretary:', firstSecretary)
                  handleSelectParticipant(firstSecretary)
                }
              }}
              className="px-3 py-1 bg-blue-500 text-white rounded text-xs"
            >
              Force Select First Secretary
            </button>
            <button 
              onClick={() => {
                console.log('Current participants:', participants)
                console.log('Current messages:', messages)
              }}
              className="px-3 py-1 bg-green-500 text-white rounded text-xs ml-2"
            >
              Log All Data
            </button>
          </div>
        </div>
      </div>

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