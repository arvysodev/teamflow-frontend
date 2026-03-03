import { useQuery } from "@tanstack/react-query"

import { useParams } from "react-router-dom"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getWorkspaceById } from "@/features/workspaces/api/getWorkspaceById"
import { formatDateTime } from "@/shared/lib/date"

export function WorkspacePage() {
  const params = useParams()
  const workspaceId = params.workspaceId

  if (!workspaceId) {
    return <p className="text-sm text-desctructive">Workspace id is missing.</p>
  }

  const workspaceQuery = useQuery({
    queryKey: ["workspace", workspaceId],
    queryFn: () => getWorkspaceById(workspaceId),
  })

  if (workspaceQuery.isPending) {
    return <p className="text-sm text-muted-foreground">Loading workspace…</p>
  }

  if (workspaceQuery.isError) {
    return <p className="text-sm text-destructive">Failed to load workspace.</p>
  }

  const ws = workspaceQuery.data

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-semibold">{ws.name}</h2>
        <p className="text-sm text-muted-foreground">{ws.status}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-sm">
            <span>Created:</span> {formatDateTime(ws.createdAt)}
          </p>
          <p className="text-sm">
            <span>Updated:</span> {formatDateTime(ws.updatedAt)}
          </p>
          <p className="text-sm text-muted-foreground">projects</p>
        </CardContent>
      </Card>
    </div>
  )
}
