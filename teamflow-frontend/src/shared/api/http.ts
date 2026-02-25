import axios from "axios"

import { env } from "@/shared/lib/env"
import { getAccessToken } from "@/shared/lib/token"

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
