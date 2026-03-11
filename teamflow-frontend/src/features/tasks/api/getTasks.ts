import { http } from "@/shared/api/http"

import type { GetTasksParams, TasksPageResponse } from "./types"

export async function getTasks(params: GetTasksParams): Promise<TasksPageResponse> {
  const { workspaceId, projectId, page = 0, size = 100, status } = params

  const { data } = await http.get<TasksPageResponse>(
    `/api/v1/workspaces/${workspaceId}/projects/${projectId}/tasks`,
    {
      params: {
        page,
        size,
        status,
      },
    },
  )

  return data
}
