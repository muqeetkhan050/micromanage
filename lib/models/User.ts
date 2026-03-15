// import mongoose, { Schema, models } from "mongoose";

// const userSchema = new Schema(
//   {
//     name: String,
//     email: { type: String, unique: true },
//     password: String,
//   },
//   { timestamps: true }
// );

// export const User =
//   models.User || mongoose.model("User", userSchema);



import mongoose, { Schema, models } from "mongoose"

const userSchema = new Schema(
  {
    name: String,
    email: { type: String, unique: true },
    password: String,                    // undefined for OAuth users
    image: String,                       // from GitHub/Slack avatar
    role: { type: String, enum: ["ADMIN", "MEMBER"], default: "MEMBER" },
    organisationId: { type: Schema.Types.ObjectId, ref: "Organisation", default: null },
  },
  { timestamps: true }
)

export const User = models.User || mongoose.model("User", userSchema)