import mongoose from "mongoose"

const noteSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    title: { type: String, required: true },
    content: { type: String, default: "" },
    tags: { type: [String], default: [] },
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Medium-Hard", "Hard", "Very Hard"],
      default: "Medium",
    },
    language: {
      type: String,
      enum: ["cpp", "java", "python"],
      default: "cpp",
    },
    codeSnippet: { type: String, default: "" },
    problemUrl: { type: String, default: "" },
    revisionStatus: {
      type: String,
      enum: ["To Do", "In Mind", "Stucked", "Too Hard", "Accepted"],
      default: "To Do",
    },
    metacognition: { type: String, default: "" },
    takeaways: { type: String, default: "" },
    analysis: { type: String, default: "" },
    acceptedDate: { type: String, default: "" },
    resolve: {
      type: String,
      enum: ["New", "Revisited", "Mastered"],
      default: "New",
    },
  },
  { timestamps: true }
)

const Note = mongoose.models.Note || mongoose.model("Note", noteSchema)

export default Note
