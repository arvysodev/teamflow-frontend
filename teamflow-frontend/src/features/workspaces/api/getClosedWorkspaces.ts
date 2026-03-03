import { http } from "@/shared/api/http"

import type { WorkspacesResponse } from "./types"

export type GetWorkspacesParams = {
  page?: number
  size?: number
}

export async function getClosedWorkspaces(
  params: GetWorkspacesParams = {},
): Promise<WorkspacesResponse> {
  const { page = 0, size = 10 } = params

  const { data } = await http.get<WorkspacesResponse>("/api/v1/workspaces/closed", {
    params: { page, size },
  })

  return data
}
