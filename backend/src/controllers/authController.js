import User from "../models/User.js"
import { hashPassword, signToken, verifyPassword } from "../utils/auth.js"

const publicUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  bio: user.bio || "",
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
})

export async function register(req, res) {
  try {
    const name = typeof req.body?.name === "string" ? req.body.name.trim() : ""
    const email = typeof req.body?.email === "string" ? req.body.email.trim().toLowerCase() : ""
    const password = typeof req.body?.password === "string" ? req.body.password : ""

    if (!name || !email || password.length < 6) {
      return res.status(400).json({ message: "Name, email, and 6+ character password are required" })
    }

    const existing = await User.findOne({ email })
    if (existing) return res.status(409).json({ message: "Email is already registered" })

    const count = await User.countDocuments()
    const user = await User.create({
      name,
      email,
      passwordHash: hashPassword(password),
      role: count === 0 ? "admin" : "user",
    })

    res.status(201).json({ user: publicUser(user), token: signToken(user) })
  } catch (err) {
    console.error("register error:", err)
    res.status(500).json({ message: "Server error" })
  }
}

export async function login(req, res) {
  try {
    const email = typeof req.body?.email === "string" ? req.body.email.trim().toLowerCase() : ""
    const password = typeof req.body?.password === "string" ? req.body.password : ""
    const user = await User.findOne({ email })

    if (!user || !verifyPassword(password, user.passwordHash)) {
      return res.status(401).json({ message: "Invalid email or password" })
    }

    res.status(200).json({ user: publicUser(user), token: signToken(user) })
  } catch (err) {
    console.error("login error:", err)
    res.status(500).json({ message: "Server error" })
  }
}

export async function me(req, res) {
  res.status(200).json({ user: publicUser(req.user) })
}

export async function updateMe(req, res) {
  try {
    const name = typeof req.body?.name === "string" ? req.body.name.trim() : req.user.name
    const bio = typeof req.body?.bio === "string" ? req.body.bio.trim() : req.user.bio
    const user = await User.findByIdAndUpdate(req.user._id, { name, bio }, { new: true, runValidators: true })
    res.status(200).json({ user: publicUser(user) })
  } catch (err) {
    console.error("updateMe error:", err)
    res.status(500).json({ message: "Server error" })
  }
}
