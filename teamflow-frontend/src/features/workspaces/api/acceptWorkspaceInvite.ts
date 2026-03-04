import { http } from "@/shared/api/http"

import type { AcceptWorkspaceInviteRequest } from "./types"

export async function acceptWorkspaceInvite(req: AcceptWorkspaceInviteRequest): Promise<void> {
  await http.post("/api/v1/workspaces/invites/accept", req)
}
