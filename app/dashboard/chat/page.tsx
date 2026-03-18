// app/dashboard/chat/page.tsx
import ChatWindow from "@/components/ChatWindow"
import { auth } from "@/lib/auth"

export default async function ChatPage() {
  const session = await auth()

  if (!session) return <div>Please log in</div>

  const orgId = session.user.organisationId
  const userId = session.user.id
  const userName = session.user.name

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Organization Chat</h1>
      <ChatWindow orgId={orgId} userId={userId} userName={userName} />
    </div>
  )
}s