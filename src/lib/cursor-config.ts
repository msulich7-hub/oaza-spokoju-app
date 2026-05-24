export function isCursorApiKeyConfigured(): boolean {
  const key = process.env.CURSOR_API_KEY?.trim();
  if (!key) return false;
  if (key === "cursor_xxxxx") return false;
  if (key.startsWith("sk-ant-")) return false;
  return key.startsWith("cursor_") || key.length > 20;
}
