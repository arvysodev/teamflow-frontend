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

export type ProjectSort =
  | "updatedAt,desc"
  | "updatedAt,asc"
  | "createdAt,desc"
  | "createdAt,asc"
  | "name,asc"
  | "name,desc"

export type WorkspaceProjectsCardProps = {
  workspaceId: string
  canCreate: boolean
}

export type ProjectsToolbarProps = {
  query: string
  onQueryChange: (v: string) => void

  sort: ProjectSort
  onSortChange: (v: ProjectSort) => void

  canCreate: boolean
  onCreateClick: () => void
}

export type CreateProjectDialogProps = {
  open: boolean
  name: string
  creating: boolean

  onOpenChange: (open: boolean) => void
  onNameChange: (v: string) => void
  onCreate: () => void
}
