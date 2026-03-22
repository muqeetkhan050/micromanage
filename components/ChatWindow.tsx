

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
//     fetch("/api/socket").then(() => {
//       const socket = io(window.location.origin, { path: "/api/socket" })
//       socketRef.current = socket

//       socket.on("connect", () => {
//         console.log("Connected:", socket.id)
//         socket.emit("join-org", orgId)
//       })

//       socket.on("receive-message", (msg: Message) => {
//         setMessages((prev) => [...prev, msg])
//       })

//       socket.on("connect_error", (err: Error) => {
//         console.error("Connection error:", err.message)
//       })
//     })

//     return () => {
//       socketRef.current?.disconnect()
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
  const socketRef = useRef<ReturnType<typeof io> | null>(null)

  useEffect(() => {
    // connects to separate socket server on port 3001
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
        {messages.map((msg, index) => (
          <div key={index}>
            <strong>{msg.senderName}:</strong> {msg.content}
          </div>
        ))}
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