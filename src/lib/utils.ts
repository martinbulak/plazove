/** Pomocné funkcie bez závislostí na servri (bezpečné pre klient aj server). */

/** Spojenie tried s odstránením prázdnych hodnôt. */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

/** Vytvorí URL-slug zo slovenského textu (odstráni diakritiku). */
export function slugify(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

const MONTHS_SK = [
  "januára", "februára", "marca", "apríla", "mája", "júna",
  "júla", "augusta", "septembra", "októbra", "novembra", "decembra",
];

/** Naformátuje dátum „YYYY-MM-DD" alebo „YYYY" do slovenského tvaru. */
export function formatDateSk(value?: string): string {
  if (!value) return "";
  const parts = value.split("-");
  if (parts.length === 1) return parts[0]; // len rok
  const [y, m, d] = parts;
  const month = MONTHS_SK[Number(m) - 1] ?? m;
  if (!d) return `${month} ${y}`;
  return `${Number(d)}. ${month} ${y}`;
}

/** Krátky náhodný identifikátor (nie kryptograficky bezpečný – len na ID položiek). */
export function shortId(prefix = "id"): string {
  const rand = Math.random().toString(36).slice(2, 8);
  const time = Date.now().toString(36).slice(-4);
  return `${prefix}_${time}${rand}`;
}

/** Základné escapovanie HTML. */
export function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Veľmi jednoduchý Markdown → HTML (nadpisy, tučné, kurzíva, odkazy, odseky,
 * odrážky). Zámerne minimalistický, bez externých závislostí. Vstup escapujeme.
 */
export function miniMarkdown(md: string): string {
  const esc = escapeHtml(md);
  const lines = esc.split(/\r?\n/);
  const html: string[] = [];
  let inList = false;

  const inline = (t: string) =>
    t
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.+?)\*/g, "<em>$1</em>")
      .replace(
        /\[(.+?)\]\((https?:\/\/[^\s)]+|\/[^\s)]*)\)/g,
        '<a href="$2" class="underline decoration-2 underline-offset-2 hover:text-brand-700">$1</a>',
      );

  for (const line of lines) {
    if (/^\s*[-*]\s+/.test(line)) {
      if (!inList) {
        html.push('<ul class="list-disc pl-6 space-y-1">');
        inList = true;
      }
      html.push(`<li>${inline(line.replace(/^\s*[-*]\s+/, ""))}</li>`);
      continue;
    }
    if (inList) {
      html.push("</ul>");
      inList = false;
    }
    if (/^###\s+/.test(line)) html.push(`<h3 class="text-lg font-semibold mt-6 mb-2">${inline(line.replace(/^###\s+/, ""))}</h3>`);
    else if (/^##\s+/.test(line)) html.push(`<h2 class="text-xl font-bold mt-8 mb-3">${inline(line.replace(/^##\s+/, ""))}</h2>`);
    else if (line.trim() === "") html.push("");
    else html.push(`<p>${inline(line)}</p>`);
  }
  if (inList) html.push("</ul>");
  return html.join("\n");
}
