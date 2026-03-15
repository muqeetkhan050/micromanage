

// "use client"

// import { useState, useEffect } from "react"
// import { Button } from "@/components/ui/button"
// import { toast } from "sonner"

// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table"

// import {
//   Dialog,
//   DialogClose,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog"

// import { Field, FieldGroup } from "@/components/ui/field"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"

// import {
//   LineChart,
//   Line,
//   XAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
// } from "recharts"

// interface Issue {
//   _id: string
//   title: string
//   description: string
//   createdAt: string
// }

// export default function RaiseIssuePage() {
//   const [issues, setIssues] = useState<Issue[]>([])
//   const [newTitle, setNewTitle] = useState("")
//   const [newDescription, setNewDescription] = useState("")
//   const [editingIssue, setEditingIssue] = useState<Issue | null>(null)
//   const [editTitle, setEditTitle] = useState("")
//   const [editDescription, setEditDescription] = useState("")

//   // Fetch all issues
//   const fetchIssues = async () => {
//     const res = await fetch("/api/raise-issue")
//     const data = await res.json()
//     setIssues(data)
//   }

//   useEffect(() => {
//     fetchIssues()
//   }, [])

//   // Handle creating a new issue
//   const handleCreateSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault()
//     const res = await fetch("/api/raise-issue", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ title: newTitle, description: newDescription }),
//     })

//     if (res.ok) {
//       setNewTitle("")
//       setNewDescription("")
//       fetchIssues()
//       toast.success("Issue has been created successfully", {
//         description: "Your issue was submitted to the system",
//       })
//     } else {
//       toast.error("Failed to create issue")
//     }
//   }

//   // Handle edit
//   const handleEdit = (issue: Issue) => {
//     setEditingIssue(issue)
//     setEditTitle(issue.title)
//     setEditDescription(issue.description)
//   }

//   const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault()
//     if (!editingIssue) return

//     const res = await fetch(`/api/raise-issue/${editingIssue._id}`, {
//       method: "PATCH",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ title: editTitle, description: editDescription }),
//     })

//     if (res.ok) {
//       setEditingIssue(null)
//       fetchIssues()
//       toast.success("Issue updated successfully")
//     } else {
//       toast.error("Failed to update issue")
//     }
//   }

//   // Handle delete
//   const handleDelete = async (id: string) => {
//     const res = await fetch(`/api/raise-issue/${id}`, { method: "DELETE" })
//     if (res.ok) {
//       fetchIssues()
//       toast.success("Issue deleted successfully")
//     } else {
//       toast.error("Failed to delete issue")
//     }
//   }

//   // Prepare chart data: aggregate issues per day
//   const chartData = issues
//     .sort(
//       (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
//     )
//     .reduce((acc: { date: string; count: number }[], curr) => {
//       const date = new Date(curr.createdAt).toLocaleDateString("en-GB")
//       const existing = acc.find((item) => item.date === date)
//       if (existing) existing.count += 1
//       else acc.push({ date, count: 1 })
//       return acc
//     }, [])

//   return (
//     <div className="flex flex-col gap-6 p-6 w-full">

//       {/* NEW ISSUE FORM */}
//       <form
//         onSubmit={handleCreateSubmit}
//         className="flex flex-col gap-4 bg-white p-6 rounded-md shadow-md"
//       >
//         <h1 className="text-xl font-bold">Raise a New Issue</h1>

//         <input
//           value={newTitle}
//           onChange={(e) => setNewTitle(e.target.value)}
//           placeholder="Enter issue title..."
//           className="border border-gray-300 rounded-md p-2"
//         />

//         <textarea
//           value={newDescription}
//           onChange={(e) => setNewDescription(e.target.value)}
//           placeholder="Describe your issue..."
//           className="border border-gray-300 rounded-md p-2 h-32"
//         />

//         <Button type="submit" className="bg-black text-white">
//           Submit Issue
//         </Button>
//       </form>

//       {/* ISSUES TABLE */}
//       <div>
//         <h2 className="text-lg font-semibold mb-4">Submitted Issues</h2>

//         <Table>
//           <TableHeader>
//             <TableRow>
//               <TableHead className="w-[200px]">Title</TableHead>
//               <TableHead>Description</TableHead>
//               <TableHead className="text-right">Actions</TableHead>
//             </TableRow>
//           </TableHeader>

