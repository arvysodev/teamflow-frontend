import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatDateTime } from "@/shared/lib/date"

import type { WorkspaceDetailsCardProps } from "../model/types"

export function WorkspaceDetailsCard(props: WorkspaceDetailsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Details</CardTitle>
      </CardHeader>

      <CardContent className="space-y-2">
        <p className="text-sm">
          <span className="text-muted-foreground">Created:</span> {formatDateTime(props.createdAt)}
        </p>
        <p className="text-sm">
          <span className="text-muted-foreground">Updated:</span> {formatDateTime(props.updatedAt)}
        </p>
        <p className="text-sm">
          <span className="text-muted-foreground">My role:</span>{" "}
          {props.roleLoading ? "Loading…" : (props.myRole ?? "—")}
        </p>
      </CardContent>
    </Card>
  )
}
