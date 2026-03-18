import mongoose from "mongoose"

const MessageSchema = new mongoose.Schema({
  orgId: { type: mongoose.Schema.Types.ObjectId, required: true },
  senderId: { type: mongoose.Schema.Types.ObjectId, required: true },
  senderName: { type: String, required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
})

export default mongoose.models.Message || mongoose.model("Message", MessageSchema)