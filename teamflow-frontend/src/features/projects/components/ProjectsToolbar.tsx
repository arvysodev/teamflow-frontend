import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { ProjectsToolbarProps } from "@/features/projects/model/types"

export function ProjectsToolbar(props: ProjectsToolbarProps) {
  return (
    <div className="flex items-center gap-2">
      <Input
        value={props.query}
        onChange={(e) => props.onQueryChange(e.target.value)}
        placeholder="Search projects…"
        className="w-[240px]"
        autoComplete="off"
      />

      <Select
        value={props.sort}
        onValueChange={(v) => {
          if (
            v === "updatedAt,desc" ||
            v === "updatedAt,asc" ||
            v === "createdAt,desc" ||
            v === "createdAt,asc" ||
            v === "name,asc" ||
            v === "name,desc"
          ) {
            props.onSortChange(v)
          }
        }}
      >
        <SelectTrigger className="w-[210px]">
          <SelectValue placeholder="Sort" />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="updatedAt,desc">Updated (newest)</SelectItem>
          <SelectItem value="updatedAt,asc">Updated (oldest)</SelectItem>
          <SelectItem value="createdAt,desc">Created (newest)</SelectItem>
          <SelectItem value="createdAt,asc">Created (oldest)</SelectItem>
          <SelectItem value="name,asc">Name (ascending)</SelectItem>
          <SelectItem value="name,desc">Name (descending)</SelectItem>
        </SelectContent>
      </Select>

      {props.canCreate && (
        <Button size="sm" onClick={props.onCreateClick}>
          Create
        </Button>
      )}
    </div>
  )
}
