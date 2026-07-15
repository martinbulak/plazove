import "server-only";
import { promises as fs } from "fs";
import path from "path";
import { SEED } from "./seed";
import { kvEnabled, kvGet, kvSet } from "./kv";

/**
 * Obsahová vrstva s tromi režimami:
 *
 *  1. KV (Vercel KV / Upstash) – ak sú nastavené env premenné. Perzistentné
 *     úložisko vhodné pre serverless (Vercel). Počiatočný obsah tvorí SEED,
 *     zápisy idú do KV a prekryjú SEED.
 *  2. Súborový systém – lokálny vývoj (JSON v /content). Zápis funguje.
 *  3. Read-only fallback – ak nie je KV a súborový systém je read-only
 *     (napr. Vercel bez KV), čítanie funguje zo SEED, zápis vyhodí zrozumiteľnú
 *     chybu (STORAGE_READONLY).
 */

const CONTENT_DIR = path.join(process.cwd(), "content");
const SUBMISSIONS_DIR = path.join(CONTENT_DIR, "_submissions");

export class StorageReadOnlyError extends Error {
  constructor() {
    super("STORAGE_READONLY");
    this.name = "StorageReadOnlyError";
  }
}

async function ensureDir(dir: string) {
  await fs.mkdir(dir, { recursive: true });
}

async function readFileJson<T>(dir: string, name: string): Promise<T | null> {
  try {
    const raw = await fs.readFile(path.join(dir, `${name}.json`), "utf8");
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

async function writeFileJson<T>(dir: string, name: string, data: T): Promise<void> {
  try {
    await ensureDir(dir);
    await fs.writeFile(
      path.join(dir, `${name}.json`),
      JSON.stringify(data, null, 2) + "\n",
      "utf8",
    );
  } catch (err) {
    const code = (err as NodeJS.ErrnoException).code;
    // Read-only súborový systém (typicky serverless bez KV).
    if (code === "EROFS" || code === "EACCES" || code === "EPERM") {
      throw new StorageReadOnlyError();
    }
    throw err;
  }
}

/* ── Obsahové kolekcie (site, timeline, …) ───────────────────────────── */

export async function readJson<T>(name: string, fallback: T): Promise<T> {
  if (kvEnabled()) {
    const fromKv = await kvGet<T>(`content:${name}`);
    if (fromKv != null) return fromKv;
    const seeded = SEED[name] as T | undefined;
    return seeded ?? fallback;
  }
  const fromFile = await readFileJson<T>(CONTENT_DIR, name);
  if (fromFile != null) return fromFile;
  const seeded = SEED[name] as T | undefined;
  return seeded ?? fallback;
}

export async function writeJson<T>(name: string, data: T): Promise<void> {
  if (kvEnabled()) {
    await kvSet(`content:${name}`, data);
    return;
  }
  await writeFileJson(CONTENT_DIR, name, data);
}

/* ── Podania od verejnosti (osobné údaje – oddelený namespace) ────────── */

export async function readSubmission<T>(name: string, fallback: T): Promise<T> {
  if (kvEnabled()) {
    const fromKv = await kvGet<T>(`submission:${name}`);
    return fromKv ?? fallback;
  }
  const fromFile = await readFileJson<T>(SUBMISSIONS_DIR, name);
  return fromFile ?? fallback;
}

export async function writeSubmission<T>(name: string, data: T): Promise<void> {
  if (kvEnabled()) {
    await kvSet(`submission:${name}`, data);
    return;
  }
  await writeFileJson(SUBMISSIONS_DIR, name, data);
}

export async function appendSubmission<T>(name: string, item: T): Promise<void> {
  const list = await readSubmission<T[]>(name, []);
  list.push(item);
  await writeSubmission(name, list);
}
