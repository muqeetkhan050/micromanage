import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { Organisation } from '@/lib/models/Organisation'
import { User } from '@/lib/models/User'
import { auth } from '@/lib/auth'
import {sendEmail} from '@/lib/email'








export async function POST(req: Request) {
  try {
    await connectDB()

    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const { name, action } = await req.json()

    if (!name) {
      return NextResponse.json(
        { message: 'Organisation name required' },
        { status: 400 }
      )
    }

    const org = await Organisation.findOne({
      $or: [{ name }, { slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') }],
    })

    if (action === 'create') {
      if (org) {
        return NextResponse.json(
          { message: 'Organisation name is already taken' },
          { status: 400 }
        )
      }

      const slug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')

      const newOrg = await Organisation.create({ name, slug })

      await User.findByIdAndUpdate(session.user.id, {
        organisationId: newOrg._id,
      })

      try {
        await sendEmail(
          session.user.email,
          `Welcome to ${newOrg.name}!`,
          `
          <h1>Welcome to ${newOrg.name}!</h1>
          <p>Hi ${session.user.name},</p>
          <p>You've successfully created the organisation <strong>${newOrg.name}</strong>.</p>
          <p>Start by inviting your team members and raising issues.</p>
          `
        )
      } catch (e) {
        console.error('Welcome email failed:', e)
      }

      return NextResponse.json(newOrg)
    }

    if (action === 'join') {
      if (!org) {
        return NextResponse.json(
          { message: 'Organisation not found' },
          { status: 404 }
        )
      }

      await User.findByIdAndUpdate(session.user.id, {
        organisationId: org._id,
      })

      try {
        await sendEmail(
          session.user.email,
          `Welcome to ${org.name}!`,
          `
          <h1>Welcome to ${org.name}!</h1>
          <p>Hi ${session.user.name},</p>
          <p>You've successfully joined the organisation <strong>${org.name}</strong>.</p>
          <p>Check your dashboard to see assigned issues and collaborate with your team.</p>
          `
        )
      } catch (e) {
        console.error('Welcome email failed:', e)
      }

      return NextResponse.json(org)
    }

    return NextResponse.json({ message: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
