import { useEffect, useCallback, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { chatService } from '@/services/ChatService'
import { useChatStore } from '@/stores/ChtatStore'
import { toast } from 'sonner'

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
    messages: (conversationId?: string) => ['chat', 'messages', conversationId],
    unreadCount: ['chat', 'unread-count']
  }

  // Fetch conversations
  const conversationsQuery = useQuery({
    queryKey: CHAT_KEYS.conversations,
    queryFn: async () => {
      const data = await chatService.getConversations()
      setConversations(data)
      return data
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
      const data = await chatService.getParticipants()
      setParticipants(data)
      return data
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
    queryKey: CHAT_KEYS.messages(currentConversation?.id),
    queryFn: async () => {
      const data = await chatService.getMessages()
      setMessages(data)
      return data
    },
    enabled: isClient,
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
      const data = await chatService.getUnreadCount()
      setUnreadCount(data)
      return data
    },
    enabled: isClient,
    onError: (error) => {
      setError(error.message)
    }
  })

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      if (!currentConversation?.id) {
        throw new Error('Aucune conversation sélectionnée')
      }
      return await chatService.sendMessage(currentConversation.id, content)
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
    mutationFn: async ({ messageId, emoji }: { messageId: number; emoji: string }) => {
      await chatService.addReaction(messageId, emoji)
      return { messageId, emoji }
    },
    onSuccess: ({ messageId, emoji }) => {
      const newReaction = {
        id: Date.now().toString(),
        emoji,
        userId: 1, // Mock current user ID - will be replaced with real user data
        userName: 'Dr. Martin Dupont', // Mock current user name - will be replaced with real user data
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

  // Delete message mutation
  const deleteMessageMutation = useMutation({
    mutationFn: async (messageId: number) => {
      await chatService.deleteMessage(messageId)
      return messageId
    },
    onSuccess: (messageId) => {
      removeMessage(messageId)
      queryClient.invalidateQueries({ queryKey: CHAT_KEYS.messages(currentConversation?.id) })
      queryClient.invalidateQueries({ queryKey: CHAT_KEYS.conversations })
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
      await chatService.deleteAllMessages()
    },
    onSuccess: () => {
      clearMessages()
      queryClient.invalidateQueries({ queryKey: CHAT_KEYS.messages(currentConversation?.id) })
      queryClient.invalidateQueries({ queryKey: CHAT_KEYS.conversations })
      toast.success('Tous les messages ont été supprimés')
    },
    onError: (error) => {
      toast.error('Erreur', {
        description: 'Impossible de supprimer tous les messages'
      })
    }
  })

  // Mark as read mutation
  const markAsReadMutation = useMutation({
    mutationFn: async (conversationId: string) => {
      await chatService.markAsRead(conversationId)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CHAT_KEYS.unreadCount })
      queryClient.invalidateQueries({ queryKey: CHAT_KEYS.messages(currentConversation?.id) })
    },
    onError: (error) => {
      toast.error('Erreur', {
        description: 'Impossible de marquer comme lu'
      })
    }
  })

  // Actions
  const selectParticipant = useCallback((participant: any) => {
    setSelectedParticipant(participant)
    // Find or create conversation with this participant
    const existingConversation = conversations.find(conv => 
      conv.participants.some(p => p.id === participant.id)
    )
    
    if (existingConversation) {
      setCurrentConversation(existingConversation)
      if (existingConversation.id) {
        markAsReadMutation.mutate(existingConversation.id)
      }
    } else {
      // Create new conversation - this would need to be implemented
      toast.info('Nouvelle conversation créée')
    }
  }, [setSelectedParticipant, conversations, setCurrentConversation, markAsReadMutation])

  const sendMessage = useCallback((content: string) => {
    if (!currentConversation) {
      toast.error('Aucune conversation sélectionnée')
      return
    }
    
    sendMessageMutation.mutate(content)
  }, [currentConversation, sendMessageMutation])

  const addReaction = useCallback((messageId: number, emoji: string) => {
    addReactionMutation.mutate({ messageId, emoji })
  }, [addReactionMutation])

  const deleteMessage = useCallback((messageId: number) => {
    deleteMessageMutation.mutate(messageId)
  }, [deleteMessageMutation])

  const deleteAllMessages = useCallback(() => {
    deleteAllMessagesMutation.mutate()
  }, [deleteAllMessagesMutation])

  const markAsRead = useCallback((messageId: number) => {
    // For now, just update local state
    // TODO: Implement actual API call to mark message as read
    markMessageAsRead(messageId)
  }, [markMessageAsRead])

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
    markAsRead,
    markMessageAsRead,
    updateParticipantStatus,

    // Mutations state
    isSending: sendMessageMutation.isPending,
    isAddingReaction: addReactionMutation.isPending,
    isDeletingAll: deleteAllMessagesMutation.isPending
  }
}
