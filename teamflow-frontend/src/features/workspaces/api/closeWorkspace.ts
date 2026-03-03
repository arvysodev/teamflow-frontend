import { http } from "@/shared/api/http"

export async function closeWorkspace(id: string): Promise<void> {
  await http.post(`/api/v1/workspaces/${id}/close`)
}
