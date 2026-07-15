import { NextResponse } from "next/server";
import { readJson, writeJson, StorageReadOnlyError } from "@/lib/store";
import { DEFAULT_SITE } from "@/lib/content";
import type { SiteConfig } from "@/lib/types";

export async function GET() {
  const site = await readJson<SiteConfig>("site", DEFAULT_SITE);
  return NextResponse.json({ site });
}

export async function POST(req: Request) {
  let body: Partial<SiteConfig>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Neplatný formát." }, { status: 400 });
  }
  const current = await readJson<SiteConfig>("site", DEFAULT_SITE);
  const next: SiteConfig = { ...current, ...body };
  try {
    await writeJson("site", next);
  } catch (err) {
    if (err instanceof StorageReadOnlyError) {
      return NextResponse.json(
        { error: "Zápis zlyhal: úložisko je read-only. Nastavte Vercel KV / Upstash (viď README)." },
        { status: 503 },
      );
    }
    throw err;
  }
  return NextResponse.json({ ok: true, site: next });
}
