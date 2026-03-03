import type { Workspace } from "@/features/workspaces/model/types"
import { http } from "@/shared/api/http"
import type { PageResponse } from "@/shared/api/page"

export type GetWorkspacesParams = {
  page?: number
  size?: number
}

export async function getWorkspaces(params: GetWorkspacesParams = {}) {
  const { page = 0, size = 20 } = params

  const { data } = await http.get<PageResponse<Workspace>>("/api/v1/workspaces", {
    params: { page, size },
  })

  return data
}
