import { type PropsWithChildren, createContext, useContext, useState } from "react"
import { useEffect } from "react"

import { queryClient } from "@/app/providers/queryClient"
import { onLogout } from "@/shared/lib/authBus"
import { isJwtExpired } from "@/shared/lib/jwt"
import { getJwtExpSeconds } from "@/shared/lib/jwt"
import { clearAccessToken, getAccessToken, setAccessToken } from "@/shared/lib/token"

type AuthContextValue = {
  isAuthenticated: boolean
  login: (token: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: PropsWithChildren) {
  const [token, setToken] = useState<string | null>(() => {
    const t = getAccessToken()
    if (!t) return null
    if (isJwtExpired(t)) {
      clearAccessToken()
      return null
    }
    return t
  })

  const [isAuthenticated, setIsAuthenticated] = useState(Boolean(token))

  useEffect(() => {
    return onLogout(() => {
      setIsAuthenticated(false)
    })
  }, [])

  function login(token: string) {
    setAccessToken(token)
    setToken(token)
    setIsAuthenticated(true)
  }

  function logout() {
    clearAccessToken()
    setToken(null)
    setIsAuthenticated(false)
    queryClient.clear()
  }

  useEffect(() => {
    if (!token) return

    const exp = getJwtExpSeconds(token)
    if (!exp) return

    const nowMs = Date.now()
    const expMs = exp * 1000

    const delayMs = Math.max(0, expMs - nowMs - 2000)

    const id = window.setTimeout(() => {
      logout()
    }, delayMs)

    return () => window.clearTimeout(id)
  }, [token])

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider")
  }
  return ctx
}
