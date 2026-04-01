import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import Event from '@/lib/models/Event'
import { auth } from '@/lib/auth'

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()

    const { id } = await params
    const body = await req.json()
    const { title, description, start, end, category, reminderTime, backgroundColor, borderColor } = body

    const event = await Event.findOneAndUpdate(
      { _id: id, userId: session.user.id },
      {
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(start && { start: new Date(start) }),
        ...(end !== undefined && { end: end ? new Date(end) : undefined }),
        ...(category && { category }),
        ...(reminderTime !== undefined && { reminderTime }),
        ...(backgroundColor && { backgroundColor }),
        ...(borderColor && { borderColor }),
      },
      { new: true }
    )

    if (!event) {
      return NextResponse.json({ message: 'Event not found' }, { status: 404 })
    }

    return NextResponse.json(event)
  } catch (error) {
    console.error('PATCH /api/reminder/[id] error:', error)
    return NextResponse.json({ message: 'Failed to update event' }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()

    const { id } = await params
    const event = await Event.findOneAndDelete({ _id: id, userId: session.user.id })

    if (!event) {
      return NextResponse.json({ message: 'Event not found' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Event deleted' })
  } catch (error) {
    console.error('DELETE /api/reminder/[id] error:', error)
    return NextResponse.json({ message: 'Failed to delete event' }, { status: 500 })
  }
}
