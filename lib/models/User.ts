
import mongoose, { Schema, models } from 'mongoose'

const userSchema = new Schema(
  {
    name: String,
    email: { type: String, unique: true, required: true },
    password: { type: String, select: false }, // Not required for OAuth
    image: String,
    provider: { type: String, enum: ["google", "github", "credentials"], default: "credentials" },
    role: {
      type: String,
      enum: ["ADMIN", "MEMBER"],
      default: "MEMBER",
    },
    organisationId: {
      type: Schema.Types.ObjectId,
      ref: "Organisation",
      default: null,
    },
  },
  { timestamps: true }
);

export const User = models.User || mongoose.model("User", userSchema);