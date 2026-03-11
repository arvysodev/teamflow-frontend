import type { AssignTaskParams, Task } from "@/features/tasks/model/types"
import { http } from "@/shared/api/http"

export async function assignTask(params: AssignTaskParams): Promise<Task> {
  const { workspaceId, projectId, taskId, userId } = params

  const { data } = await http.post<Task>(
    `/api/v1/workspaces/${workspaceId}/projects/${projectId}/tasks/${taskId}/assign`,
    { userId },
  )

  return data
}
