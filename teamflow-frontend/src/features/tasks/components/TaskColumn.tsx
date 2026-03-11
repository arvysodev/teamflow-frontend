import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { TaskColumnProps } from "@/features/tasks/model/types"

import { TaskCard } from "./TaskCard"

export function TaskColumn(props: TaskColumnProps) {
  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle className="text-base">{props.title}</CardTitle>
      </CardHeader>

      <CardContent className="space-y-3">
        {props.tasks.length === 0 && <p className="text-sm text-muted-foreground">No tasks.</p>}

        {props.tasks.map((task) => (
          <TaskCard key={task.id} task={task} onClick={() => props.onTaskClick(task)} />
        ))}
      </CardContent>
    </Card>
  )
}
