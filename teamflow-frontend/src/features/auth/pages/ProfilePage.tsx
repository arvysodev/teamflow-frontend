import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useMeQuery } from "@/shared/api/queries"
import { formatDateTime } from "@/shared/lib/date"

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium">{value}</span>
    </div>
  )
}

export function ProfilePage() {
  const meQuery = useMeQuery()

  if (meQuery.isLoading) {
    return (
      <div className="mx-auto max-w-xl">
        <p className="text-sm text-muted-foreground">Loading profile…</p>
      </div>
    )
  }

  if (!meQuery.data) {
    return (
      <div className="mx-auto max-w-xl">
        <p className="text-sm text-muted-foreground">Profile not available.</p>
      </div>
    )
  }

  const u = meQuery.data

  return (
    <div className="mx-auto max-w-xxl">
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>

        <CardContent className="space-y-3">
          <Row label="Username" value={u.username} />
          <Row label="Email" value={u.email} />
          <Row label="Role" value={u.role} />
          <Row label="Status" value={u.status} />
          <Row label="Created at" value={formatDateTime(u.createdAt)} />
          <Row label="Updated at" value={formatDateTime(u.updatedAt)} />
        </CardContent>
      </Card>
    </div>
  )
}
