import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { Issue } from '@/lib/models/issue'
import { auth } from '@/lib/auth'

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const { status } = await req.json()

  if (!['not started yet', 'in Progress', 'completed'].includes(status)) {
    return NextResponse.json({ message: 'Invalid status' }, { status: 400 })
  }

  const { id } = await params
  await connectDB()
  const updated = await Issue.findByIdAndUpdate(id, { status }, { new: true })
  return NextResponse.json(updated)
}
