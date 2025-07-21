import { useEffect, useCallback, useState, useMemo } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { queryClient } from '@/providers'
import { chatService } from '@/services/chatService'
import { useChatStore } from '@/stores/chatStore'
import { useUserStore } from '@/stores/userStore'
import { toast } from 'sonner'
import { SendMessageRequest, ChatParticipant, ChatMessage } from '@/types';
import { getSession } from 'next-auth/react'
import { useStaff } from '@/hooks/useUsers'
import { stompChatService } from '@/lib/chat';

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

  // Fetch staff as chat participants
  const { getStaff } = useStaff();
  useEffect(() => {
    if (getStaff.data) {
      setParticipants(
        getStaff.data
          .filter(user => user.role === 'DOCTOR' || user.role === 'SECRETARY')
          .map((user) => ({
            id: user.id,
            name: (user.firstName && user.lastName) ? `${user.firstName} ${user.lastName}` : user.email || '',
            username: user.username || user.email,
            role: user.role as 'DOCTOR' | 'SECRETARY',
            avatar: 'avatar' in user ? (user as { avatar?: string }).avatar : undefined,
            isOnline: false,
            lastSeen: undefined,
          }))
      );
    }
  }, [getStaff.data, setParticipants]);

  // Fix hydration issue
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Query Keys
  const CHAT_KEYS = useMemo(() => ({
    conversations: ['chat', 'conversations'],
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

  const messagesQuery = useQuery({
    queryKey: CHAT_KEYS.messages(selectedParticipant?.id),
    queryFn: async () => {
      if (!selectedParticipant) return []
      const response = await chatService.getConversation(selectedParticipant.id)
      if (response.success) {
        // Merge new messages with existing ones, avoiding duplicates
        const allMessages = [...messages];
        response.data.forEach((msg) => {
          if (!allMessages.some((m) => m.id === msg.id)) {
            allMessages.push(msg);
          }
        });
        setMessages(allMessages);
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
      recipientName: selectedParticipant.username
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

  // --- WebSocket Integration (STOMP/SockJS) ---
  useEffect(() => {
    let disconnect: (() => void) | undefined;
    let active = true;
    (async () => {
      if (!user) return;
      const session = await getSession();
      const token = session?.accessToken;
      if (!token) return;
      stompChatService.connect(token);
      disconnect = stompChatService.onMessage((message) => {
        if (!active) return;
        const msg = message as ChatMessage;
        // Only add if the message is for the current conversation
        if (
          selectedParticipant &&
          (msg.senderId === selectedParticipant.id || msg.senderId === user?.id)
        ) {
          addMessage(msg);
        }
      });
    })();
    return () => {
      active = false;
      stompChatService.disconnect();
      if (disconnect) disconnect();
    };
  }, [user, addMessage, selectedParticipant]);

  return {
    // State
    conversations,
    currentConversation,
    messages,
    participants,
    selectedParticipant,
    isLoading: conversationsQuery.isLoading || messagesQuery.isLoading,
    error: conversationsQuery.error || messagesQuery.error || unreadCountQuery.error,
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
