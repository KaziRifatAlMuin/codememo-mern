import { apiRequest } from "./apiClient.js"

export const notesKeys = {
  all: ["notes"],
  detail: (id) => ["notes", id],
}

export async function fetchNotes() {
  return apiRequest("/api/notes")
}

export async function fetchNoteById(id) {
  return apiRequest(`/api/notes/${id}`)
}

export async function createNote(note) {
  return apiRequest("/api/notes", {
    method: "POST",
    body: JSON.stringify(note),
  })
}

export async function updateNote(id, note) {
  return apiRequest(`/api/notes/${id}`, {
    method: "PUT",
    body: JSON.stringify(note),
  })
}

export async function deleteNote(id) {
  return apiRequest(`/api/notes/${id}`, {
    method: "DELETE",
  })
}
