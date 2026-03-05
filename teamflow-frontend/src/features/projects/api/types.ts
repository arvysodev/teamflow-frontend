import type { ProjectStatus } from "../model/types"

export type GetProjectsParams = {
  workspaceId: string
  page?: number
  size?: number
  status?: ProjectStatus
}
