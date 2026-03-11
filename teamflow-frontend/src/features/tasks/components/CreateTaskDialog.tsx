import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

import type { CreateTaskDialogProps } from "../model/types"

export function CreateTaskDialog(props: CreateTaskDialogProps) {
  return (
    <Dialog open={props.open} onOpenChange={props.onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create task</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <Input
            value={props.title}
            onChange={(e) => props.onTitleChange(e.target.value)}
            placeholder="Task title"
            autoComplete="off"
          />

          <Textarea
            value={props.description}
            onChange={(e) => props.onDescriptionChange(e.target.value)}
            placeholder="Description"
            rows={5}
          />

          <Button
            onClick={props.onCreate}
            disabled={props.creating || props.title.trim().length === 0}
          >
            {props.creating ? "Creating…" : "Create"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
