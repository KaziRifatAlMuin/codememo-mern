import mongoose from "mongoose"

const noteSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    tags: { type: [String], default: [] },
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      default: "Medium",
    },
    language: {
      type: String,
      enum: ["cpp", "python", "javascript"],
      default: "cpp",
    },
    codeSnippet: { type: String, default: "" },
    problemUrl: { type: String, default: "" },
    revisionStatus: {
      type: String,
      enum: ["New", "Revised", "Mastered"],
      default: "New",
    },
  },
  { timestamps: true }
)

const Note = mongoose.models.Note || mongoose.model("Note", noteSchema)

export default Note
