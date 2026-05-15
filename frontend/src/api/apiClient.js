const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001"

export function getToken() {
  return window.localStorage.getItem("codememo_token")
}

export function setToken(token) {
  if (token) window.localStorage.setItem("codememo_token", token)
  else window.localStorage.removeItem("codememo_token")
}

export async function apiRequest(path, options = {}) {
  const token = getToken()
  const headers = {
    ...(options.body ? { "Content-Type": "application/json" } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  }

  const response = await fetch(`${API_URL}${path}`, { ...options, headers })
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
