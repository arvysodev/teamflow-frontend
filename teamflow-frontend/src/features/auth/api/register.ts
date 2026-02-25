import { http } from "@/shared/api/http"

import type { RegisterRequest, RegisterResponse } from "./register.types"

export async function registerRequest(req: RegisterRequest): Promise<RegisterResponse> {
  const { data } = await http.post<RegisterResponse>("/api/v1/auth/register", req)
  return data
}
