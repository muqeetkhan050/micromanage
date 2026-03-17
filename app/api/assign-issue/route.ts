

// import { NextResponse } from "next/server"
// import { auth } from "@/lib/auth"
// import mongoose from "mongoose"
// import {connectDB} from "@/lib/db"
// import { Issue } from "@/lib/models/issue"

// export async function PATCH(req: Request) {
//   try {
//     await connectDB()

//     const session = await auth()

//     if (!session || !session.user) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
//     }

//     const { issueId, assignedTo } = await req.json()

//     if (!issueId) {
//       return NextResponse.json(
//         { error: "Issue ID required" },
//         { status: 400 }
//       )
//     }

//     const updatedIssue = await Issue.findByIdAndUpdate(
//       issueId,
//       {
//         assignedTo: assignedTo
//           ? new mongoose.Types.ObjectId(assignedTo)
//           : null,
//       },
//       { new: true }
//     )

//     if (!updatedIssue) {
//       return NextResponse.json(
//         { error: "Issue not found" },
//         { status: 404 }
//       )
//     }

//     return NextResponse.json(updatedIssue)
//   } catch (error) {
//     console.error("Assign Issue Error:", error)
//     return NextResponse.json(
//       { error: "Failed to assign issue" },
//       { status: 500 }
//     )
//   }
// }
// route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import {Issue} from "@/lib/models/issue";

export async function PATCH(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const { issueId, userId } = body;

    const updatedIssue = await Issue.findByIdAndUpdate(
      issueId,
      { assignedTo: userId },
      { new: true }
    );

    if (!updatedIssue) return NextResponse.json({ error: "Issue not found" }, { status: 404 });
    return NextResponse.json(updatedIssue);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Assign failed" }, { status: 500 });
  }
}
