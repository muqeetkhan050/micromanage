import { NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
// import { Time } from "@/lib/models/Time"
import {Time} from '@lib/models/Time'

export async function GET() {

  await connectDB()

  const data = await Time.find().sort({ _id: -1 })

  return NextResponse.json(data)
}

export async function POST(req: Request) {

  const { clockIn, clockOut } = await req.json()

  await connectDB()

  await Time.create({ clockIn, clockOut })

  const data = await Time.find().sort({ _id: -1 })

  return NextResponse.json(data)
}