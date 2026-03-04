import { Navigate, Outlet } from "react-router-dom"

import { useAuth } from "@/features/auth/model/AuthContext"
import { isJwtExpired } from "@/shared/lib/jwt"
import { getAccessToken } from "@/shared/lib/token"

export function ProtectedRoute() {
  const { isAuthenticated } = useAuth()
  const token = getAccessToken()
  
  if (!token || isJwtExpired(token)) {
    return <Navigate to="/login" replace />
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}
