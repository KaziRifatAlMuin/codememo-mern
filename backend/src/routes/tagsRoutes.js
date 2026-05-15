import express from "express"
import { createTag, deleteTag, getAllTags } from "../controllers/tagsController.js"

const router = express.Router()

router.get("/", getAllTags)
router.post("/", createTag)
router.delete("/:id", deleteTag)

export default router
