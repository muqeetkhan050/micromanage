

import { Server } from "socket.io"
import { NextApiRequest, NextApiResponse } from "next"
import { connectDB } from "@/lib/db"
import Message from "@/lib/models/message"
import type { Server as HTTPServer } from "http"
import type { Socket as NetSocket } from "net"
import type { Server as IOServer } from "socket.io"

type NextApiResponseServerIO = NextApiResponse & {
  socket: NetSocket & {
    server: HTTPServer & {
      io?: IOServer
    }
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIO
) {
  if (!res.socket.server.io) {
    await connectDB()

    const io = new Server(res.socket.server, {
      path: "/api/socket",
    })

    res.socket.server.io = io

    io.on("connection", (socket) => {
      console.log("Client connected:", socket.id)

      socket.on("join-org", (orgId: string) => {
        socket.join(orgId)
      })

      socket.on("send-message", async (msg) => {
        const { orgId, senderId, senderName, content } = msg
        const message = await Message.create({ orgId, senderId, senderName, content })
        io.to(orgId).emit("receive-message", message)
      })

      socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id)
      })
    })
  }

  res.end()
}