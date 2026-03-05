import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

import type { CreateProjectDialogProps } from "../model/types"

export function CreateProjectDialog(props: CreateProjectDialogProps) {
  return (
    <Dialog
      open={props.open}
      onOpenChange={(open) => {
        props.onOpenChange(open)
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create project</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <Input
            value={props.name}
            onChange={(e) => props.onNameChange(e.target.value)}
            placeholder="Project name"
            autoComplete="off"
          />

          <Button
            onClick={props.onCreate}
            disabled={props.creating || props.name.trim().length === 0}
          >
            {props.creating ? "Creating…" : "Create"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
