import { getCache } from "@vercel/functions";

const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;
const RATE_LIMIT_TTL_SECONDS = 3600;
const DEFAULT_RATE_LIMIT = 20;
const CACHE_NAMESPACE = "chat-rl";

export type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  resetAt: number;
};

// Best-effort fallback for local dev or when the Runtime Cache is unavailable.
// Each instance keeps its own Map, so it is not shared across instances.
const memoryStore = new Map<string, number[]>();

export function getRateLimit(): number {
  const parsed = Number.parseInt(process.env.CHAT_RATE_LIMIT_PER_HOUR ?? "", 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : DEFAULT_RATE_LIMIT;
}

async function getClientKey(request: Request): Promise<string> {
  const forwardedFor = request.headers.get("x-forwarded-for");
  const ip =
    forwardedFor?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip")?.trim() ||
    "unknown";

  const data = new TextEncoder().encode(ip);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function toTimestamps(value: unknown): number[] {
  if (!Array.isArray(value)) return [];
  return value.filter(
    (timestamp): timestamp is number =>
      typeof timestamp === "number" && Number.isFinite(timestamp)
  );
}

function checkInMemory(
  key: string,
  limit: number,
  now: number
): RateLimitResult {
  const cutoff = now - RATE_LIMIT_WINDOW_MS;

  for (const [storedKey, timestamps] of memoryStore) {
    const recent = timestamps.filter((timestamp) => timestamp > cutoff);
    if (recent.length === 0) {
      memoryStore.delete(storedKey);
    } else {
      memoryStore.set(storedKey, recent);
    }
  }

  const timestamps = memoryStore.get(key) ?? [];
  const allowed = timestamps.length < limit;

  if (allowed) {
    timestamps.push(now);
    memoryStore.set(key, timestamps);
  }

  return {
    allowed,
    remaining: allowed ? Math.max(0, limit - timestamps.length) : 0,
    resetAt:
      timestamps.length > 0
        ? timestamps[0] + RATE_LIMIT_WINDOW_MS
        : now + RATE_LIMIT_WINDOW_MS,
  };
}

export async function checkRateLimit(request: Request): Promise<RateLimitResult> {
  const key = await getClientKey(request);
  const limit = getRateLimit();
  const now = Date.now();

  try {
    const cache = getCache({ namespace: CACHE_NAMESPACE });
    const stored = await cache.get(key);
    const timestamps = toTimestamps(stored).filter(
      (timestamp) => timestamp > now - RATE_LIMIT_WINDOW_MS
    );

    const allowed = timestamps.length < limit;

    if (allowed) {
      timestamps.push(now);
      await cache.set(key, timestamps, { ttl: RATE_LIMIT_TTL_SECONDS });
    }

    return {
      allowed,
      remaining: allowed ? Math.max(0, limit - timestamps.length) : 0,
      resetAt:
        timestamps.length > 0
          ? timestamps[0] + RATE_LIMIT_WINDOW_MS
          : now + RATE_LIMIT_WINDOW_MS,
    };
  } catch {
    return checkInMemory(key, limit, now);
  }
}
