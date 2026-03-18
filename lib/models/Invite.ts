import mongoose, { Schema, models } from 'mongoose'

const inviteSchema = new Schema(
  {
    email: { type: String, required: true },
    token: { type: String, required: true, unique: true },
    organisationId: {
      type: Schema.Types.ObjectId,
      ref: 'Organisation',
      required: true,
    },
    expiresAt: { type: Date, required: true },
    accepted: { type: Boolean, default: false },
  },
  { timestamps: true }
)

export const Invite = models.Invite || mongoose.model('Invite', inviteSchema)
