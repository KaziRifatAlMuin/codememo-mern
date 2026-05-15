/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { fetchMe, login as loginRequest, register as registerRequest, updateMe as updateMeRequest } from "../api/authApi.js"
import { getToken, setToken } from "../api/apiClient.js"

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const queryClient = useQueryClient()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(Boolean(getToken()))

  useEffect(() => {
    let alive = true
    if (!getToken()) return

    fetchMe()
      .then((payload) => {
        if (alive) setUser(payload.user)
      })
      .catch(() => {
        setToken("")
        if (alive) setUser(null)
      })
      .finally(() => {
        if (alive) setLoading(false)
      })

    return () => {
      alive = false
    }
  }, [])

  const value = useMemo(
    () => ({
      user,
      loading,
      isAdmin: user?.role === "admin",
      async login(payload) {
        const result = await loginRequest(payload)
        setToken(result.token)
        setUser(result.user)
        queryClient.clear()
        return result.user
      },
      async register(payload) {
        const result = await registerRequest(payload)
        setToken(result.token)
        setUser(result.user)
        queryClient.clear()
        return result.user
      },
      async updateProfile(payload) {
        const result = await updateMeRequest(payload)
        setUser(result.user)
        return result.user
      },
      logout() {
        setToken("")
        setUser(null)
        queryClient.clear()
      },
    }),
    [loading, queryClient, user]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const value = useContext(AuthContext)
  if (!value) throw new Error("useAuth must be used inside AuthProvider")
  return value
}
