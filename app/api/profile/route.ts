import { NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { connectDB } from "@/lib/db"
import { User } from "@/lib/models/User"

const JWT_SECRET = process.env.JWT_SECRET || "mysecretkey"

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization")

    if (!authHeader) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const token = authHeader.split(" ")[1]

    const decoded: any = jwt.verify(token, JWT_SECRET)

    await connectDB()

    const user = await User.findById(decoded.userId).select("-password")

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    return NextResponse.json(user)

  } catch (error) {
    return NextResponse.json({ message: "Invalid token" }, { status: 401 })
  }
}