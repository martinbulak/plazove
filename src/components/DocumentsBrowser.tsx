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

/**
 * Druh položky v archíve. Rozlíšenie je pre čitateľa podstatné: pri jednom
 * dostane priamo súbor, pri druhom ho posielame na cudziu stránku, ktorá sa
 * môže zmeniť alebo zmiznúť.
 */
type DocKind = "file" | "link" | "pending";

function docKind(d: DocumentItem): DocKind {
  if (d.fileUrl) return "file";
  if (d.sourceUrl) return "link";
  return "pending";
}

/** Prípona súboru veľkými písmenami – „PDF", „DOCX"… */
function fileExt(url: string): string {
  const m = url.split("?")[0].match(/\.([a-z0-9]{2,5})$/i);
  return m ? m[1].toUpperCase() : "Súbor";
}

const GROUPS: { kind: DocKind; title: string; intro: string }[] = [
  {
    kind: "file",
    title: "Dokumenty na stiahnutie",
    intro:
      "Originálne súbory uložené priamo na tomto webe. Otvoríte ich alebo stiahnete jedným kliknutím a zostanú dostupné, aj keby ich pôvodný zdroj stiahol.",
  },
  {
    kind: "link",
    title: "Odkazy na zdroje na webe",
    intro:
      "Tlačové správy a verejné vyjadrenia, ktoré nemajú podobu samostatného súboru. Odkazujeme na pôvodnú stránku – jej obsah spravuje jej prevádzkovateľ a môže sa zmeniť.",
  },
  {
    kind: "pending",
    title: "Zatiaľ nezverejnené",
    intro:
      "Obsah a závery týchto dokumentov na webe spracované máme, samotný súbor však ešte nemáme k dispozícii alebo ho pripravujeme na anonymizáciu.",
  },
];

