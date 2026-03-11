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
  onOpenChange: (open: boolean) => void
}
