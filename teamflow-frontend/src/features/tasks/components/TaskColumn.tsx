import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { TaskColumnProps } from "@/features/tasks/model/types"
import { formatDateTime } from "@/shared/lib/date"

export function TaskColumn(props: TaskColumnProps) {
  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle className="text-base">{props.title}</CardTitle>
      </CardHeader>

      <CardContent className="space-y-3">
        {props.tasks.length === 0 && <p className="text-sm text-muted-foreground">No tasks.</p>}

        {props.tasks.map((task) => (
          <Card key={task.id} className="hover:bg-muted/40 transition">
            <CardContent className="p-4">
              <p className="font-medium">{task.title}</p>

              {task.description && (
                <p className="text-sm text-muted-foreground line-clamp-3">{task.description}</p>
              )}

              <div className="text-xs text-muted-foreground space-y-1">
                <p>Updated: {formatDateTime(task.updatedAt)}</p>
                <p>Assignee: {task.assigneeUserId ?? "—"}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </CardContent>
    </Card>
  )
}
