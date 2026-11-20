import { BOOKING_URL } from "@/lib/site";

const MAX_REPLY_LENGTH = 1200;
const URL_PATTERN = /\b(?:https?:\/\/|www\.)[^\s<>()"']+/gi;

export function stripThinkBlock(text: string): string {
  return text.replace(/<think[\s\S]*?<\/think>/gi, "").trim();
}

function isAllowedUrl(raw: string): boolean {
  const candidate = raw.startsWith("www.") ? `https://${raw}` : raw;

  let url: URL;
  try {
    url = new URL(candidate);
  } catch {
    return false;
  }

  if (url.protocol !== "http:" && url.protocol !== "https:") return false;

  const host = url.hostname.toLowerCase().replace(/\.$/, "").replace(/^www\./, "");
  const path = url.pathname;

  if (host === "willowvibe.com") return true;
  if (host === "cal.com") return path.startsWith("/harishng");
  if (host === "github.com") return path.startsWith("/willowvibe");
  if (host === "willowvibe.github.io") return true;
  if (host === "rag-docs-chatbot-three.vercel.app") return true;
  if (host === "pypi.org") return path.startsWith("/project/pipelineprobe");
  if (host === "cosmicsaju.com") return true;
  if (host === "dikshithra.com") return true;

  return false;
}

function capReply(text: string): string {
  if (text.length <= MAX_REPLY_LENGTH) return text;

  const slice = text.slice(0, MAX_REPLY_LENGTH);
  let lastSentenceEnd = -1;

  for (const match of slice.matchAll(/[.!?](?=\s|$)/g)) {
    lastSentenceEnd = match.index ?? -1;
  }

  if (lastSentenceEnd >= 0) {
    return slice.slice(0, lastSentenceEnd + 1).trim();
  }

  return slice.trim();
}

export function sanitizeReply(text: string): string {
  let reply = stripThinkBlock(text);

  reply = reply.replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1\s*>/gi, "").replace(/<[^>]*>/g, "");
  reply = reply.replace(/!\[[^\]]*\]\([^)]*\)/g, "");

  reply = reply.replace(URL_PATTERN, (match) => {
    const trailing = match.match(/[.,;:!?]+$/)?.[0] ?? "";
    const token = trailing ? match.slice(0, -trailing.length) : match;
    return isAllowedUrl(token) ? `${token}${trailing}` : "";
  });

  reply = reply
    .replace(/\(\s*\)/g, "")
    .replace(/[ \t]{2,}/g, " ")
    .trim();

  reply = capReply(reply);

  if (reply.length === 0) {
    return `I don't have a reliable answer for that. Please email contact@willowvibe.com or book a call at ${BOOKING_URL}.`;
  }

  return reply;
}
