"use client";

import { useState } from "react";

/**
 * Hotový text výzvy so skopírovaním na jeden klik a s prípravou e-mailu.
 * Nič neodosiela ani neukladá – všetko sa deje v prehliadači.
 */
export function CopyMessage({
  text,
  to,
  subject,
}: {
  text: string;
  /** Adresa príjemcu pre tlačidlo „Otvoriť v e-maile". */
  to: string;
  subject: string;
}) {
  const [copied, setCopied] = useState(false);
  const [failed, setFailed] = useState(false);

  /**
   * Staršia metóda cez skrytú textareu. Moderné Clipboard API vyžaduje
   * zabezpečené pripojenie a povolenie, ktoré nie je vždy k dispozícii.
   */
  function copyFallback(): boolean {
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(ta);
      return ok;
    } catch {
      return false;
    }
  }

  async function copy() {
    let ok = false;
    try {
      await navigator.clipboard.writeText(text);
      ok = true;
    } catch {
      ok = copyFallback();
    }

    if (ok) {
      setCopied(true);
      setFailed(false);
      setTimeout(() => setCopied(false), 2500);
    } else {
      // Text má používateľ pred sebou, takže ho môže označiť a skopírovať ručne.
      setFailed(true);
    }
  }

  const mailto = `mailto:${to}?subject=${encodeURIComponent(
    subject,
  )}&body=${encodeURIComponent(text)}`;

  return (
    <div className="overflow-hidden rounded-[var(--radius-card)] border border-ink-200 bg-white">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ink-100 bg-paper px-4 py-3">
        <p className="text-sm">
          <span className="text-ink-500">Komu:</span>{" "}
          <span className="font-medium text-ink-900">{to}</span>
          <br />
          <span className="text-ink-500">Predmet:</span>{" "}
          <span className="font-medium text-ink-900">{subject}</span>
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={copy}
            aria-live="polite"
            className="rounded-lg bg-brand-700 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-800"
          >
            {copied ? "Skopírované ✓" : "Skopírovať text"}
          </button>
          <a
            href={mailto}
            className="rounded-lg border border-ink-300 px-4 py-2 text-sm font-semibold text-ink-800 hover:bg-ink-50"
          >
            Otvoriť v e-maile
          </a>
        </div>
      </div>

      <p className="whitespace-pre-wrap px-4 py-5 text-[0.95rem] leading-relaxed text-ink-700 sm:px-6">
        {text}
      </p>

      {failed && (
        <p className="border-t border-ink-100 bg-amber-50 px-4 py-2.5 text-xs text-amber-900">
          Prehliadač nedovolil skopírovanie do schránky. Text si, prosím, označte
          myšou a skopírujte ručne.
        </p>
      )}
    </div>
  );
}
