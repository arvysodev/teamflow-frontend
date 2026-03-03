import type { CreateWorkspaceRequest, Workspace } from "@/features/workspaces/model/types"
import { http } from "@/shared/api/http"

export async function createWorkspace(req: CreateWorkspaceRequest): Promise<Workspace> {
  const { data } = await http.post<Workspace>("/api/v1/workspaces", req)
  return data
}
