import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { useState } from "react"

import { Link, useNavigate, useParams } from "react-router-dom"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getProjectParams } from "@/features/projects/api/getProjects"
import type { ProjectStatus } from "@/features/projects/model/types"
import { closeWorkspace } from "@/features/workspaces/api/closeWorkspace"
import { getWorkspaceById } from "@/features/workspaces/api/getWorkspaceById"
import { getWorkspaceMembers } from "@/features/workspaces/api/getWorkspaceMembers"
import { leaveWorkspace } from "@/features/workspaces/api/leaveWorkspace"
import { renameWorkspace } from "@/features/workspaces/api/renameWorkspace"
import { restoreWorkspace } from "@/features/workspaces/api/restoreWorkspace"
import { useMeQuery } from "@/shared/api/queries"
import { formatDateTime } from "@/shared/lib/date"

export function WorkspacePage() {
  const { workspaceId } = useParams()
  const [projectStatus, setProjectStatus] = useState<ProjectStatus>("ACTIVE")
  const [projectsPage, setProjectsPage] = useState(0)
  const projectsSize = 10
  const navigate = useNavigate()
  const qc = useQueryClient()

  if (!workspaceId) {
    return <p className="text-sm text-desctructive">Workspace id is missing.</p>
  }

  const workspaceQuery = useQuery({
    queryKey: ["workspace", workspaceId],
    queryFn: () => getWorkspaceById(workspaceId),
  })

  const projectsQuery = useQuery({
    queryKey: ["projects", workspaceId, projectStatus, projectsPage, projectsSize],
    queryFn: () =>
      getProjectParams({
        workspaceId: workspaceId!,
        status: projectStatus,
        page: projectsPage,
        size: projectsSize,
      }),
    enabled: !!workspaceId,
  })

  const meQuery = useMeQuery()

  const membersQuery = useQuery({
    queryKey: ["workspaceMembers", workspaceId],
    queryFn: () => getWorkspaceMembers(workspaceId),
  })

  const myRole =
    meQuery.data && membersQuery.data
      ? membersQuery.data.find((m) => m.userId === meQuery.data!.id)?.role
      : undefined

  const isOwner = myRole === "OWNER"

  const currentName = workspaceQuery.data?.name ?? ""
  const [newName, setNewName] = useState("")

  const renameMutation = useMutation({
    mutationFn: (name: string) => renameWorkspace(workspaceId, { name }),
    onSuccess: async () => {
      toast.success("Workspace renamed")
      await qc.invalidateQueries({ queryKey: ["workspace", workspaceId] })
      await qc.invalidateQueries({ queryKey: ["workspaces"] })
    },
    onError: () => toast.error("Rename failed"),
  })

  const closeMutation = useMutation({
    mutationFn: () => closeWorkspace(workspaceId),
    onSuccess: async () => {
      toast.message("Workspace closed")
      await qc.invalidateQueries({ queryKey: ["workspace", workspaceId] })
      await qc.invalidateQueries({ queryKey: ["workspaces"] })
    },
    onError: () => toast.error("Close failed"),
  })

  const restoreMutation = useMutation({
    mutationFn: () => restoreWorkspace(workspaceId),
    onSuccess: async () => {
      toast.message("Workspace restored")
      await qc.invalidateQueries({ queryKey: ["workspace", workspaceId] })
      await qc.invalidateQueries({ queryKey: ["workspaces"] })
    },
    onError: () => toast.error("Restore failed"),
  })

  const leaveMutation = useMutation({
    mutationFn: () => leaveWorkspace(workspaceId),
    onSuccess: async () => {
      toast.message("You left the workspace")
      await qc.invalidateQueries({ queryKey: ["workspaces"] })
      navigate("/", { replace: true })
    },
    onError: () => toast.error("Leave failed"),
  })

  if (workspaceQuery.isPending) {
    return <p className="text-sm text-muted-foreground">Loading workspace…</p>
  }

  if (workspaceQuery.isError) {
    return <p className="text-sm text-destructive">Failed to load workspace.</p>
  }

  const ws = workspaceQuery.data
  const isClosed = ws.status === "CLOSED" || ws.status === "ARCHIVED"

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h2 className="text-2xl font-semibold truncate">{ws.name}</h2>
          <p className="text-sm text-muted-foreground">{ws.status}</p>
        </div>

        <div className="flex items-center gap-2">
          <Button asChild variant="secondary" size="sm">
            <Link to="members">Members</Link>
          </Button>

          {isOwner && (
            <Dialog
              onOpenChange={(open) => {
                if (open) setNewName(currentName)
              }}
            >
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  Rename
                </Button>
              </DialogTrigger>

              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Rename workspace</DialogTitle>
                </DialogHeader>

                <div className="space-y-3">
                  <Input
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Workspace name"
                  />

                  <Button
                    onClick={() => renameMutation.mutate(newName)}
                    disabled={renameMutation.isPending || newName.trim().length === 0}
                  >
                    {renameMutation.isPending ? "Saving…" : "Save"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}

          {isOwner &&
            (!isClosed ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => closeMutation.mutate()}
                disabled={closeMutation.isPending}
              >
                {closeMutation.isPending ? "Closing…" : "Close"}
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => restoreMutation.mutate()}
                disabled={restoreMutation.isPending}
              >
                {restoreMutation.isPending ? "Restoring…" : "Restore"}
              </Button>
            ))}

          <Button
            variant="destructive"
            size="sm"
            onClick={() => leaveMutation.mutate()}
            disabled={leaveMutation.isPending}
          >
            {leaveMutation.isPending ? "Leaving…" : "Leave"}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-sm">
            <span className="text-muted-foreground">Created:</span> {formatDateTime(ws.createdAt)}
          </p>
          <p className="text-sm">
            <span className="text-muted-foreground">Updated:</span> {formatDateTime(ws.updatedAt)}
          </p>
          <p className="text-sm">
            <span className="text-muted-foreground">My role:</span>{" "}
            {membersQuery.isPending ? "Loading…" : (myRole ?? "—")}
          </p>
          <p className="text-sm text-muted-foreground">projects</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-4">
          <CardTitle>Projects</CardTitle>
        </CardHeader>

        <Tabs
          value={projectStatus}
          onValueChange={(v) => {
            if (v === "ACTIVE" || v === "ARCHIVED") {
              setProjectStatus(v)
              setProjectsPage(0)
            }
          }}
        >
          <TabsList className="mx-4 mb-4">
            <TabsTrigger value="ACTIVE">Active</TabsTrigger>
            <TabsTrigger value="ARCHIVED">Archived</TabsTrigger>
          </TabsList>
        </Tabs>

        <CardContent>
          {projectsQuery.isPending && (
            <p className="text-sm text-muted-foreground">Loading projects...</p>
          )}

          {projectsQuery.isError && (
            <p className="text-sm text-destructive">Failed to load projects</p>
          )}

          {projectsQuery.isSuccess && projectsQuery.data.items.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No {projectStatus.toLowerCase()} projects yet.
            </p>
          )}

          {projectsQuery.isSuccess && projectsQuery.data.items.length > 0 && (
            <div className="rounded-md border divide-y">
              {projectsQuery.data.items.map((p) => (
                <Link
                  key={p.id}
                  to={`/workspaces/${workspaceId}/projects/${p.id}`}
                  className="px-4 py-2 flex items-center justify-between hover:bg-muted/50 transition"
                >
                  <div className="min-w-0">
                    <p className="font-medium truncate">{p.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Updated: {formatDateTime(p.updatedAt)}
                    </p>

                    <span className="text-sm text-muted-foreground">{p.status}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {projectsQuery.isSuccess && projectsQuery.data.meta.totalPages > 1 && (
            <div className="flex items-center justify-between pt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setProjectsPage((x) => Math.max(0, x - 1))}
                disabled={!projectsQuery.data.meta.hasPrev}
              >
                Prev
              </Button>

              <p className="text-sm text-muted-foreground">
                Page {projectsQuery.data.meta.page + 1} of {projectsQuery.data.meta.totalPages}
              </p>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setProjectsPage((x) => x + 1)}
                disabled={!projectsQuery.data.meta.hasNext}
              >
                Next
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
