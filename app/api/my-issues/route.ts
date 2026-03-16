

// import { NextResponse } from "next/server"
// import { connectDB } from "@/lib/db"
// import { Issue } from "@/lib/models/issue"

// export async function POST(req: Request) {

//   try {

//     await connectDB()

//     const body = await req.json()

//     const { title, description, assignedTo } = body

//     if (!title || !description) {

//       return NextResponse.json(
//         { message: "Title and description required" },
//         { status: 400 }
//       )

//     }

//     const issue = await Issue.create({
//       title,
//       description,
//       assignedTo: assignedTo || null,
//       createdAt: new Date()
//     })

//     return NextResponse.json(issue)

//   } catch (error) {

//     console.error("Create issue error:", error)

//     return NextResponse.json(
//       { message: "Internal server error" },
//       { status: 500 }
//     )

//   }

// }

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