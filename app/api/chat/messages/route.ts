import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import Message from "@/lib/models/message"
import { auth } from "@/lib/auth"

export async function GET(req: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id || !session?.user?.organisationId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const orgId = session.user.organisationId

    await connectDB()

    const messages = await Message.find({ orgId })
      .sort({ createdAt: 1 })
      .limit(50)
      .lean()

    return NextResponse.json(messages)
  } catch (error) {
    console.error("Failed to fetch messages:", error)
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 })
  }
}
