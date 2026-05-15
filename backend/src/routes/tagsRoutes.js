import express from "express"
import { createTag, deleteTag, getAllTags } from "../controllers/tagsController.js"
import { requireAuth } from "../middleware/authMiddleware.js"

const router = express.Router()

router.use(requireAuth)
router.get("/", getAllTags)
router.post("/", createTag)
router.delete("/:id", deleteTag)

export default router
