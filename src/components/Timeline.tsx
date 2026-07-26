"use client";

import { useRef, useState } from "react";
import type { TimelineItem } from "@/lib/types";
import { formatDateSk, cn } from "@/lib/utils";
import { SourceList } from "@/components/ui";

/**
 * Časová os so zbalením: predvolene zobrazuje len kľúčové momenty
 * (item.milestone), zvyšok sa rozbalí tlačidlom. Ak nie sú označené žiadne
 * míľniky, zobrazí sa všetko.
 */
export function Timeline({ items }: { items: TimelineItem[] }) {
  const [showAll, setShowAll] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const milestones = items.filter((i) => i.milestone);
  const hasMilestones = milestones.length > 0;
  const visible = showAll || !hasMilestones ? items : milestones;
  const hiddenCount = items.length - milestones.length;

  /**
   * Doplnené udalosti sa vkladajú medzi míľniky, teda nad tlačidlo. Prehliadač
   * pritom drží pozíciu viditeľného obsahu, takže po kliknutí to zdola vyzerá,
   * že sa nič nestalo. Preto po prepnutí posunieme pohľad na začiatok osi.
   */
  function toggle() {
    setShowAll((v) => !v);
    listRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div ref={listRef} className="scroll-mt-24">
      {hasMilestones && (
        <p className="mb-8 text-sm text-ink-500">
          {showAll
            ? `Zobrazená celá chronológia (${items.length} udalostí).`
            : `Zobrazených ${milestones.length} kľúčových momentov z ${items.length}.`}
        </p>
      )}

      <ol className="relative space-y-0">
        {visible.map((t, i) => (
          <li
            key={t.id}
            className={cn(
              "relative grid gap-x-6 gap-y-2 py-7 sm:grid-cols-[8.5rem_1fr]",
              i > 0 && "border-t border-ink-200",
            )}
          >
            {/* Dátum + značka */}
            <div className="sm:text-right">
              <time
                className={cn(
                  "display block text-lg",
                  t.milestone ? "text-brand-800" : "text-ink-500",
                )}
              >
                {formatDateSk(t.date)}
              </time>
              {t.milestone && (
                <span className="mt-1 inline-block rounded bg-accent-400/25 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-accent-700">
                  Kľúčový moment
                </span>
              )}
            </div>

            {/* Obsah */}
            <div className="min-w-0">
              <h3
                className={cn(
                  "display text-xl text-ink-900",
                  t.milestone && "text-[1.4rem]",
                )}
              >
                {t.title}
              </h3>
              <p className="mt-2 max-w-2xl leading-relaxed text-ink-600">
                {t.description}
              </p>
              <SourceList sources={t.sources} />
            </div>
          </li>
        ))}
      </ol>

      {hasMilestones && hiddenCount > 0 && (
        <button
          type="button"
          onClick={toggle}
          className="mt-8 inline-flex items-center gap-2 rounded-lg border border-ink-300 bg-white px-5 py-3 text-sm font-semibold text-ink-800 transition-colors hover:border-brand-400 hover:bg-brand-50"
        >
          {showAll
            ? "Zobraziť len kľúčové momenty"
            : `Zobraziť všetkých ${items.length} udalostí`}
          <span
            aria-hidden
            className={cn("transition-transform", showAll && "rotate-180")}
          >
            ▾
          </span>
        </button>
      )}
    </div>
  );
}
