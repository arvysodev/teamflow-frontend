import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import type { TaskDetailsDialogProps } from "@/features/tasks/model/types"
import { formatDateTime } from "@/shared/lib/date"

export function TaskDetailsDialog(props: TaskDetailsDialogProps) {
  const task = props.task

  return (
    <Dialog open={props.open} onOpenChange={props.onOpenChange}>
      <DialogContent>
        {!task ? null : (
          <>
            <DialogHeader>
              <DialogTitle>{task.title}</DialogTitle>
            </DialogHeader>

            <div className="space-y-4 text-sm">
              <div>
                <p className="text-muted-foreground">Description</p>
                <p className="mt-1 whitespace-pre-wrap border rounded-sm border-muted-foreground px-2 py-1">
                  {task.description?.trim() ? task.description : "—"}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <p className="text-muted-foreground">Status</p>
                  <p className="mt-1">{task.status}</p>
                </div>

                <div>
                  <p className="text-muted-foreground">Assignee</p>
                  <p className="mt-1">{task.assigneeUserId ?? "—"}</p>
                </div>

                <div>
                  <p className="text-muted-foreground">Created</p>
                  <p className="mt-1">{formatDateTime(task.createdAt)}</p>
                </div>

                <div>
                  <p className="text-muted-foreground">Updated</p>
                  <p className="mt-1">{formatDateTime(task.updatedAt)}</p>
                </div>

                <div>
                  <p className="text-muted-foreground">Created by</p>
                  <p className="mt-1">{task.createdBy}</p>
                </div>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
