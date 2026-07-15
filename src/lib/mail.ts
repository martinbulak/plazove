import "server-only";

/**
 * Odosielanie e-mailov. V predvolenom (dev) režime sa e-mail neodosiela – iba
 * sa vypíše do konzoly servera vrátane potvrdzovacieho odkazu. Pre reálne
 * odosielanie doplňte poskytovateľa (napr. Resend) podľa README.
 */

interface Mail {
  to: string;
  subject: string;
  text: string;
}

export async function sendMail(mail: Mail): Promise<{ delivered: boolean }> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.MAIL_FROM;

  if (!apiKey || !from) {
    // DEV režim – len logovanie.
    console.info(
      "\n[mail:DEV] E-mail sa NEODOSLAL (chýba RESEND_API_KEY/MAIL_FROM).",
    );
    console.info(`[mail:DEV] Pre: ${mail.to}`);
    console.info(`[mail:DEV] Predmet: ${mail.subject}`);
    console.info(`[mail:DEV] Text:\n${mail.text}\n`);
    return { delivered: false };
  }

  // Reálne odoslanie cez Resend HTTP API (bez SDK – použijeme fetch).
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: mail.to,
        subject: mail.subject,
        text: mail.text,
      }),
    });
    return { delivered: res.ok };
  } catch (err) {
    console.error("[mail] Odoslanie zlyhalo:", err);
    return { delivered: false };
  }
}

export function confirmUrl(path: string, token: string): string {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  return `${base}${path}?token=${encodeURIComponent(token)}`;
}
