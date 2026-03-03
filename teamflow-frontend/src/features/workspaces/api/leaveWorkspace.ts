import { http } from "@/shared/api/http"

export async function leaveWorkspace(id: string): Promise<void> {
  await http.delete(`/api/v1/workspaces/${id}/leave`)
}
