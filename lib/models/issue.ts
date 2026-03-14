import mongoose from "mongoose";

const issueSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
      createdAt: { type: Date, default: Date.now }
    
},
);

export const Issue = mongoose.models.Issue || mongoose.model("Issue", issueSchema);

