"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, ChevronLeft, ChevronRight, Clock, MapPin, Users, X } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import type { Event } from "@/lib/supabase"

// Sample event data (would come from Supabase in production)
const events: Event[] = [
  {
    id: "EVT-1001",
    title: "Summer Collection Photoshoot",
    description: "Photoshoot for the new summer collection with the marketing team.",
    start_date: "2025-05-20T09:00:00Z",
    end_date: "2025-05-20T16:00:00Z",
    all_day: false,
    location: "Studio 5, Downtown",
    attendees: ["Marketing Team", "Models", "Photographers"],
    created_at: "2025-05-01T00:00:00Z",
  },
  {
    id: "EVT-1002",
    title: "Supplier Meeting - Fashion Fabrics Inc.",
    description: "Quarterly review meeting with our main fabric supplier.",
    start_date: "2025-05-22T14:00:00Z",
    end_date: "2025-05-22T15:30:00Z",
    all_day: false,
    location: "Conference Room B",
    attendees: ["Procurement Team", "Supplier Representatives"],
    created_at: "2025-05-05T00:00:00Z",
  },
  {
    id: "EVT-1003",
    title: "Inventory Audit",
    description: "Monthly inventory audit with the warehouse team.",
    start_date: "2025-05-25T08:00:00Z",
    end_date: "2025-05-25T17:00:00Z",
    all_day: true,
    location: "Warehouse",
    attendees: ["Inventory Team", "Finance Representative"],
    created_at: "2025-05-10T00:00:00Z",
  },
  {
    id: "EVT-1004",
    title: "Marketing Strategy Meeting",
    description: "Planning session for the upcoming fall campaign.",
    start_date: "2025-05-27T10:00:00Z",
    end_date: "2025-05-27T12:00:00Z",
    all_day: false,
    location: "Conference Room A",
    attendees: ["Marketing Team", "Sales Team", "Creative Director"],
    created_at: "2025-05-15T00:00:00Z",
  },
  {
    id: "EVT-1005",
    title: "Staff Training - New POS System",
    description: "Training session for retail staff on the new point of sale system.",
    start_date: "2025-05-29T13:00:00Z",
    end_date: "2025-05-29T17:00:00Z",
    all_day: false,
    location: "Training Room",
    attendees: ["Retail Staff", "IT Support"],
    created_at: "2025-05-18T00:00:00Z",
  },
  {
    id: "EVT-1006",
    title: "Website Redesign Launch",
    description: "Official launch of the redesigned e-commerce website.",
    start_date: "2025-06-01T00:00:00Z",
    end_date: "2025-06-01T23:59:59Z",
    all_day: true,
    location: "Online",
    attendees: ["IT Team", "Marketing Team", "Customer Support"],
    created_at: "2025-05-20T00:00:00Z",
  },
]

// Helper function to generate calendar days
const generateCalendarDays = (year: number, month: number) => {
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const daysInMonth = lastDay.getDate()
  const startingDayOfWeek = firstDay.getDay()

  // Get days from previous month to fill the first week
  const prevMonthDays = []
  const prevMonth = month === 0 ? 11 : month - 1
  const prevMonthYear = month === 0 ? year - 1 : year
  const daysInPrevMonth = new Date(prevMonthYear, prevMonth + 1, 0).getDate()

  for (let i = startingDayOfWeek - 1; i >= 0; i--) {
    prevMonthDays.push({
      date: new Date(prevMonthYear, prevMonth, daysInPrevMonth - i),
      isCurrentMonth: false,
    })
  }

  // Current month days
  const currentMonthDays = []
  for (let i = 1; i <= daysInMonth; i++) {
    currentMonthDays.push({
      date: new Date(year, month, i),
      isCurrentMonth: true,
    })
  }

  // Next month days to fill the last week
  const nextMonthDays = []
  const totalDaysShown = prevMonthDays.length + currentMonthDays.length
  const daysNeeded = Math.ceil(totalDaysShown / 7) * 7 - totalDaysShown
  const nextMonth = month === 11 ? 0 : month + 1
  const nextMonthYear = month === 11 ? year + 1 : year

  for (let i = 1; i <= daysNeeded; i++) {
    nextMonthDays.push({
      date: new Date(nextMonthYear, nextMonth, i),
      isCurrentMonth: false,
    })
  }

  return [...prevMonthDays, ...currentMonthDays, ...nextMonthDays]
}

