export type ProblemDetails = {
  title?: string
  detail?: string
  status?: number
  type?: string
  instance?: string
}

export function getProblemDetail(data: unknown): ProblemDetails | null {
  if (!data || typeof data !== "object") return null
  const d = data as Record<string, unknown>
  return {
    type: typeof d.type === "string" ? d.type : undefined,
    title: typeof d.title === "string" ? d.title : undefined,
    status: typeof d.status === "number" ? d.status : undefined,
    detail: typeof d.detail === "string" ? d.detail : undefined,
    instance: typeof d.instance === "string" ? d.instance : undefined,
  }
}
