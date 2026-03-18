import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { Invite } from '@/lib/models/Invite'
import { auth } from '@/lib/auth'
import crypto from 'crypto'

export async function POST(req: Request) {
  try {
    const session = await auth()

    if (session?.user?.role !== 'ADMIN') {
      return NextResponse.json(
        { message: 'Only admins can invite members' },
        { status: 403 }
      )
    }

    const { email } = await req.json()
    await connectDB()

    const token = crypto.randomUUID()

    await Invite.create({
      email,
      token,
      organisationId: session.user.organisationId,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 48), // 48 hours
    })

    // In production replace this log with your email sender (Resend, Nodemailer etc)
    const inviteUrl = `${process.env.NEXT_PUBLIC_APP_URL}/invite/${token}`
    console.log(`Invite URL for ${email}: ${inviteUrl}`)

    return NextResponse.json({ message: 'Invite sent', inviteUrl })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { message: 'Something went wrong' },
      { status: 500 }
    )
  }
}
