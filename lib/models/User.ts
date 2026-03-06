import mongoose, { Schema, models } from "mongoose";

const userSchema = new Schema(
  {
    name: String,
    email: { type: String, unique: true },
    password: String,
  },
  { timestamps: true }
);

export const User =
  models.User || mongoose.model("User", userSchema);