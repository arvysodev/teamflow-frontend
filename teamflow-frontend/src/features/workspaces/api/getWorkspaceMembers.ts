import { http } from "@/shared/api/http"

import type { WorkspaceMember } from "../model/types"

export async function getWorkspaceMembers(workspaceId: string): Promise<WorkspaceMember[]> {
  const { data } = await http.get<WorkspaceMember[]>(`/api/v1/workspaces/${workspaceId}/members`)
  return data
}
