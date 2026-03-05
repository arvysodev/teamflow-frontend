import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import { toast } from "sonner"

import { useEffect, useState } from "react"

import { Link, useNavigate, useParams } from "react-router-dom"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { createProject } from "@/features/projects/api/createProject"
import { getProjects } from "@/features/projects/api/getProjects"
import type { ProjectSort } from "@/features/projects/api/types"
import type { ProjectStatus } from "@/features/projects/model/types"
import { closeWorkspace } from "@/features/workspaces/api/closeWorkspace"
import { getWorkspaceById } from "@/features/workspaces/api/getWorkspaceById"
import { getWorkspaceMembers } from "@/features/workspaces/api/getWorkspaceMembers"
import { leaveWorkspace } from "@/features/workspaces/api/leaveWorkspace"
import { renameWorkspace } from "@/features/workspaces/api/renameWorkspace"
import { restoreWorkspace } from "@/features/workspaces/api/restoreWorkspace"
import { getProblemDetail } from "@/shared/api/problemDetails"
import { useMeQuery } from "@/shared/api/queries"
import { formatDateTime } from "@/shared/lib/date"

import { WorkspaceHeader } from "../components/WorkspaceHeader"

export function WorkspacePage() {
  const { workspaceId } = useParams()
  const [projectStatus, setProjectStatus] = useState<ProjectStatus>("ACTIVE")
  const [projectQuery, setProjectQuery] = useState("")
  const [projectSort, setProjectSort] = useState<ProjectSort>("updatedAt,desc")
  const [projectsPage, setProjectsPage] = useState(0)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [projectName, setProjectName] = useState("")
  const projectsSize = 10
  const normalizedQ = projectQuery.trim()

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
    queryKey: [
      "projects",
      workspaceId,
      projectStatus,
      projectsPage,
      projectsSize,
      normalizedQ,
      projectSort,
    ],
    queryFn: () =>
      getProjects({
        workspaceId: workspaceId!,
        status: projectStatus,
        page: projectsPage,
        size: projectsSize,
        q: normalizedQ,
        sort: projectSort,
      }),
    enabled: !!workspaceId,
  })

  useEffect(() => {
    setProjectsPage(0)
  }, [projectStatus, projectSort, normalizedQ])

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

  const createProjectMutation = useMutation({
    mutationFn: () => createProject(workspaceId, { name: projectName.trim() }),
    onSuccess: async (created) => {
      toast.success("Project created")
      setProjectName("")
      setIsCreateOpen(false)

      await qc.invalidateQueries({ queryKey: ["projects", workspaceId] })

      navigate(`/workspaces/${workspaceId}/projects/${created.id}`)
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        const problem = getProblemDetail(error.response?.data)
        if (problem?.detail) {
          toast.error("Create failed", { description: problem.detail })
          return
        }
      }
      toast.error("Create failed")
    },
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
      <WorkspaceHeader
        workspaceId={workspaceId}
        name={ws.name}
        status={ws.status}
        isOwner={isOwner}
        isClosed={isClosed}
        onRename={(name) => renameMutation.mutate(name)}
        renaming={renameMutation.isPending}
        onClose={() => closeMutation.mutate()}
        closing={closeMutation.isPending}
        onRestore={() => restoreMutation.mutate()}
        restoring={restoreMutation.isPending}
        onLeave={() => leaveMutation.mutate()}
        leaving={leaveMutation.isPending}
      />

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
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-4">
          <CardTitle>Projects</CardTitle>

          <div className="flex items-center gap-2">
            <Input
              value={projectQuery}
              onChange={(e) => setProjectQuery(e.target.value)}
              placeholder="Search projects…"
              className="w-[240px]"
              autoComplete="off"
            />

            <Select
              value={projectSort}
              onValueChange={(v) => {
                if (
                  v === "updatedAt,desc" ||
                  v === "updatedAt,asc" ||
                  v === "createdAt,desc" ||
                  v === "createdAt,asc" ||
                  v === "name,asc" ||
                  v === "name,desc"
                ) {
                  setProjectSort(v)
                }
              }}
            >
              <SelectTrigger className="w-[210px]">
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="updatedAt,desc">Updated (newest)</SelectItem>
                <SelectItem value="updatedAt,asc">Updated (oldest)</SelectItem>
                <SelectItem value="createdAt,desc">Created (newest)</SelectItem>
                <SelectItem value="createdAt,asc">Created (oldest)</SelectItem>
                <SelectItem value="name,asc">Name (ascending)</SelectItem>
                <SelectItem value="name,desc">Name (descending)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>

        <div className="flex">
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

          <Button size="sm" onClick={() => setIsCreateOpen(true)}>
            Create
          </Button>
        </div>

        <Dialog
          open={isCreateOpen}
          onOpenChange={(open) => {
            setIsCreateOpen(open)
            if (open) setProjectName("")
          }}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create project</DialogTitle>
            </DialogHeader>

            <div className="space-y-3">
              <Input
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="Project name"
                autoComplete="off"
              />

              <Button
                onClick={() => createProjectMutation.mutate()}
                disabled={createProjectMutation.isPending || projectName.trim().length === 0}
              >
                {createProjectMutation.isPending ? "Creating…" : "Create"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {projectsQuery.data.items.map((p) => (
                <Link
                  key={p.id}
                  to={`/workspaces/${workspaceId}/projects/${p.id}`}
                  className="block"
                >
                  <Card className="hover:bg-muted transition">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base truncate">{p.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-1">
                      <p className="text-sm text-muted-foreground">
                        Updated: {formatDateTime(p.updatedAt)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Created: {formatDateTime(p.createdAt)}
                      </p>
                      <p className="text-xs text-muted-foreground">Status: {p.status}</p>
                    </CardContent>
                  </Card>
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
