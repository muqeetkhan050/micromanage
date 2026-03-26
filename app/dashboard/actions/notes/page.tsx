

"use client"

import { useEffect, useState } from "react"

export default function MyIssues() {

    const [issues, setIssues] = useState<any[]>([])

    useEffect(() => {

        fetch("/api/my-issues")
            .then(res => res.json())
            .then(data => {

                if (Array.isArray(data)) {
                    setIssues(data)
                } else {
                    setIssues([])
                    console.log("API returned:", data)
                }

            })

    }, [])

    return (

        <div className="p-6">

            <h1 className="text-xl font-bold mb-6">
                My Assigned Issues
            </h1>

            {issues.length === 0 && (
                <p className="text-gray-500">
                    No issues assigned to you
                </p>
            )}

            {issues.map((issue) => (
                <div key={issue._id} className="border p-4 mb-4 rounded">
                    <h2 className="font-semibold">{issue.title}</h2>
                    <p>{issue.description}</p>

                    {/* Status dropdown */}
                    <select
                        value={issue.status || 'not started yet'}
                        onChange={async (e) => {
                            const newStatus = e.target.value
                            const res = await fetch(`/api/issues/${issue._id}`, {
                                method: 'PATCH',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ status: newStatus }),
                            })
                            if (res.ok) {
                                setIssues((prev) =>
                                    prev.map((i) => (i._id === issue._id ? { ...i, status: newStatus } : i))
                                )
                            }
                        }}
                        className="mt-2 border rounded px-2 py-1"
                    >
                        <option value="not started yet">Not Started Yet</option>
                        <option value="in Progress">In Progress</option>
                        <option value="completed">Completed</option>
                    </select>
                </div>
            ))}


        </div>

    )

}