import {NextResponse} from 'next/server'
import {connectDB} from '@/lib/db'
import {Issue } from "@/lib/models/issue";


export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()

    const deletedIssue = await Issue.findByIdAndDelete(params.id)

    if (!deletedIssue) {
      return NextResponse.json(
        { message: "Issue not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      message: "Issue deleted successfully",
    })
  } catch (error) {
    console.error("Delete error:", error)

    return NextResponse.json(
      { message: "Error deleting issue" },
      { status: 500 }
    )
  }
}



export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json()
    const { title, description } = body

    await connectDB()

    const updatedIssue = await Issue.findByIdAndUpdate(
      params.id,
      { title, description },
      { new: true }
    )

    if (!updatedIssue) {
      return NextResponse.json(
        { message: "Issue not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      message: "Issue updated successfully",
      issue: updatedIssue,
    })
  } catch (error) {
    console.error("Update error:", error)

    return NextResponse.json(
      { message: "Error updating issue" },
      { status: 500 }
    )
  }
}