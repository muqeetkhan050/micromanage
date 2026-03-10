
"use client"

import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"

export default function ProfilePage() {
  return (
    <div className="p-10">

      <h1 className="text-2xl font-bold mb-6">
        Change your profile
      </h1>

      {/* Sheet Component */}
      <Sheet>

        {/* Button that opens sheet */}
        <SheetTrigger asChild>
          <Button>Edit Profile</Button>
        </SheetTrigger>

        {/* Sliding panel */}
        <SheetContent side="right">

          <SheetHeader>
            <SheetTitle>Edit  Profile</SheetTitle>
            <SheetDescription>
              Update your profile information here.
            </SheetDescription>
          </SheetHeader>

          {/* Content */}
          <div className="grid gap-4 py-4">

            <input
              className="border p-2 rounded"
              placeholder="Enter name"
            />

            <input
              className="border p-2 rounded"
              placeholder="Enter email"
            />

          </div>

          <SheetFooter>
            <Button>Save Changes</Button>
          </SheetFooter>

        </SheetContent>

      </Sheet>

    </div>
  )
}