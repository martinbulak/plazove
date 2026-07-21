import type { ReviewAnalysis } from "@/lib/types";
import { Card } from "@/components/ui";
import { formatDateSk } from "@/lib/utils";

/**
 * Analýza verejných hodnotení na Google: rozloženie hviezd, opakujúce sa témy
 * sťažností a ukážky konkrétnych recenzií.
 *
 * Metodická poznámka je súčasťou komponentu zámerne – čitateľ musí vedieť,
 * že témy sú odvodené z obmedzenej prečítanej vzorky, nie zo všetkých recenzií.
 */
export function ReviewAnalysisBlock({ data }: { data: ReviewAnalysis }) {
  const negative = data.distribution
    .filter((d) => d.stars <= 2)
    .reduce((sum, d) => sum + d.count, 0);
  const negativeShare = Math.round((negative / data.totalReviews) * 1000) / 10;
  const maxCount = Math.max(...data.distribution.map((d) => d.count));
  const hasCounts = data.themes.some((t) => typeof t.count === "number");
  const maxTheme = Math.max(...data.themes.map((t) => t.count ?? 0), 1);

  return (
    <div>
      {/* Súhrn + rozloženie hviezd */}
      <div className="grid gap-4 lg:grid-cols-[auto_1fr]">
        <Card className="flex flex-col items-center justify-center text-center lg:w-56">
          <p className="text-5xl font-extrabold text-ink-900">
            {data.average.toFixed(1).replace(".", ",")}
          </p>
          <p className="mt-1 text-accent-500" aria-hidden>
            ★★★★★
          </p>
          <p className="mt-1 text-sm text-ink-500">
            {data.totalReviews.toLocaleString("sk-SK")} hodnotení
          </p>
          <p className="mt-3 rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-800 ring-1 ring-rose-200">
            {negativeShare.toString().replace(".", ",")} % dalo 1–2 hviezdy
          </p>
        </Card>

        <Card>
          <p className="mb-3 text-sm font-semibold text-ink-800">
            Ako návštevníci hodnotia
          </p>
          <ul className="space-y-1.5">
            {data.distribution
              .slice()
              .sort((a, b) => b.stars - a.stars)
              .map((d) => (
                <li key={d.stars} className="flex items-center gap-3 text-sm">
                  <span className="w-10 shrink-0 tabular-nums text-ink-600">
                    {d.stars} <span className="text-accent-500">★</span>
                  </span>
                  <span className="h-2.5 flex-1 overflow-hidden rounded-full bg-ink-100">
                    <span
                      className={`block h-full rounded-full ${
                        d.stars <= 2 ? "bg-rose-400" : "bg-brand-400"
                      }`}
                      style={{ width: `${(d.count / maxCount) * 100}%` }}
                    />
                  </span>
                  <span className="w-12 shrink-0 text-right tabular-nums text-ink-500">
                    {d.count}
                  </span>
                </li>
              ))}
          </ul>
          <p className="mt-3 text-xs text-ink-500">
            Zdroj: Mapy Google, stav k {formatDateSk(data.checkedAt)}.
          </p>
        </Card>
      </div>

      {/* Témy sťažností */}
      {data.themes.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-bold text-ink-900">
            Najčastejšie dôvody nespokojnosti
          </h3>
          <p className="mt-1 max-w-3xl text-sm text-ink-600">
            {hasCounts ? (
              <>
                Témy sme určili prečítaním vzorky {data.analysedSample}{" "}
                negatívnych hodnotení. Čísla vyjadrujú, koľkokrát sa téma v tejto
                vzorke objavila – nejde o rozbor všetkých{" "}
                {data.totalReviews.toLocaleString("sk-SK")} recenzií.
              </>
            ) : (
              <>
                Podrobne sme prečítali {data.analysedSample} hodnotení a doplnili
                ich o doložené verejné vyjadrenia mesta a dôvody uvedené v petícii.
                Zámerne <strong>neuvádzame početnosť</strong> – takáto vzorka nie je
                dosť veľká na štatistické závery o všetkých{" "}
                {data.totalReviews.toLocaleString("sk-SK")} recenziách. Pri každej
                téme preto uvádzame konkrétne zdroje.
              </>
            )}
          </p>

          <ul className="mt-4 space-y-3">
            {data.themes
              .slice()
              .sort((a, b) => (b.count ?? 0) - (a.count ?? 0))
              .map((t) => (
                <li key={t.id}>
                  <Card>
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <p className="font-semibold text-ink-900">{t.label}</p>
                      {typeof t.count === "number" && (
                        <span className="shrink-0 rounded-full bg-ink-100 px-2.5 py-0.5 text-xs font-semibold tabular-nums text-ink-700">
                          {t.count}× vo vzorke
                        </span>
                      )}
                    </div>
                    {typeof t.count === "number" && (
                      <span className="mt-2 block h-1.5 overflow-hidden rounded-full bg-ink-100">
                        <span
                          className="block h-full rounded-full bg-brand-500"
                          style={{ width: `${(t.count / maxTheme) * 100}%` }}
                        />
                      </span>
                    )}
                    <p className="mt-2 text-sm text-ink-600">{t.description}</p>
                    {t.evidence && t.evidence.length > 0 && (
                      <ul className="mt-2 space-y-0.5 text-xs text-ink-500">
                        {t.evidence.map((e, i) => (
                          <li key={i}>↳ {e}</li>
                        ))}
                      </ul>
                    )}
                  </Card>
                </li>
              ))}
          </ul>
        </div>
      )}

      {/* Ukážky recenzií */}
      {data.samples.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-bold text-ink-900">Ukážky hodnotení</h3>
          <p className="mt-1 max-w-3xl text-sm text-ink-600">
            Krátke úryvky z verejne publikovaných recenzií. Ide o názory
            konkrétnych návštevníkov, nie o tvrdenia prevádzkovateľa tohto webu.
            Mená uvádzame skrátene.
          </p>

          <ul className="mt-4 grid gap-4 sm:grid-cols-2">
            {data.samples.map((s) => (
              <li key={s.id}>
                <Card className="flex h-full flex-col">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-accent-500" aria-label={`${s.stars} z 5 hviezd`}>
                      {"★".repeat(s.stars)}
                      <span className="text-ink-300">{"★".repeat(5 - s.stars)}</span>
                    </span>
                    <span className="text-xs text-ink-500">{s.platform}</span>
                  </div>

                  <blockquote className="mt-3 flex-1 border-l-2 border-ink-200 pl-3 text-sm text-ink-800">
                    „{s.excerpt}"
                  </blockquote>

                  <p className="mt-3 text-xs text-ink-500">
                    {s.author} · {s.date}
                  </p>
                  {s.ownerReplied && (
                    <p className="mt-1 text-xs font-medium text-emerald-700">
                      ✓ Prevádzkovateľ na recenziu verejne odpovedal
                    </p>
                  )}
                </Card>
              </li>
            ))}
          </ul>

          {data.sourceUrl && (
            <a
              href={data.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-block text-sm font-medium text-brand-700 underline"
            >
              Zobraziť všetky recenzie na Mapách Google →
            </a>
          )}
        </div>
      )}
    </div>
  );
}
