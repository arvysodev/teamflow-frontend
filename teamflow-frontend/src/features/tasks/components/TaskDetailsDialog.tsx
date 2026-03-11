import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
                <p className="mt-1 whitespace-pre-wrap border rounded-md border-muted-foreground px-2 py-1">
                  {task.description?.trim() ? task.description : "—"}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <p className="text-muted-foreground">Current status</p>
                  <p className="mt-1">{task.status}</p>
                </div>

                <div>
                  <p className="text-muted-foreground">Current assignee</p>
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

              <div className="space-y-3 border-t pt-4">
                <p className="text-muted-foreground">Change status</p>

                <div className="flex gap-2">
                  <Select
                    value={props.selectedStatus}
                    onValueChange={(value) => {
                      if (value === "TODO" || value === "IN_PROGRESS" || value === "DONE") {
                        props.onSelectedStatusChange(value)
                      }
                    }}
                  >
                    <SelectTrigger className="w-[220px]">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="TODO">Todo</SelectItem>
                      <SelectItem value="IN_PROGRESS">In progress</SelectItem>
                      <SelectItem value="DONE">Done</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button
                    onClick={props.onSaveStatus}
                    disabled={props.changingStatus || props.selectedStatus === task.status}
                  >
                    {props.changingStatus ? "Saving…" : "Save status"}
                  </Button>
                </div>
              </div>

              <div className="space-y-3 border-t pt-4">
                <p className="text-muted-foreground">Assignment</p>

                <div className="flex gap-2">
                  <Select
                    value={props.selectedAssigneeId}
                    onValueChange={props.onSelectedAssigneeIdChange}
                  >
                    <SelectTrigger className="w-[280px]">
                      <SelectValue placeholder="Select assignee" />
                    </SelectTrigger>
                    <SelectContent>
                      {props.members.map((member) => (
                        <SelectItem key={member.userId} value={member.userId}>
                          {member.userId}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Button
                    onClick={props.onAssign}
                    disabled={props.assigning || props.selectedAssigneeId.trim().length === 0}
                  >
                    {props.assigning ? "Assigning…" : "Assign"}
                  </Button>

                  <Button
                    variant="outline"
                    onClick={props.onUnassign}
                    disabled={props.unassigning || !task.assigneeUserId}
                  >
                    {props.unassigning ? "Removing…" : "Unassign"}
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
