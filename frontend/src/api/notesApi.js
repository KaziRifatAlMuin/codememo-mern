const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001"
const BASE_URL = `${API_URL}/api/notes`

export const notesKeys = {
  all: ["notes"],
  detail: (id) => ["notes", id],
}

async function handleResponse(response) {
  if (!response.ok) {
    let message = "Request failed"
    try {
      const payload = await response.json()
      message = payload?.message || message
    } catch {
      message = response.statusText || message
    }
    throw new Error(message)
  }
  return response.json()
}

export async function fetchNotes() {
  const response = await fetch(BASE_URL)
  return handleResponse(response)
}

export async function fetchNoteById(id) {
  const response = await fetch(`${BASE_URL}/${id}`)
  return handleResponse(response)
}

export async function createNote(note) {
  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(note),
  })
  return handleResponse(response)
}

export async function updateNote(id, note) {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(note),
  })
  return handleResponse(response)
}

export async function deleteNote(id) {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
  })
  return handleResponse(response)
}
