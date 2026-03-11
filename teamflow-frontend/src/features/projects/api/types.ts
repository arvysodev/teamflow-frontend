import type { PageMeta, ProjectSort, ProjectStatus } from "../model/types"

export type GetProjectsParams = {
  workspaceId: string
  status: ProjectStatus
  page: number
  size: number
  q?: string
  sort?: ProjectSort
}

export type CreateProjectRequest = {
  name: string
}

export type PageResponse<T> = {
  items: T[]
  meta: PageMeta
}

export type RenameProjectRequest = {
  name: string
}