export function DocumentsBrowser({ documents }: { documents: DocumentItem[] }) {
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState<DocumentCategory | "all">("all");
  const [kind, setKind] = useState<DocKind | "all">("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return documents.filter((d) => {
      if (cat !== "all" && d.category !== cat) return false;
      if (kind !== "all" && docKind(d) !== kind) return false;
      if (!q) return true;
      return (
        d.title.toLowerCase().includes(q) ||
        d.summary.toLowerCase().includes(q) ||
        d.issuer.toLowerCase().includes(q) ||
        (d.keyFindings ?? []).some((k) => k.toLowerCase().includes(q))
      );
    });
  }, [documents, query, cat, kind]);

  const counts = useMemo(
    () => ({
      file: documents.filter((d) => docKind(d) === "file").length,
      link: documents.filter((d) => docKind(d) === "link").length,
      pending: documents.filter((d) => docKind(d) === "pending").length,
    }),
    [documents],
  );

  const chip = (active: boolean) =>
    `rounded-lg px-3 py-1.5 text-sm font-medium ring-1 ring-inset ${
      active
        ? "bg-brand-700 text-white ring-brand-700"
        : "bg-white text-ink-700 ring-ink-300 hover:bg-ink-50"
    }`;

  return (
    <div>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
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

      <div className="mb-6 flex flex-wrap gap-2" role="group" aria-label="Filtrovať podľa druhu">
        <button type="button" onClick={() => setKind("all")} className={chip(kind === "all")}>
          Všetko ({documents.length})
        </button>
        <button type="button" onClick={() => setKind("file")} className={chip(kind === "file")}>
          Súbory na stiahnutie ({counts.file})
        </button>
        <button type="button" onClick={() => setKind("link")} className={chip(kind === "link")}>
          Odkazy na web ({counts.link})
        </button>
        {counts.pending > 0 && (
          <button
            type="button"
            onClick={() => setKind("pending")}
            className={chip(kind === "pending")}
          >
            Zatiaľ nezverejnené ({counts.pending})
          </button>
        )}
      </div>

      <p className="mb-6 text-sm text-ink-500" aria-live="polite">
        Zobrazených {filtered.length} z {documents.length} položiek
      </p>

      {filtered.length === 0 ? (
        <p className="rounded-lg border border-ink-200 bg-ink-50 p-6 text-center text-sm text-ink-500">
          Žiadna položka nezodpovedá zadaným kritériám.
        </p>
      ) : (
        <div className="space-y-10">
          {GROUPS.map((g) => {
            const items = filtered.filter((d) => docKind(d) === g.kind);
            if (items.length === 0) return null;
            return (
              <section key={g.kind}>
                <h2 className="display text-2xl text-ink-900">{g.title}</h2>
                <p className="mb-5 mt-1.5 max-w-3xl text-sm leading-relaxed text-ink-600">
                  {g.intro}
                </p>
                <ul className="space-y-4">
                  {items.map((d) => (
                    <li key={d.id} id={d.id}>
                      <DocumentCard doc={d} />
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}

function DocumentCard({ doc: d }: { doc: DocumentItem }) {
  const kind = docKind(d);
  return (
    <article className="scroll-mt-24 rounded-[var(--radius-card)] border border-ink-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-center gap-2 text-xs">
        {/* Druh položky ako prvý – čitateľ hneď vie, čo dostane */}
        {kind === "file" && (
          <span className="rounded bg-emerald-50 px-2 py-0.5 font-bold uppercase tracking-wide text-emerald-800 ring-1 ring-emerald-200">
            {fileExt(d.fileUrl!)}
          </span>
        )}
        {kind === "link" && (
          <span className="rounded bg-ink-100 px-2 py-0.5 font-bold uppercase tracking-wide text-ink-600 ring-1 ring-ink-300">
            Odkaz na web
          </span>
        )}
        {kind === "pending" && (
          <span className="rounded bg-amber-50 px-2 py-0.5 font-bold uppercase tracking-wide text-amber-800 ring-1 ring-amber-200">
            Bez súboru
          </span>
        )}
        <span className="rounded bg-brand-50 px-2 py-0.5 font-medium text-brand-700 ring-1 ring-brand-200">
          {DOCUMENT_CATEGORY_LABEL[d.category]}
        </span>
        <span className="text-ink-500">{formatDateSk(d.date)}</span>
        {d.isPlaceholder && <PlaceholderBadge />}
      </div>

      <h3 className="display mt-2 text-xl text-ink-900">{d.title}</h3>
      <p className="mt-1.5 leading-relaxed text-ink-600">{d.summary}</p>
      <p className="mt-2 text-xs text-ink-500">Vydal / autor: {d.issuer}</p>

      {d.keyFindings && d.keyFindings.length > 0 && (
        <div className="mt-3">
          <p className="eyebrow text-ink-400">Hlavné závery</p>
          <ul className="mt-2 space-y-1.5 border-l-2 border-brand-200 pl-4 text-sm leading-relaxed text-ink-700">
            {d.keyFindings.map((k, i) => (
              <li key={i}>{k}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-4 flex flex-wrap gap-3 text-sm">
        {d.fileUrl && (
          <a
            href={d.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg bg-brand-700 px-3 py-1.5 font-semibold text-white hover:bg-brand-800"
          >
            Otvoriť {fileExt(d.fileUrl)} →
          </a>
        )}
        {d.sourceUrl && (
          <a
            href={d.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg border border-ink-300 px-3 py-1.5 font-medium text-ink-700 hover:bg-ink-50"
          >
            {d.fileUrl ? "Pôvodný zdroj →" : "Otvoriť stránku →"}
          </a>
        )}
        {kind === "pending" && (
          <span className="inline-flex items-center gap-1.5 rounded-lg bg-ink-100 px-3 py-1.5 font-medium text-ink-500">
            Súbor zatiaľ nemáme
          </span>
        )}
      </div>
    </article>
  );
}
