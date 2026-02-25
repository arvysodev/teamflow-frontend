import { http } from "@/shared/api/http"

import type { User } from "../types/User"

export async function getMe(): Promise<User> {
  const { data } = await http.get<User>("/api/v1/users/me")
  return data
}
