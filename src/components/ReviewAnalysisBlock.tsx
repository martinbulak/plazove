import type { ReviewAnalysis } from "@/lib/types";
import { StatTile, StarDistribution } from "@/components/charts";
import { formatDateSk } from "@/lib/utils";

/**
 * Analýza verejných hodnotení na Google: rozloženie hviezd, opakujúce sa témy
 * sťažností a ukážky konkrétnych recenzií.
 *
 * Metodická poznámka je súčasťou komponentu zámerne – čitateľ musí vedieť,
 * že témy sú odvodené z obmedzenej prečítanej vzorky, nie zo všetkých recenzií.
 */

/** Piktogram k téme sťažnosti – uľahčuje skenovanie zoznamu. */
const THEME_ICON: Record<string, string> = {
  "th-technicky-stav": "🔧",
  "th-voda": "💧",
  "th-cena": "€",
  "th-hygiena": "🚿",
  "th-gastro": "🍽",
  "th-personal": "🗣",
  "th-investicie": "🏗",
};

export function ReviewAnalysisBlock({ data }: { data: ReviewAnalysis }) {
  const negative = data.distribution
    .filter((d) => d.stars <= 2)
    .reduce((sum, d) => sum + d.count, 0);
  const positive = data.distribution
    .filter((d) => d.stars >= 4)
    .reduce((sum, d) => sum + d.count, 0);
  const negativeShare = Math.round((negative / data.totalReviews) * 100);
  const positiveShare = Math.round((positive / data.totalReviews) * 100);
  const hasCounts = data.themes.some((t) => typeof t.count === "number");

  return (
    <div>
      {/* Prehľad v číslach */}
      <dl className="mb-10 grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile
          value={data.average.toFixed(1).replace(".", ",")}
          label="Priemerné hodnotenie"
          hint="na škále 1 – 5"
        />
        <StatTile
          value={data.totalReviews.toLocaleString("sk-SK")}
          label="Počet hodnotení"
          hint={`stav k ${formatDateSk(data.checkedAt)}`}
        />
        <StatTile
          value={`${negativeShare} %`}
          label="Dalo 1 – 2 hviezdy"
          hint={`${negative.toLocaleString("sk-SK")} hodnotení`}
          tone="negative"
        />
        <StatTile
          value={`${positiveShare} %`}
          label="Dalo 4 – 5 hviezd"
          hint={`${positive.toLocaleString("sk-SK")} hodnotení`}
        />
      </dl>

      {/* Graf rozloženia */}
      <div className="rounded-xl border border-ink-200 bg-white p-5 sm:p-6">
        <h3 className="display mb-1 text-xl text-ink-900">Ako ľudia hodnotia</h3>
        <p className="mb-5 text-sm text-ink-500">
          Zdroj: Mapy Google, stav k {formatDateSk(data.checkedAt)}. Hodnotenia sa
          v čase menia.
        </p>
        <StarDistribution distribution={data.distribution} total={data.totalReviews} />
      </div>

      {/* Témy sťažností */}
      {data.themes.length > 0 && (
        <div className="mt-10">
          <h3 className="display text-xl text-ink-900">
            Najčastejšie dôvody nespokojnosti
          </h3>
          <p className="mt-1.5 max-w-3xl text-sm leading-relaxed text-ink-600">
            {hasCounts ? (
              <>
                Témy sme určili prečítaním vzorky {data.analysedSample} negatívnych
                hodnotení.
              </>
            ) : (
              <>
                Podrobne sme prečítali {data.analysedSample} hodnotení a doplnili ich
                o doložené verejné vyjadrenia mesta a dôvody uvedené v petícii.
                Zámerne <strong>neuvádzame početnosť</strong> – takáto vzorka nie je
                dosť veľká na štatistické závery o všetkých{" "}
                {data.totalReviews.toLocaleString("sk-SK")} recenziách.
              </>
            )}
          </p>

          <ul className="mt-5 grid gap-px overflow-hidden rounded-xl bg-ink-200 sm:grid-cols-2">
            {data.themes
              .slice()
              .sort((a, b) => (b.count ?? 0) - (a.count ?? 0))
              .map((t) => (
                <li key={t.id} className="bg-white p-5">
                  <div className="flex items-start gap-3">
                    <span
                      aria-hidden
                      className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-brand-50 text-base text-brand-800 ring-1 ring-brand-100"
                    >
                      {THEME_ICON[t.id] ?? "•"}
                    </span>
                    <div className="min-w-0">
                      <p className="font-semibold leading-snug text-ink-900">
                        {t.label}
                      </p>
                      {typeof t.count === "number" && (
                        <span className="mt-1 inline-block rounded bg-ink-100 px-1.5 py-0.5 text-[11px] font-bold tabular-nums text-ink-600">
                          {t.count}× vo vzorke
                        </span>
                      )}
                      <p className="mt-2 text-sm leading-relaxed text-ink-600">
                        {t.description}
                      </p>

                      {t.evidence && t.evidence.length > 0 && (
                        <details className="group mt-3">
                          <summary className="cursor-pointer list-none text-xs font-semibold text-brand-700 hover:underline [&::-webkit-details-marker]:hidden">
                            <span className="group-open:hidden">
                              Na čom to stojí ({t.evidence.length}) ↓
                            </span>
                            <span className="hidden group-open:inline">Skryť ↑</span>
                          </summary>
                          <ul className="mt-2 space-y-1.5 border-l-2 border-ink-200 pl-3 text-xs leading-relaxed text-ink-500">
                            {t.evidence.map((e, i) => (
                              <li key={i}>{e}</li>
                            ))}
                          </ul>
                        </details>
                      )}
                    </div>
                  </div>
                </li>
              ))}
          </ul>
        </div>
      )}

      {/* Ukážky recenzií */}
      {data.samples.length > 0 && (
        <div className="mt-10">
          <h3 className="display text-xl text-ink-900">Ukážky hodnotení</h3>
          <p className="mt-1.5 max-w-3xl text-sm leading-relaxed text-ink-600">
            Krátke úryvky z verejne publikovaných recenzií. Ide o názory konkrétnych
            návštevníkov, nie o tvrdenia prevádzkovateľa tohto webu. Mená uvádzame
            skrátene.
          </p>

          <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data.samples.map((s) => (
              <li key={s.id}>
                <figure className="flex h-full flex-col rounded-xl border border-ink-200 bg-white p-5">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className="text-sm tracking-tight"
                      aria-label={`${s.stars} z 5 hviezd`}
                    >
                      <span className="text-accent-500">{"★".repeat(s.stars)}</span>
                      <span className="text-ink-300">{"★".repeat(5 - s.stars)}</span>
                    </span>
                    <span className="text-[11px] font-medium uppercase tracking-wide text-ink-400">
                      {s.platform}
                    </span>
                  </div>

                  <blockquote className="mt-3 flex-1 font-display text-[0.95rem] italic leading-relaxed text-ink-700">
                    „{s.excerpt}"
                  </blockquote>

                  <figcaption className="mt-4 border-t border-ink-100 pt-3 text-xs text-ink-500">
                    {s.author} · {s.date}
                    {s.ownerReplied && (
                      <span className="mt-1 block font-medium text-emerald-700">
                        ✓ Prevádzkovateľ verejne odpovedal
                      </span>
                    )}
                  </figcaption>
                </figure>
              </li>
            ))}
          </ul>

          {data.sourceUrl && (
            <a
              href={data.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-brand-700 underline"
            >
              Zobraziť všetky recenzie na Mapách Google →
            </a>
          )}
        </div>
      )}
    </div>
  );
}
