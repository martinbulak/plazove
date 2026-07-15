"use client";

import { useMemo, useState } from "react";
import {
  DOCUMENT_CATEGORY_LABEL,
  type DocumentCategory,
  type DocumentItem,
} from "@/lib/types";
import { formatDateSk } from "@/lib/utils";
import { PlaceholderBadge } from "@/components/ui";

const CATEGORIES = Object.keys(DOCUMENT_CATEGORY_LABEL) as DocumentCategory[];

export function DocumentsBrowser({ documents }: { documents: DocumentItem[] }) {
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState<DocumentCategory | "all">("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return documents.filter((d) => {
      if (cat !== "all" && d.category !== cat) return false;
      if (!q) return true;
      return (
        d.title.toLowerCase().includes(q) ||
        d.summary.toLowerCase().includes(q) ||
        d.issuer.toLowerCase().includes(q) ||
        (d.keyFindings ?? []).some((k) => k.toLowerCase().includes(q))
      );
    });
  }, [documents, query, cat]);

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <label className="flex-1">
          <span className="sr-only">Vyhľadať v dokumentoch</span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Hľadať podľa názvu, inštitúcie, obsahu…"
            className="w-full rounded-lg border border-ink-300 px-4 py-2.5 text-sm shadow-sm focus:border-brand-500"
          />
        </label>
        <label className="sm:w-64">
          <span className="sr-only">Filtrovať podľa kategórie</span>
          <select
            value={cat}
            onChange={(e) => setCat(e.target.value as DocumentCategory | "all")}
            className="w-full rounded-lg border border-ink-300 px-4 py-2.5 text-sm shadow-sm focus:border-brand-500"
          >
            <option value="all">Všetky kategórie</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {DOCUMENT_CATEGORY_LABEL[c]}
              </option>
            ))}
          </select>
        </label>
      </div>

      <p className="mb-4 text-sm text-ink-500" aria-live="polite">
        Zobrazených {filtered.length} z {documents.length} dokumentov
      </p>

      <ul className="space-y-4">
        {filtered.map((d) => (
          <li key={d.id} id={d.id}>
            <article className="scroll-mt-24 rounded-[var(--radius-card)] border border-ink-200 bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="rounded bg-brand-50 px-2 py-0.5 font-medium text-brand-700 ring-1 ring-brand-200">
                  {DOCUMENT_CATEGORY_LABEL[d.category]}
                </span>
                <span className="text-ink-500">{formatDateSk(d.date)}</span>
                {d.isPlaceholder && <PlaceholderBadge />}
              </div>

              <h2 className="mt-2 text-lg font-semibold text-ink-900">{d.title}</h2>
              <p className="mt-1 text-sm text-ink-600">{d.summary}</p>
              <p className="mt-2 text-xs text-ink-500">Vydal / autor: {d.issuer}</p>

              {d.keyFindings && d.keyFindings.length > 0 && (
                <div className="mt-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-ink-500">
                    Hlavné závery
                  </p>
                  <ul className="mt-1 list-disc space-y-0.5 pl-5 text-sm text-ink-700">
                    {d.keyFindings.map((k, i) => (
                      <li key={i}>{k}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mt-4 flex flex-wrap gap-3 text-sm">
                {d.fileUrl ? (
                  <a
                    href={d.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-brand-700 px-3 py-1.5 font-semibold text-white hover:bg-brand-800"
                  >
                    📄 Otvoriť / stiahnuť PDF
                  </a>
                ) : (
                  <span className="inline-flex items-center gap-1.5 rounded-lg bg-ink-100 px-3 py-1.5 font-medium text-ink-400">
                    PDF zatiaľ nedoplnené
                  </span>
                )}
                {d.sourceUrl && (
                  <a
                    href={d.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg border border-ink-300 px-3 py-1.5 font-medium text-ink-700 hover:bg-ink-50"
                  >
                    Zdroj dokumentu →
                  </a>
                )}
              </div>
            </article>
          </li>
        ))}
      </ul>

      {filtered.length === 0 && (
        <p className="rounded-lg border border-ink-200 bg-ink-50 p-6 text-center text-sm text-ink-500">
          Žiadny dokument nezodpovedá zadaným kritériám.
        </p>
      )}
    </div>
  );
}
