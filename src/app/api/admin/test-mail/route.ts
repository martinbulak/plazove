import { NextResponse } from "next/server";
import { sendMail, isMailConfigured } from "@/lib/mail";
import { isEmail, str } from "@/lib/validate";

/**
 * Skúšobné odoslanie e-mailu z administrácie.
 *
 * Umožňuje overiť nastavenie Resendu (kľúč, odosielateľ, overená doména) bez
 * toho, aby administrátor musel podpisovať výzvu naozajstným formulárom.
 * Prístup chráni middleware pre /api/admin.
 */
export async function POST(req: Request) {
  if (!isMailConfigured()) {
    return NextResponse.json(
      {
        error:
          "Chýba RESEND_API_KEY alebo MAIL_FROM. Doplňte ich v premenných prostredia a znova nasaďte projekt.",
      },
      { status: 400 },
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Neplatný formát." }, { status: 400 });
  }

  const to = str(body.to, 254);
  if (!isEmail(to)) {
    return NextResponse.json({ error: "Zadajte platnú adresu." }, { status: 400 });
  }

  const url = `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/podporte`;
  const result = await sendMail({
    to,
    subject: "Skúšobný e-mail – Za Pláž",
    text:
      `Toto je skúšobný e-mail z administrácie webu Za Pláž.\n\n` +
      `Ak vám prišiel, odosielanie cez Resend funguje – potvrdzovacie e-maily ` +
      `k výzve aj k odberu noviniek budú chodiť.\n\n` +
      `Odosielateľ: ${process.env.MAIL_FROM}\n\n` +
      `Za Pláž – ktorá nebude hanbou\nzaplaz.sk · info@zaplaz.sk`,
    action: { label: "Otvoriť stránku výzvy", url },
  });

  if (!result.delivered) {
    return NextResponse.json(
      { error: result.error || "Odoslanie zlyhalo." },
      { status: 502 },
    );
  }

  return NextResponse.json({
    ok: true,
    message: `E-mail odoslaný na ${to}.`,
    id: result.id,
  });
}
