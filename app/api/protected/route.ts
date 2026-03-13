import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({
    message: "You accessed a protected route"
  })
}