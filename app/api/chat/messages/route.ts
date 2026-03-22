import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import Message from "@/lib/models/message"
import mongoose from "mongoose"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const orgId = searchParams.get("orgId")

    if (!orgId) {
      return NextResponse.json({ error: "orgId is required" }, { status: 400 })
    }

    // Validate it is a valid ObjectId before querying
    if (!mongoose.Types.ObjectId.isValid(orgId)) {
      return NextResponse.json({ error: "Invalid orgId" }, { status: 400 })
    }

    await connectDB()

    const messages = await Message.find({
      orgId: new mongoose.Types.ObjectId(orgId)
    })
      .sort({ createdAt: 1 })
      .limit(50)
      .lean()

    return NextResponse.json(messages)
  } catch (error) {
    console.error("Failed to fetch messages:", error)
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 })
  }
}