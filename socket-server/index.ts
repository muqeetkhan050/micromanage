import dotenv from "dotenv"
import path from "path"

dotenv.config({ path: path.resolve(process.cwd(), ".env") })

import express from "express"
import { createServer } from "http"
import { Server } from "socket.io"
import mongoose from "mongoose"
import cors from "cors"

const MONGODB_URI = process.env.MONGODB_URI || ""

if (!MONGODB_URI) {
  console.error("ERROR: MONGODB_URI is not set.")
  process.exit(1)
}

const app = express()
const httpServer = createServer(app)

app.use(cors({ origin: "http://localhost:3000" }))
app.use(express.json())

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
})

async function connectDB() {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(MONGODB_URI)
    console.log("Socket server: MongoDB connected")
  }
}

// Match your actual model schema exactly
const messageSchema = new mongoose.Schema({
  orgId: { type: mongoose.Schema.Types.ObjectId, required: true },
  senderId: { type: mongoose.Schema.Types.ObjectId, required: true },
  senderName: { type: String, required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
})

const Message =
  mongoose.models.Message || mongoose.model("Message", messageSchema)

connectDB().then(() => {
  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id)

    socket.on("join-org", (orgId: string) => {
      socket.join(orgId)
      console.log(`Socket ${socket.id} joined org ${orgId}`)
    })

    socket.on("send-message", async (msg) => {
      const { orgId, senderId, senderName, content } = msg
      try {
        const message = await Message.create({
          orgId: new mongoose.Types.ObjectId(orgId),
          senderId: new mongoose.Types.ObjectId(senderId),
          senderName,
          content,
        })
        io.to(orgId).emit("receive-message", {
          _id: message._id.toString(),
          orgId: message.orgId.toString(),
          senderId: message.senderId.toString(),
          senderName: message.senderName,
          content: message.content,
          createdAt: message.createdAt,
        })
      } catch (error) {
        console.error("Failed to save message:", error)
      }
    })

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id)
    })
  })

  httpServer.listen(3001, () => {
    console.log("Socket server running on http://localhost:3001")
  })
})