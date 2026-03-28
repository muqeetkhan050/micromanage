// app/api/assign-issue/route.ts
import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { Issue } from '@/lib/models/issue'
import { auth } from '@/lib/auth'

export async function PATCH(req: Request) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!session.user.organisationId) {
      return NextResponse.json({ error: 'No organisation' }, { status: 403 })
    }

    await connectDB()
    const { issueId, userId } = await req.json()

    // Make sure the issue belongs to the user's org
    const issue = await Issue.findById(issueId)
    if (!issue || issue.organizationId.toString() !== session.user.organisationId) {
      return NextResponse.json({ error: 'Issue not found' }, { status: 404 })
    }

    const updatedIssue = await Issue.findByIdAndUpdate(
      issueId,
      { assignedTo: userId },
      { new: true }
    )

    return NextResponse.json(updatedIssue)
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Assign failed' }, { status: 500 })
  }
}
