import { http } from "@/shared/api/http"

import type { Project } from "../model/types"
import type { GetProjectsParams, PageResponse } from "./types"

export async function getProjects(params: GetProjectsParams): Promise<PageResponse<Project>> {
  const { workspaceId, page = 0, size = 10, status = "ACTIVE", q, sort } = params

  const { data } = await http.get(`/api/v1/workspaces/${workspaceId}/projects`, {
    params: { page, size, status, q, sort },
  })

  return data
}
