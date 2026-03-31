

'use client'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import timeGridPlugin from '@fullcalendar/timegrid'
import { useState, useEffect } from 'react'

interface CalendarEvent {
  id: string
  title: string
  start: string
  end?: string
  backgroundColor?: string
  borderColor?: string
  extendedProps?: {
    description?: string
    reminderTime?: number // minutes before event
    category?: string
  }
}

export default function Reminder() {
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [showModal, setShowModal] = useState(false)
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)
  const [isEditMode, setIsEditMode] = useState(false)

  // Form states
  const [eventTitle, setEventTitle] = useState('')
  const [eventDescription, setEventDescription] = useState('')
  const [eventStart, setEventStart] = useState('')
  const [eventEnd, setEventEnd] = useState('')
  const [eventCategory, setEventCategory] = useState('meeting')
  const [reminderTime, setReminderTime] = useState(30) // 30 minutes before

  // Load events from localStorage on mount
  useEffect(() => {
    const savedEvents = localStorage.getItem('calendarEvents')
    if (savedEvents) {
      setEvents(JSON.parse(savedEvents))
    }
    
    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }
  }, [])

  // Save events to localStorage whenever they change
  useEffect(() => {
    if (events.length > 0) {
      localStorage.setItem('calendarEvents', JSON.stringify(events))
    }
  }, [events])

  // Check for upcoming reminders
  useEffect(() => {
    const checkReminders = setInterval(() => {
      const now = new Date()
      
      events.forEach(event => {
        const eventTime = new Date(event.start)
        const reminderMinutes = event.extendedProps?.reminderTime || 30
        const reminderTime = new Date(eventTime.getTime() - reminderMinutes * 60000)
        
        // If reminder time is within the next minute
        const timeDiff = reminderTime.getTime() - now.getTime()
        if (timeDiff > 0 && timeDiff < 60000) {
          showNotification(event)
        }
      })
    }, 60000) // Check every minute

    return () => clearInterval(checkReminders)
  }, [events])

  const showNotification = (event: CalendarEvent) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      const reminderMinutes = event.extendedProps?.reminderTime || 30
      new Notification(`Reminder: ${event.title}`, {
        body: `Starting in ${reminderMinutes} minutes\n${event.extendedProps?.description || ''}`,
        icon: '/calendar-icon.png', // Add your icon path
        tag: event.id // Prevents duplicate notifications
      })
    }
  }

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: { bg: string; border: string } } = {
      meeting: { bg: '#3b82f6', border: '#2563eb' }, // Blue
      deadline: { bg: '#ef4444', border: '#dc2626' }, // Red
      milestone: { bg: '#f59e0b', border: '#d97706' }, // Orange
      review: { bg: '#8b5cf6', border: '#7c3aed' }, // Purple
      sprint: { bg: '#10b981', border: '#059669' }, // Green
      personal: { bg: '#6366f1', border: '#4f46e5' }, // Indigo
    }
    return colors[category] || colors.meeting
  }

  const handleDateClick = (info: any) => {
    setSelectedDate(info.dateStr)
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
      extendedProps: event.extendedProps
    })
    
    setEventTitle(event.title)
    setEventDescription(event.extendedProps.description || '')
    setEventStart(event.startStr)
    setEventEnd(event.endStr || event.startStr)
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

  const handleSaveEvent = () => {
    if (!eventTitle || !eventStart) return

    const colors = getCategoryColor(eventCategory)
    
    const newEvent: CalendarEvent = {
      id: isEditMode ? selectedEvent!.id : Date.now().toString(),
      title: eventTitle,
      start: eventStart,
      end: eventEnd || eventStart,
      backgroundColor: colors.bg,
      borderColor: colors.border,
      extendedProps: {
        description: eventDescription,
        reminderTime: reminderTime,
        category: eventCategory
      }
    }

    if (isEditMode) {
      // Update existing event
      setEvents(events.map(e => e.id === newEvent.id ? newEvent : e))
    } else {
      // Add new event
      setEvents([...events, newEvent])
    }

    setShowModal(false)
    resetForm()
  }

  const handleDeleteEvent = () => {
    if (selectedEvent) {
      setEvents(events.filter(e => e.id !== selectedEvent.id))
      setShowModal(false)
      resetForm()
    }
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">GEO Project Calendar</h1>
        <p className="text-gray-600">Team 62 - Flight Centre GEO Research</p>
      </div>

      {/* Legend */}
      <div className="mb-4 flex flex-wrap gap-3">
        {Object.entries({
          meeting: 'Team Meetings',
          deadline: 'Deadlines',
          milestone: 'Milestones',
          review: 'Reviews',
          sprint: 'Sprints',
          personal: 'Personal'
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
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
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
            hour12: true
          }}
        />
      </div>

      {/* Modal for Add/Edit Event */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">
              {isEditMode ? 'Edit Event' : 'Add New Event'}
            </h2>

            <div className="space-y-4">
              {/* Event Title */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Event Title *
                </label>
                <input
                  type="text"
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  placeholder="e.g., Sprint Planning Meeting"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Category
                </label>
                <select
                  value={eventCategory}
                  onChange={(e) => setEventCategory(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                >
                  <option value="meeting">Team Meeting</option>
                  <option value="deadline">Deadline</option>
                  <option value="milestone">Milestone</option>
                  <option value="review">Review/Feedback</option>
                  <option value="sprint">Sprint Event</option>
                  <option value="personal">Personal</option>
                </select>
              </div>

              {/* Start Time */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Start Time *
                </label>
                <input
                  type="datetime-local"
                  value={eventStart}
                  onChange={(e) => setEventStart(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>

              {/* End Time */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  End Time
                </label>
                <input
                  type="datetime-local"
                  value={eventEnd}
                  onChange={(e) => setEventEnd(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Description
                </label>
                <textarea
                  value={eventDescription}
                  onChange={(e) => setEventDescription(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  rows={3}
                  placeholder="Add meeting agenda, notes, or details..."
                />
              </div>

              {/* Reminder */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Reminder
                </label>
                <select
                  value={reminderTime}
                  onChange={(e) => setReminderTime(Number(e.target.value))}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                >
                  <option value={0}>No reminder</option>
                  <option value={5}>5 minutes before</option>
                  <option value={15}>15 minutes before</option>
                  <option value={30}>30 minutes before</option>
                  <option value={60}>1 hour before</option>
                  <option value={1440}>1 day before</option>
                  <option value={2880}>2 days before</option>
                  <option value={10080}>1 week before</option>
                </select>
              </div>

              {/* Buttons */}
              <div className="flex gap-2 pt-4">
                <button
                  onClick={handleSaveEvent}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  disabled={!eventTitle || !eventStart}
                >
                  {isEditMode ? 'Update' : 'Add'} Event
                </button>
                
                {isEditMode && (
                  <button
                    onClick={handleDeleteEvent}
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                )}
                
                <button
                  onClick={() => {
                    setShowModal(false)
                    resetForm()
                  }}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}


