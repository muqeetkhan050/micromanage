'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import OrganisationForm from '@/components/OrganisationForm'

export default function OnboardingPage() {
  const [orgName, setOrgName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await fetch('/api/organisation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: orgName, action: 'create' }),
    })

    const data = await res.json()

    if (res.ok) {
      // Hard reload forces NextAuth to re-run jwt callback
      // which re-reads organisationId from MongoDB
      window.location.href = '/dashboard'
    } else {
      setError(data.message ?? 'Something went wrong')
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md flex flex-col gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Create your organisation</CardTitle>
            <CardDescription>
              You are not part of an organisation yet. Create one to get
              started.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreate} className="flex flex-col gap-4">
              <Input
                placeholder="e.g. Acme Corp"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                required
              />
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <Button type="submit" disabled={loading}>
                {loading ? 'Creating...' : 'Create Organisation'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="flex items-center gap-3 text-gray-400 text-sm">
          <div className="flex-1 border-t" />
          or
          <div className="flex-1 border-t" />
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Join via invite</CardTitle>
            <CardDescription>
              Ask a colleague to send you an invite link. Opening it will add
              you to their organisation automatically.
              <OrganisationForm />
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  )
}
