import { NextResponse } from "next/server";
import crypto from "crypto";
import { readSubmission, appendSubmission, StorageReadOnlyError } from "@/lib/store";
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
    await appendSubmission("newsletter", sub);
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
  await sendMail({
    to: email,
    subject: "Potvrďte odber noviniek – Aqualand BB",
    text:
      `Dobrý deň,\n\npre potvrdenie odberu noviniek kliknite na odkaz:\n\n${url}\n\n` +
      `Ak ste o odber nežiadali, tento e-mail ignorujte.\n\nAqualand BB – verejná kontrola`,
  });

  return NextResponse.json({
    ok: true,
    message: "Skontrolujte si e-mail a potvrďte odber kliknutím na odkaz.",
  });
}
