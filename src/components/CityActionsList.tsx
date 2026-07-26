import { StatusBadge, SourceList } from "@/components/ui";
import { formatDateSk } from "@/lib/utils";
import type { CityAction } from "@/lib/types";

/**
 * Kompaktný zoznam krokov mesta.
 *
 * V zbalenom stave je vidieť len dátum, názov kroku a stav plnenia – tabuľka
 * sa tak dá prebehnúť očami. Podrobnosti a zdroje si čitateľ rozbalí.
 * Použité je natívne <details>, takže obsah je dostupný aj bez JavaScriptu
 * a klávesnicová obsluha funguje bez vlastného kódu.
 *
 * Rozloženie hlavičky riadku:
 *  – mobil: dátum a stav na prvom riadku, názov kroku pod nimi cez celú šírku,
 *  – od sm: jeden riadok v mriežke dátum | názov | stav | šípka. Na desktope sa
 *    obaľovacie spany menia na `display: contents`, poradie rieši `order`.
 */
export function CityActionsList({ items }: { items: CityAction[] }) {
  return (
    <div className="overflow-hidden rounded-[var(--radius-card)] border border-ink-200 bg-white">
      <div className="hidden items-center gap-x-3 border-b border-ink-200 bg-ink-50 px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-ink-500 sm:grid sm:grid-cols-[8rem_1fr_7.5rem_1rem]">
        <span>Dátum</span>
        <span>Krok / prísľub</span>
        <span>Stav</span>
        <span aria-hidden />
      </div>

      <ul className="divide-y divide-ink-100">
        {items.map((a) => {
          const hasDetail = Boolean(a.note) || (a.sources?.length ?? 0) > 0;

          const head = (
            <>
              <span className="flex items-center justify-between gap-3 sm:contents">
                <span className="font-mono text-xs text-ink-500 sm:order-1">
                  {formatDateSk(a.date)}
                </span>
                <span className="flex shrink-0 items-center gap-2 sm:contents">
                  <span className="sm:order-3">
                    <StatusBadge status={a.actionStatus} />
                  </span>
                  {hasDetail ? (
                    <Chevron />
                  ) : (
                    <span className="w-4 shrink-0 sm:order-4" aria-hidden />
                  )}
                </span>
              </span>
              <span className="font-medium text-ink-900 sm:order-2">{a.step}</span>
            </>
          );

          const headClass =
            "flex flex-col gap-1 px-4 py-3 sm:grid sm:grid-cols-[8rem_1fr_7.5rem_1rem] sm:items-center sm:gap-x-3 sm:gap-y-0";

          return (
            <li key={a.id}>
              {hasDetail ? (
                <details className="group">
                  <summary
                    className={`${headClass} cursor-pointer list-none hover:bg-ink-50 focus-visible:bg-ink-50 [&::-webkit-details-marker]:hidden`}
                  >
                    {head}
                  </summary>
                  {/* Odsadenie = px-4 (16px) + stĺpec dátumu (128px) + gap-x-3 (12px). */}
                  <div className="border-t border-ink-100 bg-paper px-4 pb-4 pt-3 sm:pl-[9.75rem]">
                    {a.note && (
                      <p className="text-sm leading-relaxed text-ink-700">{a.note}</p>
                    )}
                    <SourceList sources={a.sources} />
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
