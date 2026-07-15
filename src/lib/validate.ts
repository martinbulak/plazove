/** Jednoduché validácie a ochrana proti spamu (bez externých závislostí). */

export function isEmail(value: unknown): value is string {
  return (
    typeof value === "string" &&
    value.length <= 254 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
  );
}

export function isNonEmpty(value: unknown, max = 200): value is string {
  return typeof value === "string" && value.trim().length > 0 && value.length <= max;
}

/** Vráti orezaný string alebo prázdny reťazec. */
export function str(value: unknown, max = 2000): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

/**
 * Honeypot: skryté pole „website" musí zostať prázdne. Ak je vyplnené,
 * ide s vysokou pravdepodobnosťou o bota.
 */
export function isBot(body: Record<string, unknown>): boolean {
  return typeof body.website === "string" && body.website.trim().length > 0;
}
