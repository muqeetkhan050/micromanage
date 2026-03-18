

import { Server } from "socket.io"
import { NextApiRequest } from "next"
import { connectDB } from "@/lib/db"
import Message from "@/lib/models/message"
import { NextApiResponseServerIO } from "@/.next/types/next"
import { Socket } from "socket.io-client"



export default async function handler(req: NextApiRequest, res: NextApiResponseServerIO) {
  if (!res.socket.server.io) {
    await connectDB()
    const io = new Server(res.socket.server)
    res.socket.server.io = io

    io.on("connection", (socket) => {
      console.log("Client connected", socket.id)

      socket.on("join-org", (orgId) => {
        socket.join(orgId)
      })

      socket.on("send-message", async (msg) => {
        const { orgId, senderId, senderName, content } = msg
        const message = await Message.create({ orgId, senderId, senderName, content })
        io.to(orgId).emit("receive-message", message)
      })

      socket.on("disconnect", () => {
        console.log("Client disconnected", socket.id)
      })
    })
  }
  res.end()
}