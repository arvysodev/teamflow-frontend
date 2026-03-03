import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import { toast } from "sonner"

import { useEffect, useState } from "react"

import { Link, useNavigate } from "react-router-dom"

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
import { createWorkspace } from "@/features/workspaces/api/createWorkspace"
import { getClosedWorkspaces } from "@/features/workspaces/api/getClosedWorkspaces"
import { getWorkspaces } from "@/features/workspaces/api/getWorkspaces"
import type { WorkspaceFilter } from "@/features/workspaces/model/types"
import { formatDateTime } from "@/shared/lib/date"

export function HomePage() {
  const [page, setPage] = useState(0)
  const size = 10
  const qc = useQueryClient()
  const navigate = useNavigate()

  const [statusFilter, setStatusFilter] = useState<WorkspaceFilter>("active")

  useEffect(() => {
    setPage(0)
  }, [statusFilter])

  const workspacesQuery = useQuery({
    queryKey: ["workspaces", statusFilter, page, size],
    queryFn: () =>
      statusFilter === "active"
        ? getWorkspaces({ page, size })
        : getClosedWorkspaces({ page, size }),
  })

  const [name, setName] = useState("")

  const createMutation = useMutation({
    mutationFn: () => createWorkspace({ name: name.trim() }),
    onSuccess: async (ws) => {
      toast.success("Workspace created")
      setName("")
      await qc.invalidateQueries({ queryKey: ["workspaces"] })

      navigate(`/workspaces/${ws.id}`)
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        const detail = (error.response?.data as any)?.detail
        if (detail) {
          toast.error("Create failed", { description: detail })
          return
        }
      }
      toast.error("Create failed")
    },
  })

  const items = workspacesQuery.data?.items ?? []

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-semibold">Workspaces</h2>
      </div>

      <div className="flex justify-between gap-4">
        <Tabs
          value={statusFilter}
          onValueChange={(value) => {
            if (value === "active" || value === "closed") {
              setStatusFilter(value)
            }
          }}
        >
          <TabsList>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="closed">Closed</TabsTrigger>
          </TabsList>
        </Tabs>

        <Dialog
          onOpenChange={(open) => {
            if (open) setName("")
          }}
        >
          <DialogTrigger asChild>
            <Button size="sm">Create workspace</Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create workspace</DialogTitle>
            </DialogHeader>

            <div className="space-y-3">
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Workspace name"
                autoComplete="off"
              />

              <Button
                onClick={() => createMutation.mutate()}
                disabled={createMutation.isPending || name.trim().length === 0}
              >
                {createMutation.isPending ? "Creating..." : "Create"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="my-4">
        <CardHeader>
          <CardTitle>Your workspaces</CardTitle>
        </CardHeader>

        <CardContent className="space-y-2">
          {workspacesQuery.isLoading && <p className="text-sm text-muted-foreground">Loading…</p>}

          {workspacesQuery.isError && (
            <p className="text-sm text-destructive">Failed to load workspaces.</p>
          )}

          {workspacesQuery.isSuccess && items.length === 0 && (
            <p className="text-sm text-muted-foreground">
              You don’t have any {statusFilter} workspaces.
            </p>
          )}

          {workspacesQuery.isSuccess && items.length > 0 && (
            <div className="space-y-2">
              {items.map((ws) => (
                <Link
                  key={ws.id}
                  className="p-4 flex items-center justify-between hover:bg-muted transition"
                  to={`/workspaces/${ws.id}`}
                >
                  <div className="min-w-0">
                    <p className="font-medium truncate">{ws.name}</p>
                    <p className="text-sm text-muted-foreground">{ws.status}</p>
                  </div>

                  <p className="text-sm text-muted-foreground whitespace-nowrap">
                    {formatDateTime(ws.createdAt)}
                  </p>
                </Link>
              ))}
            </div>
          )}

          {workspacesQuery.isSuccess && workspacesQuery.data.meta.totalPages > 1 && (
            <div className="flex items-center justify-between pt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={!workspacesQuery.data.meta.hasPrev}
              >
                Prev
              </Button>

              <p className="text-sm text-muted-foreground">
                Page {workspacesQuery.data.meta.page + 1} of {workspacesQuery.data.meta.totalPages}
              </p>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => p + 1)}
                disabled={!workspacesQuery.data.meta.hasNext}
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
