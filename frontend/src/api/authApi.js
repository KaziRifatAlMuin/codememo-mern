import { apiRequest } from "./apiClient.js"

export const authKeys = {
  me: ["auth", "me"],
}

export const login = (payload) =>
  apiRequest("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  })

export const register = (payload) =>
  apiRequest("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  })

export const fetchMe = () => apiRequest("/api/auth/me")

export const updateMe = (payload) =>
  apiRequest("/api/auth/me", {
    method: "PUT",
    body: JSON.stringify(payload),
  })
