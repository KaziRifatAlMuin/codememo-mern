import Note from "../models/Note.js"
import mongoose from "mongoose"

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id)

const allowedDifficulties = new Set(["Easy", "Medium", "Hard"])
const allowedLanguages = new Set(["cpp", "python", "javascript"])
const allowedStatuses = new Set(["New", "Revised", "Mastered"])

const cleanTags = (tags) => {
    if (Array.isArray(tags)) {
        return tags
            .map((tag) => (typeof tag === "string" ? tag.trim() : ""))
            .filter(Boolean)
            .slice(0, 8)
    }

    if (typeof tags === "string") {
        return tags
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean)
            .slice(0, 8)
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
}) => ({
    title: typeof title === "string" ? title.trim() : "",
    content: typeof content === "string" ? content.trim() : "",
    tags: cleanTags(tags),
    difficulty: allowedDifficulties.has(difficulty) ? difficulty : "Medium",
    language: allowedLanguages.has(language) ? language : "cpp",
    codeSnippet: typeof codeSnippet === "string" ? codeSnippet.trim() : "",
    problemUrl: typeof problemUrl === "string" ? problemUrl.trim() : "",
    revisionStatus: allowedStatuses.has(revisionStatus) ? revisionStatus : "New",
})

export async function getAllNotes(req, res) {
    try {
        const notes = await Note.find().sort({ createdAt: -1 })
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

        const note = await Note.findById(id)
        if (!note) return res.status(404).json({ message: "Note not found" })

        res.status(200).json(note)
    } catch (err) {
        console.error("getNoteById error:", err)
        res.status(500).json({ message: "Server error" })
    }
}

export async function createNote(req, res) {
    try {
        const noteInput = cleanNoteInput(req.body)
        const { title, content } = noteInput
        if (!title || !content) {
            return res.status(400).json({ message: "Title and content are required" })
        }

        const note = await Note.create(noteInput)
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

        const noteInput = cleanNoteInput(req.body)
        const { title, content } = noteInput
        if (!title || !content) {
            return res.status(400).json({ message: "Title and content are required" })
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

        const note = await Note.findByIdAndDelete(id)
        if (!note) return res.status(404).json({ message: "Note not found" })
        res.status(200).json({ message: "Note deleted successfully!" })
    } catch (err) {
        console.error("deleteNote error:", err)
        res.status(500).json({ message: "Server error" })
    }
}
