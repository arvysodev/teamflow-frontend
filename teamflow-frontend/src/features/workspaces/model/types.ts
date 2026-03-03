export type WorkspaceStatus = "ACTIVE" | "ARCHIVED"; 

export type Workspace = {
  id: string;
  name: string;
  status: WorkspaceStatus;
  createdAt: string;
  updatedAt: string;
};