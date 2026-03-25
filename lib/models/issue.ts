

import mongoose from "mongoose";

const issueSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },

 

  organizationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Organisation",
    required: true,
  },

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
   status:{
    type:String,
    enum:['not started yet','in Progress', 'completed'],
    default:'not started yet'

  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Issue =
  mongoose.models.Issue || mongoose.model("Issue", issueSchema);