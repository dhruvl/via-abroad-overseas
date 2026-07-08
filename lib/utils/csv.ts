const DANGEROUS_PREFIXES = ["=", "+", "-", "@", "\t", "\r"];

/**
 * Prevents CSV/spreadsheet formula injection: if a cell value starts with
 * a character a spreadsheet application would interpret as the start of
 * a formula, prefix it with a single quote so it's treated as inert text
 * when the file is opened in Excel/Sheets/etc.
 */
export function sanitizeCsvCell(value: unknown): string {
  const str = value === null || value === undefined ? "" : String(value);
  const needsPrefix = DANGEROUS_PREFIXES.some((prefix) => str.startsWith(prefix));
  const safe = needsPrefix ? `'${str}` : str;
  const escaped = safe.replace(/"/g, '""');
  return `"${escaped}"`;
}

export function rowsToCsv(headers: string[], rows: (string | number | null | undefined)[][]) {
  const lines = [headers.map(sanitizeCsvCell).join(",")];
  for (const row of rows) {
    lines.push(row.map(sanitizeCsvCell).join(","));
  }
  return lines.join("\r\n");
}
