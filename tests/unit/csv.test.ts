import { describe, it, expect } from "vitest";
import { sanitizeCsvCell, rowsToCsv } from "@/lib/utils/csv";

describe("sanitizeCsvCell", () => {
  it("leaves ordinary text untouched (aside from quoting)", () => {
    expect(sanitizeCsvCell("Asha Rao")).toBe('"Asha Rao"');
  });

  it("neutralizes formula-injection prefixes", () => {
    expect(sanitizeCsvCell("=cmd|'/c calc'!A1")).toBe("\"'=cmd|'/c calc'!A1\"");
    expect(sanitizeCsvCell("+1+1")).toBe("\"'+1+1\"");
    expect(sanitizeCsvCell("-1+1")).toBe("\"'-1+1\"");
    expect(sanitizeCsvCell("@SUM(A1:A2)")).toBe("\"'@SUM(A1:A2)\"");
  });

  it("escapes embedded double quotes", () => {
    expect(sanitizeCsvCell('Say "hello"')).toBe('"Say ""hello"""');
  });

  it("renders null/undefined as an empty cell", () => {
    expect(sanitizeCsvCell(null)).toBe('""');
    expect(sanitizeCsvCell(undefined)).toBe('""');
  });
});

describe("rowsToCsv", () => {
  it("produces a header row followed by data rows", () => {
    const csv = rowsToCsv(
      ["Name", "Country"],
      [["Asha Rao", "United States"], ["=EVIL()", "Canada"]]
    );
    const lines = csv.split("\r\n");
    expect(lines[0]).toBe('"Name","Country"');
    expect(lines[1]).toBe('"Asha Rao","United States"');
    expect(lines[2]).toBe(`"'=EVIL()","Canada"`);
  });
});
