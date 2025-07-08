'use client'

import { useState } from 'react'
import { ChevronDown, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ChatParticipant } from '@/types/chat'

interface ParticipantListProps {
  participants: ChatParticipant[]
  selectedParticipant: ChatParticipant | null
  onSelectParticipant: (participant: ChatParticipant) => void
  title: string
  placeholder: string
  emptyMessage: string
}

export function ParticipantList({
  participants,
  selectedParticipant,
  onSelectParticipant,
  title,
  placeholder,
  emptyMessage,
}: Readonly<ParticipantListProps>) {
  const [isClient, setIsClient] = useState(false)

  // Handle hydration
  if (typeof window !== 'undefined' && !isClient) {
    setIsClient(true)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          {title} ({participants.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full justify-between">
              <div className="flex items-center gap-2">
                {selectedParticipant ? (
                  <>
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="text-xs">
                        {selectedParticipant.name
                          .split(' ')
                          .map(n => n[0])
                          .join('')
                          .slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="truncate">{selectedParticipant.name}</span>
                  </>
                ) : (
                  <span className="text-muted-foreground">{placeholder}</span>
                )}
              </div>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-full min-w-[200px]">
            {participants.length === 0 ? (
              <DropdownMenuItem disabled>
                <span className="text-muted-foreground">{emptyMessage}</span>
              </DropdownMenuItem>
            ) : (
              participants.map((participant) => (
                <DropdownMenuItem
                  key={participant.id}
                  onClick={() => onSelectParticipant(participant)}
                  className="flex items-center gap-3 p-3"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={participant.avatar} />
                    <AvatarFallback>
                      {participant.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{participant.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className={`w-2 h-2 rounded-full ${participant.isOnline ? 'bg-green-500' : 'bg-gray-400'}`} />
                      <p className="text-xs text-muted-foreground">
                        {participant.isOnline ? 'En ligne' : 'Hors ligne'}
                      </p>
                    </div>
                  </div>
                </DropdownMenuItem>
              ))
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Participant sélectionné - Affichage détaillé */}
        {selectedParticipant && (
          <div className="mt-4 p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={selectedParticipant.avatar} />
                <AvatarFallback>
                  {selectedParticipant.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-medium">{selectedParticipant.name}</p>
                <p className="text-sm text-muted-foreground capitalize">
                  {selectedParticipant.role.toLowerCase()}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <div className={`w-2 h-2 rounded-full ${selectedParticipant.isOnline ? 'bg-green-500' : 'bg-gray-400'}`} />
                  <p className="text-xs text-muted-foreground">
                    {selectedParticipant.isOnline ? 'En ligne' : 'Hors ligne'}
                  </p>
                  {!selectedParticipant.isOnline && selectedParticipant.lastSeen && isClient && (
                    <span className="text-xs text-muted-foreground">
                      • Dernière connexion: {new Date(selectedParticipant.lastSeen).toLocaleTimeString()}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
} 