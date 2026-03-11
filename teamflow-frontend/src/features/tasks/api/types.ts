import type { Task, TaskStatus, TasksPageMeta } from "../model/types"

export type TasksPageResponse = {
  items: Task[]
  meta: TasksPageMeta
}

export type GetTasksParams = {
  workspaceId: string
  projectId: string
  page?: number
  size?: number
  status?: TaskStatus
}

export type CreateTaskRequest = {
  title: string
  description: string
}

export type CreateTaskParams = {
  workspaceId: string
  projectId: string
  title: string
  description: string
}
