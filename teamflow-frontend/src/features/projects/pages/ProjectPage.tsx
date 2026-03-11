import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import { toast } from "sonner"

import { useMemo, useState } from "react"

import { Link, useParams } from "react-router-dom"

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
import { archiveProject } from "@/features/projects/api/archiveProject"
import { getProjectById } from "@/features/projects/api/getProjectById"
import { renameProject } from "@/features/projects/api/renameProject"
import { restoreProject } from "@/features/projects/api/restoreProject"
import { assignTask } from "@/features/tasks/api/assignTask"
import { changeTaskStatus } from "@/features/tasks/api/changeTaskStatus"
import { createTask } from "@/features/tasks/api/createTask"
import { getTasks } from "@/features/tasks/api/getTasks"
import { unassignTask } from "@/features/tasks/api/unassignTask"
import { updateTask } from "@/features/tasks/api/updateTask"
import { CreateTaskDialog } from "@/features/tasks/components/CreateTaskDialog"
import { TaskColumn } from "@/features/tasks/components/TaskColumn"
import { TaskDetailsDialog } from "@/features/tasks/components/TaskDetailsDialog"
import type { Task, TaskStatus } from "@/features/tasks/model/types"
import { getWorkspaceMembers } from "@/features/workspaces/api/getWorkspaceMembers"
import { getProblemDetail } from "@/shared/api/problemDetails"
import { formatDateTime } from "@/shared/lib/date"

