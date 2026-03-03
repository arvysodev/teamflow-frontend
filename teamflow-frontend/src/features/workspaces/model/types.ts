export type WorkspaceStatus = "CLOSED" | "ARCHIVED"

export type Workspace = {
  id: string
  name: string
  status: WorkspaceStatus
  createdAt: string
  updatedAt: string
}

export type WorkspaceMemberRole = "OWNER" | "MEMBER"

export type WorkspaceMember = {
  userId: string
  role: WorkspaceMemberRole
  joinedAt: string
}

export type WorkspaceFilter = "active" | "closed"
