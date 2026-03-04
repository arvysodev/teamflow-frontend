import { type PropsWithChildren, createContext, useContext, useState } from "react"
import { useEffect } from "react"

import { queryClient } from "@/app/providers/queryClient"
import { onLogout } from "@/shared/lib/authBus"
import { isJwtExpired } from "@/shared/lib/jwt"
import { clearAccessToken, getAccessToken, setAccessToken } from "@/shared/lib/token"

type AuthContextValue = {
  isAuthenticated: boolean
  login: (token: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: PropsWithChildren) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const token = getAccessToken()
    if (!token) return false
    if (isJwtExpired(token)) {
      clearAccessToken()
      return false
    }
    return true
  })

  useEffect(() => {
    return onLogout(() => {
      setIsAuthenticated(false)
    })
  }, [])

  function login(token: string) {
    setAccessToken(token)
    setIsAuthenticated(true)
  }

  function logout() {
    clearAccessToken()
    setIsAuthenticated(false)
    queryClient.clear()
  }

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
