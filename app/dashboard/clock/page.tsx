
'use client'

import { useState, useEffect } from "react"
import { DatePickerTime } from "@/components/DatePickerTime"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableCaption,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"

export default function ChatPage() {
  const [clockIn, setClockIn] = useState("")
  const [clockOut, setClockOut] = useState("")
  const [records, setRecords] = useState<any[]>([])

  // Submit new record
  const submit = async () => {
    if (!clockIn || !clockOut) return
    const res = await fetch("/api/time", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clockIn, clockOut }),
    })

    const data = await res.json()
    setRecords(data)
    setClockIn("")
    setClockOut("")
  }

  // Load records
  const loadRecords = async () => {
    const res = await fetch("/api/time")
    const data = await res.json()
    setRecords(data)
  }

  useEffect(() => {
    loadRecords()
  }, [])

  return (
    <div className="flex flex-col items-center justify-center gap-8 mt-10 w-full min-h-screen px-4">

      {/* CLOCK INPUTS - SAME LINE */}
      <div className="flex flex-col md:flex-row items-center gap-4 w-full max-w-3xl">
        
        {/* Wrap each input to control width */}
        <div className="flex-1">
          <DatePickerTime label="Clock In" onChange={setClockIn} />
        </div>

        <div className="flex-1">
          <DatePickerTime label="Clock Out" onChange={setClockOut} />
        </div>

        <div>
          <Button
            onClick={submit}
            className="bg-black text-white h-12 w-full md:w-auto"
          >
            Submit
          </Button>
        </div>

      </div>

      {/* TABLE */}
      <div className="w-full max-w-4xl">
        <Table>
          <TableCaption className="text-center">
            Your submitted clock records
          </TableCaption>

          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Clock In</TableHead>
              <TableHead>Clock Out</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {records.length === 0 && (
              <TableRow>
                <TableCell colSpan={2} className="text-center text-gray-400">
                  No records yet
                </TableCell>
              </TableRow>
            )}

            {records.map((r, i) => (
              <TableRow key={i}>
                <TableCell className="font-medium">{r.clockIn}</TableCell>
                <TableCell>{r.clockOut}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}