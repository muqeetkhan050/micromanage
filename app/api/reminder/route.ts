import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import Event from '@/lib/models/Event'
import { auth } from '@/lib/auth'

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()

    const events = await Event.find({ userId: session.user.id }).sort({ start: 1 })

    return NextResponse.json(events)
  } catch (error) {
    console.error('GET /api/reminder error:', error)
    return NextResponse.json({ message: 'Failed to fetch events' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()

    const body = await req.json()
    const { title, description, start, end, category, reminderTime, backgroundColor, borderColor } = body

    if (!title || !start) {
      return NextResponse.json({ message: 'Title and start are required' }, { status: 400 })
    }

    const event = await Event.create({
      userId: session.user.id,
      title,
      description: description || '',
      start: new Date(start),
      end: end ? new Date(end) : undefined,
      category: category || 'meeting',
      reminderTime: reminderTime ?? 30,
      backgroundColor: backgroundColor || '#3b82f6',
      borderColor: borderColor || '#2563eb',
    })

    return NextResponse.json(event, { status: 201 })
  } catch (error) {
    console.error('POST /api/reminder error:', error)
    return NextResponse.json({ message: 'Failed to create event' }, { status: 500 })
  }
}
