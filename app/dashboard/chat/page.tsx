

import ChatWindow from "@/components/ChatWindow"
import { auth } from "@/lib/auth"

export default async function ChatPage() {
  const session = await auth()

  if (!session?.user?.id || !session.user.organisationId) {
    return <div>Please log in with a valid organization account</div>
  }

  const orgId: string = session.user.organisationId
  const userId: string = session.user.id
  const userName: string = session.user.name ?? "Anonymous"

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Organization Chat</h1>
      <ChatWindow orgId={orgId} userId={userId} userName={userName} />
    </div>
  )
}