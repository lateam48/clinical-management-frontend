'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Smile, Paperclip } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

interface MessageInputProps {
  onSendMessage: (content: string) => void
  disabled?: boolean
  placeholder?: string
  isLoading?: boolean
}

const EMOJI_LIST = [
  '😊', '😂', '❤️', '👍', '👎', '😍', '😭', '😡', '🤔', '👏',
  '🙏', '🎉', '🔥', '💯', '✨', '🌟', '💪', '👀', '🤝', '💖'
]

export function MessageInput({
  onSendMessage,
  disabled = false,
  placeholder = "Tapez votre message...",
  isLoading = false
}: Readonly<MessageInputProps>) {
  const [message, setMessage] = useState('')
  const [showEmojis, setShowEmojis] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSend = () => {
    if (message.trim() && !disabled && !isLoading) {
      onSendMessage(message.trim())
      setMessage('')
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto'
      }
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleEmojiClick = (emoji: string) => {
    setMessage(prev => prev + emoji)
    setShowEmojis(false)
    // Focus back to textarea
    setTimeout(() => {
      textareaRef.current?.focus()
    }, 100)
  }

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value)
    
    // Auto-resize textarea
    const textarea = e.target
    textarea.style.height = 'auto'
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px'
  }

  // Auto-focus on mount
  useEffect(() => {
    if (!disabled) {
      textareaRef.current?.focus()
    }
  }, [disabled])

  return (
    <div className="flex items-end gap-2 p-4 border-t bg-background">
      {/* Emoji picker */}
      <Popover open={showEmojis} onOpenChange={setShowEmojis}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-10 w-10 p-0"
            disabled={disabled}
          >
            <Smile className="h-5 w-5" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-2" align="start">
          <div className="grid grid-cols-10 gap-1">
            {EMOJI_LIST.map((emoji) => (
              <Button
                key={emoji}
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-lg hover:bg-muted"
                onClick={() => handleEmojiClick(emoji)}
              >
                {emoji}
              </Button>
            ))}
          </div>
        </PopoverContent>
      </Popover>

      {/* File attachment (placeholder for future) */}
      <Button
        variant="ghost"
        size="sm"
        className="h-10 w-10 p-0"
        disabled={disabled}
        title="Joindre un fichier (à venir)"
      >
        <Paperclip className="h-5 w-5" />
      </Button>

      {/* Message input */}
      <div className="flex-1 relative">
        <Textarea
          ref={textareaRef}
          value={message}
          onChange={handleTextareaChange}
          onKeyDown={handleKeyPress}
          placeholder={placeholder}
          disabled={disabled || isLoading}
          className="min-h-[40px] max-h-[120px] resize-none pr-12"
          rows={1}
        />
        
        {/* Character count */}
        {message.length > 0 && (
          <div className="absolute bottom-2 right-2">
            <Badge variant="secondary" className="text-xs">
              {message.length}/1000
            </Badge>
          </div>
        )}
      </div>

      {/* Send button */}
      <Button
        onClick={handleSend}
        disabled={!message.trim() || disabled || isLoading}
        size="sm"
        className="h-10 w-10 p-0"
      >
        <Send className="h-5 w-5" />
      </Button>
    </div>
  )
}
