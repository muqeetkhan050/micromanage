import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { User } from '@/lib/models/User'
import { Issue } from '@/lib/models/issue'
import { sendEmail } from '@/lib/email'

export async function GET(req: Request) {
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  await connectDB()

  const users = (await User.find({ organisationId: { $ne: null } }).lean()) as any[]

  let sent = 0

  for (const user of users) {
    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)

    const issueCount = await Issue.countDocuments({
      organizationId: user.organisationId,
      createdAt: { $gte: oneWeekAgo },
    })

    const assignedCount = await Issue.countDocuments({
      assignedTo: user._id,
      status: { $ne: 'completed' },
    })

    await sendEmail(
      user.email,
      'Micromanage Weekly Update',
      `
      <h1>Weekly Update</h1>
      <p>Hi ${user.name},</p>
      <p>Here's your weekly summary:</p>
      <ul>
        <li><strong>${issueCount}</strong> new issues raised in your org this week</li>
        <li><strong>${assignedCount}</strong> issues assigned to you are still open</li>
      </ul>
      <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard">Go to Dashboard</a></p>
      `
    )
    sent++
  }

  return NextResponse.json({ message: `Newsletter sent to ${sent} users` })
}
