import type { Task } from "@/features/tasks/model/types"
import { http } from "@/shared/api/http"

import type { CreateTaskParams } from "./types"

export async function createTask(params: CreateTaskParams): Promise<Task> {
  const { workspaceId, projectId, title, description } = params

  const { data } = await http.post<Task>(
    `/api/v1/workspaces/${workspaceId}/projects/${projectId}/tasks`,
    {
      title,
      description,
    },
  )

  return data
}
