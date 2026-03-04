import type { Workspace } from "../model/types"

export type WorkspacesMeta = {
  page: number
  size: number
  totalItems: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

export type WorkspacesResponse = {
  items: Workspace[]
  meta: WorkspacesMeta
}

export type RenameWorkspaceRequest = {
  name: string
}

export type CreateWorkspaceRequest = {
  name: string
}

export type CreateWorkspaceInviteRequest = {
  email: string
}

export type CreateWorkspaceInviteResponse = {
  message: string
}

export type AcceptWorkspaceInviteRequest = {
  rawToken: string
}
