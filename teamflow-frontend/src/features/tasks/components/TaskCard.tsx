import { Card, CardContent } from "@/components/ui/card"
import type { TaskCardProps } from "@/features/tasks/model/types"
import { formatDateTime } from "@/shared/lib/date"

export function TaskCard(props: TaskCardProps) {
  const { task } = props

  return (
    <Card className="cursor-pointer hover:bg-muted transition" onClick={props.onClick}>
      <CardContent className="p-4 space-y-3">
        <div className="space-y-1">
          <p className="font-medium">{task.title}</p>
        </div>

        <div className="text-xs text-muted-foreground space-y-1">
          <p>Assignee: {task.assigneeUserId ?? "—"}</p>
          <p>Created: {formatDateTime(task.createdAt)}</p>
          <p>Updated: {formatDateTime(task.updatedAt)}</p>
        </div>
      </CardContent>
    </Card>
  )
}
