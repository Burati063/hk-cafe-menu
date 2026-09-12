/**
 * Normalizes menu items from the database.
 * PostgreSQL: tags is String[] (native array) — no parsing needed.
 * SQLite fallback: tags may be a JSON string — parse it.
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function parseTags(tags: any): string[] {
  if (Array.isArray(tags)) return tags;
  if (typeof tags === "string") {
    try { return JSON.parse(tags); } catch { return []; }
  }
  return [];
}

export function serializeTags(tags: string[]): string[] {
  return tags; // PostgreSQL stores as native array
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function normalizeItem(item: any) {
  return { ...item, tags: parseTags(item.tags) };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function normalizeCategory(cat: any) {
  return { ...cat, items: (cat.items ?? []).map(normalizeItem) };
}
