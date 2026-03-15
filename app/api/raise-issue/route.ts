
import { NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { Issue } from "@/lib/models/issue"
import { auth } from "@/lib/auth"   // ← v5 import

export async function POST(req: Request) {
  const session = await auth()     // ← v5 call, no authOptions needed

  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }
  if (!session.user.organisationId) {
    return NextResponse.json({ message: "Join an organisation first" }, { status: 403 })
  }

  const { title, description } = await req.json()
  await connectDB()

  const issue = await Issue.create({
    title,
    description,
    organisationId: session.user.organisationId,
    createdById: session.user.id,
  })

  return NextResponse.json({ message: "Issue created", issue })
}

export async function GET() {
  const session = await auth()

  if (!session?.user?.organisationId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  await connectDB()

  const issues = await Issue.find({
    organisationId: session.user.organisationId,
  }).sort({ createdAt: -1 })

  return NextResponse.json(issues)
}