export function ProjectPage() {
  const { workspaceId, projectId } = useParams()
  const qc = useQueryClient()

  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [taskTitle, setTaskTitle] = useState("")
  const [taskDescription, setTaskDescription] = useState("")
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState<TaskStatus>("TODO")
  const [selectedAssigneeId, setSelectedAssigneeId] = useState("")
  const [isEditingTask, setIsEditingTask] = useState(false)
  const [draftTaskTitle, setDraftTaskTitle] = useState("")
  const [draftTaskDescription, setDraftTaskDescription] = useState("")
  const [isRenameOpen, setIsRenameOpen] = useState(false)
  const [newProjectName, setNewProjectName] = useState("")

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

  const membersQuery = useQuery({
    queryKey: ["workspaceMembers", workspaceId],
    queryFn: () => getWorkspaceMembers(workspaceId!),
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

  const changeStatusMutation = useMutation({
    mutationFn: () =>
      changeTaskStatus({
        workspaceId: workspaceId!,
        projectId: projectId!,
        taskId: selectedTask!.id,
        status: selectedStatus,
      }),

    onSuccess: async () => {
      toast.success("Task status updated")
      await qc.invalidateQueries({ queryKey: ["tasks", workspaceId, projectId] })
      setIsTaskDialogOpen(false)
      setSelectedTask(null)
    },

    onError: (error) => {
      if (axios.isAxiosError(error)) {
        const problem = getProblemDetail(error.response?.data)
        if (problem?.detail) {
          toast.error("Status change failed", { description: problem.detail })
          return
        }
      }
      toast.error("Status change failed")
    },
  })

  const assignMutation = useMutation({
    mutationFn: () =>
      assignTask({
        workspaceId: workspaceId!,
        projectId: projectId!,
        taskId: selectedTask!.id,
        userId: selectedAssigneeId,
      }),

    onSuccess: async () => {
      toast.success("Task assigned")
      await qc.invalidateQueries({ queryKey: ["tasks", workspaceId, projectId] })
      setIsTaskDialogOpen(false)
      setSelectedTask(null)
    },

    onError: (error) => {
      if (axios.isAxiosError(error)) {
        const problem = getProblemDetail(error.response?.data)
        if (problem?.detail) {
          toast.error("Assign failed", { description: problem.detail })
          return
        }
      }
      toast.error("Assign failed")
    },
  })

  const unassignMutation = useMutation({
    mutationFn: () =>
      unassignTask({
        workspaceId: workspaceId!,
        projectId: projectId!,
        taskId: selectedTask!.id,
      }),

    onSuccess: async () => {
      toast.success("Task unassigned")
      await qc.invalidateQueries({ queryKey: ["tasks", workspaceId, projectId] })
      setIsTaskDialogOpen(false)
      setSelectedTask(null)
    },

    onError: (error) => {
      if (axios.isAxiosError(error)) {
        const problem = getProblemDetail(error.response?.data)
        if (problem?.detail) {
          toast.error("Unassign failed", { description: problem.detail })
          return
        }
      }
      toast.error("Unassign failed")
    },
  })

  const updateTaskMutation = useMutation({
    mutationFn: () =>
      updateTask({
        workspaceId: workspaceId!,
        projectId: projectId!,
        taskId: selectedTask!.id,
        title: draftTaskTitle.trim(),
        description: draftTaskDescription.trim(),
      }),

    onSuccess: async () => {
      toast.success("Task updated")
      await qc.invalidateQueries({ queryKey: ["tasks", workspaceId, projectId] })

      setIsEditingTask(false)
      setIsTaskDialogOpen(false)
      setSelectedTask(null)
      setDraftTaskTitle("")
      setDraftTaskDescription("")
    },

    onError: (error) => {
      if (axios.isAxiosError(error)) {
        const problem = getProblemDetail(error.response?.data)
        if (problem?.detail) {
          toast.error("Update failed", { description: problem.detail })
          return
        }
      }

      toast.error("Update failed")
    },
  })

  const renameProjectMutation = useMutation({
    mutationFn: () => renameProject(workspaceId!, projectId!, { name: newProjectName.trim() }),

    onSuccess: async () => {
      toast.success("Project renamed")
      setIsRenameOpen(false)
      setNewProjectName("")

      await qc.invalidateQueries({ queryKey: ["project", workspaceId, projectId] })
      await qc.invalidateQueries({ queryKey: ["projects", workspaceId] })
    },

    onError: (error) => {
      if (axios.isAxiosError(error)) {
        const problem = getProblemDetail(error.response?.data)
        if (problem?.detail) {
          toast.error("Rename failed", { description: problem.detail })
          return
        }
      }

      toast.error("Rename failed")
    },
  })

  const archiveProjectMutation = useMutation({
    mutationFn: () => archiveProject(workspaceId!, projectId!),

    onSuccess: async () => {
      toast.success("Project archived")

      await qc.invalidateQueries({ queryKey: ["project", workspaceId, projectId] })
      await qc.invalidateQueries({ queryKey: ["projects", workspaceId] })
    },

    onError: (error) => {
      if (axios.isAxiosError(error)) {
        const problem = getProblemDetail(error.response?.data)
        if (problem?.detail) {
          toast.error("Archive failed", { description: problem.detail })
          return
        }
      }

      toast.error("Archive failed")
    },
  })

  const restoreProjectMutation = useMutation({
    mutationFn: () => restoreProject(workspaceId!, projectId!),

    onSuccess: async () => {
      toast.success("Project restored")

      await qc.invalidateQueries({ queryKey: ["project", workspaceId, projectId] })
      await qc.invalidateQueries({ queryKey: ["projects", workspaceId] })
    },

    onError: (error) => {
      if (axios.isAxiosError(error)) {
        const problem = getProblemDetail(error.response?.data)
        if (problem?.detail) {
          toast.error("Restore failed", { description: problem.detail })
          return
        }
      }

      toast.error("Restore failed")
    },
  })

  const tasks = tasksQuery.data?.items ?? []
  const todoTasks = useMemo(() => tasks.filter((t) => t.status === "TODO"), [tasks])
  const inProgressTasks = useMemo(() => tasks.filter((t) => t.status === "IN_PROGRESS"), [tasks])
  const doneTasks = useMemo(() => tasks.filter((t) => t.status === "DONE"), [tasks])

  if (!hasIds) {
    return <p className="text-sm text-destructive">Project or workspace id is missing.</p>
  }

  if (projectQuery.isPending || tasksQuery.isPending || membersQuery.isPending) {
    return <p className="text-sm text-muted-foreground">Loading…</p>
  }

  if (projectQuery.isError) {
    return <p className="text-sm text-destructive">Failed to load project.</p>
  }

  if (tasksQuery.isError) {
    return <p className="text-sm text-destructive">Failed to load tasks.</p>
  }

  if (membersQuery.isError) {
    return <p className="text-sm text-destructive">Failed to load members.</p>
  }

  const project = projectQuery.data
  const isArchived = project.status === "ARCHIVED"

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

        <div className="flex items-center gap-2">
          <Button size="sm" onClick={() => setIsCreateOpen(true)}>
            Create task
          </Button>

          <Dialog
            open={isRenameOpen}
            onOpenChange={(open) => {
              setIsRenameOpen(open)
              if (open) {
                setNewProjectName(project.name)
              }
            }}
          >
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                Rename
              </Button>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>Rename project</DialogTitle>
              </DialogHeader>

              <div className="space-y-3">
                <Input
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  placeholder="Project name"
                  autoComplete="off"
                />

                <Button
                  onClick={() => renameProjectMutation.mutate()}
                  disabled={renameProjectMutation.isPending || newProjectName.trim().length === 0}
                >
                  {renameProjectMutation.isPending ? "Saving…" : "Save"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {!isArchived ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => archiveProjectMutation.mutate()}
              disabled={archiveProjectMutation.isPending}
            >
              {archiveProjectMutation.isPending ? "Archiving…" : "Archive"}
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => restoreProjectMutation.mutate()}
              disabled={restoreProjectMutation.isPending}
            >
              {restoreProjectMutation.isPending ? "Restoring…" : "Restore"}
            </Button>
          )}
        </div>
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
        <TaskColumn
          title="Todo"
          tasks={todoTasks}
          onTaskClick={(task) => {
            setSelectedTask(task)
            setSelectedStatus(task.status as TaskStatus)
            setSelectedAssigneeId(task.assigneeUserId ?? "")
            setDraftTaskTitle(task.title)
            setDraftTaskDescription(task.description ?? "")
            setIsEditingTask(false)
            setIsTaskDialogOpen(true)
          }}
        />

        <TaskColumn
          title="In progress"
          tasks={inProgressTasks}
          onTaskClick={(task) => {
            setSelectedTask(task)
            setSelectedStatus(task.status as TaskStatus)
            setSelectedAssigneeId(task.assigneeUserId ?? "")
            setDraftTaskTitle(task.title)
            setDraftTaskDescription(task.description ?? "")
            setIsEditingTask(false)
            setIsTaskDialogOpen(true)
          }}
        />

        <TaskColumn
          title="Done"
          tasks={doneTasks}
          onTaskClick={(task) => {
            setSelectedTask(task)
            setSelectedStatus(task.status as TaskStatus)
            setSelectedAssigneeId(task.assigneeUserId ?? "")
            setDraftTaskTitle(task.title)
            setDraftTaskDescription(task.description ?? "")
            setIsEditingTask(false)
            setIsTaskDialogOpen(true)
          }}
        />
      </div>

      <TaskDetailsDialog
        open={isTaskDialogOpen}
        task={selectedTask}
        members={membersQuery.data ?? []}
        onOpenChange={(open) => {
          setIsTaskDialogOpen(open)

          if (!open) {
            setSelectedTask(null)
            setSelectedAssigneeId("")
            setSelectedStatus("TODO")
            setIsEditingTask(false)
            setDraftTaskTitle("")
            setDraftTaskDescription("")
          }
        }}
        editing={isEditingTask}
        draftTitle={draftTaskTitle}
        draftDescription={draftTaskDescription}
        onDraftTitleChange={setDraftTaskTitle}
        onDraftDescriptionChange={setDraftTaskDescription}
        onStartEdit={() => setIsEditingTask(true)}
        onCancelEdit={() => {
          setIsEditingTask(false)
          setDraftTaskTitle(selectedTask?.title ?? "")
          setDraftTaskDescription(selectedTask?.description ?? "")
        }}
        onSaveEdit={() => updateTaskMutation.mutate()}
        savingEdit={updateTaskMutation.isPending}
        selectedStatus={selectedStatus}
        onSelectedStatusChange={setSelectedStatus}
        onSaveStatus={() => changeStatusMutation.mutate()}
        changingStatus={changeStatusMutation.isPending}
        selectedAssigneeId={selectedAssigneeId}
        onSelectedAssigneeIdChange={setSelectedAssigneeId}
        onAssign={() => assignMutation.mutate()}
        assigning={assignMutation.isPending}
        onUnassign={() => unassignMutation.mutate()}
        unassigning={unassignMutation.isPending}
      />
    </div>
  )
}
