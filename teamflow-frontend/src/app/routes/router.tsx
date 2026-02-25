import { createBrowserRouter } from "react-router-dom"

import { AppShell } from "@/app/layout/AppShell"
import { ProtectedRoute } from "@/app/routes/ProtectedRoute"
import { LoginPage } from "@/features/auth/pages/LoginPage"
import { RegisterPage } from "@/features/auth/pages/RegisterPage"
import { VerifyPage } from "@/features/auth/pages/VerifyPage"

export const router = createBrowserRouter([
  { path: "/login", element: <LoginPage /> },
  { path: "/register", element: <RegisterPage /> },
  { path: "/verify", element: <VerifyPage /> },

  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/",
        element: <AppShell />,
      },
    ],
  },
])
