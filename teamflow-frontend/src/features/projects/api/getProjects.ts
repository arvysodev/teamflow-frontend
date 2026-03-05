import { http } from "@/shared/api/http"

import type { PageResponse, Project } from "../model/types"
import type { GetProjectsParams } from "./types"

export async function getProjectParams(params: GetProjectsParams): Promise<PageResponse<Project>> {
  const { workspaceId, page = 0, size = 10, status = "ACTIVE" } = params

  const { data } = await http.get(`/api/v1/workspaces/${workspaceId}/projects`, {
    params: { page, size, status },
  })

  return data
}
