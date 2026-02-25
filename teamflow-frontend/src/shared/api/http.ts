import axios from "axios"

import { emitLogout } from "@/shared/lib/authBus"
import { env } from "@/shared/lib/env"
import { navigate } from "@/shared/lib/navigation"
import { getAccessToken } from "@/shared/lib/token"
import { clearAccessToken } from "@/shared/lib/token"

export const http = axios.create({
  baseURL: env.apiUrl,
  headers: {
    "Content-Type": "application/json",
  },
})

http.interceptors.request.use((config) => {
  const token = getAccessToken()
  if (token) {
    config.headers = config.headers ?? {}
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

http.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error?.response?.status;

    if (status === 401) {
      clearAccessToken();
      emitLogout();
      navigate("/login");
    }

    return Promise.reject(error);
  }
);
