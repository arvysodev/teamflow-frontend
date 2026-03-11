import type { Task, UnassignTaskParams } from "@/features/tasks/model/types"
import { http } from "@/shared/api/http"

export async function unassignTask(params: UnassignTaskParams): Promise<Task> {
  const { workspaceId, projectId, taskId } = params

  const { data } = await http.post<Task>(
    `/api/v1/workspaces/${workspaceId}/projects/${projectId}/tasks/${taskId}/unassign`,
  )

  return data
}
