'use client'

import { DatePickerTime } from '@/components/DatePickerTime'

export default function ChatPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      
      <div className="w-full max-w-md space-y-8">
        
        <h1 className="text-2xl font-semibold text-center">
          Time Tracking
        </h1>

        <div className="space-y-6">

          <div className="flex flex-col items-center gap-2">
            <h2 className="text-lg font-medium">Clock In</h2>
            <DatePickerTime />
          </div>

          <div className="flex flex-col items-center gap-2">
            <h2 className="text-lg font-medium">Clock Out</h2>
            <DatePickerTime />
          </div>

        </div>

      </div>

    </div>
  )
}