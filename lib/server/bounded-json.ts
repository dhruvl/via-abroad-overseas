import "server-only";

export type BoundedJsonResult =
  | { status: "valid"; value: unknown }
  | { status: "malformed_json" }
  | { status: "too_large" }
  | { status: "unsupported_media_type" };

/** Reads and parses JSON while enforcing the limit against streamed UTF-8 bytes. */
export async function readBoundedJson(
  request: Request,
  maxBytes: number
): Promise<BoundedJsonResult> {
  const mediaType = request.headers.get("content-type")?.split(";", 1)[0]?.trim().toLowerCase();
  if (mediaType !== "application/json") return { status: "unsupported_media_type" };

  if (!request.body) return { status: "malformed_json" };

  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let totalBytes = 0;

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      totalBytes += value.byteLength;
      if (totalBytes > maxBytes) {
        await reader.cancel().catch(() => undefined);
        return { status: "too_large" };
      }
      chunks.push(value);
    }
  } catch {
    return { status: "malformed_json" };
  } finally {
    reader.releaseLock();
  }

  const bytes = new Uint8Array(totalBytes);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }

  try {
    const text = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
    return { status: "valid", value: JSON.parse(text) as unknown };
  } catch {
    return { status: "malformed_json" };
  }
}
