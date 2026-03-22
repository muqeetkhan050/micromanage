

'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

import { Input } from '@/components/ui/input'

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import {
  LineChart,
  Line,
  XAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

interface Issue {
  _id: string
  title: string
  description: string
  createdAt: string
  assignedTo?: string
}

interface User {
  _id: string
  name: string
}

export default function RaiseIssuePage() {
  const [issues, setIssues] = useState<Issue[]>([])
  const [users, setUsers] = useState<User[]>([])

  const [newTitle, setNewTitle] = useState('')
  const [newDescription, setNewDescription] = useState('')
  const [assignedUser, setAssignedUser] = useState('')

  const [editingIssue, setEditingIssue] = useState<Issue | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [editDescription, setEditDescription] = useState('')

  const [error, setError] = useState('')

  /* ---------------- FETCH ISSUES ---------------- */
  const fetchIssues = async () => {
    try {
      const res = await fetch('/api/raise-issue')
      const data = await res.json()
      if (!res.ok) {
        setError(data.message ?? 'Failed to load issues')
        setIssues([])
        return
      }
      if (Array.isArray(data)) {
        setIssues(data)
        setError('')
      } else setIssues([])
    } catch (err) {
      console.error(err)
      setIssues([])
    }
  }

  /* ---------------- FETCH USERS ---------------- */
  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/org-users')
      const data = await res.json()
      if (Array.isArray(data)) setUsers(data)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    fetchIssues()
    fetchUsers()
  }, [])

  /* ---------------- CREATE ISSUE ---------------- */
  const handleCreateSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/raise-issue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle,
          description: newDescription,
          assignedTo: assignedUser || null,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data?.message || 'Failed to create issue')
        return
      }
      setNewTitle('')
      setNewDescription('')
      setAssignedUser('')
      fetchIssues()
      toast.success('Issue created successfully')
    } catch (err) {
      console.error(err)
      toast.error('Failed to create issue')
    }
  }

  /* ---------------- ASSIGN ISSUE ---------------- */
  const assignIssue = async (issueId: string, userId: string) => {
    if (!userId) {
      toast.error('Select user first')
      return
    }
    try {
      const res = await fetch('/api/assign-issue', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ issueId, userId }),
      })
      if (!res.ok) throw new Error('Assign failed')
      toast.success('Issue assigned')
      fetchIssues()
    } catch (err) {
      console.error(err)
      toast.error('Failed to assign issue')
    }
  }

  /* ---------------- EDIT ISSUE ---------------- */
  const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!editingIssue) return
    try {
      const res = await fetch(`/api/raise-issue/${editingIssue._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: editTitle,
          description: editDescription,
        }),
      })
      if (!res.ok) throw new Error('Update failed')
      setEditingIssue(null)
      fetchIssues()
      toast.success('Issue updated')
    } catch (err) {
      console.error(err)
      toast.error('Update failed')
    }
  }

  /* ---------------- DELETE ISSUE ---------------- */
  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/raise-issue/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Delete failed')
      fetchIssues()
      toast.success('Issue deleted')
    } catch (err) {
      console.error(err)
      toast.error('Delete failed')
    }
  }

  /* ---------------- CHART DATA ---------------- */
  const chartData = [...issues]
    .sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    )
    .reduce((acc: { date: string; count: number }[], curr) => {
      const date = new Date(curr.createdAt).toLocaleDateString('en-GB')
      const existing = acc.find((item) => item.date === date)
      if (existing) existing.count += 1
      else acc.push({ date, count: 1 })
      return acc
    }, [])

  return (
    <div className="flex flex-col gap-6 p-6 w-full">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-md">
          {error}
        </div>
      )}

      {/* ---------------- CREATE ISSUE FORM ---------------- */}
      <form
        onSubmit={handleCreateSubmit}
        className="flex flex-col gap-4 bg-white p-6 rounded-md shadow-md"
      >
        <h1 className="text-xl font-bold">Raise Issue</h1>
        <Input
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="Issue title"
          required
        />
        <textarea
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
          placeholder="Issue description"
          className="border p-2 rounded h-32"
          required
        />

        {/* SHADCN SELECT FOR CREATE FORM */}
        <Select value={assignedUser} onValueChange={setAssignedUser}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Assign user" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Team Members</SelectLabel>
              {users.map((user) => (
                <SelectItem key={user._id} value={user._id}>
                  {user.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        <Button type="submit" className="bg-black text-white">
          Submit Issue
        </Button>
      </form>

      {/* ---------------- ISSUES TABLE ---------------- */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Assign</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {issues.map((issue) => (
            <TableRow key={issue._id}>
              <TableCell>{issue.title}</TableCell>
              <TableCell>{issue.description}</TableCell>

              {/* ROW-LEVEL SHADCN SELECT */}
              <TableCell>
                <Select
                  value={issue.assignedTo || ''}
                  onValueChange={(userId) => assignIssue(issue._id, userId)}
                >
                  <SelectTrigger className="w-full max-w-48">
                    <SelectValue placeholder="Assign user" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Team Members</SelectLabel>
                      {users.map((user) => (
                        <SelectItem key={user._id} value={user._id}>
                          {user.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </TableCell>

              <TableCell className="text-right space-x-2">
                {/* EDIT BUTTON */}
                <Button
                  className="bg-black text-white"
                  onClick={() => {
                    setEditingIssue(issue)
                    setEditTitle(issue.title)
                    setEditDescription(issue.description)
                  }}
                >
                  Edit
                </Button>

                {/* EDIT MODAL */}
                {editingIssue && editingIssue._id === issue._id && (
                  <Dialog
                    open={true}
                    onOpenChange={(open) => !open && setEditingIssue(null)}
                  >
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit Issue</DialogTitle>
                        <DialogDescription>
                          Update title and description
                        </DialogDescription>
                      </DialogHeader>
                      <form
                        onSubmit={handleEditSubmit}
                        className="flex flex-col gap-4"
                      >
                        <Input
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          required
                        />
                        <textarea
                          value={editDescription}
                          onChange={(e) => setEditDescription(e.target.value)}
                          className="border p-2 rounded h-32"
                          required
                        />
                        <DialogFooter className="flex justify-end gap-2">
                          <Button
                            type="button"
                            variant="secondary"
                            onClick={() => setEditingIssue(null)}
                          >
                            Cancel
                          </Button>
                          <Button type="submit" className="bg-black text-white">
                            Save
                          </Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                )}

                {/* DELETE BUTTON */}
                <Button
                  className="bg-black text-white"
                  onClick={() => handleDelete(issue._id)}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* ---------------- CHART ---------------- */}
      <div className="bg-white p-6 rounded-md shadow-md">
        <h2 className="text-lg font-semibold mb-4">Issues Over Time</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="count"
              stroke="#8884d8"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}