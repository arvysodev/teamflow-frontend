import type { ProjectStatus } from "../model/types"

export type ProjectSort =
  | "updatedAt,desc"
  | "updatedAt,asc"
  | "createdAt,desc"
  | "createdAt,asc"
  | "name,asc"
  | "name,desc"

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
