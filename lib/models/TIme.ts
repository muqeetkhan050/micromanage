
import mongoose from "mongoose"

const TimeSchema = new mongoose.Schema({
  clockIn: String,
  clockOut: String,
})

export const Time =
  mongoose.models.Time ||
  mongoose.model("Time", TimeSchema)