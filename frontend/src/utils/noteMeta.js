export const DIFFICULTIES = ["Easy", "Medium", "Medium-Hard", "Hard", "Very Hard"]
export const LANGUAGES = [
  { value: "cpp", label: "C++" },
  { value: "python", label: "Python" },
  { value: "javascript", label: "JavaScript" },
]
export const REVISION_STATUSES = ["New", "Revised", "Mastered"]

export const difficultyClass = {
  Easy: "border-cyan-300/40 bg-cyan-400/10 text-cyan-200",
  Medium: "border-blue-400/40 bg-blue-500/10 text-blue-200",
  "Medium-Hard": "border-purple-400/45 bg-purple-500/10 text-purple-200",
  Hard: "border-orange-400/45 bg-orange-500/10 text-orange-200",
  "Very Hard": "border-red-400/45 bg-red-500/10 text-red-200",
}

export const difficultySelectClass = {
  Easy: "border-cyan-300/40 bg-cyan-400/10 text-cyan-100",
  Medium: "border-blue-400/40 bg-blue-500/10 text-blue-100",
  "Medium-Hard": "border-purple-400/45 bg-purple-500/10 text-purple-100",
  Hard: "border-orange-400/45 bg-orange-500/10 text-orange-100",
  "Very Hard": "border-red-400/45 bg-red-500/10 text-red-100",
}

export const difficultyHex = {
  Easy: "#67e8f9",
  Medium: "#93c5fd",
  "Medium-Hard": "#c4b5fd",
  Hard: "#fdba74",
  "Very Hard": "#fca5a5",
}

export const statusClass = {
  New: "border-sky-400/35 bg-sky-500/10 text-sky-100",
  Revised: "border-violet-400/35 bg-violet-500/10 text-violet-100",
  Mastered: "border-teal-300/35 bg-teal-400/10 text-teal-100",
}

export const TAG_COLORS = ["cyan", "blue", "purple", "orange", "red"]

export const tagColorClass = {
  cyan: "border-cyan-300/35 bg-cyan-400/10 text-cyan-100",
  blue: "border-blue-400/35 bg-blue-500/10 text-blue-100",
  purple: "border-purple-400/35 bg-purple-500/10 text-purple-100",
  orange: "border-orange-400/35 bg-orange-500/10 text-orange-100",
  red: "border-red-400/35 bg-red-500/10 text-red-100",
}

export function colorForTag(tag, tags = []) {
  const name = typeof tag === "string" ? tag : tag?.name
  const found = tags.find((item) => item.name === name)
  if (found?.color && tagColorClass[found.color]) return found.color

  const value = name || ""
  const index = Array.from(value).reduce((sum, char) => sum + char.charCodeAt(0), 0) % TAG_COLORS.length
  return TAG_COLORS[index]
}

export function normalizeNote(note = {}) {
  return {
    title: note.title || "",
    content: note.content || "",
    tags: Array.isArray(note.tags) ? note.tags : [],
    difficulty: note.difficulty || "Medium",
    language: note.language || "cpp",
    codeSnippet: note.codeSnippet || "",
    problemUrl: note.problemUrl || "",
    revisionStatus: note.revisionStatus || "New",
  }
}

export function parseTags(value) {
  if (Array.isArray(value)) {
    return value.map((tag) => (typeof tag === "string" ? tag.trim() : "")).filter(Boolean).slice(0, 12)
  }

  return value
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean)
    .slice(0, 12)
}

export function languageLabel(language) {
  return LANGUAGES.find((item) => item.value === language)?.label || "C++"
}

export function platformFromUrl(url = "") {
  const value = url.toLowerCase()

  if (value.includes("codeforces.com")) return "Codeforces"
  if (value.includes("leetcode.com")) return "LeetCode"
  if (value.includes("atcoder.jp")) return "AtCoder"

  return url ? "Problem Link" : "No Link"
}
