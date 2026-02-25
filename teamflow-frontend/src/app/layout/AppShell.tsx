import { Link } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";

export function AppShell() {
  return (
    <div className="min-h-screen p-6">
      <Toaster />
      <div className="mx-auto max-w-4xl space-y-4">
        <header className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">TeamFlow</h1>
          <nav className="flex gap-4 text-sm underline">
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
            <Link to="/verify">Verify</Link>
          </nav>
        </header>

        <main className="rounded-lg border p-6">
          <p className="text-sm text-muted-foreground">
            Protected area placeholder. Next: Workspaces list.
          </p>
        </main>
      </div>
    </div>
  );
}
