'use client'

import { useState, useEffect } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from '@/components/ui/sheet'

import { Button } from '@/components/ui/button'

interface Issue {
  _id: string
  title: string
  createdAt: string
}

interface Profile {
  name: string
  email: string
  role: string
  image?: string
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [issues, setIssues] = useState<Issue[]>([])

  useEffect(() => {
    fetch('/api/profile')
      .then((res) => res.json())
      .then((data) => {
        if (data.name) {
          setProfile(data)
          setName(data.name)
          setEmail(data.email)
        }
      })

    fetch('/api/raise-issue')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setIssues(data)
      })
  }, [])

  const handleUpdate = async () => {
    const res = await fetch('/api/profile/update', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email }),
    })
    const data = await res.json()
    alert('Profile updated')
    setProfile((prev) => (prev ? { ...prev, name: data.name, email: data.email } : prev))
    setName(data.name)
    setEmail(data.email)
  }

  // Build chart data: every day of the current month
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const chartData = Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1
    const count = issues.filter((issue) => {
      const d = new Date(issue.createdAt)
      return d.getFullYear() === year && d.getMonth() === month && d.getDate() === day
    }).length
    return { day: `${day}`, issues: count }
  })

  return (
    <div className="flex flex-col gap-6 p-6 w-full">
      {/* Profile Info */}
      <div className="bg-white p-6 rounded-md shadow-md flex items-center gap-6">
        <div className="flex size-16 items-center justify-center rounded-full bg-gray-200 text-2xl font-bold text-gray-600">
          {profile?.name?.charAt(0)?.toUpperCase() ?? '?'}
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{profile?.name ?? 'Loading...'}</h1>
          <p className="text-gray-500">{profile?.email}</p>
          <span className="inline-block mt-1 text-xs font-medium bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
            {profile?.role ?? '—'}
          </span>
        </div>

        <Sheet>
          <SheetTrigger asChild>
            <Button>Edit Profile</Button>
          </SheetTrigger>

          <SheetContent side="right">
            <SheetHeader>
              <SheetTitle>Edit Profile</SheetTitle>
              <SheetDescription>Update your profile information here.</SheetDescription>
            </SheetHeader>

            <div className="grid gap-4 py-4">
              <input
                className="border p-2 rounded"
                placeholder="Enter name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <input
                className="border p-2 rounded"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <SheetFooter>
              <Button onClick={handleUpdate}>Save Changes</Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>

      {/* Issues Per Day Chart */}
      <div className="bg-white p-6 rounded-md shadow-md">
        <h2 className="text-lg font-semibold mb-4">
          Issues Raised — {now.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" fontSize={12} />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="issues" fill="#8884d8" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
