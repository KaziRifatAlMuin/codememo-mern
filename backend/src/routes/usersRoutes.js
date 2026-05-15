import express from "express"
import { getUser, getUsers, updateUser } from "../controllers/usersController.js"
import { requireAdmin, requireAuth } from "../middleware/authMiddleware.js"

const router = express.Router()

router.use(requireAuth, requireAdmin)
router.get("/", getUsers)
router.get("/:id", getUser)
router.put("/:id", updateUser)

export default router
