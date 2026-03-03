import type { WorkspacesResponse } from "@/features/workspaces/model/types"
import { http } from "@/shared/api/http"

export type GetWorkspacesParams = {
  page?: number
  size?: number
}

export async function getWorkspaces(params: GetWorkspacesParams = {}): Promise<WorkspacesResponse> {
  const { page = 0, size = 10 } = params

  const { data } = await http.get<WorkspacesResponse>("/api/v1/workspaces", {
    params: { page, size },
  })

  return data
}
