import type { Project } from "@/features/projects/model/types"
import { http } from "@/shared/api/http"

import type { CreateProjectRequest } from "./types"

export async function createProject(
  workspaceId: string,
  req: CreateProjectRequest,
): Promise<Project> {
  const { data } = await http.post<Project>(`/api/v1/workspaces/${workspaceId}/projects`, req)

  return data
}
