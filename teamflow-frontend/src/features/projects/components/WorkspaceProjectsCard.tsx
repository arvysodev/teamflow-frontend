import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import { toast } from "sonner"

import { useEffect, useState } from "react"

import { Link, useNavigate } from "react-router-dom"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { createProject } from "@/features/projects/api/createProject"
import { getProjects } from "@/features/projects/api/getProjects"
import type {
  ProjectSort,
  ProjectStatus,
  WorkspaceProjectsCardProps,
} from "@/features/projects/model/types"
import { getProblemDetail } from "@/shared/api/problemDetails"
import { formatDateTime } from "@/shared/lib/date"

import { CreateProjectDialog } from "./CreateProjectDialog"
import { ProjectsToolbar } from "./ProjectsToolbar"

export function WorkspaceProjectsCard(props: WorkspaceProjectsCardProps) {
  const navigate = useNavigate()
  const qc = useQueryClient()

  const [projectStatus, setProjectStatus] = useState<ProjectStatus>("ACTIVE")
  const [projectQuery, setProjectQuery] = useState("")
  const [projectSort, setProjectSort] = useState<ProjectSort>("updatedAt,desc")
  const [projectsPage, setProjectsPage] = useState(0)
  const projectsSize = 10

  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [projectName, setProjectName] = useState("")

  const normalizedQ = projectQuery.trim()

  const projectsQuery = useQuery({
    queryKey: [
      "projects",
      props.workspaceId,
      projectStatus,
      projectsPage,
      projectsSize,
      normalizedQ,
      projectSort,
    ],
    queryFn: () =>
      getProjects({
        workspaceId: props.workspaceId,
        status: projectStatus,
        page: projectsPage,
        size: projectsSize,
        q: normalizedQ,
        sort: projectSort,
      }),
    enabled: !!props.workspaceId,
  })

  useEffect(() => {
    setProjectsPage(0)
  }, [projectStatus, projectSort, normalizedQ])

  const createProjectMutation = useMutation({
    mutationFn: () => createProject(props.workspaceId, { name: projectName.trim() }),
    onSuccess: async (created) => {
      toast.success("Project created")
      setProjectName("")
      setIsCreateOpen(false)

      await qc.invalidateQueries({ queryKey: ["projects", props.workspaceId] })

      navigate(`/workspaces/${props.workspaceId}/projects/${created.id}`)
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

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <CardTitle>Projects</CardTitle>

        <ProjectsToolbar
          query={projectQuery}
          onQueryChange={setProjectQuery}
          sort={projectSort}
          onSortChange={setProjectSort}
          canCreate={props.canCreate}
          onCreateClick={() => setIsCreateOpen(true)}
        />
      </CardHeader>

      <div className="px-6 pb-4">
        <Tabs
          value={projectStatus}
          onValueChange={(v) => {
            if (v === "ACTIVE" || v === "ARCHIVED") {
              setProjectStatus(v)
              setProjectsPage(0)
            }
          }}
        >
          <TabsList>
            <TabsTrigger value="ACTIVE">Active</TabsTrigger>
            <TabsTrigger value="ARCHIVED">Archived</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <CreateProjectDialog
        open={isCreateOpen}
        name={projectName}
        creating={createProjectMutation.isPending}
        onOpenChange={(open) => {
          setIsCreateOpen(open)
          if (open) setProjectName("")
        }}
        onNameChange={setProjectName}
        onCreate={() => createProjectMutation.mutate()}
      />

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
                to={`/workspaces/${props.workspaceId}/projects/${p.id}`}
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
  )
}
