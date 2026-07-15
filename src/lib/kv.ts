import "server-only";

/**
 * Minimalistický klient pre Upstash Redis / Vercel KV cez REST API (bez SDK,
 * len fetch). Používa sa ako perzistentné úložisko na Verceli, kde je súborový
 * systém read-only.
 *
 * Podporované premenné prostredia (automaticky doplní Vercel KV / Upstash
 * integrácia):
 *   KV_REST_API_URL         + KV_REST_API_TOKEN
 *   UPSTASH_REDIS_REST_URL  + UPSTASH_REDIS_REST_TOKEN
 *
 * Ak nie sú nastavené, klient je vypnutý (null) a store.ts použije súborový
 * systém (lokálny vývoj).
 */

interface KvConfig {
  url: string;
  token: string;
}

function config(): KvConfig | null {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token =
    process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return { url: url.replace(/\/$/, ""), token };
}

export function kvEnabled(): boolean {
  return config() !== null;
}

async function command<T>(args: (string | number)[]): Promise<T | null> {
  const cfg = config();
  if (!cfg) return null;
  const res = await fetch(cfg.url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${cfg.token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(args),
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`KV command zlyhal (${res.status}): ${await res.text()}`);
  }
  const data = (await res.json()) as { result: T };
  return data.result;
}

/** Načíta a rozparsuje JSON hodnotu uloženú pod kľúčom. */
export async function kvGet<T>(key: string): Promise<T | null> {
  const raw = await command<string>(["GET", key]);
  if (raw == null) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

/** Uloží hodnotu ako JSON reťazec. */
export async function kvSet<T>(key: string, value: T): Promise<void> {
  await command(["SET", key, JSON.stringify(value)]);
}
