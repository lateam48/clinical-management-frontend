'use client'

import { useRef, useEffect } from 'react';
import { MessageCircle, CheckCheck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MessageBubble } from './MessageBubble';
import { MessageInput } from './MessageInput';
import { EmptyState } from '@/components/global/empty-state';
import { ChatMessage, ChatParticipant } from '@/types/chat';

interface ChatAreaProps {
  messages: ChatMessage[];
  selectedParticipant: ChatParticipant | null;
  onSendMessage: (content: string) => void;
  onAddReaction: (messageId: number, emoji: string) => void;
  onDeleteMessage?: (messageId: number) => void;
  onMarkAsRead?: (senderId: number) => void;
  isSending?: boolean;
  isMarkingAsRead?: boolean;
  currentUserId?: number;
  unreadCount?: number | { total: number; byConversation: Record<string, number> };
  reverseDisplay?: boolean;
}

export function ChatArea({
  messages,
  selectedParticipant,
  onSendMessage,
  onAddReaction,
  onDeleteMessage,
  onMarkAsRead,
  isSending = false,
  isMarkingAsRead = false,
  currentUserId,
  unreadCount = 0,
}: Readonly<ChatAreaProps>) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive, but only if user is already at bottom
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (container && messages.length > 0) {
      const isAtBottom = container.scrollHeight - container.scrollTop <= container.clientHeight + 50;
      const isUserScrolling = container.scrollTop < container.scrollHeight - container.clientHeight - 50;
      
      // Only auto-scroll if user is at the bottom or very close to it
      if (isAtBottom && !isUserScrolling) {
        setTimeout(() => {
          messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, [messages.length]); // Only trigger on message count change, not content change

  const isOwnMessage = (message: ChatMessage) => message.senderId === currentUserId;

  // Extract the count value from unreadCount
  const count = typeof unreadCount === 'object' ? unreadCount.total : unreadCount || 0;

  // Refactor nested ternary for messages area
  let messagesContent;
  // const sortedMessages = [...messages].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  const sortedMessages = messages.toSorted((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  if (!selectedParticipant) {
    messagesContent = (
      <EmptyState
        icon={MessageCircle}
        title="Aucun participant sélectionné"
        description="Sélectionnez un participant pour voir les messages"
      />
    );
  } else if (messages.length === 0) {
    messagesContent = (
      <EmptyState
        icon={MessageCircle}
        title="Aucun message"
        description="Aucun message dans cette conversation. Commencez à discuter !"
      />
    );
  } else {
    messagesContent = (
      <>
        {sortedMessages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              isOwnMessage={isOwnMessage(message)}
              onAddReaction={onAddReaction}
              onDeleteMessage={onDeleteMessage}
            />
          ))}
        <div ref={messagesEndRef} />
      </>
    );
  }

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="flex-shrink-0">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Messages
            {selectedParticipant && (
              <span className="text-sm font-normal text-muted-foreground">
                - {selectedParticipant.name}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {count > 0 && (
              <Badge variant="secondary">
                {count} non lu{count > 1 ? 's' : ''}
              </Badge>
            )}
            {selectedParticipant && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onMarkAsRead?.(selectedParticipant.id)}
                disabled={isMarkingAsRead || count === 0 || !onMarkAsRead}
                className="h-8 px-3"
              >
                <CheckCheck className="h-4 w-4 mr-1" />
                {isMarkingAsRead ? 'Marquage...' : 'Marquer comme lu'}
              </Button>
            )}
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        {/* Messages area */}
        <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-6 space-y-3">
          {messagesContent}
        </div>

        {/* Message input */}
        {selectedParticipant && (
          <MessageInput
            onSendMessage={onSendMessage}
            disabled={!selectedParticipant}
            isLoading={isSending}
            placeholder={`Message à ${selectedParticipant.name}...`}
          />
        )}
      </CardContent>
    </Card>
  );
}
