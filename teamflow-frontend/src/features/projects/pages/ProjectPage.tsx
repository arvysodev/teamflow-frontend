import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import { toast } from "sonner"

import { useMemo, useState } from "react"

import { Link, useParams } from "react-router-dom"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getProjectById } from "@/features/projects/api/getProjectById"
import { createTask } from "@/features/tasks/api/createTask"
import { getTasks } from "@/features/tasks/api/getTasks"
import { TaskColumn } from "@/features/tasks/components/TaskColumn"
import { getProblemDetail } from "@/shared/api/problemDetails"
import { formatDateTime } from "@/shared/lib/date"
import { CreateTaskDialog } from "@/features/tasks/components/CreateTaskDialog"

export function ProjectPage() {
  const { workspaceId, projectId } = useParams()
  const qc = useQueryClient()

  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [taskTitle, setTaskTitle] = useState("")
  const [taskDescription, setTaskDescription] = useState("")

  const hasIds = Boolean(workspaceId && projectId)

  const projectQuery = useQuery({
    queryKey: ["project", workspaceId, projectId],
    queryFn: () => getProjectById(workspaceId!, projectId!),
    enabled: hasIds,
  })

  const tasksQuery = useQuery({
    queryKey: ["tasks", workspaceId, projectId],
    queryFn: () =>
      getTasks({
        workspaceId: workspaceId!,
        projectId: projectId!,
        page: 0,
        size: 100,
      }),
    enabled: hasIds,
  })

  const createTaskMutation = useMutation({
    mutationFn: () =>
      createTask({
        workspaceId: workspaceId!,
        projectId: projectId!,
        title: taskTitle.trim(),
        description: taskDescription.trim(),
      }),

    onSuccess: async () => {
      toast.success("Task created")
      setTaskTitle("")
      setTaskDescription("")
      setIsCreateOpen(false)

      await qc.invalidateQueries({ queryKey: ["tasks", workspaceId, projectId] })
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

  const tasks = tasksQuery.data?.items ?? []
  const todoTasks = useMemo(() => tasks.filter((t) => t.status === "TODO"), [tasks])
  const inProgressTasks = useMemo(() => tasks.filter((t) => t.status === "IN_PROGRESS"), [tasks])
  const doneTasks = useMemo(() => tasks.filter((t) => t.status === "DONE"), [tasks])

  if (!hasIds) {
    return <p className="text-sm text-destructive">Project or workspace id is missing.</p>
  }

  if (projectQuery.isPending) {
    return <p className="text-sm text-muted-foreground">Loading project…</p>
  }

  if (projectQuery.isError) {
    return <p className="text-sm text-destructive">Failed to load project.</p>
  }

  if (tasksQuery.isPending) {
    return <p className="text-sm text-muted-foreground">Loading tasks…</p>
  }

  if (tasksQuery.isError) {
    return <p className="text-sm text-destructive">Failed to load tasks.</p>
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

        <Button size="sm" onClick={() => setIsCreateOpen(true)}>
          Create task
        </Button>
      </div>

      <CreateTaskDialog
        open={isCreateOpen}
        title={taskTitle}
        description={taskDescription}
        creating={createTaskMutation.isPending}
        onOpenChange={(open) => {
          setIsCreateOpen(open)
          if (open) {
            setTaskTitle("")
            setTaskDescription("")
          }
        }}
        onTitleChange={setTaskTitle}
        onDescriptionChange={setTaskDescription}
        onCreate={() => createTaskMutation.mutate()}
      />

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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <TaskColumn title="Todo" tasks={todoTasks} />
        <TaskColumn title="In progress" tasks={inProgressTasks} />
        <TaskColumn title="Done" tasks={doneTasks} />
      </div>
    </div>
  )
}
