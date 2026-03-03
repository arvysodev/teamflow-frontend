import type { Workspace } from "@/features/workspaces/model/types"
import { http } from "@/shared/api/http"

export async function getWorkspaceById(id: string): Promise<Workspace> {
  const { data } = await http.get<Workspace>(`/api/v1/workspaces/${id}`)
  return data
}
