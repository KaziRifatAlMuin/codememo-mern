import mongoose from "mongoose"
import Tag from "../models/Tag.js"

const allowedColors = new Set(["cyan", "blue", "purple", "orange", "red"])
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id)

const cleanTagName = (name) =>
  typeof name === "string" ? name.trim().replace(/\s+/g, "-").toLowerCase() : ""

export async function getAllTags(req, res) {
  try {
    const tags = await Tag.find().sort({ name: 1 })
    res.status(200).json(tags)
  } catch (err) {
    console.error("getAllTags error:", err)
    res.status(500).json({ message: "Server error" })
  }
}

export async function createTag(req, res) {
  try {
    const name = cleanTagName(req.body?.name)
    const color = allowedColors.has(req.body?.color) ? req.body.color : "cyan"

    if (!name) return res.status(400).json({ message: "Tag name is required" })

    const existing = await Tag.findOne({ name }).collation({ locale: "en", strength: 2 })
    if (existing) return res.status(200).json(existing)

    const tag = await Tag.create({ name, color })
    res.status(201).json(tag)
  } catch (err) {
    console.error("createTag error:", err)
    res.status(500).json({ message: "Server error" })
  }
}

export async function deleteTag(req, res) {
  try {
    const { id } = req.params
    if (!isValidObjectId(id)) return res.status(400).json({ message: "Invalid tag id" })

    const tag = await Tag.findByIdAndDelete(id)
    if (!tag) return res.status(404).json({ message: "Tag not found" })

    res.status(200).json({ message: "Tag deleted successfully!" })
  } catch (err) {
    console.error("deleteTag error:", err)
    res.status(500).json({ message: "Server error" })
  }
}
