import express from "express"
import {
    createNote,
    deleteNote,
    getAllNotes,
    getNoteById,
    updateNote,
} from "../controllers/notesController.js"
import { requireAuth } from "../middleware/authMiddleware.js"

const router = express.Router()

router.use(requireAuth)
router.get("/", getAllNotes)
router.get("/:id", getNoteById)
router.post("/", createNote)
router.put("/:id", updateNote)
router.delete("/:id", deleteNote)


export default router
