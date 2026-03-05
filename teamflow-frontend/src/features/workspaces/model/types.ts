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

export type WorkspaceHeaderProps = {
  workspaceId: string
  name: string
  status: string
  isOwner: boolean
  isClosed: boolean

  onRename: (name: string) => void
  renaming: boolean

  onClose: () => void
  closing: boolean

  onRestore: () => void
  restoring: boolean

  onLeave: () => void
  leaving: boolean
}
