import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { Issue } from '@/lib/models/issue'
import { auth } from '@/lib/auth'

export async function POST(req: Request) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    if (!session.user.organisationId) {
      return NextResponse.json(
        { message: 'Join an organization first' },
        { status: 403 }
      )
    }

    const { title, description, assignedTo } = await req.json()

    if (!title || !description) {
      return NextResponse.json(
        { message: 'Title and description required' },
        { status: 400 }
      )
    }

    await connectDB()

    const issue = await Issue.create({
      title,
      description,
      assignedTo: assignedTo || null,
      organizationId: session.user.organisationId,
      createdBy: session.user.id,
      createdAt: new Date(),
    })

    return NextResponse.json(issue)
  } catch (error) {
    console.error('Create issue error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const session = await auth()

    if (!session?.user?.organisationId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()

    const issues = await Issue.find({
      organizationId: session.user.organisationId,
    }).sort({ createdAt: -1 })

    return NextResponse.json(issues)
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { message: 'Failed to fetch issues' },
      { status: 500 }
    )
  }
}
