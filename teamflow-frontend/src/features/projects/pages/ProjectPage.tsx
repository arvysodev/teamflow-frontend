import { useQuery } from "@tanstack/react-query"

import { Link, useParams } from "react-router-dom"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getProjectById } from "@/features/projects/api/getProjectById"
import { formatDateTime } from "@/shared/lib/date"

export function ProjectPage() {
  const { workspaceId, projectId } = useParams()

  const hasIds = Boolean(workspaceId && projectId)

  const projectQuery = useQuery({
    queryKey: ["project", workspaceId, projectId],
    queryFn: () => getProjectById(workspaceId!, projectId!),
    enabled: hasIds,
  })

  if (!hasIds) {
    return <p className="text-sm text-destructive">Project or workspace id is missing.</p>
  }

  if (projectQuery.isPending) {
    return <p className="text-sm text-muted-foreground">Loading project…</p>
  }

  if (projectQuery.isError) {
    return <p className="text-sm text-destructive">Failed to load project.</p>
  }

  const project = projectQuery.data

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">
            <Link to={`/workspaces/${workspaceId}`} className="underline underline-offset-4">
              Back to workspace
            </Link>
          </p>

          <h2 className="text-2xl font-semibold">{project.name}</h2>
          <p className="text-sm text-muted-foreground">{project.status}</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Project details</CardTitle>
        </CardHeader>

        <CardContent className="space-y-2">
          <p className="text-sm">
            <span className="text-muted-foreground">Created:</span>{" "}
            {formatDateTime(project.createdAt)}
          </p>

          <p className="text-sm">
            <span className="text-muted-foreground">Updated:</span>{" "}
            {formatDateTime(project.updatedAt)}
          </p>

          <p className="text-sm">
            <span className="text-muted-foreground">Created by:</span> {project.createdBy}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
