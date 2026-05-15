export const DIFFICULTIES = ["Easy", "Medium", "Hard"]
export const LANGUAGES = [
  { value: "cpp", label: "C++" },
  { value: "python", label: "Python" },
  { value: "javascript", label: "JavaScript" },
]
export const REVISION_STATUSES = ["New", "Revised", "Mastered"]

export const difficultyClass = {
  Easy: "badge-success",
  Medium: "badge-warning",
  Hard: "badge-error",
}

export const statusClass = {
  New: "badge-info",
  Revised: "badge-secondary",
  Mastered: "badge-success",
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
  return value
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean)
    .slice(0, 8)
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
