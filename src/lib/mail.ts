import "server-only";

/**
 * Odosielanie e-mailov cez Resend HTTP API (bez SDK – stačí fetch).
 *
 * Bez RESEND_API_KEY / MAIL_FROM sa e-mail neodošle, iba sa vypíše do konzoly
 * servera vrátane potvrdzovacieho odkazu. Vývoj tak funguje bez účtu u Resendu
 * a zároveň je z logu jasné, že šlo o dev režim.
 *
 * Výsledok sa vždy vracia volajúcemu – API cesty musia vedieť, či e-mail
 * naozaj odišiel. Bez toho by sme používateľovi tvrdili „skontrolujte si
 * e-mail", hoci Resend odoslanie odmietol (neoverená doména, zlý kľúč…).
 */

const RESEND_ENDPOINT = "https://api.resend.com/emails";
const TIMEOUT_MS = 10_000;

export interface Mail {
  to: string;
  subject: string;
  /** Čistý text – povinný, slúži aj ako fallback pre HTML verziu. */
  text: string;
  /** Voliteľná výzva na akciu, z ktorej sa v HTML verzii vyrobí tlačidlo. */
  action?: { label: string; url: string };
}

export interface MailResult {
  delivered: boolean;
  /** Dôvod zlyhania pre log a pre administrátora. Nikdy sa nezobrazuje verejne. */
  error?: string;
  /** ID správy u Resendu – užitočné pri dohľadávaní v ich logu. */
  id?: string;
}

/** Je odosielanie e-mailov vôbec nakonfigurované? */
export function isMailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY && process.env.MAIL_FROM);
}

export async function sendMail(mail: Mail): Promise<MailResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.MAIL_FROM;

  if (!apiKey || !from) {
    console.info(
      "\n[mail:DEV] E-mail sa NEODOSLAL (chýba RESEND_API_KEY alebo MAIL_FROM).",
    );
    console.info(`[mail:DEV] Pre: ${mail.to}`);
    console.info(`[mail:DEV] Predmet: ${mail.subject}`);
    console.info(`[mail:DEV] Text:\n${mail.text}\n`);
    return { delivered: false, error: "Odosielanie e-mailov nie je nastavené." };
  }

  const payload = {
    from,
    to: [mail.to],
    subject: mail.subject,
    text: mail.text,
    html: renderHtml(mail),
    ...(process.env.MAIL_REPLY_TO ? { reply_to: process.env.MAIL_REPLY_TO } : {}),
  };

  // Jedno zopakovanie stačí – rieši prekročený limit (429) a krátkodobé
  // výpadky (5xx). Pri chybe v konfigurácii (4xx) opakovanie nemá zmysel.
  for (let attempt = 1; attempt <= 2; attempt++) {
    const res = await postToResend(apiKey, payload);

    if (res.ok) return { delivered: true, id: res.id };

    const retryable = res.status === 429 || (res.status ?? 0) >= 500;
    if (!retryable || attempt === 2) {
      console.error(
        `[mail] Odoslanie zlyhalo (HTTP ${res.status ?? "—"}): ${res.error}`,
      );
      return { delivered: false, error: res.error };
    }
    await new Promise((r) => setTimeout(r, 1000));
  }

  return { delivered: false, error: "Neznáma chyba." };
}

async function postToResend(
  apiKey: string,
  payload: unknown,
): Promise<{ ok: boolean; status?: number; error?: string; id?: string }> {
  try {
    const res = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });

    const body = await res.text();
    if (res.ok) {
      let id: string | undefined;
      try {
        id = (JSON.parse(body) as { id?: string }).id;
      } catch {
        /* odpoveď bez JSON tela nevadí */
      }
      return { ok: true, status: res.status, id };
    }

    // Resend vracia { name, message } – správa je konkrétna a stojí za log.
    let message = body.slice(0, 300);
    try {
      const parsed = JSON.parse(body) as { message?: string; name?: string };
      if (parsed.message) message = parsed.message;
    } catch {
      /* necháme surové telo */
    }
    return { ok: false, status: res.status, error: message };
  } catch (err) {
    const message =
      err instanceof Error && err.name === "TimeoutError"
        ? `Resend neodpovedal do ${TIMEOUT_MS / 1000} s.`
        : err instanceof Error
          ? err.message
          : String(err);
    return { ok: false, error: message };
  }
}

/**
 * Jednoduchá HTML verzia. Tabuľkové rozloženie a inline štýly sú v e-mailoch
 * nutnosť – klienti ako Outlook flexbox ani externé CSS nepodporujú.
 */
function renderHtml(mail: Mail): string {
  const { action } = mail;
  // Text bez riadku s odkazom – v HTML ho nahradí tlačidlo.
  const body = mail.text
    .split("\n")
    .filter((line) => !action || line.trim() !== action.url)
    .join("\n")
    .trim();

  const paragraphs = body
    .split(/\n{2,}/)
    .map(
      (p) =>
        `<p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#33403f">${escapeHtml(
          p,
        ).replace(/\n/g, "<br>")}</p>`,
    )
    .join("");

  const button = action
    ? `<p style="margin:0 0 24px"><a href="${escapeHtml(action.url)}" style="display:inline-block;background:#245e73;color:#ffffff;text-decoration:none;font-weight:600;font-size:15px;padding:12px 22px;border-radius:8px">${escapeHtml(
        action.label,
      )}</a></p>
       <p style="margin:0 0 24px;font-size:12px;line-height:1.5;color:#6b7a79">Ak tlačidlo nefunguje, skopírujte si tento odkaz do prehliadača:<br><span style="word-break:break-all;color:#245e73">${escapeHtml(
         action.url,
       )}</span></p>`
    : "";

  return `<!doctype html>
<html lang="sk"><body style="margin:0;padding:24px;background:#fbfaf8;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif">
<table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width:560px;margin:0 auto;background:#ffffff;border:1px solid #e6e3df;border-radius:12px">
<tr><td style="padding:28px 28px 8px">
  <p style="margin:0 0 4px;font-size:18px;font-weight:700;color:#102a37">Za Pláž</p>
  <p style="margin:0 0 24px;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:#245e73">ktorá nebude hanbou</p>
  ${paragraphs}
  ${button}
</td></tr>
<tr><td style="padding:0 28px 28px">
  <p style="margin:0;padding-top:16px;border-top:1px solid #eeebe7;font-size:12px;line-height:1.6;color:#8a9695">
    Nezávislý občiansky projekt o plážovom kúpalisku v Banskej Bystrici.<br>
    <a href="https://zaplaz.sk" style="color:#245e73">zaplaz.sk</a> · <a href="mailto:info@zaplaz.sk" style="color:#245e73">info@zaplaz.sk</a>
  </p>
</td></tr>
</table>
</body></html>`;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function confirmUrl(path: string, token: string): string {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  return `${base}${path}?token=${encodeURIComponent(token)}`;
}
