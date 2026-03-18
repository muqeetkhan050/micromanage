


"use client"

import { useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";
/* ---------------- TYPES ---------------- */

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

/* ---------------- SOCKET ---------------- */

let socket: typeof Socket | null = null

/* ---------------- COMPONENT ---------------- */

export default function ChatWindow({
  orgId,
  userId,
  userName,
}: ChatWindowProps) {

  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")

  /* ---------------- CONNECT SOCKET ---------------- */
  useEffect(() => {
    socket = io("/api/chat/socket")

    socket.on("connect", () => {
      console.log("Connected:", socket?.id)

      // join organisation room
      socket?.emit("join-org", orgId)
    })

    /* RECEIVE MESSAGE */
    socket.on("receive-message", (msg: Message) => {
      setMessages((prev) => [...prev, msg])
    })

    return () => {
      socket?.disconnect()
    }
  }, [orgId])

  /* ---------------- SEND MESSAGE ---------------- */
  const sendMessage = () => {
    if (!newMessage.trim() || !socket) return

    socket.emit("send-message", {
      orgId,
      senderId: userId,
      senderName: userName,
      content: newMessage,
    })

    setNewMessage("")
  }

  /* ---------------- UI ---------------- */
  return (
    <div className="flex flex-col h-96 border rounded p-2">
      
      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto mb-2">
        {messages.map((msg, index) => (
          <div key={index}>
            <strong>{msg.senderName}:</strong> {msg.content}
          </div>
        ))}
      </div>

      {/* INPUT */}
      <div className="flex gap-2">
        <input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
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