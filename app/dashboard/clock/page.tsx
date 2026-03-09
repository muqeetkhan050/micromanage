

'use client'

import { useState, useEffect } from "react"
import { DatePickerTime } from "@/components/DatePickerTime"

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
    <div className="flex flex-col items-center gap-8 mt-10">

      <DatePickerTime label="Clock In" onChange={setClockIn} />

      <DatePickerTime label="Clock Out" onChange={setClockOut} />

      <button
        onClick={submit}
        className="border px-4 py-2"
      >
        Submit
      </button>

      <div className="mt-10 w-full max-w-md">

        <h2 className="text-lg mb-4 text-center">Records</h2>

        {records.map((r, i) => (
          <div key={i} className="flex justify-between border p-2">
            <span>{r.clockIn}</span>
            <span>{r.clockOut}</span>
          </div>
        ))}

      </div>

    </div>
  )
}