import { NextResponse } from "next/server";
import { readJson, writeJson, StorageReadOnlyError } from "@/lib/store";
import { COLLECTIONS } from "@/lib/admin-schema";
import { shortId } from "@/lib/utils";

type Item = Record<string, unknown> & { id?: string };

const READONLY_MSG =
  "Zápis zlyhal: úložisko je read-only. Na Verceli nastavte Vercel KV / Upstash (viď README).";

function readOnlyResponse() {
  return NextResponse.json({ error: READONLY_MSG }, { status: 503 });
}

async function getParams(params: Promise<{ name: string }>) {
  const { name } = await params;
  return name;
}

/** Zoznam položiek kolekcie. */
export async function GET(_req: Request, ctx: { params: Promise<{ name: string }> }) {
  const name = await getParams(ctx.params);
  if (!COLLECTIONS[name]) return NextResponse.json({ error: "Neznáma kolekcia." }, { status: 404 });
  const items = await readJson<Item[]>(name, []);
  return NextResponse.json({ items });
}

/** Vytvorenie alebo úprava položky (upsert podľa id). */
export async function POST(req: Request, ctx: { params: Promise<{ name: string }> }) {
  const name = await getParams(ctx.params);
  if (!COLLECTIONS[name]) return NextResponse.json({ error: "Neznáma kolekcia." }, { status: 404 });

  let item: Item;
  try {
    item = await req.json();
  } catch {
    return NextResponse.json({ error: "Neplatný formát." }, { status: 400 });
  }

  const items = await readJson<Item[]>(name, []);
  const now = new Date().toISOString().slice(0, 10);
  item.updatedAt = now;

  if (item.id && items.some((i) => i.id === item.id)) {
    const idx = items.findIndex((i) => i.id === item.id);
    items[idx] = { ...items[idx], ...item };
  } else {
    item.id = item.id && typeof item.id === "string" ? item.id : shortId(name.slice(0, 3));
    items.push(item);
  }

  try {
    await writeJson(name, items);
  } catch (err) {
    if (err instanceof StorageReadOnlyError) return readOnlyResponse();
    throw err;
  }
  return NextResponse.json({ ok: true, item });
}

/** Zmazanie položky podľa ?id=. */
export async function DELETE(req: Request, ctx: { params: Promise<{ name: string }> }) {
  const name = await getParams(ctx.params);
  if (!COLLECTIONS[name]) return NextResponse.json({ error: "Neznáma kolekcia." }, { status: 404 });

  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Chýba id." }, { status: 400 });

  const items = await readJson<Item[]>(name, []);
  const next = items.filter((i) => i.id !== id);
  try {
    await writeJson(name, next);
  } catch (err) {
    if (err instanceof StorageReadOnlyError) return readOnlyResponse();
    throw err;
  }
  return NextResponse.json({ ok: true, removed: items.length - next.length });
}
