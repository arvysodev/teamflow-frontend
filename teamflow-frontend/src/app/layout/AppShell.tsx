import { Outlet } from "react-router-dom"

import { Header } from "./Header"

export function AppShell() {
  return (
    <div className="min-h-screen p-6 bg-background">
      <div className="mx-auto max-w-4xl space-y-4">
        <Header />

        <main className="mx-auto px-4 py-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
