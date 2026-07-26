import { cn } from "@/lib/utils";

/**
 * Grafové komponenty.
 *
 * Farebná škála je overená validátorom (viď tokeny --color-chart-* v globals.css).
 * Zásady, ktoré tu držíme:
 *  – každý stĺpec má vždy viditeľný priamy popisok (hodnota aj podiel),
 *    takže graf sa dá prečítať aj bez farieb,
 *  – identitu nenesie iba farba (popisky + poradie + tvar),
 *  – osi a mriežka sú potlačené, dáta sú najvýraznejší prvok.
 */

/* ── Veľké číslo (stat tile) ─────────────────────────────────────────── */

export function StatTile({
  value,
  label,
  hint,
  tone = "neutral",
}: {
  value: string;
  label: string;
  hint?: string;
  tone?: "neutral" | "negative";
}) {
  return (
    <div className="border-t-2 border-ink-900 pt-3">
      <p
        className={cn(
          "display text-3xl",
          tone === "negative" ? "text-[var(--color-chart-neg)]" : "text-ink-900",
        )}
      >
        {value}
      </p>
      <p className="mt-1 text-sm font-medium leading-snug text-ink-800">{label}</p>
      {hint && <p className="mt-0.5 text-xs leading-snug text-ink-500">{hint}</p>}
    </div>
  );
}

/* ── Rozloženie hodnotení (divergentná škála) ────────────────────────── */

export function StarDistribution({
  distribution,
  total,
}: {
  distribution: { stars: number; count: number }[];
  total: number;
}) {
  const rows = [...distribution].sort((a, b) => b.stars - a.stars);
  const max = Math.max(...rows.map((r) => r.count));

  const toneFor = (stars: number) =>
    stars <= 2
      ? "var(--color-chart-neg)"
      : stars === 3
        ? "var(--color-chart-mid)"
        : "var(--color-chart-pos)";

  return (
    <figure>
      <figcaption className="sr-only">
        Rozloženie hodnotení podľa počtu hviezd
      </figcaption>

      {/* Legenda – identita nie je nesená iba farbou */}
      <ul className="mb-4 flex flex-wrap gap-x-5 gap-y-1.5 text-xs text-ink-600">
        {[
          { c: "var(--color-chart-neg)", l: "1–2 hviezdy (kritické)" },
          { c: "var(--color-chart-mid)", l: "3 hviezdy (neutrálne)" },
          { c: "var(--color-chart-pos)", l: "4–5 hviezd (pozitívne)" },
        ].map((i) => (
          <li key={i.l} className="flex items-center gap-1.5">
            <span
              aria-hidden
              className="h-2.5 w-2.5 rounded-sm"
              style={{ background: i.c }}
            />
            {i.l}
          </li>
        ))}
      </ul>

      <ul className="space-y-1.5">
        {rows.map((r) => {
          const pct = (r.count / total) * 100;
          return (
            <li key={r.stars} className="flex items-center gap-2 sm:gap-3">
              <span className="w-9 shrink-0 text-right text-sm tabular-nums text-ink-600 sm:w-11">
                {r.stars} <span className="text-accent-500">★</span>
              </span>

              <span className="relative h-6 flex-1 overflow-hidden rounded-sm bg-ink-100">
                <span
                  className="block h-full rounded-r-[4px]"
                  style={{
                    width: `${Math.max((r.count / max) * 100, 1.5)}%`,
                    background: toneFor(r.stars),
                  }}
                />
              </span>

              <span className="flex w-[5.5rem] shrink-0 items-baseline justify-end gap-1.5 text-sm tabular-nums text-ink-700 sm:w-28">
                <span className="font-semibold">{r.count}</span>
                <span aria-hidden className="text-ink-300">·</span>
                <span className="w-9 text-right text-ink-500">
                  {pct.toFixed(0)} %
                </span>
              </span>
            </li>
          );
        })}
      </ul>
    </figure>
  );
}

/* ── Rebríček podľa počtu recenzií (návštevnosť) ─────────────────────── */

