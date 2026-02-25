export function formatDateTime(value: string | Date, locale = "en-GB") {
  const date = typeof value === "string" ? new Date(value) : value

  if (Number.isNaN(date.getTime())) return String(value)

  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(date)
}
