"use client";

import { useState } from "react";

/**
 * Zdieľanie odkazu na web. Nič neodosiela na server ani neukladá –
 * len otvorí zdieľacie okno alebo skopíruje adresu do schránky.
 */
export function ShareButtons({ url, title }: { url: string; title: string }) {
  const enc = encodeURIComponent(url);
  const encT = encodeURIComponent(title);
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  }

  const btn =
    "inline-flex items-center gap-1.5 rounded-lg border border-ink-300 px-3 py-2 text-sm font-medium text-ink-700 hover:bg-ink-50";

  return (
    <div className="flex flex-wrap gap-2">
      <a className={btn} href={`https://www.facebook.com/sharer/sharer.php?u=${enc}`} target="_blank" rel="noopener noreferrer">
        Zdieľať na Facebooku
      </a>
      <a className={btn} href={`https://twitter.com/intent/tweet?url=${enc}&text=${encT}`} target="_blank" rel="noopener noreferrer">
        Zdieľať na X
      </a>
      <a className={btn} href={`mailto:?subject=${encT}&body=${enc}`}>
        Poslať e-mailom
      </a>
      <button type="button" onClick={copy} className={btn}>
        {copied ? "Skopírované ✓" : "Kopírovať odkaz"}
      </button>
    </div>
  );
}
