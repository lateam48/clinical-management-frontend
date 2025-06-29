'use client'

import { useState, useEffect } from 'react'
import { DoctorDashboard } from "@/components/modules/dashboard/doctor/home"
import { ChatInterface } from '@/components/modules/chat'
import { useChat } from '@/hooks/UseChat'
import { ChatParticipant } from '@/types/chat'
import { useSearchParams } from 'next/navigation'

export default function DoctorDashboardPage() {
    const searchParams = useSearchParams()
    const view = searchParams.get('view')
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
        selectParticipant,
        selectedParticipant
    } = useChat()

    const handleSelectParticipant = (participant: ChatParticipant) => {
        selectParticipant(participant)
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

    // Mock current user ID (in real app, this would come from auth)
    const currentUserId = 2
    
    // Show chat if view=chat parameter is present
    if (view === 'chat') {
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

    return <DoctorDashboard />
}
