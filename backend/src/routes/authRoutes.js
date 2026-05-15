import express from "express"
import { login, me, register, updateMe } from "../controllers/authController.js"
import { requireAuth } from "../middleware/authMiddleware.js"

const router = express.Router()

router.post("/register", register)
router.post("/login", login)
router.get("/me", requireAuth, me)
router.put("/me", requireAuth, updateMe)

export default router
