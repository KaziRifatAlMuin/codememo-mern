import { apiRequest } from "./apiClient.js"

export const tagsKeys = {
  all: ["tags"],
}

export async function fetchTags() {
  return apiRequest("/api/tags")
}

export async function createTag(tag) {
  return apiRequest("/api/tags", {
    method: "POST",
    body: JSON.stringify(tag),
  })
}

export async function deleteTag(id) {
  return apiRequest(`/api/tags/${id}`, {
    method: "DELETE",
  })
}
