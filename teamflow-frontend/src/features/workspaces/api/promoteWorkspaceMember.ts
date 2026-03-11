import { http } from "@/shared/api/http"

export async function promoteWorkspaceMember(workspaceId: string, userId: string): Promise<void> {
  await http.post(`/api/v1/workspaces/${workspaceId}/members/${userId}/promote`)
}
