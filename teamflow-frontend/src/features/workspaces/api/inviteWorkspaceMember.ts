import { http } from "@/shared/api/http"

import type { CreateWorkspaceInviteRequest, CreateWorkspaceInviteResponse } from "./types"

export async function inviteWorkspaceMember(
  workspaceId: string,
  req: CreateWorkspaceInviteRequest,
): Promise<CreateWorkspaceInviteResponse> {
  const { data } = await http.post<CreateWorkspaceInviteResponse>(
    `/api/v1/workspaces/invites/${workspaceId}`,
    req,
  )
  return data
}