// Helper function to group events by date
const groupEventsByDate = (events: Event[]) => {
  const grouped: Record<string, Event[]> = {}

  events.forEach((event) => {
    const dateKey = new Date(event.start_date).toISOString().split("T")[0]
    if (!grouped[dateKey]) {
      grouped[dateKey] = []
    }
    grouped[dateKey].push(event)
  })

  return grouped
}

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [calendarDays, setCalendarDays] = useState<{ date: Date; isCurrentMonth: boolean }[]>([])
  const [eventsByDate, setEventsByDate] = useState<Record<string, Event[]>>({})
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [isAddEventOpen, setIsAddEventOpen] = useState(false)
  const [activeView, setActiveView] = useState<"month" | "week" | "day">("month")

  // Initialize calendar days and events
  useEffect(() => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const days = generateCalendarDays(year, month)
    setCalendarDays(days)

    const grouped = groupEventsByDate(events)
    setEventsByDate(grouped)
  }, [currentDate])

  const handlePrevMonth = () => {
    setCurrentDate((prev) => {
      const prevMonth = new Date(prev)
      prevMonth.setMonth(prev.getMonth() - 1)
      return prevMonth
    })
  }

  const handleNextMonth = () => {
    setCurrentDate((prev) => {
      const nextMonth = new Date(prev)
      nextMonth.setMonth(prev.getMonth() + 1)
      return nextMonth
    })
  }

  const handleDateClick = (date: Date) => {
    setSelectedDate(date)
    setSelectedEvent(null)
  }

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event)
  }

  const handleAddEvent = () => {
    setIsAddEventOpen(true)
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    })
  }

  const getEventsForDate = (date: Date) => {
    const dateKey = date.toISOString().split("T")[0]
    return eventsByDate[dateKey] || []
  }

  const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

  return (
    <DashboardShell className="bg-black">
      <DashboardHeader
        heading="Calendar"
        text="Schedule and manage events, meetings, and deadlines."
        className="text-white"
      >
        <Dialog open={isAddEventOpen} onOpenChange={setIsAddEventOpen}>
          <DialogTrigger asChild>
            <Button className="gap-1 bg-pink-600 hover:bg-pink-700" onClick={handleAddEvent}>
              <Plus className="h-4 w-4" />
              <span>Add Event</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px] bg-zinc-900 border-zinc-800 text-white">
            <DialogHeader>
              <DialogTitle className="text-white">Add New Event</DialogTitle>
              <DialogDescription className="text-zinc-400">
                Fill in the details to create a new event on your calendar.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right text-zinc-400">
                  Title
                </Label>
                <Input
                  id="title"
                  placeholder="Event title"
                  className="col-span-3 bg-zinc-800 border-zinc-700 text-white"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right text-zinc-400">
                  Description
                </Label>
                <Textarea
                  id="description"
                  placeholder="Event description"
                  className="col-span-3 bg-zinc-800 border-zinc-700 text-white"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="start-date" className="text-right text-zinc-400">
                  Start Date
                </Label>
                <div className="col-span-3 flex gap-2">
                  <Input
                    id="start-date"
                    type="date"
                    className="flex-1 bg-zinc-800 border-zinc-700 text-white"
                    defaultValue={selectedDate ? selectedDate.toISOString().split("T")[0] : undefined}
                  />
                  <Input id="start-time" type="time" className="w-32 bg-zinc-800 border-zinc-700 text-white" />
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="end-date" className="text-right text-zinc-400">
                  End Date
                </Label>
                <div className="col-span-3 flex gap-2">
                  <Input
                    id="end-date"
                    type="date"
                    className="flex-1 bg-zinc-800 border-zinc-700 text-white"
                    defaultValue={selectedDate ? selectedDate.toISOString().split("T")[0] : undefined}
                  />
                  <Input id="end-time" type="time" className="w-32 bg-zinc-800 border-zinc-700 text-white" />
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="text-right text-zinc-400">All Day</div>
                <div className="col-span-3 flex items-center space-x-2">
                  <Checkbox id="all-day" />
                  <label
                    htmlFor="all-day"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-zinc-400"
                  >
                    This is an all-day event
                  </label>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="location" className="text-right text-zinc-400">
                  Location
                </Label>
                <Input
                  id="location"
                  placeholder="Event location"
                  className="col-span-3 bg-zinc-800 border-zinc-700 text-white"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="attendees" className="text-right text-zinc-400">
                  Attendees
                </Label>
                <Input
                  id="attendees"
                  placeholder="Add attendees (comma separated)"
                  className="col-span-3 bg-zinc-800 border-zinc-700 text-white"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsAddEventOpen(false)}
                className="border-zinc-700 text-zinc-400 hover:text-white hover:bg-zinc-800"
              >
                Cancel
              </Button>
              <Button type="submit" onClick={() => setIsAddEventOpen(false)} className="bg-pink-600 hover:bg-pink-700">
                Create Event
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </DashboardHeader>

      <div className="space-y-4">
        <Card className="bg-zinc-900 border-zinc-800 text-white">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handlePrevMonth}
                  className="h-8 w-8 border-zinc-700 text-zinc-400 hover:text-white hover:bg-zinc-800"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <h2 className="text-xl font-semibold">
                  {currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                </h2>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleNextMonth}
                  className="h-8 w-8 border-zinc-700 text-zinc-400 hover:text-white hover:bg-zinc-800"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center space-x-2">
                <Tabs defaultValue="month" onValueChange={(value) => setActiveView(value as any)}>
                  <TabsList className="bg-zinc-800 text-zinc-400">
                    <TabsTrigger
                      value="month"
                      className="data-[state=active]:bg-pink-600 data-[state=active]:text-white"
                    >
                      Month
                    </TabsTrigger>
                    <TabsTrigger
                      value="week"
                      className="data-[state=active]:bg-pink-600 data-[state=active]:text-white"
                    >
                      Week
                    </TabsTrigger>
                    <TabsTrigger value="day" className="data-[state=active]:bg-pink-600 data-[state=active]:text-white">
                      Day
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-zinc-700 text-zinc-400 hover:text-white hover:bg-zinc-800"
                  onClick={() => setCurrentDate(new Date())}
                >
                  Today
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {activeView === "month" && (
              <div className="grid grid-cols-7 gap-1">
                {/* Weekday headers */}
                {weekdays.map((day) => (
                  <div key={day} className="p-2 text-center text-sm font-medium text-zinc-400">
                    {day.slice(0, 3)}
                  </div>
                ))}

                {/* Calendar days */}
                {calendarDays.map((day, index) => {
                  const dateKey = day.date.toISOString().split("T")[0]
                  const dayEvents = eventsByDate[dateKey] || []
                  const isToday = day.date.toDateString() === new Date().toDateString()
                  const isSelected = selectedDate && day.date.toDateString() === selectedDate.toDateString()

                  return (
                    <div
                      key={index}
                      className={`min-h-[100px] p-1 border border-zinc-800 ${
                        day.isCurrentMonth ? "bg-zinc-900" : "bg-zinc-950 opacity-50"
                      } ${isToday ? "ring-1 ring-pink-500" : ""} ${isSelected ? "bg-zinc-800" : ""}`}
                      onClick={() => handleDateClick(day.date)}
                    >
                      <div className="flex justify-between items-start">
                        <span
                          className={`text-sm font-medium p-1 ${
                            isToday
                              ? "bg-pink-600 text-white rounded-full w-6 h-6 flex items-center justify-center"
                              : day.isCurrentMonth
                                ? "text-white"
                                : "text-zinc-500"
                          }`}
                        >
                          {day.date.getDate()}
                        </span>
                        {dayEvents.length > 0 && (
                          <span className="text-xs bg-pink-600/20 text-pink-400 px-1.5 py-0.5 rounded-full">
                            {dayEvents.length}
                          </span>
                        )}
                      </div>
                      <div className="mt-1 space-y-1 max-h-[80px] overflow-hidden">
                        {dayEvents.slice(0, 3).map((event, idx) => (
                          <div
                            key={idx}
                            className="text-xs p-1 rounded bg-pink-900/30 text-pink-300 truncate cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleEventClick(event)
                            }}
                          >
                            {event.all_day ? (
                              <span className="font-medium">{event.title}</span>
                            ) : (
                              <>
                                <span className="font-medium">{formatTime(event.start_date)}</span> {event.title}
                              </>
                            )}
                          </div>
                        ))}
                        {dayEvents.length > 3 && (
                          <div className="text-xs text-zinc-500 pl-1">+{dayEvents.length - 3} more</div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {activeView === "week" && (
              <div className="space-y-2">
                <div className="grid grid-cols-7 gap-1">
                  {/* Get the current week */}
                  {Array.from({ length: 7 }).map((_, i) => {
                    const date = new Date(currentDate)
                    const currentDay = date.getDay()
                    const diff = i - currentDay
                    date.setDate(date.getDate() + diff)
                    const isToday = date.toDateString() === new Date().toDateString()

                    return (
                      <div key={i} className="text-center p-2">
                        <div className="text-sm text-zinc-400">{weekdays[i].slice(0, 3)}</div>
                        <div
                          className={`text-lg font-medium mt-1 ${
                            isToday
                              ? "bg-pink-600 text-white rounded-full w-8 h-8 flex items-center justify-center mx-auto"
                              : "text-white"
                          }`}
                        >
                          {date.getDate()}
                        </div>
                      </div>
                    )
                  })}
                </div>

                <div className="space-y-2 mt-4">
                  {/* Time slots */}
                  {Array.from({ length: 12 }).map((_, i) => {
                    const hour = i + 8 // Start at 8 AM
                    return (
                      <div key={i} className="grid grid-cols-[80px_1fr] gap-2">
                        <div className="text-right pr-2 text-sm text-zinc-500">
                          {hour % 12 === 0 ? 12 : hour % 12} {hour < 12 ? "AM" : "PM"}
                        </div>
                        <div className="grid grid-cols-7 gap-1 border-t border-zinc-800 pt-2">
                          {Array.from({ length: 7 }).map((_, j) => {
                            const date = new Date(currentDate)
                            const currentDay = date.getDay()
                            const diff = j - currentDay
                            date.setDate(date.getDate() + diff)
                            date.setHours(hour, 0, 0, 0)

                            // Find events that overlap with this hour
                            const dateKey = date.toISOString().split("T")[0]
                            const dayEvents = (eventsByDate[dateKey] || []).filter((event) => {
                              const eventStart = new Date(event.start_date)
                              const eventEnd = new Date(event.end_date)
                              return (eventStart.getHours() <= hour && eventEnd.getHours() >= hour) || event.all_day
                            })

                            return (
                              <div key={j} className="h-12 relative border border-zinc-800 rounded">
                                {dayEvents.map((event, idx) => (
                                  <div
                                    key={idx}
                                    className="absolute inset-0 m-0.5 p-1 text-xs bg-pink-900/30 text-pink-300 rounded overflow-hidden"
                                    onClick={() => handleEventClick(event)}
                                  >
                                    <div className="truncate">{event.title}</div>
                                  </div>
                                ))}
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {activeView === "day" && selectedDate && (
              <div className="space-y-4">
                <div className="text-center">
                  <h3 className="text-xl font-medium text-white">{formatDate(selectedDate)}</h3>
                </div>

                <div className="space-y-2">
                  {/* Time slots for the day */}
                  {Array.from({ length: 14 }).map((_, i) => {
                    const hour = i + 8 // Start at 8 AM
                    const dateKey = selectedDate.toISOString().split("T")[0]
                    const hourEvents = (eventsByDate[dateKey] || []).filter((event) => {
                      const eventStart = new Date(event.start_date)
                      const eventEnd = new Date(event.end_date)
                      return (eventStart.getHours() <= hour && eventEnd.getHours() >= hour) || event.all_day
                    })

                    return (
                      <div key={i} className="grid grid-cols-[80px_1fr] gap-4 items-start">
                        <div className="text-right pr-2 text-sm text-zinc-500 pt-2">
                          {hour % 12 === 0 ? 12 : hour % 12} {hour < 12 ? "AM" : "PM"}
                        </div>
                        <div className="min-h-[60px] border-t border-zinc-800 pt-2 relative">
                          {hourEvents.map((event, idx) => (
                            <div
                              key={idx}
                              className="mb-2 p-2 bg-pink-900/30 text-pink-300 rounded cursor-pointer"
                              onClick={() => handleEventClick(event)}
                            >
                              <div className="font-medium">{event.title}</div>
                              {!event.all_day && (
                                <div className="text-xs text-zinc-400 flex items-center mt-1">
                                  <Clock className="h-3 w-3 mr-1" />
                                  {formatTime(event.start_date)} - {formatTime(event.end_date)}
                                </div>
                              )}
                              {event.location && (
                                <div className="text-xs text-zinc-400 flex items-center mt-1">
                                  <MapPin className="h-3 w-3 mr-1" />
                                  {event.location}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Event Details */}
        {selectedEvent && (
          <Card className="bg-zinc-900 border-zinc-800 text-white">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-white">{selectedEvent.title}</CardTitle>
                  <CardDescription className="text-zinc-400">
                    {selectedEvent.all_day ? (
                      <span>All day • {formatDate(new Date(selectedEvent.start_date))}</span>
                    ) : (
                      <span>
                        {formatDate(new Date(selectedEvent.start_date))} •{formatTime(selectedEvent.start_date)} -{" "}
                        {formatTime(selectedEvent.end_date)}
                      </span>
                    )}
                  </CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedEvent(null)}
                  className="text-zinc-400 hover:text-white hover:bg-zinc-800"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedEvent.description && (
                <div>
                  <h4 className="text-sm font-medium text-zinc-400 mb-1">Description</h4>
                  <p className="text-zinc-300">{selectedEvent.description}</p>
                </div>
              )}

              {selectedEvent.location && (
                <div>
                  <h4 className="text-sm font-medium text-zinc-400 mb-1">Location</h4>
                  <div className="flex items-center text-zinc-300">
                    <MapPin className="h-4 w-4 mr-2 text-pink-500" />
                    {selectedEvent.location}
                  </div>
                </div>
              )}

              {selectedEvent.attendees && selectedEvent.attendees.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-zinc-400 mb-1">Attendees</h4>
                  <div className="flex items-center text-zinc-300">
                    <Users className="h-4 w-4 mr-2 text-pink-500" />
                    <div className="flex flex-wrap gap-1">
                      {selectedEvent.attendees.map((attendee, idx) => (
                        <Badge key={idx} className="bg-zinc-800 text-zinc-300 hover:bg-zinc-700">
                          {attendee}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="border-t border-zinc-800 flex justify-end space-x-2">
              <Button
                variant="outline"
                size="sm"
                className="border-zinc-700 text-zinc-400 hover:text-white hover:bg-zinc-800"
              >
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-red-900/50 text-red-500 hover:text-red-400 hover:bg-red-900/20"
              >
                Delete
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </DashboardShell>
  )
}
