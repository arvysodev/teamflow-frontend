import { toast } from "sonner"

import { Link, useNavigate } from "react-router-dom"

import { Button } from "@/components/ui/button"
import { useAuth } from "@/features/auth/model/AuthContext"
import { useMeQuery } from "@/shared/api/queries"

export function Header() {
  const navigate = useNavigate()
  const meQuery = useMeQuery()

  const { logout } = useAuth()

  function handleLogout() {
    logout()
    toast.message("Logged out")
    navigate("/login", { replace: true })
  }

  return (
    <header className="sticky top-0 z-50 border-b bg-background">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-2xl font-semibold hover:opacity-80">
          TeamFlow
        </Link>

        <div className="flex items-center gap-3">
          {meQuery.data && (
            <Link
              to="/profile"
              className="text-sm text-muted-foreground hover:opacity-80 underline underline-offset-4"
            >
              Logged in as {meQuery.data.username}
            </Link>
          )}
          <Button variant="outline" size="sm" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>
    </header>
  )
}
