import type { WorkspaceMember } from "@/features/workspaces/model/types"

export type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE"

export type Task = {
  id: string
  projectId: string
  title: string
  description: string | null
  status: TaskStatus | string
  assigneeUserId: string | null
  createdBy: string
  createdAt: string
  updatedAt: string
}

export type TasksPageMeta = {
  page: number
  size: number
  totalItems: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

export type TaskColumnProps = {
  title: string
  tasks: Task[]
  onTaskClick: (task: Task) => void
}

export type CreateTaskDialogProps = {
  open: boolean
  title: string
  description: string
  creating: boolean

  onOpenChange: (open: boolean) => void
  onTitleChange: (value: string) => void
  onDescriptionChange: (value: string) => void
  onCreate: () => void
}

export type ChangeTaskStatusParams = {
  workspaceId: string
  projectId: string
  taskId: string
  status: TaskStatus
}

export type TaskCardProps = {
  task: Task
  onClick: () => void
}

export type TaskDetailsDialogProps = {
  open: boolean
  task: Task | null
  members: WorkspaceMember[]
  onOpenChange: (open: boolean) => void

  editing: boolean
  draftTitle: string
  draftDescription: string
  onDraftTitleChange: (value: string) => void
  onDraftDescriptionChange: (value: string) => void
  onStartEdit: () => void
  onCancelEdit: () => void
  onSaveEdit: () => void
  savingEdit: boolean

  selectedStatus: TaskStatus
  onSelectedStatusChange: (status: TaskStatus) => void
  onSaveStatus: () => void
  changingStatus: boolean

  selectedAssigneeId: string
  onSelectedAssigneeIdChange: (userId: string) => void
  onAssign: () => void
  assigning: boolean

  onUnassign: () => void
  unassigning: boolean
}

export type AssignTaskParams = {
  workspaceId: string
  projectId: string
  taskId: string
  userId: string
}

export type UnassignTaskParams = {
  workspaceId: string
  projectId: string
  taskId: string
}

export type UpdateTaskParams = {
  workspaceId: string
  projectId: string
  taskId: string
  title: string
  description: string
}
