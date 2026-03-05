import { useState } from "react"

import { Link } from "react-router-dom"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

import type { WorkspaceHeaderProps } from "../model/types"

export function WorkspaceHeader(props: WorkspaceHeaderProps) {
  const [newName, setNewName] = useState("")

  return (
    <div className="flex items-start justify-between gap-4">
      <div className="min-w-0">
        <h2 className="text-2xl font-semibold truncate">{props.name}</h2>
        <p className="text-sm text-muted-foreground">{props.status}</p>
      </div>

      <div className="flex items-center gap-2">
        <Button asChild variant="secondary" size="sm">
          <Link to="members">Members</Link>
        </Button>

        {props.isOwner && (
          <Dialog
            onOpenChange={(open) => {
              if (open) setNewName(props.name)
            }}
          >
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                Rename
              </Button>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>Rename workspace</DialogTitle>
              </DialogHeader>

              <div className="space-y-3">
                <Input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Workspace name"
                />

                <Button
                  onClick={() => props.onRename(newName.trim())}
                  disabled={props.renaming || newName.trim().length === 0}
                >
                  {props.renaming ? "Saving…" : "Save"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}

        {props.isOwner &&
          (!props.isClosed ? (
            <Button variant="outline" size="sm" onClick={props.onClose} disabled={props.closing}>
              {props.closing ? "Closing…" : "Close"}
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={props.onRestore}
              disabled={props.restoring}
            >
              {props.restoring ? "Restoring…" : "Restore"}
            </Button>
          ))}

        <Button variant="destructive" size="sm" onClick={props.onLeave} disabled={props.leaving}>
          {props.leaving ? "Leaving…" : "Leave"}
        </Button>
      </div>
    </div>
  )
}