//           <TableBody>
//             {issues.map((issue) => (
//               <TableRow key={issue._id}>
//                 <TableCell className="font-medium">{issue.title}</TableCell>
//                 <TableCell>{issue.description}</TableCell>
//                 <TableCell className="text-right space-x-2">

//                   {/* EDIT DIALOG */}
//                   <Dialog
//                     open={editingIssue?._id === issue._id}
//                     onOpenChange={(open) => !open && setEditingIssue(null)}
//                   >
//                     <DialogTrigger asChild>
//                       <Button
//                         className="bg-black text-white"
//                         onClick={() => handleEdit(issue)}
//                       >
//                         Edit
//                       </Button>
//                     </DialogTrigger>

//                     <DialogContent>
//                       <form onSubmit={handleEditSubmit}>
//                         <DialogHeader>
//                           <DialogTitle>Edit Issue</DialogTitle>
//                           <DialogDescription>
//                             Update issue details
//                           </DialogDescription>
//                         </DialogHeader>

//                         <FieldGroup>
//                           <Field>
//                             <Label>Title</Label>
//                             <Input
//                               value={editTitle}
//                               onChange={(e) => setEditTitle(e.target.value)}
//                             />
//                           </Field>

//                           <Field>
//                             <Label>Description</Label>
//                             <textarea
//                               value={editDescription}
//                               onChange={(e) => setEditDescription(e.target.value)}
//                               className="border border-gray-300 rounded-md p-2 h-24 w-full"
//                             />
//                           </Field>
//                         </FieldGroup>

//                         <DialogFooter>
//                           <DialogClose asChild>
//                             <Button className="bg-black text-white">Cancel</Button>
//                           </DialogClose>

//                           <Button type="submit" className="bg-black text-white">
//                             Save
//                           </Button>
//                         </DialogFooter>
//                       </form>
//                     </DialogContent>
//                   </Dialog>

//                   {/* DELETE BUTTON */}
//                   <Button
//                     className="bg-black text-white"
//                     onClick={() => handleDelete(issue._id)}
//                   >
//                     Delete
//                   </Button>

//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </div>

//       {/* ISSUES CHART */}
//       <div className="bg-white p-6 rounded-md shadow-md">
//         <h2 className="text-lg font-semibold mb-4">Issues Over Time</h2>
//         <ResponsiveContainer width="100%" height={300}>
//           <LineChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
//             <CartesianGrid strokeDasharray="3 3" />
//             <XAxis dataKey="date" />
//             <Tooltip />
//             <Line type="monotone" dataKey="count" stroke="#8884d8" strokeWidth={2} />
//           </LineChart>
//         </ResponsiveContainer>
//       </div>
//     </div>
//   )
// }


