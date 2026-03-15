import mongoose, { Schema, models } from "mongoose"

const organisationSchema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    slackAccessToken: { type: String },
    slackChannelId: { type: String },
    slackTeamId: { type: String },
  },
  { timestamps: true }
)

export const Organisation =
  models.Organisation || mongoose.model("Organisation", organisationSchema)