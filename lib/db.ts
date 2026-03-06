
import mongoose from "mongoose";

let isConnected = false;

export const connectDB = async () => {
  if (isConnected) return;

  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("Missing MONGODB_URI in environment variables");

  await mongoose.connect(uri);
  isConnected = true;
  console.log("MongoDB connected");
};