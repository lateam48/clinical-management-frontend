"use client"

import { useState } from "react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { CalendarIcon, Filter, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

import type { AppointmentFilters } from "@/types/appointment"

interface AppointmentFiltersProps {
  filters: AppointmentFilters
  onFiltersChange: (filters: AppointmentFilters) => void
  onReset: () => void
}

const doctorsList = ["Dr. Martin", "Dr. Dubois", "Dr. Moreau", "Dr. Laurent", "Dr. Bernard"]

const roomsList = ["Salle 101", "Salle 102", "Salle 103", "Salle 201", "Salle 202"]

export function AppointmentFilters({ filters, onFiltersChange, onReset }: Readonly<AppointmentFiltersProps>) {
  const [selectedDate, setSelectedDate] = useState<Date>()

  const handleDateChange = (date: Date | undefined) => {
    setSelectedDate(date)
    onFiltersChange({
      ...filters,
      date: date ? format(date, "yyyy-MM-dd") : undefined,
    })
  }

  const handleDoctorChange = (doctor: string) => {
    onFiltersChange({
      ...filters,
      doctor: doctor === "all" ? undefined : doctor,
    })
  }

  const handleRoomChange = (room: string) => {
    onFiltersChange({
      ...filters,
      room: room === "all" ? undefined : room,
    })
  }

  const hasActiveFilters = !!(filters.doctor ?? filters.date ?? filters.room)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Filtres
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Date */}
        <div className="space-y-2">
          <Label>Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn("w-full justify-start text-left font-normal", !selectedDate && "text-muted-foreground")}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDate ? format(selectedDate, "PPP", { locale: fr }) : "Sélectionner une date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar mode="single" selected={selectedDate} onSelect={handleDateChange} initialFocus />
            </PopoverContent>
          </Popover>
        </div>

        {/* Médecin */}
        <div className="space-y-2">
          <Label>Médecin</Label>
          <Select value={filters.doctor ?? "all"} onValueChange={handleDoctorChange}>
            <SelectTrigger>
              <SelectValue placeholder="Tous les médecins" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les médecins</SelectItem>
              {doctorsList.map((doctor) => (
                <SelectItem key={doctor} value={doctor}>
                  {doctor}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Salle */}
        <div className="space-y-2">
          <Label>Salle</Label>
          <Select value={filters.room ?? "all"} onValueChange={handleRoomChange}>
            <SelectTrigger>
              <SelectValue placeholder="Toutes les salles" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les salles</SelectItem>
              {roomsList.map((room) => (
                <SelectItem key={room} value={room}>
                  {room}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Reset */}
        {hasActiveFilters && (
          <Button
            variant="outline"
            onClick={() => {
              onReset()
              setSelectedDate(undefined)
            }}
            className="w-full"
          >
            <X className="mr-2 h-4 w-4" />
            Réinitialiser les filtres
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
