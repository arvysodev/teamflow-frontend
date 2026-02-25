import { http } from "@/shared/api/http"

import type { VerifyEmailRequest } from "./verifyEmail.types"

export async function verifyEmailRequest(req: VerifyEmailRequest): Promise<void> {
  await http.post("/api/v1/auth/verify-email", req)
}
