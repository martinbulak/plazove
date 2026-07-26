"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import type { GalleryItem } from "@/lib/types";
import { formatDateSk } from "@/lib/utils";
import { PlaceholderBadge } from "@/components/ui";

export function Gallery({
  items,
  /**
   * Koľko fotografií zobraziť pred rozbalením. Zvyšok si čitateľ dožiada
   * tlačidlom – album s desiatkami záberov inak zaberie celú stránku.
   * Bez hodnoty sa zobrazia všetky.
   */
  initialCount,
}: {
  items: GalleryItem[];
  initialCount?: number;
}) {
  const [open, setOpen] = useState<number | null>(null);
  const [expanded, setExpanded] = useState(false);

  const limit = initialCount ?? items.length;
  const hidden = Math.max(0, items.length - limit);
  // Svetlobox listuje vždy celým albumom, aj keď je mriežka zbalená.
  const visible = expanded ? items : items.slice(0, limit);

  const close = useCallback(() => setOpen(null), []);
  const prev = useCallback(
    () => setOpen((i) => (i === null ? i : (i - 1 + items.length) % items.length)),
    [items.length],
  );
  const next = useCallback(
    () => setOpen((i) => (i === null ? i : (i + 1) % items.length)),
    [items.length],
  );

  useEffect(() => {
    if (open === null) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, close, prev, next]);

  const active = open === null ? null : items[open];

  return (
    <>
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {visible.map((g, i) => (
          <li key={g.id}>
            <button
              type="button"
              onClick={() => setOpen(i)}
              className="group block w-full overflow-hidden rounded-[var(--radius-card)] border border-ink-200 bg-white text-left shadow-sm transition hover:shadow-md focus-visible:outline-none"
              aria-label={`Otvoriť fotografiu: ${g.alt}`}
            >
              <span className="relative block aspect-[3/2] overflow-hidden bg-ink-100">
                <Image
                  src={g.src}
                  alt={g.alt}
                  fill
                  unoptimized
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                />
              </span>
              <span className="block px-3 py-2">
                {g.caption && (
                  <span className="block text-sm leading-snug text-ink-700">
                    {g.caption}
                  </span>
                )}
                {g.isPlaceholder && (
                  <span className="mt-1 block">
                    <PlaceholderBadge />
                  </span>
                )}
              </span>
            </button>
          </li>
        ))}
      </ul>

      {hidden > 0 && !expanded && (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="mt-4 w-full rounded-lg border border-ink-300 bg-white px-4 py-2.5 text-sm font-semibold text-ink-800 hover:border-brand-300 hover:bg-brand-50 hover:text-brand-800"
        >
          Zobraziť ďalších {hidden}{" "}
          {hidden < 5 ? "fotografie" : "fotografií"}
        </button>
      )}

      {hidden > 0 && expanded && (
        <button
          type="button"
          onClick={() => setExpanded(false)}
          className="mt-4 w-full rounded-lg border border-ink-300 bg-white px-4 py-2.5 text-sm font-semibold text-ink-800 hover:border-brand-300 hover:bg-brand-50 hover:text-brand-800"
        >
          Zbaliť galériu
        </button>
      )}

      {active && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={active.alt}
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/90 p-4"
          onClick={close}
        >
          <button
            type="button"
            onClick={close}
            aria-label="Zavrieť"
            className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); prev(); }}
            aria-label="Predchádzajúca"
            className="absolute left-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <figure className="max-h-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
            <div className="relative aspect-[3/2] w-[min(90vw,56rem)] overflow-hidden rounded-lg bg-ink-800">
              <Image
                src={active.src}
                alt={active.alt}
                fill
                unoptimized
                sizes="90vw"
                className="object-contain"
              />
            </div>
            <figcaption className="mt-3 text-sm text-ink-100">
              <span className="font-medium">{active.caption}</span>
              <span className="mt-1 block text-xs text-ink-300">
                {active.date && `${formatDateSk(active.date)} · `}
                {active.credit && `${active.credit} · `}
                {active.origin === "own" ? "vlastná fotografia" : "prevzatá fotografia"}
              </span>
            </figcaption>
          </figure>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); next(); }}
            aria-label="Ďalšia"
            className="absolute right-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      )}
    </>
  );
}
