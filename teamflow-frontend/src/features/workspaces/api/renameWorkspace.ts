import type { Workspace } from "@/features/workspaces/model/types"
import { http } from "@/shared/api/http"

import type { RenameWorkspaceRequest } from "./types"

export async function renameWorkspace(id: string, req: RenameWorkspaceRequest): Promise<Workspace> {
  const { data } = await http.patch<Workspace>(`/api/v1/workspaces/${id}`, req)
  return data
}
