import { http } from "@/shared/api/http";
import type { LoginRequest, LoginResponse } from "./types";

export async function login(req: LoginRequest): Promise<LoginResponse> {
  const { data } = await http.post<LoginResponse>("/api/v1/auth/login", req);
  return data;
}
