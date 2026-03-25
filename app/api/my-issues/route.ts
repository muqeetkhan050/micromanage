

import { NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { Issue } from "@/lib/models/issue"
import { auth } from "@/lib/auth"

export async function GET() {

  try {

    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      )
    }

    await connectDB()

    const issues = await Issue.find({
      assignedTo: session.user.id
    }).sort({ createdAt: -1 })

    return NextResponse.json(issues)

  } catch (error) {

    return NextResponse.json(
      { message: "Failed to fetch issues" },
      { status: 500 }
    )

  }

}