export function ReviewVolumeRanking({ rows }: { rows: RankRow[] }) {
  const max = Math.max(...rows.map((r) => r.reviews), 1);

  return (
    <figure>
      <figcaption className="mb-4 text-sm text-ink-500">
        Zoradené podľa počtu hodnotení na Google – čím viac hodnotení, tým
        navštevovanejšie zariadenie. Vpravo je priemerné hodnotenie a overená
        rozloha.
      </figcaption>

      <ul className="space-y-2">
        {rows.map((r, i) => {
          const w = (r.reviews / max) * 100;
          return (
            <li
              key={r.id}
              className={cn(
                "grid grid-cols-[1.5rem_1fr] items-center gap-x-3 gap-y-1 rounded-md py-1.5 sm:grid-cols-[1.5rem_14rem_1fr_8.5rem]",
                r.highlight && "bg-[var(--color-chart-neg)]/8 px-2",
              )}
            >
              <span aria-hidden className="section-number text-sm text-ink-400">
                {i + 1}
              </span>

              <span className="col-start-2 min-w-0">
                <span
                  className={cn(
                    "block truncate text-sm leading-snug",
                    r.highlight ? "font-bold text-ink-900" : "font-medium text-ink-800",
                  )}
                >
                  {r.name}
                </span>
                <span className="block truncate text-xs text-ink-500">
                  {r.place}
                  {haLabel(r.areaM2) && (
                    <span className="ml-1.5 whitespace-nowrap rounded bg-ink-100 px-1.5 py-0.5 font-medium tabular-nums text-ink-600">
                      {haLabel(r.areaM2)}
                    </span>
                  )}
                </span>
              </span>

              <span className="col-span-2 col-start-1 flex items-center gap-3 sm:col-span-1 sm:col-start-3">
                <span className="relative h-3.5 flex-1 overflow-hidden rounded-sm bg-ink-100">
                  <span
                    className="block h-full rounded-r-[4px]"
                    style={{
                      width: `${Math.max(w, 2)}%`,
                      background: r.highlight
                        ? "var(--color-chart-neg)"
                        : "var(--color-chart-pos)",
                    }}
                  />
                </span>
                <span className="w-14 shrink-0 text-right text-sm tabular-nums text-ink-700 sm:hidden">
                  {r.reviews.toLocaleString("sk-SK")}
                </span>
              </span>

              <span className="hidden items-baseline justify-end gap-2 sm:flex">
                <span
                  className={cn(
                    "text-sm tabular-nums",
                    r.highlight ? "font-bold text-ink-900" : "font-semibold text-ink-800",
                  )}
                >
                  {r.reviews.toLocaleString("sk-SK")}
                </span>
                <span className="whitespace-nowrap text-xs tabular-nums text-ink-400">
                  ★ {r.rating.toFixed(1).replace(".", ",")}
                </span>
              </span>
            </li>
          );
        })}
      </ul>
    </figure>
  );
}

/* ── Rebríček hodnotení kúpalísk ─────────────────────────────────────── */

export interface RankRow {
  id: string;
  name: string;
  place: string;
  rating: number;
  reviews: number;
  areaM2?: number;
  highlight?: boolean;
}

/** Rozloha v hektároch pre kompaktný štítok, napr. „3,7 ha“. */
function haLabel(m2?: number): string | null {
  if (!m2) return null;
  const ha = m2 / 10000;
  return `${ha.toFixed(1).replace(".", ",")} ha`;
}

export function RatingRanking({
  rows,
  min = 3,
  max = 5,
}: {
  rows: RankRow[];
  min?: number;
  max?: number;
}) {
  const span = max - min;

  return (
    <figure>
      <figcaption className="mb-4 text-sm text-ink-500">
        Priemerné hodnotenie na Google (škála {min}–{max}). Zvýraznené je plážové
        kúpalisko v Banskej Bystrici.
      </figcaption>

      <ul className="space-y-2">
        {rows.map((r, i) => {
          const w = ((r.rating - min) / span) * 100;
          return (
            <li
              key={r.id}
              className={cn(
                "grid grid-cols-[1.5rem_1fr] items-center gap-x-3 gap-y-1 rounded-md py-1.5 sm:grid-cols-[1.5rem_13rem_1fr_5.5rem]",
                r.highlight && "bg-[var(--color-chart-neg)]/8 px-2",
              )}
            >
              <span
                aria-hidden
                className="section-number text-sm text-ink-400"
              >
                {i + 1}
              </span>

              <span className="col-start-2 min-w-0">
                <span
                  className={cn(
                    "block truncate text-sm leading-snug",
                    r.highlight ? "font-bold text-ink-900" : "font-medium text-ink-800",
                  )}
                >
                  {r.name}
                </span>
                <span className="block truncate text-xs text-ink-500">
                  {r.place}
                  {haLabel(r.areaM2) && (
                    <span className="ml-1.5 whitespace-nowrap rounded bg-ink-100 px-1.5 py-0.5 font-medium tabular-nums text-ink-600">
                      {haLabel(r.areaM2)}
                    </span>
                  )}
                </span>
              </span>

              <span className="col-span-2 col-start-1 flex items-center gap-3 sm:col-span-1 sm:col-start-3">
                <span className="relative h-3.5 flex-1 overflow-hidden rounded-sm bg-ink-100">
                  <span
                    className="block h-full rounded-r-[4px]"
                    style={{
                      width: `${Math.max(w, 2)}%`,
                      background: r.highlight
                        ? "var(--color-chart-neg)"
                        : "var(--color-chart-pos)",
                    }}
                  />
                </span>
                <span
                  className={cn(
                    "w-8 shrink-0 text-sm tabular-nums sm:hidden",
                    r.highlight ? "font-bold text-ink-900" : "text-ink-700",
                  )}
                >
                  {r.rating.toFixed(1).replace(".", ",")}
                </span>
              </span>

              <span className="hidden items-baseline justify-end gap-2 sm:flex">
                <span
                  className={cn(
                    "text-sm tabular-nums",
                    r.highlight ? "font-bold text-ink-900" : "font-semibold text-ink-800",
                  )}
                >
                  {r.rating.toFixed(1).replace(".", ",")}
                </span>
                <span className="text-xs tabular-nums text-ink-400">
                  {r.reviews.toLocaleString("sk-SK")}
                </span>
              </span>
            </li>
          );
        })}
      </ul>

      <p className="mt-3 text-xs text-ink-500">
        Druhé číslo vpravo je počet recenzií, z ktorých hodnotenie vychádza.
      </p>
    </figure>
  );
}
