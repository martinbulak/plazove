"use client";

import { useState } from "react";
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
  const milestones = items.filter((i) => i.milestone);
  const hasMilestones = milestones.length > 0;
  const visible = showAll || !hasMilestones ? items : milestones;
  const hiddenCount = items.length - milestones.length;

  return (
    <div>
      {hasMilestones && !showAll && (
        <p className="mb-6 text-sm text-ink-500">
          Zobrazujeme {milestones.length} kľúčových momentov. Celú časovú os (
          {items.length} udalostí) rozbalíte tlačidlom nižšie.
        </p>
      )}

      <ol className="relative border-l-2 border-brand-200 pl-6">
        {visible.map((t) => (
          <li key={t.id} className="mb-8 last:mb-0">
            <span
              aria-hidden
              className={cn(
                "absolute -left-[9px] mt-1.5 h-4 w-4 rounded-full border-2 border-white shadow",
                t.milestone ? "bg-accent-500 ring-2 ring-accent-400/40" : "bg-brand-500",
              )}
            />
            <div className="flex flex-wrap items-center gap-2">
              <time className="font-mono text-sm font-bold text-brand-700">
                {formatDateSk(t.date)}
              </time>
              {t.milestone && (
                <span className="rounded bg-accent-400/20 px-2 py-0.5 text-xs font-semibold text-accent-700">
                  Kľúčový moment
                </span>
              )}
              {t.tag && (
                <span className="rounded bg-brand-50 px-2 py-0.5 text-xs font-medium text-brand-700 ring-1 ring-brand-200">
                  {t.tag}
                </span>
              )}
            </div>
            <h3
              className={cn(
                "mt-1 text-lg font-semibold text-ink-900",
                t.milestone && "font-bold",
              )}
            >
              {t.title}
            </h3>
            <p className="mt-1 max-w-2xl text-ink-600">{t.description}</p>
            <SourceList sources={t.sources} />
          </li>
        ))}
      </ol>

      {hasMilestones && hiddenCount > 0 && (
        <button
          type="button"
          onClick={() => setShowAll((v) => !v)}
          className="mt-6 inline-flex items-center gap-2 rounded-lg border border-brand-300 px-5 py-2.5 text-sm font-semibold text-brand-800 hover:bg-brand-50"
        >
          {showAll
            ? "Zobraziť len kľúčové momenty"
            : `Zobraziť všetky udalosti (${items.length})`}
          <span aria-hidden className={cn("transition-transform", showAll && "rotate-180")}>
            ▾
          </span>
        </button>
      )}
    </div>
  );
}
