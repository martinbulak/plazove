import { NextResponse } from "next/server";
import crypto from "crypto";
import { readSubmission, writeSubmission, StorageReadOnlyError } from "@/lib/store";
import { isEmail, isBot, str } from "@/lib/validate";
import { sendMail, confirmUrl } from "@/lib/mail";
import { shortId } from "@/lib/utils";
import type { NewsletterSubscriber } from "@/lib/types";

/** Prihlásenie na newsletter (double opt-in). */
export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Neplatný formát." }, { status: 400 });
  }

  if (isBot(body)) return NextResponse.json({ ok: true });

  const email = str(body.email, 254);
  if (!isEmail(email)) {
    return NextResponse.json({ error: "Zadajte platný e-mail." }, { status: 400 });
  }
  if (body.consent !== true) {
    return NextResponse.json(
      { error: "Bez súhlasu so spracovaním e-mailu vás nemôžeme prihlásiť." },
      { status: 400 },
    );
  }

  const existing = await readSubmission<NewsletterSubscriber[]>("newsletter", []);
  if (existing.some((s) => s.email.toLowerCase() === email.toLowerCase() && s.confirmed)) {
    return NextResponse.json({ ok: true, message: "Tento e-mail je už prihlásený." });
  }

  const token = crypto.randomBytes(24).toString("hex");
  const sub: NewsletterSubscriber = {
    id: shortId("nl"),
    email,
    confirmed: false,
    confirmToken: token,
    createdAt: new Date().toISOString(),
  };
  try {
    // Nepotvrdené prihlásenie s rovnakým e-mailom nahradíme – ak prvý pokus
    // zlyhal na odoslaní e-mailu, opakovaný pokus nemá pridať ďalší záznam.
    const kept = existing.filter(
      (s) => s.confirmed || s.email.toLowerCase() !== email.toLowerCase(),
    );
    await writeSubmission("newsletter", [...kept, sub]);
  } catch (err) {
    if (err instanceof StorageReadOnlyError) {
      return NextResponse.json(
        { error: "Úložisko nie je nakonfigurované. Kontaktujte prevádzkovateľa webu." },
        { status: 503 },
      );
    }
    throw err;
  }

  const url = confirmUrl("/podporte/newsletter-potvrdenie", token);
  const mail = await sendMail({
    to: email,
    subject: "Potvrďte odber noviniek – Za Pláž",
    text:
      `Dobrý deň,\n\npre potvrdenie odberu noviniek kliknite na odkaz:\n\n${url}\n\n` +
      `Ak ste o odber nežiadali, tento e-mail ignorujte.\n\n` +
      `Za Pláž – ktorá nebude hanbou\nzaplaz.sk · info@zaplaz.sk`,
    action: { label: "Potvrdiť odber noviniek", url },
  });

  if (!mail.delivered) {
    // Prihlásenie je uložené, ale bez potvrdenia je neplatné – nesmieme
    // tvrdiť, že e-mail odišiel.
    return NextResponse.json(
      {
        error:
          "Potvrdzovací e-mail sa nepodarilo odoslať. Skúste to, prosím, o chvíľu znova alebo nám napíšte na info@zaplaz.sk.",
      },
      { status: 502 },
    );
  }

  return NextResponse.json({
    ok: true,
    message: "Skontrolujte si e-mail a potvrďte odber kliknutím na odkaz.",
  });
}
