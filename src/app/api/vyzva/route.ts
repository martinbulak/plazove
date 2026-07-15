import { NextResponse } from "next/server";
import crypto from "crypto";
import { readSubmission, appendSubmission, StorageReadOnlyError } from "@/lib/store";
import { isEmail, isNonEmpty, isBot, str } from "@/lib/validate";
import { sendMail, confirmUrl } from "@/lib/mail";
import { shortId } from "@/lib/utils";
import type { PetitionSignature } from "@/lib/types";

/**
 * Podpis verejnej výzvy (double opt-in).
 * 1) uloží nepotvrdený podpis + token, 2) pošle potvrdzovací e-mail.
 * Verejné zobrazenie mena/mesta je voliteľné (showPublicly).
 */
export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Neplatný formát." }, { status: 400 });
  }

  if (isBot(body)) {
    // Ticho „prijmeme", ale nič neuložíme.
    return NextResponse.json({ ok: true });
  }

  const firstName = str(body.firstName, 80);
  const lastName = str(body.lastName, 80);
  const city = str(body.city, 120);
  const email = str(body.email, 254);

  if (!isNonEmpty(firstName, 80) || !isNonEmpty(lastName, 80)) {
    return NextResponse.json({ error: "Zadajte meno a priezvisko." }, { status: 400 });
  }
  if (!isNonEmpty(city, 120)) {
    return NextResponse.json({ error: "Zadajte mesto." }, { status: 400 });
  }
  if (!isEmail(email)) {
    return NextResponse.json({ error: "Zadajte platný e-mail." }, { status: 400 });
  }
  if (body.consent !== true) {
    return NextResponse.json(
      { error: "Bez súhlasu so spracovaním údajov nie je možné výzvu podpísať." },
      { status: 400 },
    );
  }

  const existing = await readSubmission<PetitionSignature[]>("petition", []);
  if (existing.some((s) => s.email.toLowerCase() === email.toLowerCase() && s.confirmed)) {
    return NextResponse.json(
      { ok: true, message: "Tento e-mail už výzvu podpísal." },
    );
  }

  const token = crypto.randomBytes(24).toString("hex");
  const signature: PetitionSignature = {
    id: shortId("sig"),
    firstName,
    lastName,
    city,
    email,
    showPublicly: body.showPublicly === true,
    consent: true,
    confirmed: false,
    confirmToken: token,
    createdAt: new Date().toISOString(),
  };
  try {
    await appendSubmission("petition", signature);
  } catch (err) {
    if (err instanceof StorageReadOnlyError) {
      return NextResponse.json(
        { error: "Úložisko nie je nakonfigurované. Kontaktujte prevádzkovateľa webu." },
        { status: 503 },
      );
    }
    throw err;
  }

  const url = confirmUrl("/podporte/potvrdenie", token);
  await sendMail({
    to: email,
    subject: "Potvrďte podpis verejnej výzvy – Aqualand BB",
    text:
      `Dobrý deň,\n\nĎakujeme za podporu verejnej výzvy k plážovému kúpalisku v Banskej Bystrici.\n` +
      `Pre potvrdenie podpisu kliknite na odkaz:\n\n${url}\n\n` +
      `Ak ste o podpis nežiadali, tento e-mail ignorujte.\n\nAqualand BB – verejná kontrola`,
  });

  return NextResponse.json({
    ok: true,
    message:
      "Ďakujeme! Na váš e-mail sme poslali potvrdzovací odkaz. Podpis sa započíta až po potvrdení.",
  });
}
