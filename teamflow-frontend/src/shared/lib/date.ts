export function formatDateTime(value: unknown, locale = "en-GB") {
  if (value == null) return "—"

  const date =
    value instanceof Date
      ? value
      : typeof value === "string" || typeof value === "number"
        ? new Date(value)
        : null

  if (!date || Number.isNaN(date.getTime())) return String(value)

  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(date)
}
