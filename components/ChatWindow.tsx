

// 'use client'

// import { useEffect, useState, useRef } from "react"
// import io from "socket.io-client"

// interface Message {
//   _id?: string
//   senderName: string
//   content: string
//   createdAt?: string
// }

// interface ChatWindowProps {
//   orgId: string
//   userId: string
//   userName: string
// }

// export default function ChatWindow({ orgId, userId, userName }: ChatWindowProps) {
//   const [messages, setMessages] = useState<Message[]>([])
//   const [newMessage, setNewMessage] = useState("")
//   const socketRef = useRef<ReturnType<typeof io> | null>(null)

//   useEffect(() => {
//     // connects to separate socket server on port 3001
//     const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL!, {
//       transports: ["websocket"],
//     })
//     socketRef.current = socket

//     socket.on("connect", () => {
//       console.log("Connected:", socket.id)
//       socket.emit("join-org", orgId)
//     })

//     socket.on("receive-message", (msg: Message) => {
//       setMessages((prev) => [...prev, msg])
//     })

//     socket.on("connect_error", (err: Error) => {
//       console.error("Connection error:", err.message)
//     })

//     return () => {
//       socket.disconnect()
//     }
//   }, [orgId])

//   const sendMessage = () => {
//     if (!newMessage.trim() || !socketRef.current) return

//     socketRef.current.emit("send-message", {
//       orgId,
//       senderId: userId,
//       senderName: userName,
//       content: newMessage,
//     })

//     setNewMessage("")
//   }

//   return (
//     <div className="flex flex-col h-96 border rounded p-2">
//       <div className="flex-1 overflow-y-auto mb-2">
//         {messages.map((msg, index) => (
//           <div key={index}>
//             <strong>{msg.senderName}:</strong> {msg.content}
//           </div>
//         ))}
//       </div>
//       <div className="flex gap-2">
//         <input
//           value={newMessage}
//           onChange={(e) => setNewMessage(e.target.value)}
//           onKeyDown={(e) => e.key === "Enter" && sendMessage()}
//           placeholder="Type a message"
//           className="flex-1 border rounded p-1"
//         />
//         <button
//           onClick={sendMessage}
//           className="bg-black text-white px-3 rounded"
//         >
//           Send
//         </button>
//       </div>
//     </div>
//   )
// }

'use client'

import { useEffect, useState, useRef } from "react"
import io from "socket.io-client"

interface Message {
  _id?: string
  senderName: string
  content: string
  createdAt?: string
}

interface ChatWindowProps {
  orgId: string
  userId: string
  userName: string
}

export default function ChatWindow({ orgId, userId, userName }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [loading, setLoading] = useState(true)
  const socketRef = useRef<ReturnType<typeof io> | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  // Load previous messages from MongoDB on mount
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch(`/api/chat/messages?orgId=${orgId}`)
        const data = await res.json()
        setMessages(data)
      } catch (error) {
        console.error("Failed to load messages:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchMessages()
  }, [orgId])

  // Connect to socket server
  useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL!, {
      transports: ["websocket"],
    })
    socketRef.current = socket

    socket.on("connect", () => {
      console.log("Connected:", socket.id)
      socket.emit("join-org", orgId)
    })

    socket.on("receive-message", (msg: Message) => {
      setMessages((prev) => [...prev, msg])
    })

    socket.on("connect_error", (err: Error) => {
      console.error("Connection error:", err.message)
    })

    return () => {
      socket.disconnect()
    }
  }, [orgId])

  // Auto scroll to bottom when new message arrives
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const sendMessage = () => {
    if (!newMessage.trim() || !socketRef.current) return

    socketRef.current.emit("send-message", {
      orgId,
      senderId: userId,
      senderName: userName,
      content: newMessage,
    })

    setNewMessage("")
  }

  return (
    <div className="flex flex-col h-96 border rounded p-2">
      <div className="flex-1 overflow-y-auto mb-2">
        {loading ? (
          <div className="text-center text-gray-400 mt-4">Loading messages...</div>
        ) : messages.length === 0 ? (
          <div className="text-center text-gray-400 mt-4">No messages yet</div>
        ) : (
          messages.map((msg, index) => (
            <div key={msg._id || index} className="mb-1">
              <strong>{msg.senderName}:</strong> {msg.content}
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>
      <div className="flex gap-2">
        <input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type a message"
          className="flex-1 border rounded p-1"
        />
        <button
          onClick={sendMessage}
          className="bg-black text-white px-3 rounded"
        >
          Send
        </button>
      </div>
    </div>
  )
}