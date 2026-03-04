import { useQuery } from "@tanstack/react-query"

import { useParams } from "react-router-dom"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatDateTime } from "@/shared/lib/date"

import { getWorkspaceMembers } from "../api/getWorkspaceMembers"

export function WorkspaceMembersPage() {
  const { workspaceId } = useParams()

  const membersQuery = useQuery({
    queryKey: ["workspaceMembers", workspaceId],
    queryFn: () => getWorkspaceMembers(workspaceId!),
    enabled: !!workspaceId,
  })

  if (membersQuery.isPending) {
    return <p className="text-sm text-muted-foreground">Loading members…</p>
  }

  if (membersQuery.isError) {
    return <p className="text-sm text-destructive">Failed to load members.</p>
  }

  const members = membersQuery.data

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Members</h2>

      <Card>
        <CardHeader>
          <CardTitle>Workspace members</CardTitle>
        </CardHeader>

        <CardContent className="space-y-2">
          {members.length === 0 && (
            <p className="text-sm text-muted-foreground">No members found.</p>
          )}

          {members.length > 0 && (
            <div className="rounded-md border divide-y max-h-[420px] overflow-y-auto">
              {members.map((m) => (
                <div
                  key={m.userId}
                  className="p-4 flex items-center justify-between hover:bg-muted/50 transition"
                >
                  <div className="min-w-0">
                    <p className="font-medium truncate">{m.userId}</p>
                    <p className="text-sm text-muted-foreground">
                      Joined {formatDateTime(m.joinedAt)}
                    </p>
                  </div>

                  <span className="text-sm text-muted-foreground">{m.role}</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
