import { useMutation, useQuery } from "@tanstack/react-query"
import axios from "axios"
import { toast } from "sonner"

import { useState } from "react"

import { useParams } from "react-router-dom"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { getProblemDetail } from "@/shared/api/problemDetails"
import { useMeQuery } from "@/shared/api/queries"
import { formatDateTime } from "@/shared/lib/date"

import { getWorkspaceMembers } from "../api/getWorkspaceMembers"
import { inviteWorkspaceMember } from "../api/inviteWorkspaceMember"

export function WorkspaceMembersPage() {
  const { workspaceId } = useParams()
  const meQuery = useMeQuery()
  const [inviteEmail, setInviteEmail] = useState("")

  const membersQuery = useQuery({
    queryKey: ["workspaceMembers", workspaceId],
    queryFn: () => getWorkspaceMembers(workspaceId!),
    enabled: !!workspaceId,
  })

  const inviteMutation = useMutation({
    mutationFn: () => inviteWorkspaceMember(workspaceId!, { email: inviteEmail.trim() }),
    onSuccess: (res) => {
      toast.success(res.message || "Invitation sent")
      setInviteEmail("")
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        const problem = getProblemDetail(error.response?.data)

        if (problem?.detail) {
          toast.error("Invite failed", { description: problem.detail })
          return
        }
      }

      toast.error("Invite failed")
    },
  })

  if (!workspaceId) return <p>Workspace id is missing.</p>

  if (membersQuery.isPending) return <p>Loading members…</p>
  if (membersQuery.isError) return <p>Failed to load members.</p>

  const members = membersQuery.data
  const myRole = meQuery.data ? members.find((m) => m.userId === meQuery.data!.id)?.role : undefined
  const isOwner = myRole === "OWNER"

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-semibold">Members</h2>
        <p className="text-sm text-muted-foreground">{myRole ? `Your role: ${myRole}` : " "}</p>
      </div>

      {isOwner && (
        <Dialog
          onOpenChange={(open) => {
            if (open) setInviteEmail("")
          }}
        >
          <DialogTrigger asChild>
            <Button size="sm">Invite member</Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Invite member</DialogTitle>
            </DialogHeader>

            <div className="space-y-3">
              <Input
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="Email"
                autoComplete="email"
              />

              <Button
                onClick={() => inviteMutation.mutate()}
                disabled={inviteMutation.isPending || inviteEmail.trim().length === 0}
              >
                {inviteMutation.isPending ? "Sending…" : "Send invite"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Workspace members</CardTitle>
        </CardHeader>

        <CardContent className="space-y-2">
          {members.length === 0 && (
            <p className="text-sm text-muted-foreground">No members found.</p>
          )}

          {members.length > 0 && (
            <div className="rounded-md border divide-y max-h-[420px] overflow-y-auto">
              {members.map((m) => (
                <div
                  key={m.userId}
                  className="p-4 flex items-center justify-between hover:bg-muted/50 transition"
                >
                  <div className="min-w-0">
                    <p className="font-medium truncate">{m.userId}</p>
                    <p className="text-sm text-muted-foreground">
                      Joined {formatDateTime(m.joinedAt)}
                    </p>
                  </div>

                  <span className="text-sm text-muted-foreground">{m.role}</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
