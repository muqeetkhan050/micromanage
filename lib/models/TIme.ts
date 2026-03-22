

import mongoose from "mongoose"

const TimeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  clockIn: { type: String, required: true },
  clockOut: { type: String, required: true },
}, { timestamps: true })

export const Time = mongoose.models.Time || mongoose.model("Time", TimeSchema)