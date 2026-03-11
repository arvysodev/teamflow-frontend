import { createBrowserRouter } from "react-router-dom"

import { AppShell } from "@/app/layout/AppShell"
import { ProtectedRoute } from "@/app/routes/ProtectedRoute"
import { LoginPage } from "@/features/auth/pages/LoginPage"
import { ProfilePage } from "@/features/auth/pages/ProfilePage"
import { RegisterPage } from "@/features/auth/pages/RegisterPage"
import { VerifyPage } from "@/features/auth/pages/VerifyPage"
import { ProjectPage } from "@/features/projects/pages/ProjectPage"
import { HomePage } from "@/features/workspaces/pages/HomePage"
import { WorkspaceMembersPage } from "@/features/workspaces/pages/WorkspaceMembersPage"
import { WorkspacePage } from "@/features/workspaces/pages/WorkspacePage"

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
          { path: "/workspaces/:workspaceId/members", element: <WorkspaceMembersPage /> },
          { path: "/workspaces/:workspaceId/projects/:projectId", element: <ProjectPage /> },
        ],
      },
    ],
  },
])
