import type { Task, UpdateTaskParams } from "@/features/tasks/model/types"
import { http } from "@/shared/api/http"

export async function updateTask(params: UpdateTaskParams): Promise<Task> {
  const { workspaceId, projectId, taskId, title, description } = params

  const { data } = await http.patch<Task>(
    `/api/v1/workspaces/${workspaceId}/projects/${projectId}/tasks/${taskId}`,
    {
      title,
      description,
    },
  )

  return data
}
