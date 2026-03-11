import { http } from "@/shared/api/http"

export async function removeWorkspaceMember(workspaceId: string, userId: string): Promise<void> {
  await http.delete(`/api/v1/workspaces/${workspaceId}/members/${userId}`)
}
