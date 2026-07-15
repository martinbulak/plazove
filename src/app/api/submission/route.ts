import { NextResponse } from "next/server";
import { appendSubmission, StorageReadOnlyError } from "@/lib/store";
import { isNonEmpty, isBot, str, isEmail } from "@/lib/validate";
import { shortId } from "@/lib/utils";
import type { Submission } from "@/lib/types";

/**
 * Prijatie podania od verejnosti: tip/dokument, fotografia alebo nahlásenie chyby.
 * Pri fotografii je povinné potvrdenie autorstva a súhlasu so zverejnením.
 */
export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Neplatný formát." }, { status: 400 });
  }

  if (isBot(body)) return NextResponse.json({ ok: true });

  const type = str(body.type, 20);
  if (!["tip", "photo", "correction"].includes(type)) {
    return NextResponse.json({ error: "Neznámy typ podania." }, { status: 400 });
  }

  const message = str(body.message, 5000);
  if (!isNonEmpty(message, 5000)) {
    return NextResponse.json({ error: "Napíšte, prosím, správu." }, { status: 400 });
  }

  const email = str(body.email, 254);
  if (email && !isEmail(email)) {
    return NextResponse.json({ error: "Zadaný e-mail nie je platný." }, { status: 400 });
  }

  if (type === "photo" && body.photoConsent !== true) {
    return NextResponse.json(
      {
        error:
          "Pri fotografii musíte potvrdiť autorstvo/oprávnenie, súhlas so zverejnením a ohľad na súkromie iných osôb.",
      },
      { status: 400 },
    );
  }

  const submission: Submission = {
    id: shortId("sub"),
    type: type as Submission["type"],
    name: str(body.name, 120) || undefined,
    email: email || undefined,
    message,
    photoConsent: type === "photo" ? true : undefined,
    attachmentNote: str(body.attachmentNote, 500) || undefined,
    createdAt: new Date().toISOString(),
    handled: false,
  };
  try {
    await appendSubmission("submissions", submission);
  } catch (err) {
    if (err instanceof StorageReadOnlyError) {
      return NextResponse.json(
        { error: "Úložisko nie je nakonfigurované. Kontaktujte prevádzkovateľa webu." },
        { status: 503 },
      );
    }
    throw err;
  }

  return NextResponse.json({
    ok: true,
    message: "Ďakujeme! Vaše podanie sme prijali a administrátor ho posúdi.",
  });
}
