import type { ChangeTaskStatusParams, Task } from "@/features/tasks/model/types"
import { http } from "@/shared/api/http"

export async function changeTaskStatus(params: ChangeTaskStatusParams): Promise<Task> {
  const { workspaceId, projectId, taskId, status } = params

  const { data } = await http.post<Task>(
    `/api/v1/workspaces/${workspaceId}/projects/${projectId}/tasks/${taskId}/status`,
    { status },
  )

  return data
}
