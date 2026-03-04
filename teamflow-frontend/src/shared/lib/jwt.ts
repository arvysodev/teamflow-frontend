function base64UrlDecode(input: string) {
  const base64 = input.replace(/-/g, "+").replace(/_/g, "/")
  const pad = base64.length % 4 === 0 ? "" : "=".repeat(4 - (base64.length % 4))
  const str = atob(base64 + pad)
  return str
}

export function isJwtExpired(token: string): boolean {
  try {
    const payloadPart = token.split(".")[1]
    if (!payloadPart) return true

    const json = base64UrlDecode(payloadPart)
    const payload = JSON.parse(json) as { exp?: number }

    if (!payload.exp) return true

    const nowSec = Math.floor(Date.now() / 1000)
    return payload.exp <= nowSec
  } catch {
    return true
  }
}

export function getJwtExpSeconds(token: string): number | null {
  try {
    const payloadPart = token.split(".")[1]
    if (!payloadPart) return null
    const json = base64UrlDecode(payloadPart)
    const payload = JSON.parse(json) as { exp?: number }
    return typeof payload.exp === "number" ? payload.exp : null
  } catch {
    return null
  }
}
