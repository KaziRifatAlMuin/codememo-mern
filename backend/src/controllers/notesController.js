import Note from "../models/Note.js"
import mongoose from "mongoose"

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id)

const allowedDifficulties = new Set(["Easy", "Medium", "Medium-Hard", "Hard", "Very Hard"])
const allowedLanguages = new Set(["cpp", "java", "python"])
const allowedStatuses = new Set(["To Do", "In Mind", "Stucked", "Too Hard", "Accepted"])
const allowedRevisited = new Set(["New", "Revisited", "Mastered"])

const statusAliases = {
    New: "To Do",
    Revised: "In Mind",
    Mastered: "Accepted",
}

const cleanTags = (tags) => {
    if (Array.isArray(tags)) {
        return tags
            .map((tag) => (typeof tag === "string" ? tag.trim() : ""))
            .filter(Boolean)
            .slice(0, 12)
    }

    if (typeof tags === "string") {
        return tags
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean)
            .slice(0, 12)
    }

    return []
}

const cleanNoteInput = ({
    title,
    content,
    tags,
    difficulty,
    language,
    codeSnippet,
    problemUrl,
    revisionStatus,
    metacognition,
    takeaways,
    analysis,
    acceptedDate,
    resolve,
}) => ({
    title: typeof title === "string" ? title.trim() : "",
    content: typeof content === "string" ? content.trim() : "",
    tags: cleanTags(tags),
    difficulty: allowedDifficulties.has(difficulty) ? difficulty : "Medium",
    language: allowedLanguages.has(language) ? language : "cpp",
    codeSnippet: typeof codeSnippet === "string" ? codeSnippet.trim() : "",
    problemUrl: typeof problemUrl === "string" ? problemUrl.trim() : "",
    revisionStatus: allowedStatuses.has(revisionStatus)
        ? revisionStatus
        : statusAliases[revisionStatus] || "To Do",
    metacognition: typeof metacognition === "string" ? metacognition.trim() : "",
    takeaways: typeof takeaways === "string" ? takeaways.trim() : "",
    analysis: typeof analysis === "string" ? analysis.trim() : "",
    acceptedDate: typeof acceptedDate === "string" ? acceptedDate.trim() : "",
    resolve: allowedRevisited.has(resolve) ? resolve : "New",
})

export async function getAllNotes(req, res) {
    try {
        const filter = req.user.role === "admin" ? {} : { owner: req.user._id }
        const notes = await Note.find(filter).populate("owner", "name email role").sort({ updatedAt: -1 })
        res.status(200).json(notes)
    } catch (err) {
        console.error("getAllNotes error:", err)
        res.status(500).json({ message: "Server error" })
    }
}

export async function getNoteById(req, res) {
    try {
        const { id } = req.params
        if (!isValidObjectId(id)) return res.status(400).json({ message: "Invalid note id" })

        const note = await Note.findById(id).populate("owner", "name email role")
        if (!note) return res.status(404).json({ message: "Note not found" })
        const ownerId = note.owner?._id || note.owner
        if (req.user.role !== "admin" && ownerId?.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "You can only access your own memos" })
        }

        res.status(200).json(note)
    } catch (err) {
        console.error("getNoteById error:", err)
        res.status(500).json({ message: "Server error" })
    }
}

export async function createNote(req, res) {
    try {
        const noteInput = cleanNoteInput(req.body)
        const { title } = noteInput
        if (!title) {
            return res.status(400).json({ message: "Problem is required" })
        }

        const note = await Note.create({ ...noteInput, owner: req.user._id })
        res.status(201).json({ message: "Note created successfully!", note })
    } catch (err) {
        console.error("createNote error:", err)
        res.status(500).json({ message: "Server error" })
    }
}

export async function updateNote(req, res) {
    try {
        const { id } = req.params
        if (!isValidObjectId(id)) return res.status(400).json({ message: "Invalid note id" })

        const existing = await Note.findById(id)
        if (!existing) return res.status(404).json({ message: "Note not found" })
        if (req.user.role !== "admin" && existing.owner?.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "You can only edit your own memos" })
        }

        const noteInput = cleanNoteInput(req.body)
        const { title } = noteInput
        if (!title) {
            return res.status(400).json({ message: "Problem is required" })
        }

        const note = await Note.findByIdAndUpdate(
            id,
            noteInput,
            { new: true, runValidators: true }
        )

        if (!note) return res.status(404).json({ message: "Note not found" })

        res.status(200).json({ message: "Note updated successfully!", note })
    } catch (err) {
        console.error("updateNote error:", err)
        res.status(500).json({ message: "Server error" })
    }
}

export async function deleteNote(req, res) {
    try {
        const { id } = req.params
        if (!isValidObjectId(id)) return res.status(400).json({ message: "Invalid note id" })

        const existing = await Note.findById(id)
        if (!existing) return res.status(404).json({ message: "Note not found" })
        if (req.user.role !== "admin" && existing.owner?.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "You can only delete your own memos" })
        }

        const note = await Note.findByIdAndDelete(id)
        if (!note) return res.status(404).json({ message: "Note not found" })
        res.status(200).json({ message: "Note deleted successfully!" })
    } catch (err) {
        console.error("deleteNote error:", err)
        res.status(500).json({ message: "Server error" })
    }
}
