import { NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { Invite } from "@/lib/models/Invite"
import { User } from "@/lib/models/User"
import { auth } from "@/lib/auth"

export async function POST(
  _req: Request,
  { params }: { params: { token: string } }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Login first" }, { status: 401 })
    }

    await connectDB()

    const invite = await Invite.findOne({ token: params.token })

    if (!invite || invite.accepted || invite.expiresAt < new Date()) {
      return NextResponse.json({ message: "Invalid or expired invite" }, { status: 400 })
    }

    if (invite.email !== session.user.email) {
      return NextResponse.json({ message: "This invite is for a different email" }, { status: 403 })
    }

    // Add user to the org
    await User.findByIdAndUpdate(session.user.id, {
      organisationId: invite.organisationId,
      role: "MEMBER",
    })

    // Mark invite as used
    await Invite.findByIdAndUpdate(invite._id, { accepted: true })

    return NextResponse.json({ message: "Joined organisation successfully" })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 })
  }
}