"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import {
  Table, TableBody, TableCell, TableHead,
  TableHeader, TableRow,
} from "@/components/ui/table"
import {
  Dialog, DialogClose, DialogContent, DialogDescription,
  DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog"
import { Field, FieldGroup } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  LineChart, Line, XAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from "recharts"

interface Issue {
  _id: string
  title: string
  description: string
  createdAt: string
}

export default function RaiseIssuePage() {
  const [issues, setIssues] = useState<Issue[]>([])   // ← typed as array
  const [newTitle, setNewTitle] = useState("")
  const [newDescription, setNewDescription] = useState("")
  const [editingIssue, setEditingIssue] = useState<Issue | null>(null)
  const [editTitle, setEditTitle] = useState("")
  const [editDescription, setEditDescription] = useState("")
  const [error, setError] = useState("")               // ← new: show errors

  const fetchIssues = async () => {
    try {
      const res = await fetch("/api/raise-issue")
      const data = await res.json()

      if (!res.ok) {
        // API returned an error — show it, don't crash
        setError(data.message ?? "Failed to load issues")
        setIssues([])
        return
      }

      // Safety check — make sure it really is an array
      if (Array.isArray(data)) {
        setIssues(data)
        setError("")
      } else {
        console.error("Unexpected response:", data)
        setIssues([])
      }
    } catch (err) {
      console.error("fetchIssues failed:", err)
      setIssues([])
    }
  }

  useEffect(() => {
    fetchIssues()
  }, [])

  const handleCreateSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const res = await fetch("/api/raise-issue", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newTitle, description: newDescription }),
    })

    if (res.ok) {
      setNewTitle("")
      setNewDescription("")
      fetchIssues()
      toast.success("Issue has been created successfully", {
        description: "Your issue was submitted to the system",
      })
    } else {
      const data = await res.json()
      toast.error(data.message ?? "Failed to create issue")
    }
  }

  const handleEdit = (issue: Issue) => {
    setEditingIssue(issue)
    setEditTitle(issue.title)
    setEditDescription(issue.description)
  }

  const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!editingIssue) return

    const res = await fetch(`/api/raise-issue/${editingIssue._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: editTitle, description: editDescription }),
    })

    if (res.ok) {
      setEditingIssue(null)
      fetchIssues()
      toast.success("Issue updated successfully")
    } else {
      toast.error("Failed to update issue")
    }
  }

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/raise-issue/${id}`, { method: "DELETE" })
    if (res.ok) {
      fetchIssues()
      toast.success("Issue deleted successfully")
    } else {
      toast.error("Failed to delete issue")
    }
  }

  // ← Safe: issues is always an array now, spread to avoid mutating state
  const chartData = [...issues]
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    .reduce((acc: { date: string; count: number }[], curr) => {
      const date = new Date(curr.createdAt).toLocaleDateString("en-GB")
      const existing = acc.find((item) => item.date === date)
      if (existing) existing.count += 1
      else acc.push({ date, count: 1 })
      return acc
    }, [])

  return (
    <div className="flex flex-col gap-6 p-6 w-full">

      {/* Show error banner if user has no org */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error === "You are not part of an organisation"
            ? "You need to create or join an organisation first."
            : error}
          {error === "You are not part of an organisation" && (
            <a href="/onboarding" className="ml-2 underline font-medium">
              Go to onboarding →
            </a>
          )}
        </div>
      )}

      {/* NEW ISSUE FORM */}
      <form
        onSubmit={handleCreateSubmit}
        className="flex flex-col gap-4 bg-white p-6 rounded-md shadow-md"
      >
        <h1 className="text-xl font-bold">Raise a New Issue</h1>
        <input
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="Enter issue title..."
          className="border border-gray-300 rounded-md p-2"
          required
        />
        <textarea
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
          placeholder="Describe your issue..."
          className="border border-gray-300 rounded-md p-2 h-32"
          required
        />
        <Button type="submit" className="bg-black text-white">
          Submit Issue
        </Button>
      </form>

      {/* ISSUES TABLE */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Submitted Issues</h2>
        {issues.length === 0 && !error ? (
          <p className="text-gray-500 text-sm">No issues yet.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Title</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {issues.map((issue) => (
                <TableRow key={issue._id}>
                  <TableCell className="font-medium">{issue.title}</TableCell>
                  <TableCell>{issue.description}</TableCell>
                  <TableCell className="text-right space-x-2">

                    <Dialog
                      open={editingIssue?._id === issue._id}
                      onOpenChange={(open) => !open && setEditingIssue(null)}
                    >
                      <DialogTrigger asChild>
                        <Button
                          className="bg-black text-white"
                          onClick={() => handleEdit(issue)}
                        >
                          Edit
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <form onSubmit={handleEditSubmit}>
                          <DialogHeader>
                            <DialogTitle>Edit Issue</DialogTitle>
                            <DialogDescription>Update issue details</DialogDescription>
                          </DialogHeader>
                          <FieldGroup>
                            <Field>
                              <Label>Title</Label>
                              <Input
                                value={editTitle}
                                onChange={(e) => setEditTitle(e.target.value)}
                              />
                            </Field>
                            <Field>
                              <Label>Description</Label>
                              <textarea
                                value={editDescription}
                                onChange={(e) => setEditDescription(e.target.value)}
                                className="border border-gray-300 rounded-md p-2 h-24 w-full"
                              />
                            </Field>
                          </FieldGroup>
                          <DialogFooter>
                            <DialogClose asChild>
                              <Button className="bg-black text-white">Cancel</Button>
                            </DialogClose>
                            <Button type="submit" className="bg-black text-white">
                              Save
                            </Button>
                          </DialogFooter>
                        </form>
                      </DialogContent>
                    </Dialog>

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
        )}
      </div>

      {/* CHART */}
      <div className="bg-white p-6 rounded-md shadow-md">
        <h2 className="text-lg font-semibold mb-4">Issues Over Time</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <Tooltip />
            <Line type="monotone" dataKey="count" stroke="#8884d8" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

    </div>
  )
}