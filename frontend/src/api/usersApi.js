import { apiRequest } from "./apiClient.js"

export const usersKeys = {
  all: ["users"],
  detail: (id) => ["users", id],
}

export const fetchUsers = () => apiRequest("/api/users")
export const fetchUser = (id) => apiRequest(`/api/users/${id}`)
export const updateUser = (id, payload) =>
  apiRequest(`/api/users/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  })
