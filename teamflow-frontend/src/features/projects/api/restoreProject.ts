import { http } from "@/shared/api/http"

export async function restoreProject(workspaceId: string, projectId: string): Promise<void> {
  await http.post(`/api/v1/workspaces/${workspaceId}/projects/${projectId}/restore`)
}
