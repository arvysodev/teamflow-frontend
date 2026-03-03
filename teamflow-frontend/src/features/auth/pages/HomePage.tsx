import { useQuery } from "@tanstack/react-query"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getWorkspaces } from "@/features/workspaces/api/getWorkspaces"
import { formatDateTime } from "@/shared/lib/date"

export function HomePage() {
  const page = 0
  const size = 10

  const workspacesQuery = useQuery({
    queryKey: ["workspaces", page, size],
    queryFn: () => getWorkspaces({ page, size }),
  })

  const items = workspacesQuery.data?.items ?? []

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-semibold">Workspaces</h2>
      </div>

      <Card className="my-4">
        <CardHeader>
          <CardTitle>Your workspaces</CardTitle>
        </CardHeader>
        <CardContent>
          {workspacesQuery.isLoading && <p className="text-sm text-muted-foreground">Loading…</p>}

          {workspacesQuery.isError && (
            <p className="text-sm text-destructive">Failed to load workspaces.</p>
          )}

          {workspacesQuery.data && items.length === 0 && (
            <p className="text-sm text-muted-foreground">You don’t have any workspaces yet.</p>
          )}

          {workspacesQuery.data && items.length > 0 && (
            <div className="space-y-2">
              {items.map((ws) => (
                <div
                  key={ws.id}
                  className="p-4 flex items-center justify-between hover:bg-muted/50 transition"
                >
                  <div className="min-w-0">
                    <p className="font-medium truncate">{ws.name}</p>
                    <p className="text-sm text-muted-foreground">{ws.status}</p>
                  </div>

                  <p className="text-sm text-muted-foreground whitespace-nowrap">
                    {formatDateTime(ws.createdAt)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
