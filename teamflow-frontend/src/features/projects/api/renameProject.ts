import type { Project } from "@/features/projects/model/types"
import { http } from "@/shared/api/http"

import type { RenameProjectRequest } from "./types"

export async function renameProject(
  workspaceId: string,
  projectId: string,
  req: RenameProjectRequest,
): Promise<Project> {
  const { data } = await http.patch<Project>(
    `/api/v1/workspaces/${workspaceId}/projects/${projectId}`,
    req,
  )

  return data
}
