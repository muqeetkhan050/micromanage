
'use client'

import { useEffect, useState, useRef } from "react"
import io from "socket.io-client"

interface Message {
  _id?: string
  senderId?: string
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

  // Load previous messages
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

  // Connect to socket
  useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL!, {
      transports: ["websocket"],
    })
    socketRef.current = socket

    socket.on("connect", () => {
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

  // Auto scroll to bottom
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
    <div className="flex flex-col h-150 bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">

      {/* Header */}
      <div className="bg-black text-white px-4 py-3 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-sm font-bold">
          {userName.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="font-semibold text-sm">Organisation Chat</p>
          <p className="text-xs text-white/60">Team messaging</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3 bg-gray-50">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-400 text-sm">Loading messages...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-400 text-sm">No messages yet. Say hello!</p>
          </div>
        ) : (
          messages.map((msg, index) => {
            const isMe = msg.senderId === userId || msg.senderName === userName
            return (
              <div
                key={msg._id || index}
                className={`flex flex-col gap-1 max-w-[70%] ${
                  isMe ? "self-end items-end" : "self-start items-start"
                }`}
              >
                {/* Sender name - only show for others */}
                {!isMe && (
                  <span className="text-xs text-gray-500 ml-1">
                    {msg.senderName}
                  </span>
                )}

                {/* Bubble */}
                <div
                  className={`px-4 py-2 rounded-2xl text-sm ${
                    isMe
                      ? "bg-black text-white rounded-br-sm"
                      : "bg-white text-black border border-gray-200 rounded-bl-sm shadow-sm"
                  }`}
                >
                  {msg.content}
                </div>

                {/* Timestamp */}
                {msg.createdAt && (
                  <span className="text-[10px] text-gray-400">
                    {new Date(msg.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                )}
              </div>
            )
          })
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-4 py-3 bg-white border-t border-gray-200 flex gap-2 items-center">
        <input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type a message..."
          className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-black transition"
        />
        <button
          onClick={sendMessage}
          disabled={!newMessage.trim()}
          className="bg-black text-white w-9 h-9 rounded-full flex items-center justify-center disabled:opacity-40 hover:bg-gray-800 transition"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-4 h-4"
          >
            <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
          </svg>
        </button>
      </div>

    </div>
  )
}