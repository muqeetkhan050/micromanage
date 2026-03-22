

import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { Time } from '@/lib/models/Time'
import { auth } from '@/lib/auth'
import mongoose from 'mongoose'

export async function GET() {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  await connectDB()

  const data = await Time.find({
    userId: new mongoose.Types.ObjectId(session.user.id)
  }).sort({ _id: -1 })

  return NextResponse.json(data)
}

export async function POST(req: Request) {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { clockIn, clockOut } = await req.json()

  await connectDB()

  await Time.create({
    userId: new mongoose.Types.ObjectId(session.user.id),
    clockIn,
    clockOut,
  })

  const data = await Time.find({
    userId: new mongoose.Types.ObjectId(session.user.id)
  }).sort({ _id: -1 })

  return NextResponse.json(data)
}