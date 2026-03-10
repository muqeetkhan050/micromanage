
import { NextResponse } from "next/server"
import {Issue } from "@/lib/models/issue";
import {connectDB} from "@/lib/db"

export async function PATCH(
  req: Request,
  context: { params: { id: string } | Promise<{ id: string }> }
) {
  try {
    const { params } = context
    const { id } = await params 
    const { title, description } = await req.json()
    await connectDB()

    const updated = await Issue.findByIdAndUpdate(
      id,
      { title, description },
      { new: true }
    )

    if (!updated) return NextResponse.json({ message: "Issue not found" }, { status: 404 })

    return NextResponse.json(updated)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: "Error updating issue" }, { status: 500 })
  }
}

export async function DELETE(
  req: Request,
  context: { params: { id: string } | Promise<{ id: string }> }
) {
  try {
    const { params } = context
    const { id } = await params 

    await connectDB()
    const deletedIssue = await Issue.findByIdAndDelete(id)

    if (!deletedIssue)
      return NextResponse.json({ message: "Issue not found" }, { status: 404 })

    return NextResponse.json({ message: "Issue deleted successfully" })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: "Error deleting issue" }, { status: 500 })
  }
}