// import { NextResponse } from "next/server"
// import { connectDB } from "@/lib/db"
// import { User } from "@/lib/models/User"
// import jwt from "jsonwebtoken"

// export async function GET(req: Request) {

//   try {

//     await connectDB()

//     const token = req.headers.get("authorization")?.split(" ")[1]

//     if (!token) {
//       return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
//     }

//     const decoded: any = jwt.verify(token, process.env.JWT_SECRET!)

//     const organizationId = decoded.organizationId

//     const users = await User.find(
//       { organizationId },
//       { name: 1 }
//     )

//     return NextResponse.json(users)

//   } catch (error) {

//     return NextResponse.json(
//       { message: "Failed to fetch users" },
//       { status: 500 }
//     )

//   }

// }

import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { User } from '@/lib/models/User'
import { auth } from '@/lib/auth'

export async function GET() {
  try {
    await connectDB()

    const session = await auth()

    if (!session?.user?.organisationId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const users = await User.find({
      organisationId: session.user.organisationId,
    }).select('_id name')

    return NextResponse.json(users)
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { message: 'Failed to fetch users' },
      { status: 500 }
    )
  }
}
