import type { IncomingMessage, ServerResponse } from "node:http";

type ContactRequest = IncomingMessage & { body?: unknown };
const defaultEndpoint = "https://script.google.com/macros/s/AKfycbxn5xT14ewPCAZ2WxDv4wOyuWHmG6x5-5jKMs-zlDUz6OiEA50As1nLvQn8iVsc6dgHEQ/exec";

export default async function handler(req: ContactRequest, res: ServerResponse) {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  const reply = (status: number, success: boolean) => {
    res.statusCode = status;
    res.end(JSON.stringify({ success }));
  };
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return reply(405, false);
  }
  if (!req.headers["content-type"]?.includes("application/json")) return reply(415, false);
  let body: unknown = req.body;
  if (body === undefined) {
    const chunks: Buffer[] = [];
    let size = 0;
    for await (const chunk of req) {
      const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
      size += buffer.length;
      if (size > 32768) return reply(413, false);
      chunks.push(buffer);
    }
    body = Buffer.concat(chunks).toString("utf8");
  }
  if (typeof body === "string") {
    try { body = JSON.parse(body); } catch { return reply(400, false); }
  }
  if (!body || typeof body !== "object") return reply(400, false);
  const fields = body as Record<string, unknown>;
  const name = typeof fields.name === "string" ? fields.name.trim() : "";
  const email = typeof fields.email === "string" ? fields.email.trim() : "";
  const message = typeof fields.message === "string" ? fields.message.trim() : "";
  if (!name || name.length > 120 || !/^\S+@\S+\.\S+$/.test(email) || email.length > 254 || !message || message.length > 5000) return reply(400, false);

  try {
    // Preserve the existing Apps Script doGet integration and verify its acknowledgement.
    const url = new URL(process.env.CONTACT_SCRIPT_URL || defaultEndpoint);
    url.search = new URLSearchParams({ name, email, message }).toString();
    const response = await fetch(url, { signal: AbortSignal.timeout(12000), cache: "no-store" });
    if (!response.ok) return reply(502, false);
    const text = (await response.text()).trim();
    let confirmed = /^(ok|success)$/i.test(text);
    try {
      const result: unknown = JSON.parse(text);
      if (result && typeof result === "object") {
        const data = result as Record<string, unknown>;
        confirmed = !data.error && data.success !== false &&
          (data.success === true || data.result === "success" || data.status === "success");
      }
    } catch {
      // HTML error pages and unknown responses are not delivery confirmations.
    }
    return reply(confirmed ? 200 : 502, confirmed);
  } catch {
    // The upstream URL contains personal data; never log it.
    return reply(502, false);
  }
}
