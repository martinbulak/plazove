import type { ReactNode } from "react";

/**
 * Kompaktný rozbaľovací zoznam pre prehľadové sekcie.
 *
 * V zbalenom stave je vidieť len nadpis položky, voliteľný ľavý stĺpec
 * (napr. dátum) a odznak stavu – zoznam sa tak dá prebehnúť očami.
 * Podrobnosti si čitateľ rozbalí kliknutím na riadok.
 *
 * Použité je natívne <details>, takže obsah je dostupný aj bez JavaScriptu
 * a klávesnicová obsluha funguje bez vlastného kódu.
 *
 * Rozloženie riadku:
 *  – mobil: ľavý stĺpec a odznak na prvom riadku, nadpis pod nimi cez celú šírku,
 *  – od sm: jeden riadok v mriežke [lead] | nadpis | stav | šípka. Obaľovacie
 *    spany sa na desktope menia na `display: contents`, poradie rieši `order`.
 */
export interface DisclosureItem {
  id: string;
  /** Voliteľný ľavý stĺpec – napríklad dátum. */
  lead?: string;
  title: string;
  /** Odznak stavu vpravo. */
  badge?: ReactNode;
  /** Obsah, ktorý sa zobrazí po rozbalení. Ak chýba, riadok sa nerozbaľuje. */
  detail?: ReactNode;
}

export function DisclosureList({
  items,
  headings,
}: {
  items: DisclosureItem[];
  /** Popisky stĺpcov v hlavičke: [lead?, nadpis, stav]. */
  headings: [string, string, string] | [string, string];
}) {
  const withLead = headings.length === 3;
  /**
   * Stĺpec stavu má pevnú šírku, aby hlavička a riadky (dve samostatné
   * mriežky) zarovnali stĺpce rovnako. 11.5rem sa zmestí aj najdlhší
   * odznak „Bez verejnej odpovede".
   */
  const grid = withLead
    ? "sm:grid-cols-[8rem_1fr_11.5rem_1rem]"
    : "sm:grid-cols-[1fr_11.5rem_1rem]";
  /** Odsadenie rozbaleného obsahu = px-4 + prípadný stĺpec lead + gap-x-3. */
  const detailPad = withLead ? "sm:pl-[9.75rem]" : "";
  const headClass = `flex flex-col gap-1 px-4 py-3 sm:grid ${grid} sm:items-center sm:gap-x-3 sm:gap-y-0`;

  return (
    <div className="overflow-hidden rounded-[var(--radius-card)] border border-ink-200 bg-white">
      <div
        className={`hidden items-center gap-x-3 border-b border-ink-200 bg-ink-50 px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-ink-500 sm:grid ${grid}`}
      >
        {headings.map((h) => (
          <span key={h}>{h}</span>
        ))}
        <span aria-hidden />
      </div>

      <ul className="divide-y divide-ink-100">
        {items.map((item) => {
          const head = (
            <>
              {/* Bez ľavého stĺpca nie je čo rozostupovať – odznak ide doprava. */}
              <span
                className={`flex items-center gap-3 sm:contents ${
                  item.lead ? "justify-between" : "justify-end"
                }`}
              >
                {item.lead && (
                  <span className="font-mono text-xs text-ink-500 sm:order-1">
                    {item.lead}
                  </span>
                )}
                <span className="flex shrink-0 items-center gap-2 sm:contents">
                  <span className="sm:order-3">{item.badge}</span>
                  {item.detail ? (
                    <Chevron />
                  ) : (
                    <span className="w-4 shrink-0 sm:order-4" aria-hidden />
                  )}
                </span>
              </span>
              <span className="font-medium text-ink-900 sm:order-2">{item.title}</span>
            </>
          );

          return (
            <li key={item.id}>
              {item.detail ? (
                <details className="group">
                  <summary
                    className={`${headClass} cursor-pointer list-none hover:bg-ink-50 focus-visible:bg-ink-50 [&::-webkit-details-marker]:hidden`}
                  >
                    {head}
                  </summary>
                  <div
                    className={`border-t border-ink-100 bg-paper px-4 pb-4 pt-3 ${detailPad}`}
                  >
                    {item.detail}
                  </div>
                </details>
              ) : (
                <div className={headClass}>{head}</div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/** Šípka, ktorá sa po rozbalení otočí. */
function Chevron() {
  return (
    <svg
      aria-hidden
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      className="w-4 shrink-0 text-ink-400 transition-transform group-open:rotate-180 sm:order-4"
    >
      <path
        d="M6 9l6 6 6-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
