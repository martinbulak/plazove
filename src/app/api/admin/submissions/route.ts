import { NextResponse } from "next/server";
import { readSubmission, writeSubmission, StorageReadOnlyError } from "@/lib/store";

/**
 * Správa podaní od verejnosti: výzva (petition), newsletter, tipy/foto/opravy
 * (submissions). Podporuje akcie: markHandled, delete.
 */

const FILES = ["petition", "newsletter", "submissions"] as const;
type File = (typeof FILES)[number];

export async function POST(req: Request) {
  let body: { file?: string; id?: string; action?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Neplatný formát." }, { status: 400 });
  }

  const { file, id, action } = body;
  if (!file || !FILES.includes(file as File)) {
    return NextResponse.json({ error: "Neznámy zdroj podaní." }, { status: 400 });
  }
  if (!id) return NextResponse.json({ error: "Chýba id." }, { status: 400 });

  const list = await readSubmission<Array<Record<string, unknown>>>(file, []);
  const idx = list.findIndex((i) => i.id === id);
  if (idx === -1) return NextResponse.json({ error: "Položka sa nenašla." }, { status: 404 });

  if (action === "delete") {
    list.splice(idx, 1);
  } else if (action === "markHandled") {
    list[idx].handled = true;
  } else if (action === "markUnhandled") {
    list[idx].handled = false;
  } else {
    return NextResponse.json({ error: "Neznáma akcia." }, { status: 400 });
  }

  try {
    await writeSubmission(file, list);
  } catch (err) {
    if (err instanceof StorageReadOnlyError) {
      return NextResponse.json(
        { error: "Zápis zlyhal: úložisko je read-only. Nastavte Vercel KV / Upstash (viď README)." },
        { status: 503 },
      );
    }
    throw err;
  }
  return NextResponse.json({ ok: true });
}
