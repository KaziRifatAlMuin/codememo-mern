import User from "../models/User.js"

const publicUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  bio: user.bio || "",
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
})

export async function getUsers(req, res) {
  const users = await User.find().select("-passwordHash").sort({ createdAt: -1 })
  res.status(200).json(users.map(publicUser))
}

export async function getUser(req, res) {
  const user = await User.findById(req.params.id).select("-passwordHash")
  if (!user) return res.status(404).json({ message: "User not found" })
  res.status(200).json(publicUser(user))
}

export async function updateUser(req, res) {
  const payload = {}
  if (typeof req.body?.name === "string") payload.name = req.body.name.trim()
  if (typeof req.body?.bio === "string") payload.bio = req.body.bio.trim()
  if (["user", "admin"].includes(req.body?.role)) payload.role = req.body.role

  const user = await User.findByIdAndUpdate(req.params.id, payload, { new: true, runValidators: true }).select("-passwordHash")
  if (!user) return res.status(404).json({ message: "User not found" })
  res.status(200).json(publicUser(user))
}
