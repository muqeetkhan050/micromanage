// import mongoose from "mongoose";

// const issueSchema = new mongoose.Schema({
//     title: {
//         type: String,
//         required: true
//     },
//     description: {
//         type: String,
//         required: true
//     },
//       createdAt: { type: Date, default: Date.now }
    
// },
// );

// export const Issue = mongoose.models.Issue || mongoose.model("Issue", issueSchema);



import mongoose from "mongoose"

const issueSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, default: "open" },
  organisationId: { type: mongoose.Schema.Types.ObjectId, ref: "Organisation", required: true },
  createdById: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
})

export const Issue =
  mongoose.models.Issue || mongoose.model("Issue", issueSchema)