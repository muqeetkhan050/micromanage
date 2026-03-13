import { NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "mysecretkey"

export function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname

  // ✅ Skip login and signup routes
  if (pathname === "/api/login" || pathname === "/api/signup") {
    return NextResponse.next()
  }

  // Get Authorization header
  const authHeader = req.headers.get("authorization")
  if (!authHeader) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  const token = authHeader.split(" ")[1] // Bearer <token>

  try {
    jwt.verify(token, JWT_SECRET)
    return NextResponse.next() // Token valid → continue
  } catch (err) {
    return NextResponse.json({ message: "Invalid token" }, { status: 401 })
  }
}

// ✅ Match all API routes under /api
export const config = {
  matcher: ["/api/:path*"]
}