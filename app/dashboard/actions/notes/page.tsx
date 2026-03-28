

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

            {issues.map((issue) => {
                const status = issue.status || 'not started yet'
                const dotClass =
                    status === 'completed'
                        ? 'bg-green-500 shadow-[0_0_6px_2px_rgba(34,197,94,0.5)]'
                        : status === 'in Progress'
                          ? 'bg-yellow-500 shadow-[0_0_6px_2px_rgba(234,179,8,0.5)]'
                          : 'bg-red-500 shadow-[0_0_6px_2px_rgba(239,68,68,0.5)]'
                const statusLabel =
                    status === 'completed'
                        ? 'Completed'
                        : status === 'in Progress'
                          ? 'In Progress'
                          : 'Not Started Yet'

                return (
                    <div key={issue._id} className="border p-4 mb-4 rounded">
                        <div className="flex items-center justify-between">
                            <h2 className="font-semibold">{issue.title}</h2>
                            <span className="flex items-center gap-2 text-sm">
                                <span className={`inline-block size-2 rounded-full ${dotClass}`} />
                                {statusLabel}
                            </span>
                        </div>
                        <p className="mt-1">{issue.description}</p>

                        {/* Status dropdown */}
                        <select
                            value={status}
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
                )
            })}


        </div>

    )

}