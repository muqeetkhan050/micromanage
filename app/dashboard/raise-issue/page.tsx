
'use client'
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Field, FieldGroup } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface Issue {
  _id: string
  title: string
  description: string
}

export default function RaiseIssuePage() {
  // --- Issues & Error ---
  const [issues, setIssues] = useState<Issue[]>([])
  const [error, setError] = useState("")

  // --- New Issue form ---
  const [newTitle, setNewTitle] = useState("")
  const [newDescription, setNewDescription] = useState("")

  // --- Editing Issue ---
  const [editingIssue, setEditingIssue] = useState<Issue | null>(null)
  const [editTitle, setEditTitle] = useState("")
  const [editDescription, setEditDescription] = useState("")

  // Fetch all issues
  const fetchIssues = async () => {
    const res = await fetch("/api/raise-issue")
    const data = await res.json()
    setIssues(data)
  }

  useEffect(() => {
    fetchIssues()
  }, [])

  // --- Handle create new issue ---
  const handleCreateSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!newTitle || !newDescription) {
      setError("Please fill all fields")
      return
    }

    const res = await fetch("/api/raise-issue", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newTitle, description: newDescription }),
    })

    const data = await res.json()
    if (res.ok) {
      setNewTitle("")
      setNewDescription("")
      setError("")
      fetchIssues()
    } else {
      setError(data.message)
    }
  }

  // --- Handle edit ---
  const handleEdit = (issue: Issue) => {
    setEditingIssue(issue)
    setEditTitle(issue.title)
    setEditDescription(issue.description)
  }

  // --- Handle edit form submit (PATCH) ---
  const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!editingIssue) return
    if (!editTitle || !editDescription) {
      setError("Please fill all fields")
      return
    }

    const res = await fetch(`/api/raise-issue/${editingIssue._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: editTitle, description: editDescription }),
    })

    const data = await res.json()
    if (res.ok) {
      setEditingIssue(null)
      setEditTitle("")
      setEditDescription("")
      setError("")
      fetchIssues()
    } else {
      setError(data.message)
    }
  }

  // --- Handle delete ---
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this issue?")) return
    const res = await fetch(`/api/raise-issue/${id}`, { method: "DELETE" })
    if (res.ok) fetchIssues()
    else {
      const data = await res.json()
      setError(data.message)
    }
  }

  return (
    <div className="flex flex-col gap-6 p-6 max-w-3xl mx-auto">

      {/* --- NEW ISSUE FORM --- */}
      <form
        onSubmit={handleCreateSubmit}
        className="flex flex-col gap-4 bg-white p-6 rounded-md shadow-md"
      >
        <h1 className="text-xl font-bold">Raise a New Issue</h1>
        {error && <p className="text-red-500 text-sm">{error}</p>}

        <input
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="Enter issue title..."
          className="border border-gray-300 rounded-md p-2"
        />
        <textarea
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
          placeholder="Describe your issue..."
          className="border border-gray-300 rounded-md p-2 h-32"
        />

        <Button type="submit" className="bg-black text-white">
          Submit Issue
        </Button>
      </form>

      {/* --- ISSUES LIST --- */}
      <div className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold">Submitted Issues</h2>
        {issues.length === 0 && (
          <p className="text-gray-400 text-sm">No issues yet.</p>
        )}

        {issues.map((issue) => (
          <div
            key={issue._id}
            className="border rounded-md p-4 bg-gray-50 flex justify-between items-start"
          >
            <div>
              <h3 className="font-medium">{issue.title}</h3>
              <p className="text-sm text-gray-500 mt-1">{issue.description}</p>
            </div>

            <div className="flex gap-2">
              {/* --- EDIT DIALOG --- */}
              <Dialog
                open={editingIssue?._id === issue._id}
                onOpenChange={(open) => !open && setEditingIssue(null)}
              >
                <DialogTrigger asChild>
                  <Button className="bg-black text-white" onClick={() => handleEdit(issue)}>
                    Edit
                  </Button>
                </DialogTrigger>

                <DialogContent className="sm:max-w-sm">
                  <form onSubmit={handleEditSubmit}>
                    <DialogHeader>
                      <DialogTitle>Edit Issue</DialogTitle>
                      <DialogDescription>
                        Update your issue details below.
                      </DialogDescription>
                    </DialogHeader>

                    <FieldGroup>
                      <Field>
                        <Label htmlFor="edit-title">Title</Label>
                        <Input
                          id="edit-title"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                        />
                      </Field>
                      <Field>
                        <Label htmlFor="edit-description">Description</Label>
                        <textarea
                          id="edit-description"
                          value={editDescription}
                          onChange={(e) => setEditDescription(e.target.value)}
                          className="border border-gray-300 rounded-md p-2 h-24 w-full"
                        />
                      </Field>
                    </FieldGroup>

                    {error && (
                      <p className="text-red-500 text-sm mt-1">{error}</p>
                    )}

                    <DialogFooter>
                      <DialogClose asChild>
                        <Button className="bg-black text-white">Cancel</Button>
                      </DialogClose>
                      <Button type="submit" className="bg-black text-white">
                        Save changes
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>

              {/* --- DELETE BUTTON --- */}
              <Button className="bg-black text-white" onClick={() => handleDelete(issue._id)}>
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}