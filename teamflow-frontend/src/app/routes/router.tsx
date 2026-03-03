import { createBrowserRouter } from "react-router-dom"

import { AppShell } from "@/app/layout/AppShell"
import { ProtectedRoute } from "@/app/routes/ProtectedRoute"
import { HomePage } from "@/features/auth/pages/HomePage"
import { LoginPage } from "@/features/auth/pages/LoginPage"
import { ProfilePage } from "@/features/auth/pages/ProfilePage"
import { RegisterPage } from "@/features/auth/pages/RegisterPage"
import { VerifyPage } from "@/features/auth/pages/VerifyPage"
import { WorkspacePage } from "@/features/auth/pages/WorkspacePage"

export const router = createBrowserRouter([
  { path: "/login", element: <LoginPage /> },
  { path: "/register", element: <RegisterPage /> },
  { path: "/verify", element: <VerifyPage /> },

  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppShell />,
        children: [
          { path: "/", element: <HomePage /> },
          { path: "/profile", element: <ProfilePage /> },
          { path: "/workspaces/:workspaceId", element: <WorkspacePage /> },
        ],
      },
    ],
  },
])
