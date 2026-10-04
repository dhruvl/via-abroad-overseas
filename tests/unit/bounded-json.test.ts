import { describe, expect, it } from "vitest";
import { readBoundedJson } from "@/lib/server/bounded-json";

function jsonRequest(body: string, contentType = "application/json") {
  return new Request("https://example.test/api/enquiries/contact", {
    method: "POST",
    headers: { "content-type": contentType },
    body,
  });
}

describe("readBoundedJson", () => {
  it("parses valid JSON within the byte limit", async () => {
    await expect(readBoundedJson(jsonRequest('{"ok":true}'), 32)).resolves.toEqual({
      status: "valid",
      value: { ok: true },
    });
  });

  it("rejects malformed JSON", async () => {
    await expect(readBoundedJson(jsonRequest("{"), 32)).resolves.toEqual({
      status: "malformed_json",
    });
  });

  it("accepts a body exactly at the byte limit", async () => {
    const body = '{"a":1}';
    await expect(readBoundedJson(jsonRequest(body), new TextEncoder().encode(body).byteLength)).resolves.toMatchObject({
      status: "valid",
    });
  });

  it("rejects a body one byte over the limit", async () => {
    await expect(readBoundedJson(jsonRequest('{"a":1} '), 7)).resolves.toEqual({
      status: "too_large",
    });
  });

  it("counts UTF-8 bytes for multibyte text", async () => {
    const body = JSON.stringify({ text: "é🙂ह" });
    const bytes = new TextEncoder().encode(body).byteLength;
    expect(body.length).toBeLessThan(bytes);
    await expect(readBoundedJson(jsonRequest(body), bytes - 1)).resolves.toEqual({
      status: "too_large",
    });
    await expect(readBoundedJson(jsonRequest(body), bytes)).resolves.toMatchObject({
      status: "valid",
    });
  });

  it("cancels a large stream as soon as it exceeds the limit", async () => {
    let pulls = 0;
    let cancelled = false;
    const request = new Request("https://example.test", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: new ReadableStream<Uint8Array>({
        pull(controller) {
          pulls += 1;
          controller.enqueue(new Uint8Array(1024));
          if (pulls > 8) controller.close();
        },
        cancel() {
          cancelled = true;
        },
      }),
      // Required by Node's Request implementation for streamed bodies.
      // @ts-expect-error duplex is part of the Web Request init extension.
      duplex: "half",
    });

    await expect(readBoundedJson(request, 16)).resolves.toEqual({ status: "too_large" });
    expect(cancelled).toBe(true);
    expect(pulls).toBeLessThanOrEqual(2);
  });

  it.each(["application/json", "application/json; charset=utf-8", "Application/JSON; Charset=UTF-8"])(
    "accepts JSON media type %s",
    async (contentType) => {
      await expect(readBoundedJson(jsonRequest("{}", contentType), 8)).resolves.toMatchObject({
        status: "valid",
      });
    }
  );

  it("rejects unsupported media types", async () => {
    await expect(readBoundedJson(jsonRequest("{}", "text/plain"), 8)).resolves.toEqual({
      status: "unsupported_media_type",
    });
  });
});
