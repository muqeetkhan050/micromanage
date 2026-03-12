

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

  const submit = async () => {

    const res = await fetch("/api/time", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clockIn, clockOut })
    })

    const data = await res.json()
    setRecords(data)
  }

  const loadRecords = async () => {
    const res = await fetch("/api/time")
    const data = await res.json()
    setRecords(data)
  }

  useEffect(() => {
    loadRecords()
  }, [])

  return (

    <div className="flex flex-col items-center gap-8 mt-10 w-full">

      {/* CLOCK INPUTS */}

      <DatePickerTime label="Clock In" onChange={setClockIn} />

      <DatePickerTime label="Clock Out" onChange={setClockOut} />

      <Button
        onClick={submit}
        className="bg-black text-white"
      >
        Submit
      </Button>


      {/* TABLE */}

      <div className="mt-10 w-full max-w-3xl">

        <Table>

          <TableCaption>
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

                <TableCell className="font-medium">
                  {r.clockIn}
                </TableCell>

                <TableCell>
                  {r.clockOut}
                </TableCell>

              </TableRow>

            ))}

          </TableBody>

        </Table>

      </div>

    </div>

  )
}