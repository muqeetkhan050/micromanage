

'use client'
import { useState, useEffect } from "react"


interface Issue {
  _id: string
  title: string
  description: string
}

export default function RaiseIssuePage() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState('')
  const [issues, setIssues] = useState<Issue[]>([])
  
  
  
  const fetchIssues = async () => {
    const res = await fetch('/api/raise-issue')
    const data = await res.json()
    setIssues(data)
  }

  useEffect(() => {
    fetchIssues()  // ← runs once on page load
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!title) { setError('Please write your title'); return }
    if (!description) { setError('Please write description'); return }

    const res = await fetch('/api/raise-issue', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description })
    })

    const data = await res.json()

    if (res.ok) {
      setTitle('')        // ← clear form
      setDescription('')  // ← clear form
      setError('')
      fetchIssues()       // ← refetch issues to show new one instantly
    } else {
      setError(data.message)
    }
  }

  return (
    <div className="flex flex-col gap-6 p-6">

      {/* FORM */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <h1 className="text-xl font-bold">What issue are you facing?</h1>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter issue title..."
          className="border border-gray-300 rounded-md p-2"
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe your issue..."
          className="border border-gray-300 rounded-md p-2 h-32"
        />
        <button type="submit" className="bg-blue-500 text-white rounded-md px-4 py-2">
          Submit Issue
        </button>
      </form>

      {/* ISSUES LIST - appears below form */}
      <div className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold">Submitted Issues</h2>
        {issues.length === 0 && (
          <p className="text-gray-400 text-sm">No issues yet.</p>
        )}
        {issues.map((issue) => (
          <div key={issue._id} className="border rounded-md p-4 bg-muted/50">
            <h3 className="font-medium">{issue.title}</h3>
            <p className="text-sm text-gray-500 mt-1">{issue.description}</p>
          </div>
        ))}
      </div>

    </div>
  )
}