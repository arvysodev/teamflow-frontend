import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { useNavigate, useParams } from "react-router-dom"

import { WorkspaceProjectsCard } from "@/features/projects/components/WorkspaceProjectsCard"

import { closeWorkspace } from "@/features/workspaces/api/closeWorkspace"
import { getWorkspaceById } from "@/features/workspaces/api/getWorkspaceById"
import { getWorkspaceMembers } from "@/features/workspaces/api/getWorkspaceMembers"
import { leaveWorkspace } from "@/features/workspaces/api/leaveWorkspace"
import { renameWorkspace } from "@/features/workspaces/api/renameWorkspace"
import { restoreWorkspace } from "@/features/workspaces/api/restoreWorkspace"

import { useMeQuery } from "@/shared/api/queries"

import { WorkspaceDetailsCard } from "../components/WorkspaceDetailsCard"
import { WorkspaceHeader } from "../components/WorkspaceHeader"

export function WorkspacePage() {
  const { workspaceId } = useParams()
  const navigate = useNavigate()
  const qc = useQueryClient()

  if (!workspaceId) {
    return <p className="text-sm text-desctructive">Workspace id is missing.</p>
  }

  const workspaceQuery = useQuery({
    queryKey: ["workspace", workspaceId],
    queryFn: () => getWorkspaceById(workspaceId),
  })

  const meQuery = useMeQuery()

  const membersQuery = useQuery({
    queryKey: ["workspaceMembers", workspaceId],
    queryFn: () => getWorkspaceMembers(workspaceId),
  })

  const myRole =
    meQuery.data && membersQuery.data
      ? membersQuery.data.find((m) => m.userId === meQuery.data.id)?.role
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

      <WorkspaceDetailsCard
        createdAt={ws.createdAt}
        updatedAt={ws.updatedAt}
        myRole={myRole}
        roleLoading={membersQuery.isPending}
      />

      <WorkspaceProjectsCard workspaceId={workspaceId} canCreate={isOwner} />
    </div>
  )
}