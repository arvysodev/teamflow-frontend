import React from "react"

import ReactDOM from "react-dom/client"
import { RouterProvider } from "react-router-dom"

import { QueryProvider } from "@/app/providers/QueryProvider"
import { router } from "@/app/routes/router"
import { AuthProvider } from "@/features/auth/model/AuthContext"

import "./index.css"

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <QueryProvider>
        <RouterProvider router={router} />
      </QueryProvider>
    </AuthProvider>
  </React.StrictMode>,
)
