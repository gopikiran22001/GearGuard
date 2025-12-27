"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, Plus } from "lucide-react"

interface CalendarEvent {
  id: string
  title: string
  date: string
  status: 'scheduled' | 'completed' | 'in-progress' | 'overdue'
  equipment: string
}

interface CalendarProps {
  events?: CalendarEvent[]
  onDateClick?: (date: Date) => void
  onEventClick?: (event: CalendarEvent) => void
}

export function MaintenanceCalendar({ events = [], onDateClick, onEventClick }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ]
  
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()
    
    const days = []
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day)
    }
    
    return days
  }
  
  const getEventsForDate = (day: number) => {
    if (!day) return []
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    return events.filter(event => event.date === dateStr)
  }
  
  const getEventColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800'
      case 'completed': return 'bg-green-100 text-green-800'
      case 'in-progress': return 'bg-orange-100 text-orange-800'
      case 'overdue': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }
  
  const getStatusDot = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-500'
      case 'completed': return 'bg-green-500'
      case 'in-progress': return 'bg-orange-500'
      case 'overdue': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }
  
  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev)
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
  }
  
  const handleDateClick = (day: number) => {
    if (!day) return
    const clickedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
    onDateClick?.(clickedDate)
  }
  
  const days = getDaysInMonth(currentDate)
  
  return (
    <div className="space-y-6">
      {/* Calendar Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Preventive Maintenance Calendar</h1>
          <p className="text-gray-600 mt-1">Schedule and track preventive maintenance tasks</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={() => navigateMonth('prev')}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="font-semibold text-gray-900 px-4">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </span>
          <Button variant="outline" size="sm" onClick={() => navigateMonth('next')}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 ml-4">
            <Plus className="h-4 w-4 mr-2" />
            Schedule Task
          </Button>
        </div>
      </div>

      {/* Calendar Grid */}
      <Card className="bg-white shadow-sm border border-gray-200">
        <CardContent className="p-6">
          {/* Calendar Header */}
          <div className="grid grid-cols-7 gap-px mb-4">
            {daysOfWeek.map((day) => (
              <div key={day} className="p-3 text-center text-sm font-medium text-gray-600 bg-gray-50 rounded-lg">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Body */}
          <div className="grid grid-cols-7 gap-px">
            {days.map((day, index) => {
              const dayEvents = getEventsForDate(day)
              const hasEvents = dayEvents.length > 0
              
              return (
                <div 
                  key={index}
                  className={`h-24 p-2 rounded-lg transition-colors cursor-pointer ${
                    day 
                      ? 'bg-white border border-gray-100 hover:bg-gray-50' 
                      : 'bg-gray-50'
                  }`}
                  onClick={() => handleDateClick(day)}
                >
                  {day && (
                    <>
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-sm font-medium text-gray-900">{day}</span>
                        {hasEvents && (
                          <div className="flex gap-1">
                            {dayEvents.slice(0, 3).map((event, i) => (
                              <div 
                                key={i} 
                                className={`w-2 h-2 rounded-full ${getStatusDot(event.status)}`}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                      
                      {/* Events for this day */}
                      <div className="space-y-1">
                        {dayEvents.slice(0, 2).map((event) => (
                          <div 
                            key={event.id}
                            className={`text-xs px-2 py-1 rounded truncate cursor-pointer ${getEventColor(event.status)}`}
                            onClick={(e) => {
                              e.stopPropagation()
                              onEventClick?.(event)
                            }}
                          >
                            {event.title}
                          </div>
                        ))}
                        {dayEvents.length > 2 && (
                          <div className="text-xs text-gray-500 px-2">
                            +{dayEvents.length - 2} more
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Legend */}
      <Card className="bg-white shadow-sm border border-gray-200">
        <CardContent className="p-4">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Scheduled</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Completed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              <span className="text-sm text-gray-600">In Progress</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Overdue</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Sample events for demonstration
const sampleEvents: CalendarEvent[] = [
  {
    id: "1",
    title: "AC Maintenance",
    date: "2024-12-15",
    status: "scheduled",
    equipment: "AC Unit #AC-001"
  },
  {
    id: "2", 
    title: "Generator Check",
    date: "2024-12-22",
    status: "completed",
    equipment: "Generator #GEN-003"
  },
  {
    id: "3",
    title: "Elevator Service",
    date: "2024-12-30",
    status: "scheduled",
    equipment: "Elevator #ELV-002"
  },
  {
    id: "4",
    title: "Fire System",
    date: "2024-12-30", 
    status: "in-progress",
    equipment: "Fire System #FS-001"
  }
]

export function CalendarDemo() {
  return (
    <MaintenanceCalendar 
      events={sampleEvents}
      onDateClick={(date) => console.log('Date clicked:', date)}
      onEventClick={(event) => console.log('Event clicked:', event)}
    />
  )
}