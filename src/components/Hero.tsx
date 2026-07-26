import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui";
import type { SiteConfig, ReviewAnalysis, GalleryItem } from "@/lib/types";

/**
 * Hero: vľavo tvrdenie a výzva, vpravo dôkaz – fotografia stavu areálu
 * a zhrnutie verejných hodnotení s konkrétnym citátom.
 */
export function Hero({
  site,
  reviews,
  photos = [],
  quoteId,
}: {
  site: SiteConfig;
  reviews: ReviewAnalysis | null;
  /** Fotografie do koláže – prvá je hlavná, ďalšie dve menšie. */
  photos?: GalleryItem[];
  /** Recenzia, ktorá tematicky sedí k fotkám. */
  quoteId?: string;
}) {
  const quote =
    reviews?.samples.find((s) => s.id === quoteId) ??
    reviews?.samples.find((s) => s.stars <= 2) ??
    reviews?.samples[0];
  const [main, ...rest] = photos;
  const negative = reviews
    ? reviews.distribution
        .filter((d) => d.stars <= 2)
        .reduce((s, d) => s + d.count, 0)
    : 0;
  const negativeShare = reviews
    ? Math.round((negative / reviews.totalReviews) * 100)
    : 0;

  return (
    <section className="hero-wash relative overflow-hidden border-b border-ink-200">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:py-20">
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
          {/* ── Ľavý stĺpec: tvrdenie a výzva ── */}
          <div className="lg:col-span-7">
            <p className="eyebrow mb-5 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-brand-700 ring-1 ring-brand-200">
              <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-accent-500" />
              {site.tagline}
            </p>

            <h1 className="display text-[2.6rem] text-ink-900 sm:text-[3.4rem] lg:text-[3.75rem]">
              Zachráňme plážové kúpalisko
              <span className="mt-1 block text-brand-700">v Banskej Bystrici</span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-600">
              Areál patrí mestu, no od roku 2007 ho má v nájme súkromná firma –
              až do roku 2037. Zhromažďujeme dokumenty, fakty a dôkazy o jeho
              stave, aby mesto muselo konať.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="/podporte" variant="accent">
                Podporiť výzvu
              </Button>
              <Button href="/pripad" variant="primary">
                Čo sa stalo →
              </Button>
            </div>

            <p className="mt-6 max-w-xl border-l-2 border-ink-300 pl-4 text-sm leading-relaxed text-ink-500">
              {site.disclaimer}
            </p>
          </div>

          {/* ── Pravý stĺpec: dôkaz (fotka + hodnotenia) ── */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-md lg:mx-0">
              {main && (
                <figure className="relative">
                  {/* Koláž: jedna hlavná fotka + dve menšie vedľa seba */}
                  <div className="grid grid-cols-3 gap-2">
                    <div className="relative col-span-3 aspect-[4/3] overflow-hidden rounded-xl bg-ink-100 shadow-lg ring-1 ring-ink-900/10">
                      <Image
                        src={main.src}
                        alt={main.alt}
                        fill
                        priority
                        sizes="(max-width: 1024px) 90vw, 30rem"
                        className="object-cover"
                      />
                      <span className="absolute left-3 top-3 rounded-md bg-ink-900/80 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
                        Stav areálu · {main.date}
                      </span>
                    </div>

                    {rest.slice(0, 2).map((p) => (
                      <div
                        key={p.id}
                        className="relative col-span-1 aspect-[4/3] overflow-hidden rounded-lg bg-ink-100 shadow-md ring-1 ring-ink-900/10"
                      >
                        <Image
                          src={p.src}
                          alt={p.alt}
                          fill
                          sizes="10rem"
                          className="object-cover"
                        />
                      </div>
                    ))}

                    {/* Odkaz do galérie ako tretia dlaždica */}
                    <Link
                      href="/galeria"
                      className="col-span-1 flex aspect-[4/3] flex-col items-center justify-center rounded-lg border border-ink-300 bg-white/80 text-center text-xs font-semibold text-brand-800 transition-colors hover:border-brand-400 hover:bg-white"
                    >
                      <span className="display text-xl text-ink-900">+7</span>
                      <span className="mt-0.5 px-1 leading-tight">
                        fotografií
                      </span>
                    </Link>
                  </div>
                </figure>
              )}

              {reviews && quote && (
                <div className="relative z-10 mt-3 rounded-xl border border-ink-200 bg-white p-5 shadow-lg">
                  <div className="flex items-center gap-3">
                    <span className="display text-4xl text-ink-900">
                      {reviews.average.toFixed(1).replace(".", ",")}
                    </span>
                    <div className="min-w-0">
                      <span className="block text-sm text-accent-500" aria-hidden>
                        ★★★★★
                      </span>
                      <span className="block text-xs text-ink-500">
                        {reviews.totalReviews.toLocaleString("sk-SK")} hodnotení
                        na Google
                      </span>
                    </div>
                  </div>

                  <blockquote className="mt-4 border-l-2 border-accent-400 pl-3 font-display text-[0.95rem] italic leading-relaxed text-ink-700">
                    „{quote.excerpt}"
                  </blockquote>

                  <p className="mt-3 flex flex-wrap items-center gap-x-2 text-xs text-ink-500">
                    <span className="font-medium">{quote.author}</span>
                    <span aria-hidden>·</span>
                    <span>{quote.date}</span>
                  </p>

                  <Link
                    href="/aktualny-stav#hodnotenia"
                    className="mt-4 flex items-center justify-between gap-2 rounded-lg bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-800 ring-1 ring-rose-200 hover:bg-rose-100"
                  >
                    <span>{negativeShare} % návštevníkov dalo 1–2 hviezdy</span>
                    <span aria-hidden>→</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
