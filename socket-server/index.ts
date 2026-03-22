// import "dotenv/config"
// import express from "express"
// import { createServer } from "http"
// import { Server } from "socket.io"
// import mongoose from "mongoose"
// import cors from "cors"

// const app = express()
// const httpServer = createServer(app)

// app.use(cors({ origin: "http://localhost:3000" }))
// app.use(express.json())

// const io = new Server(httpServer, {
//   cors: {
//     origin: "http://localhost:3000",
//     methods: ["GET", "POST"],
//   },
// })

// const MONGODB_URI = process.env.MONGODB_URI || ""

// async function connectDB() {
//   if (mongoose.connection.readyState === 0) {
//     await mongoose.connect(MONGODB_URI)
//     console.log("MongoDB connected")
//   }
// }

// const messageSchema = new mongoose.Schema(
//   {
//     orgId: String,
//     senderId: String,
//     senderName: String,
//     content: String,
//   },
//   { timestamps: true }
// )

// const Message =
//   mongoose.models.Message || mongoose.model("Message", messageSchema)

// connectDB().then(() => {
//   io.on("connection", (socket) => {
//     console.log("Client connected:", socket.id)

//     socket.on("join-org", (orgId: string) => {
//       socket.join(orgId)
//       console.log(`Socket ${socket.id} joined org ${orgId}`)
//     })

//     socket.on("send-message", async (msg) => {
//       const { orgId, senderId, senderName, content } = msg
//       const message = await Message.create({ orgId, senderId, senderName, content })
//       io.to(orgId).emit("receive-message", message)
//     })

//     socket.on("disconnect", () => {
//       console.log("Client disconnected:", socket.id)
//     })
//   })

//   httpServer.listen(3001, () => {
//     console.log("Socket server running on http://localhost:3001")
//   })
// })

import dotenv from "dotenv"
import path from "path"

// Load .env file explicitly
dotenv.config({ path: path.resolve(process.cwd(), ".env") })

import express from "express"
import { createServer } from "http"
import { Server } from "socket.io"
import mongoose from "mongoose"
import cors from "cors"

const MONGODB_URI = process.env.MONGODB_URI || ""

// Debug - remove after fixing
console.log("MONGODB_URI loaded:", MONGODB_URI ? "YES" : "NO - CHECK YOUR .env FILE")

if (!MONGODB_URI) {
  console.error("ERROR: MONGODB_URI is not set. Create a .env file in your project root.")
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

const messageSchema = new mongoose.Schema(
  {
    orgId: String,
    senderId: String,
    senderName: String,
    content: String,
  },
  { timestamps: true }
)

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
      const message = await Message.create({ orgId, senderId, senderName, content })
      io.to(orgId).emit("receive-message", message)
    })

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id)
    })
  })

  httpServer.listen(3001, () => {
    console.log("Socket server running on http://localhost:3001")
  })
})
