import "server-only";
import { NextResponse } from "next/server";
import { MAX_REQUEST_BYTES } from "@/lib/security/spam-checks";

export type JsonBodyResult =
  | { ok: true; payload: unknown }
  | { ok: false; response: NextResponse };

function tooLarge(): JsonBodyResult {
  return {
    ok: false,
    response: NextResponse.json({ error: "Request payload too large." }, { status: 413 }),
  };
}

/**
 * Shared guard for the public enquiry routes, run before any parsing:
 * 1. a declared Content-Length over the cap is rejected without reading;
 * 2. only `application/json` bodies are accepted (415 otherwise);
 * 3. the body is streamed and counted in BYTES (not UTF-16 string length),
 *    aborting as soon as the cap is crossed, so a missing or lying
 *    Content-Length can't force an unbounded read.
 */
export async function readJsonRequestBody(
  request: Request,
  maxBytes: number = MAX_REQUEST_BYTES
): Promise<JsonBodyResult> {
  const declaredLength = Number(request.headers.get("content-length"));
  if (Number.isFinite(declaredLength) && declaredLength > maxBytes) return tooLarge();

  const mediaType = request.headers.get("content-type")?.split(";")[0].trim().toLowerCase();
  if (mediaType !== "application/json") {
    return {
      ok: false,
      response: NextResponse.json({ error: "Unsupported content type." }, { status: 415 }),
    };
  }

  const chunks: Uint8Array[] = [];
  let totalBytes = 0;
  if (request.body) {
    const reader = request.body.getReader();
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      totalBytes += value.byteLength;
      if (totalBytes > maxBytes) {
        await reader.cancel().catch(() => undefined);
        return tooLarge();
      }
      chunks.push(value);
    }
  }

  const bytes = new Uint8Array(totalBytes);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }

  try {
    return { ok: true, payload: JSON.parse(new TextDecoder().decode(bytes)) };
  } catch {
    return {
      ok: false,
      response: NextResponse.json({ error: "Invalid request body." }, { status: 400 }),
    };
  }
}
