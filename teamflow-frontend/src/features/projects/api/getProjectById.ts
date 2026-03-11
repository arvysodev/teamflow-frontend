import type { Project } from "@/features/projects/model/types"
import { http } from "@/shared/api/http"

export async function getProjectById(workspaceId: string, projectId: string): Promise<Project> {
  const { data } = await http.get<Project>(
    `/api/v1/workspaces/${workspaceId}/projects/${projectId}`,
  )

  return data
}
