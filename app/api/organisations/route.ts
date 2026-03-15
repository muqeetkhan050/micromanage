
import { NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { Organisation } from "@/lib/models/Organisation"
import { User } from "@/lib/models/User"
import { auth } from "@/lib/auth"

function slugify(name: string) {
  return name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
}
// app/api/organisations/route.ts — more reliable lookup
export async function POST(req: Request) {
  try {
    const session = await auth()

    if (!session?.user?.email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { name } = await req.json()
    if (!name?.trim()) {
      return NextResponse.json({ message: "Name is required" }, { status: 400 })
    }

    await connectDB()

    // Look up user by EMAIL not by session.user.id (more reliable)
    const user = await User.findOne({ email: session.user.email })
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    if (user.organisationId) {
      return NextResponse.json(
        { message: "Already in an organisation" },
        { status: 400 }
      )
    }

    const slug = slugify(name)
    const existing = await Organisation.findOne({ slug })
    if (existing) {
      return NextResponse.json(
        { message: "Organisation name already taken" },
        { status: 400 }
      )
    }

    const org = await Organisation.create({ name, slug })

    // Update by email — guaranteed to work even if _id mapping is off
    const updated = await User.findOneAndUpdate(
      { email: session.user.email },
      { organisationId: org._id, role: "ADMIN" },
      { new: true }
    )

    console.log("Org created:", org._id.toString())
    console.log("User updated:", updated?.organisationId?.toString())

    return NextResponse.json({ success: true }, { status: 201 })

  } catch (error) {
    console.error("Create org error:", error)
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 })
  }
}