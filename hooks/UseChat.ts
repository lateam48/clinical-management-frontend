import { useEffect, useCallback, useState, useMemo } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { queryClient } from '@/providers'
import { chatService } from '@/services/ChatService'
import { useChatStore } from '@/stores/chatStore'
import { useUserStore } from '@/stores/userStore'
import { toast } from 'sonner'
import { SendMessageRequest, ChatParticipant } from '@/types'

export const useChat = () => {
  const [isClient, setIsClient] = useState(false)
  
  const user = useUserStore((state) => state.user)
  const {
    conversations,
    currentConversation,
    messages,
    participants,
    selectedParticipant,
    unreadCount,
    setConversations,
    setMessages,
    addMessage,
    setParticipants,
    setSelectedParticipant,
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
  const CHAT_KEYS = useMemo(() => ({
    conversations: ['chat', 'conversations'],
    participants: ['chat', 'participants'],
    messages: (userId?: number) => ['chat', 'messages', userId],
    unreadCount: ['chat', 'unread-count']
  }), []);

  // Fetch conversations
  const conversationsQuery = useQuery({
    queryKey: CHAT_KEYS.conversations,
    queryFn: async () => {
      const response = await chatService.getConversations()
      if (response.success) {
        setConversations(response.data)
        return response.data
      }
      return []
    },
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
      return []
    },
  })

  const messagesQuery = useQuery({
    queryKey: CHAT_KEYS.messages(selectedParticipant?.id),
    queryFn: async () => {
      if (!selectedParticipant) return []
      const response = await chatService.getConversation(selectedParticipant.id)
      if (response.success) {
        setMessages(response.data)
        return response.data
      }
      return []
    },
    enabled: !!selectedParticipant && isClient,
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
      return 0
    },
    enabled: isClient,
  })

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (request: SendMessageRequest) => {
      const response = await chatService.sendMessage(request)
      if (response.success) {
        return response.data
      }
    },
    onSuccess: (newMessage) => {
      if (newMessage) {
        addMessage(newMessage);
        queryClient.invalidateQueries({ queryKey: CHAT_KEYS.conversations });
        queryClient.invalidateQueries({ queryKey: CHAT_KEYS.unreadCount });
      }
    },
    onError: () => {
      toast.error('Erreur lors de l\'envoi du message')
    }
  })

  // Add reaction mutation
  const addReactionMutation = useMutation({
    mutationFn: async ({ messageId, emoji }: { messageId: string; emoji: string }) => {
      const response = await chatService.addReaction(messageId, emoji)
      if (response.success) {
        return { messageId, emoji }
      }
      throw new Error(response.message ?? 'Erreur lors de l\'ajout de la réaction')
    },
    onSuccess: ({ messageId, emoji }) => {
      // Create a MessageReaction object and update the store
      const newReaction = {
        id: Date.now().toString(),
        emoji,
        userId: user?.id ?? 0,
        userName: user ? `${user.firstName} ${user.lastName}`.trim() : '',
        timestamp: new Date().toISOString()
      };
      addReactionToMessage(messageId, newReaction);
    },
    onError: () => {
      toast.error('Erreur lors de l\'ajout de la réaction')
    }
  })

  // Mark as read mutation
  const markAsReadMutation = useMutation({
    mutationFn: async (senderId: number) => {
      const response = await chatService.markAsRead(senderId)
      if (response.success) {
        return response.data
      }
      return null
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CHAT_KEYS.unreadCount })
      queryClient.invalidateQueries({ queryKey: CHAT_KEYS.messages(selectedParticipant?.id) })
    },
    onError: () => {
      toast.error('Erreur lors du marquage comme lu')
    }
  })

  // Delete message mutation
  const deleteMessageMutation = useMutation({
    mutationFn: async (messageId: string) => {
      const response = await chatService.deleteMessage(messageId)
      if (response.success) {
        return response.data
      }
      return null
    },
    onSuccess: (_, messageId) => {
      removeMessage(messageId)
    },
    onError: () => {
      toast.error('Erreur lors de la suppression du message')
    }
  })

  // Delete all messages mutation
  const deleteAllMessagesMutation = useMutation({
    mutationFn: async () => {
      const response = await chatService.deleteAllMessages()
      if (response.success) {
        return response.data
      }
      return null
    },
    onSuccess: () => {
      clearMessages()
      queryClient.invalidateQueries({ queryKey: CHAT_KEYS.conversations })
      queryClient.invalidateQueries({ queryKey: CHAT_KEYS.unreadCount })
    },
    onError: () => {
      toast.error('Erreur lors de la suppression de tous les messages')
    }
  })

  // Actions
  const selectParticipant = useCallback((participant: ChatParticipant) => {
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
  }, [isClient, CHAT_KEYS])

  return {
    // State
    conversations,
    currentConversation,
    messages,
    participants,
    selectedParticipant,
    isLoading: conversationsQuery.isLoading || participantsQuery.isLoading || messagesQuery.isLoading,
    error: conversationsQuery.error || participantsQuery.error || messagesQuery.error || unreadCountQuery.error,
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
