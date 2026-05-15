const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001"
const BASE_URL = `${API_URL}/api/tags`

export const tagsKeys = {
  all: ["tags"],
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

export async function fetchTags() {
  const response = await fetch(BASE_URL)
  return handleResponse(response)
}

export async function createTag(tag) {
  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(tag),
  })
  return handleResponse(response)
}

export async function deleteTag(id) {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
  })
  return handleResponse(response)
}
