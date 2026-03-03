import { http } from "@/shared/api/http"

export async function restoreWorkspace(id: string): Promise<void> {
  await http.post(`/api/v1/workspaces/${id}/restore`)
}
