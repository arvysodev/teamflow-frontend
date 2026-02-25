import React from "react";
import ReactDOM from "react-dom/client";
import { AuthProvider } from "@/features/auth/model/AuthContext";
import "./index.css";

import { RouterProvider } from "react-router-dom";
import { router } from "@/app/routes/router";
import { QueryProvider } from "@/app/providers/QueryProvider";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <QueryProvider>
        <RouterProvider router={router} />
      </QueryProvider>
    </AuthProvider>
  </React.StrictMode>,
);
