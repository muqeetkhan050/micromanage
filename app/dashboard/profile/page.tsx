

"use client"

import { useState, useEffect } from "react"

import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter
} from "@/components/ui/sheet"

import { Button } from "@/components/ui/button"

export default function ProfilePage() {

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")

  useEffect(() => {

    const fetchProfile = async () => {

      const token = localStorage.getItem("token")

      const res = await fetch("/api/profile", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      const data = await res.json()

      setName(data.name )
      setEmail(data.email )
    }

    fetchProfile()

  }, [])

  // Update profile
  const handleUpdate = async () => {

    const token = localStorage.getItem("token")

    const res = await fetch("/api/profile/update", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ name, email })
    })

    const data = await res.json()

    alert("Profile updated")

    setName(data.name)
    setEmail(data.email)
  }

  return (
    <div className="p-10">

      <h1 className="text-2xl font-bold mb-6">
        Change your profile
      </h1>

      <Sheet>

        <SheetTrigger asChild>
          <Button>Edit Profile</Button>
        </SheetTrigger>

        <SheetContent side="right">

          <SheetHeader>
            <SheetTitle>Edit Profile</SheetTitle>
            <SheetDescription>
              Update your profile information here.
            </SheetDescription>
          </SheetHeader>

          <div className="grid gap-4 py-4">

            <input
              className="border p-2 rounded"
              placeholder="Enter name"
              value={name}
              onChange={(e)=>setName(e.target.value)}
            />

            <input
              className="border p-2 rounded"
              placeholder="Enter email"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
            />

          </div>

          <SheetFooter>
            <Button onClick={handleUpdate}>
              Save Changes
            </Button>
          </SheetFooter>

        </SheetContent>

      </Sheet>

    </div>
  )
}