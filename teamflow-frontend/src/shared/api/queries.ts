import { useQuery } from "@tanstack/react-query"

import { getMe } from "@/shared/api/users"

export function useMeQuery() {
  return useQuery({
    queryKey: ["me"],
    queryFn: getMe,
  })
}
