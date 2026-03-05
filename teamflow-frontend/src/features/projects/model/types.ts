export type ProjectStatus = "ACTIVE" | "ARCHIVED"

export type Project = {
  id: string
  workspaceId: string
  name: string
  status: ProjectStatus | string
  createdBy: string
  createdAt: string
  updatedAt: string
}

export type PageMeta = {
  page: number
  size: number
  totalItems: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

export type PageResponse<T> = {
  items: T[]
  meta: PageMeta
}
