export interface Message {
  timestamp: string
  name: string
  message: string
}

export function parseMessagesFromGoogleSheet(data: unknown): Message[] {
  const record = data && typeof data === "object" ? (data as Record<string, unknown>) : null
  const possibleRows = (record?.GoogleSheetData ?? record?.rows ?? record?.values ?? data) as unknown

  if (!Array.isArray(possibleRows) || possibleRows.length === 0) return []

  const [header, ...entries] = possibleRows
  if (!Array.isArray(header)) return []

  const idxName = header.findIndex((h) => typeof h === "string" && h.toLowerCase().includes("name"))
  const idxMsg = header.findIndex((h) => typeof h === "string" && h.toLowerCase().includes("message"))
  const idxTime = header.findIndex((h) => typeof h === "string" && h.toLowerCase().includes("timestamp"))

  const safeIdxName = idxName >= 0 ? idxName : 0
  const safeIdxMsg = idxMsg >= 0 ? idxMsg : 1
  const safeIdxTime = idxTime >= 0 ? idxTime : 2

  return entries
    .filter((row): row is string[] => Array.isArray(row))
    .map((row) => ({
      timestamp: String(row[safeIdxTime] ?? ""),
      name: String(row[safeIdxName] ?? ""),
      message: String(row[safeIdxMsg] ?? ""),
    }))
    .filter((m) => m.name || m.message || m.timestamp)
}
