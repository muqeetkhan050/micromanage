import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { User } from '@/lib/models/User'
import { auth } from '@/lib/auth'

export async function GET() {
  try {
    await connectDB()

    const session = await auth()

    if (!session?.user?.organisationId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const users = await User.find({
      organisationId: session.user.organisationId,
    }).select('_id name')

    return NextResponse.json(users)
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { message: 'Failed to fetch users' },
      { status: 500 }
    )
  }
}
