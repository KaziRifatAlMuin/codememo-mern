export const DIFFICULTIES = ["Easy", "Medium", "Medium-Hard", "Hard", "Very Hard"]
export const STATUSES = ["To Do", "In Mind", "Stucked", "Too Hard", "Accepted"]
export const REVISION_STATUSES = STATUSES
export const REVISITED_STATUSES = ["New", "Revisited", "Mastered"]

export const LANGUAGES = [
  { value: "cpp", label: "C++" },
  { value: "java", label: "Java" },
  { value: "python", label: "Python" },
]

export const difficultyClass = {
  Easy: "border-cyan-300/35 bg-cyan-400/[0.1] text-cyan-100",
  Medium: "border-blue-400/35 bg-blue-500/[0.1] text-blue-100",
  "Medium-Hard": "border-violet-400/35 bg-violet-500/[0.1] text-violet-100",
  Hard: "border-orange-400/35 bg-orange-500/[0.1] text-orange-100",
  "Very Hard": "border-red-400/35 bg-red-500/[0.1] text-red-100",
}

export const difficultyOptionColor = {
  Easy: "#67e8f9",
  Medium: "#93c5fd",
  "Medium-Hard": "#c4b5fd",
  Hard: "#fdba74",
  "Very Hard": "#fca5a5",
}

export const statusClass = {
  "To Do": "border-sky-400/35 bg-sky-400/[0.1] text-sky-100",
  "In Mind": "border-violet-400/35 bg-violet-400/[0.1] text-violet-100",
  Stucked: "border-amber-400/35 bg-amber-400/[0.1] text-amber-100",
  "Too Hard": "border-red-400/35 bg-red-400/[0.1] text-red-100",
  Accepted: "border-teal-400/35 bg-teal-400/[0.1] text-teal-100",
}

export const statusOptionColor = {
  "To Do": "#7dd3fc",
  "In Mind": "#c4b5fd",
  Stucked: "#fcd34d",
  "Too Hard": "#fca5a5",
  Accepted: "#5eead4",
}

export const statusRowClass = {
  "To Do": "bg-sky-400/[0.045] hover:bg-sky-400/[0.08]",
  "In Mind": "bg-violet-400/[0.045] hover:bg-violet-400/[0.08]",
  Stucked: "bg-amber-400/[0.045] hover:bg-amber-400/[0.08]",
  "Too Hard": "bg-red-400/[0.045] hover:bg-red-400/[0.08]",
  Accepted: "bg-teal-400/[0.045] hover:bg-teal-400/[0.08]",
}

export const revisitedClass = {
  New: "border-slate-300/30 bg-slate-300/[0.08] text-slate-100",
  Revisited: "border-blue-400/35 bg-blue-500/[0.1] text-blue-100",
  Mastered: "border-teal-400/35 bg-teal-400/[0.1] text-teal-100",
}

const statusAliases = {
  New: "To Do",
  Revised: "In Mind",
  Mastered: "Accepted",
}

const difficultyAliases = {
  800: "Easy",
  900: "Easy",
  1000: "Easy",
  1100: "Medium",
  1200: "Medium",
  1300: "Medium",
  1400: "Medium-Hard",
  1500: "Medium-Hard",
  1600: "Hard",
  1700: "Hard",
  1800: "Hard",
  1900: "Very Hard",
  2000: "Very Hard",
}

export function normalizeStatus(status) {
  return STATUSES.includes(status) ? status : statusAliases[status] || "To Do"
}

export function normalizeDifficulty(difficulty) {
  const value = difficulty ? String(difficulty) : ""
  return DIFFICULTIES.includes(value) ? value : difficultyAliases[value] || "Medium"
}

export function normalizeRevisited(value) {
  return REVISITED_STATUSES.includes(value) ? value : "New"
}

export function normalizeNote(note = {}) {
  return {
    title: note.title || "",
    content: note.content || "",
    tags: Array.isArray(note.tags) ? note.tags : [],
    difficulty: normalizeDifficulty(note.difficulty),
    language: LANGUAGES.some((item) => item.value === note.language) ? note.language : "cpp",
    codeSnippet: note.codeSnippet || "",
    problemUrl: note.problemUrl || "",
    revisionStatus: normalizeStatus(note.revisionStatus),
    metacognition: note.metacognition || "",
    takeaways: note.takeaways || note.content || "",
    analysis: note.analysis || "",
    acceptedDate: note.acceptedDate || "",
    resolve: normalizeRevisited(note.resolve),
  }
}

export function parseTags(value) {
  const tags = Array.isArray(value) ? value : String(value || "").split(",")

  return tags
    .map((tag) => (typeof tag === "string" ? tag.trim() : ""))
    .filter(Boolean)
    .slice(0, 16)
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
