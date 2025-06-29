import { useEffect, useCallback, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { chatService } from '@/services/ChatService'
import { useChatStore } from '@/stores/ChtatStore'
import { toast } from 'sonner'
import { SendMessageRequest } from '@/types/chat'

export const useChat = () => {
  const queryClient = useQueryClient()
  const [isClient, setIsClient] = useState(false)
  
  const {
    conversations,
    currentConversation,
    messages,
    participants,
    selectedParticipant,
    isLoading,
    error,
    unreadCount,
    setConversations,
    setCurrentConversation,
    setMessages,
    addMessage,
    setParticipants,
    setSelectedParticipant,
    setLoading,
    setError,
    setUnreadCount,
    markMessageAsRead,
    addReactionToMessage,
    removeMessage,
    clearMessages,
    updateParticipantStatus
  } = useChatStore()

  // Fix hydration issue
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Query Keys
  const CHAT_KEYS = {
    conversations: ['chat', 'conversations'],
    participants: ['chat', 'participants'],
    messages: (userId?: number) => ['chat', 'messages', userId],
    unreadCount: ['chat', 'unread-count']
  }

  // Fetch conversations
  const conversationsQuery = useQuery({
    queryKey: CHAT_KEYS.conversations,
    queryFn: async () => {
      const response = await chatService.getConversations()
      if (response.success) {
        setConversations(response.data)
        return response.data
      }
      throw new Error(response.message || 'Erreur lors du chargement des conversations')
    },
    onError: (error) => {
      setError(error.message)
      toast.error('Erreur', {
        description: 'Impossible de charger les conversations'
      })
    }
  })

  // Fetch participants
  const participantsQuery = useQuery({
    queryKey: CHAT_KEYS.participants,
    queryFn: async () => {
      const response = await chatService.getParticipants()
      if (response.success) {
        setParticipants(response.data)
        return response.data
      }
      throw new Error(response.message || 'Erreur lors du chargement des participants')
    },
    onError: (error) => {
      setError(error.message)
      toast.error('Erreur', {
        description: 'Impossible de charger les participants'
      })
    }
  })

  // Fetch messages for a specific conversation
  const messagesQuery = useQuery({
    queryKey: CHAT_KEYS.messages(selectedParticipant?.id),
    queryFn: async () => {
      if (!selectedParticipant) return []
      const response = await chatService.getConversation(selectedParticipant.id)
      if (response.success) {
        setMessages(response.data)
        return response.data
      }
      throw new Error(response.message || 'Erreur lors du chargement des messages')
    },
    enabled: !!selectedParticipant && isClient,
    onError: (error) => {
      setError(error.message)
      toast.error('Erreur', {
        description: 'Impossible de charger les messages'
      })
    }
  })

  // Fetch unread count
  const unreadCountQuery = useQuery({
    queryKey: CHAT_KEYS.unreadCount,
    queryFn: async () => {
      const response = await chatService.getUnreadCount()
      if (response.success) {
        setUnreadCount(response.data)
        return response.data
      }
      throw new Error(response.message || 'Erreur lors du chargement du nombre de messages non lus')
    },
    enabled: isClient,
    onError: (error) => {
      setError(error.message)
    }
  })

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (request: SendMessageRequest) => {
      const response = await chatService.sendMessage(request)
      if (response.success) {
        return response.data
      }
      throw new Error(response.message || 'Erreur lors de l\'envoi du message')
    },
    onSuccess: (newMessage) => {
      addMessage(newMessage)
      queryClient.invalidateQueries({ queryKey: CHAT_KEYS.conversations })
      queryClient.invalidateQueries({ queryKey: CHAT_KEYS.unreadCount })
      toast.success('Message envoyé')
    },
    onError: (error) => {
      toast.error('Erreur', {
        description: 'Impossible d\'envoyer le message'
      })
    }
  })

  // Add reaction mutation
  const addReactionMutation = useMutation({
    mutationFn: async ({ messageId, emoji }: { messageId: string; emoji: string }) => {
      const response = await chatService.addReaction(messageId, emoji)
      if (response.success) {
        return { messageId, emoji }
      }
      throw new Error(response.message || 'Erreur lors de l\'ajout de la réaction')
    },
    onSuccess: ({ messageId, emoji }) => {
      const newReaction = {
        id: Date.now().toString(),
        emoji,
        userId: 1, // Mock current user ID
        userName: 'Dr. Martin Dupont', // Mock current user name
        timestamp: new Date().toISOString()
      }
      addReactionToMessage(messageId, newReaction)
      toast.success('Réaction ajoutée')
    },
    onError: (error) => {
      toast.error('Erreur', {
        description: 'Impossible d\'ajouter la réaction'
      })
    }
  })

  // Mark as read mutation
  const markAsReadMutation = useMutation({
    mutationFn: async (senderId: number) => {
      const response = await chatService.markAsRead(senderId)
      if (response.success) {
        return response.data
      }
      throw new Error(response.message || 'Erreur lors du marquage comme lu')
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CHAT_KEYS.unreadCount })
      queryClient.invalidateQueries({ queryKey: CHAT_KEYS.messages(selectedParticipant?.id) })
    },
    onError: (error) => {
      toast.error('Erreur', {
        description: 'Impossible de marquer comme lu'
      })
    }
  })

  // Delete message mutation
  const deleteMessageMutation = useMutation({
    mutationFn: async (messageId: string) => {
      const response = await chatService.deleteMessage(messageId)
      if (response.success) {
        return response.data
      }
      throw new Error(response.message || 'Erreur lors de la suppression du message')
    },
    onSuccess: (_, messageId) => {
      removeMessage(messageId)
      toast.success('Message supprimé')
    },
    onError: (error) => {
      toast.error('Erreur', {
        description: 'Impossible de supprimer le message'
      })
    }
  })

  // Delete all messages mutation
  const deleteAllMessagesMutation = useMutation({
    mutationFn: async () => {
      const response = await chatService.deleteAllMessages()
      if (response.success) {
        return response.data
      }
      throw new Error(response.message || 'Erreur lors de la suppression de tous les messages')
    },
    onSuccess: () => {
      clearMessages()
      queryClient.invalidateQueries({ queryKey: CHAT_KEYS.conversations })
      queryClient.invalidateQueries({ queryKey: CHAT_KEYS.unreadCount })
      toast.success('Tous les messages ont été supprimés')
    },
    onError: (error) => {
      toast.error('Erreur', {
        description: 'Impossible de supprimer tous les messages'
      })
    }
  })

  // Actions
  const selectParticipant = useCallback((participant: any) => {
    setSelectedParticipant(participant)
    if (participant) {
      markAsReadMutation.mutate(participant.id)
    }
  }, [setSelectedParticipant, markAsReadMutation])

  const sendMessage = useCallback((content: string) => {
    if (!selectedParticipant) {
      toast.error('Aucun participant sélectionné')
      return
    }
    
    sendMessageMutation.mutate({
      content,
      recipientId: selectedParticipant.id
    })
  }, [selectedParticipant, sendMessageMutation])

  const addReaction = useCallback((messageId: string, emoji: string) => {
    addReactionMutation.mutate({ messageId, emoji })
  }, [addReactionMutation])

  const deleteMessage = useCallback((messageId: string) => {
    deleteMessageMutation.mutate(messageId)
  }, [deleteMessageMutation])

  const deleteAllMessages = useCallback(() => {
    deleteAllMessagesMutation.mutate()
  }, [deleteAllMessagesMutation])

  // Auto-refresh unread count
  useEffect(() => {
    if (!isClient) return
    
    const interval = setInterval(() => {
      queryClient.invalidateQueries({ queryKey: CHAT_KEYS.unreadCount })
    }, 30000) // Refresh every 30 seconds

    return () => clearInterval(interval)
  }, [queryClient, isClient])

  return {
    // State
    conversations,
    currentConversation,
    messages,
    participants,
    selectedParticipant,
    isLoading: isLoading || conversationsQuery.isLoading || participantsQuery.isLoading || messagesQuery.isLoading,
    error,
    unreadCount,
    isClient,

    // Actions
    selectParticipant,
    sendMessage,
    addReaction,
    deleteMessage,
    deleteAllMessages,
    markMessageAsRead,
    updateParticipantStatus,

    // Mutations state
    isSending: sendMessageMutation.isPending,
    isAddingReaction: addReactionMutation.isPending,
    isDeleting: deleteMessageMutation.isPending,
    isDeletingAll: deleteAllMessagesMutation.isPending
  }
}
