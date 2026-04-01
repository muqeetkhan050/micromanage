'use client'

import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import timeGridPlugin from '@fullcalendar/timegrid'
import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface CalendarEvent {
  id: string
  title: string
  start: string
  end?: string
  backgroundColor?: string
  borderColor?: string
  extendedProps?: {
    description?: string
    reminderTime?: number
    category?: string
  }
}

export default function Reminder() {
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [showModal, setShowModal] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)
  const [isEditMode, setIsEditMode] = useState(false)
  const [loading, setLoading] = useState(true)

  const [eventTitle, setEventTitle] = useState('')
  const [eventDescription, setEventDescription] = useState('')
  const [eventStart, setEventStart] = useState('')
  const [eventEnd, setEventEnd] = useState('')
  const [eventCategory, setEventCategory] = useState('meeting')
  const [reminderTime, setReminderTime] = useState(30)

  // Fetch events from database
  const fetchEvents = async () => {
    try {
      const res = await fetch('/api/reminder')
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.message || 'Failed to load events')
        return
      }
      if (Array.isArray(data)) {
        const mapped: CalendarEvent[] = data.map((e: any) => ({
          id: e._id,
          title: e.title,
          start: e.start,
          end: e.end || undefined,
          backgroundColor: e.backgroundColor,
          borderColor: e.borderColor,
          extendedProps: {
            description: e.description,
            reminderTime: e.reminderTime,
            category: e.category,
          },
        }))
        setEvents(mapped)
      }
    } catch {
      toast.error('Failed to load events')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEvents()

    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }
  }, [])

  // Check for upcoming reminders
  useEffect(() => {
    const checkReminders = setInterval(() => {
      const now = new Date()
      events.forEach((event) => {
        const eventTime = new Date(event.start)
        const reminderMinutes = event.extendedProps?.reminderTime || 30
        const reminderAt = new Date(eventTime.getTime() - reminderMinutes * 60000)
        const timeDiff = reminderAt.getTime() - now.getTime()
        if (timeDiff > 0 && timeDiff < 60000) {
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(`Reminder: ${event.title}`, {
              body: `Starting in ${reminderMinutes} minutes\n${event.extendedProps?.description || ''}`,
              tag: event.id,
            })
          }
        }
      })
    }, 60000)
    return () => clearInterval(checkReminders)
  }, [events])

  const getCategoryColor = (category: string) => {
    const colors: Record<string, { bg: string; border: string }> = {
      meeting: { bg: '#3b82f6', border: '#2563eb' },
      deadline: { bg: '#ef4444', border: '#dc2626' },
      milestone: { bg: '#f59e0b', border: '#d97706' },
      review: { bg: '#8b5cf6', border: '#7c3aed' },
      sprint: { bg: '#10b981', border: '#059669' },
      personal: { bg: '#6366f1', border: '#4f46e5' },
    }
    return colors[category] || colors.meeting
  }

  const handleDateClick = (info: any) => {
    setEventStart(info.dateStr + 'T09:00')
    setEventEnd(info.dateStr + 'T10:00')
    setIsEditMode(false)
    setSelectedEvent(null)
    resetForm()
    setShowModal(true)
  }

  const handleEventClick = (info: any) => {
    const event = info.event
    setSelectedEvent({
      id: event.id,
      title: event.title,
      start: event.startStr,
      end: event.endStr,
      backgroundColor: event.backgroundColor,
      borderColor: event.borderColor,
      extendedProps: event.extendedProps,
    })
    setEventTitle(event.title)
    setEventDescription(event.extendedProps.description || '')
    setEventStart(event.startStr?.slice(0, 16) || '')
    setEventEnd(event.endStr?.slice(0, 16) || '')
    setEventCategory(event.extendedProps.category || 'meeting')
    setReminderTime(event.extendedProps.reminderTime || 30)
    setIsEditMode(true)
    setShowModal(true)
  }

  const resetForm = () => {
    setEventTitle('')
    setEventDescription('')
    setEventCategory('meeting')
    setReminderTime(30)
  }

  const handleSaveEvent = async () => {
    if (!eventTitle || !eventStart) return

    const colors = getCategoryColor(eventCategory)
    const payload = {
      title: eventTitle,
      description: eventDescription,
      start: eventStart,
      end: eventEnd || eventStart,
      category: eventCategory,
      reminderTime,
      backgroundColor: colors.bg,
      borderColor: colors.border,
    }

    try {
      if (isEditMode && selectedEvent) {
        const res = await fetch(`/api/reminder/${selectedEvent.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        if (!res.ok) throw new Error('Update failed')
        toast.success('Event updated')
      } else {
        const res = await fetch('/api/reminder', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        if (!res.ok) throw new Error('Create failed')
        toast.success('Event created')
      }
      fetchEvents()
    } catch {
      toast.error('Failed to save event')
    }

    setShowModal(false)
    resetForm()
  }

  const handleDeleteEvent = async () => {
    if (!selectedEvent) return
    try {
      const res = await fetch(`/api/reminder/${selectedEvent.id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Delete failed')
      toast.success('Event deleted')
      fetchEvents()
    } catch {
      toast.error('Failed to delete event')
    }
    setShowModal(false)
    resetForm()
  }

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <p className="text-gray-500">Loading calendar...</p>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Calendar & Reminders</h1>
        <p className="text-gray-600">Click on a date to add an event</p>
      </div>

      {/* Legend */}
      <div className="mb-4 flex flex-wrap gap-3">
        {Object.entries({
          meeting: 'Team Meetings',
          deadline: 'Deadlines',
          milestone: 'Milestones',
          review: 'Reviews',
          sprint: 'Sprints',
          personal: 'Personal',
        }).map(([key, label]) => {
          const color = getCategoryColor(key)
          return (
            <div key={key} className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded"
                style={{ backgroundColor: color.bg }}
              />
              <span className="text-sm">{label}</span>
            </div>
          )
        })}
      </div>

      <div className="bg-white rounded-lg shadow-lg p-4">
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay',
          }}
          events={events}
          dateClick={handleDateClick}
          eventClick={handleEventClick}
          editable={true}
          selectable={true}
          height="auto"
          eventTimeFormat={{
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
          }}
        />
      </div>

      {/* Modal for Add/Edit Event */}
      <Dialog
        open={showModal}
        onOpenChange={(open) => {
          if (!open) {
            setShowModal(false)
            resetForm()
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isEditMode ? 'Edit Event' : 'Add New Event'}</DialogTitle>
            <DialogDescription>
              {isEditMode ? 'Update event details' : 'Fill in the details to create an event'}
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4">
            <Input
              value={eventTitle}
              onChange={(e) => setEventTitle(e.target.value)}
              placeholder="Event title"
              required
            />

            <Select value={eventCategory} onValueChange={setEventCategory}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Category</SelectLabel>
                  <SelectItem value="meeting">Team Meeting</SelectItem>
                  <SelectItem value="deadline">Deadline</SelectItem>
                  <SelectItem value="milestone">Milestone</SelectItem>
                  <SelectItem value="review">Review / Feedback</SelectItem>
                  <SelectItem value="sprint">Sprint Event</SelectItem>
                  <SelectItem value="personal">Personal</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Start *</label>
                <Input
                  type="datetime-local"
                  value={eventStart}
                  onChange={(e) => setEventStart(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">End</label>
                <Input
                  type="datetime-local"
                  value={eventEnd}
                  onChange={(e) => setEventEnd(e.target.value)}
                />
              </div>
            </div>

            <textarea
              value={eventDescription}
              onChange={(e) => setEventDescription(e.target.value)}
              placeholder="Description (optional)"
              className="border p-2 rounded h-24"
              rows={3}
            />

            <Select
              value={String(reminderTime)}
              onValueChange={(val) => setReminderTime(Number(val))}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Set reminder" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Reminder</SelectLabel>
                  <SelectItem value="0">No reminder</SelectItem>
                  <SelectItem value="5">5 minutes before</SelectItem>
                  <SelectItem value="15">15 minutes before</SelectItem>
                  <SelectItem value="30">30 minutes before</SelectItem>
                  <SelectItem value="60">1 hour before</SelectItem>
                  <SelectItem value="1440">1 day before</SelectItem>
                  <SelectItem value="2880">2 days before</SelectItem>
                  <SelectItem value="10080">1 week before</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter className="flex justify-end gap-2">
            {isEditMode && (
              <Button
                type="button"
                variant="destructive"
                onClick={handleDeleteEvent}
              >
                Delete
              </Button>
            )}
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setShowModal(false)
                resetForm()
              }}
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="bg-black text-white"
              onClick={handleSaveEvent}
              disabled={!eventTitle || !eventStart}
            >
              {isEditMode ? 'Save' : 'Add Event'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
