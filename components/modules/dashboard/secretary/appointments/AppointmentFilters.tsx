"use client"

import { useState } from "react"
import { Calendar, User, MapPin, Search, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { cn } from "@/lib/utils"

import { useStaff } from "@/hooks/useUsers"
import type { AppointmentFilters } from "@/types/appointment"
import { DOCTOR_FILTER_ALL } from "@/types/appointment"
import { EmptyState } from "@/components/global/empty-state"

interface AppointmentFiltersProps {
  filters: AppointmentFilters
  onFiltersChange: (filters: AppointmentFilters) => void
  onSearch: () => void
  onReset: () => void
}

const roomList = ["Salle 101", "Salle 102", "Salle 103", "Salle 201", "Salle 202"]

export function AppointmentFiltersComponent({ filters, onFiltersChange, onSearch, onReset }: Readonly<AppointmentFiltersProps>) {
  const [selectedDate, setSelectedDate] = useState<Date>()

  // Récupérer les médecins depuis l'API
  const { getStaff } = useStaff({ role: 'DOCTOR' })
  const { data: doctors, isLoading: doctorsLoading } = getStaff

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date)
    onFiltersChange({
      ...filters,
      date: date ? format(date, "yyyy-MM-dd") : undefined,
    })
  }

  const handleDoctorChange = (doctor: string) => {
    onFiltersChange({
      ...filters,
      doctor: doctor === DOCTOR_FILTER_ALL ? undefined : doctor,
    })
  }

  const handleRoomChange = (room: string) => {
    onFiltersChange({
      ...filters,
      room: room === "all" ? undefined : room,
    })
  }

  const activeFiltersCount = Object.values(filters).filter(Boolean).length
  const hasActiveFilters = activeFiltersCount > 0

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5" />
          Filtres de recherche
          {hasActiveFilters && (
            <Badge variant="secondary" className="ml-2">
              {activeFiltersCount}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Médecin */}
        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-2">
            <User className="h-4 w-4" />
            Médecin
          </label>
          <Select value={filters.doctor ?? DOCTOR_FILTER_ALL} onValueChange={handleDoctorChange}>
            <SelectTrigger>
              <SelectValue placeholder={doctorsLoading ? "Chargement..." : "Tous les médecins"} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={DOCTOR_FILTER_ALL}>Tous les médecins</SelectItem>
              {doctors && doctors.length > 0 ? (
                doctors.map((doctor) => (
                  <SelectItem key={doctor.id} value={`${doctor.firstName} ${doctor.lastName}`}>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      {doctor.firstName} {doctor.lastName}
                    </div>
                  </SelectItem>
                ))
              ) : (
                <EmptyState icon={Calendar} title="Aucun médecin" description={doctorsLoading ? "Chargement des médecins..." : "Aucun médecin disponible"} />
              )}
            </SelectContent>
          </Select>
        </div>

        {/* Date */}
        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Date
          </label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn("w-full justify-start text-left font-normal", !selectedDate && "text-muted-foreground")}
              >
                <Calendar className="mr-2 h-4 w-4" />
                {selectedDate ? format(selectedDate, "PPP", { locale: fr }) : "Sélectionner une date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                disabled={(date) => date < new Date("1900-01-01")}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Salle */}
        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Salle
          </label>
          <Select value={filters.room ?? "all"} onValueChange={handleRoomChange}>
            <SelectTrigger>
              <SelectValue placeholder="Toutes les salles" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les salles</SelectItem>
              {roomList.map((room) => (
                <SelectItem key={room} value={room}>
                  {room}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Filtres actifs */}
        {hasActiveFilters && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Filtres actifs:</label>
            <div className="flex flex-wrap gap-2">
              {filters.doctor && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  {filters.doctor}
                  <X
                    className="h-3 w-3 cursor-pointer hover:text-destructive"
                    onClick={() => handleDoctorChange(DOCTOR_FILTER_ALL)}
                  />
                </Badge>
              )}
              {filters.date && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {format(new Date(filters.date), "dd/MM/yyyy", { locale: fr })}
                  <X
                    className="h-3 w-3 cursor-pointer hover:text-destructive"
                    onClick={() => handleDateSelect(undefined)}
                  />
                </Badge>
              )}
              {filters.room && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {filters.room}
                  <X
                    className="h-3 w-3 cursor-pointer hover:text-destructive"
                    onClick={() => handleRoomChange("all")}
                  />
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-4">
          <Button onClick={onSearch} className="flex-1" disabled={!hasActiveFilters}>
            <Search className="h-4 w-4 mr-2" />
            Rechercher
          </Button>
          {hasActiveFilters && (
            <Button variant="outline" onClick={onReset}>
              <X className="h-4 w-4 mr-2" />
              Réinitialiser
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
