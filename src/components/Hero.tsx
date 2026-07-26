import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui";
import type { SiteConfig, ReviewAnalysis, GalleryItem } from "@/lib/types";
import { formatDateSk } from "@/lib/utils";

/** Značka Google – používame len ako rozlišovací piktogram zdroja hodnotení. */
function GoogleMark() {
  return (
    <svg width="16" height="16" viewBox="0 0 48 48" aria-hidden className="shrink-0">
      <path fill="#4285F4" d="M45 24c0-1.6-.1-2.7-.4-3.9H24v7.1h12c-.2 1.8-1.5 4.6-4.3 6.4l6.6 5.1C42.2 35 45 30 45 24z" />
      <path fill="#34A853" d="M24 46c5.8 0 10.6-1.9 14.2-5.2l-6.8-5.2c-1.8 1.3-4.3 2.2-7.4 2.2-5.6 0-10.4-3.7-12.1-8.8l-7 5.4C8.5 41.2 15.7 46 24 46z" />
      <path fill="#FBBC05" d="M11.9 29c-.4-1.3-.7-2.6-.7-4s.3-2.7.7-4l-7-5.4C3.7 18.3 3 21.1 3 24s.7 5.7 1.9 8.4l7-5.4z" />
      <path fill="#EA4335" d="M24 10.5c4 0 6.6 1.7 8.1 3.1l5.9-5.8C34.6 4.4 29.8 2 24 2 15.7 2 8.5 6.8 4.9 14.6l7 5.4C13.6 14.9 18.4 10.5 24 10.5z" />
    </svg>
  );
}

/** Značka Facebook – rozlišovací piktogram zdroja. */
function FacebookMark() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden className="shrink-0">
      <path
        fill="#1877F2"
        d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.68.24 2.68.24v2.96h-1.51c-1.49 0-1.96.93-1.96 1.89v2.26h3.33l-.53 3.49h-2.8V24C19.61 23.1 24 18.1 24 12.07z"
      />
    </svg>
  );
}

/**
 * Hero: vľavo tvrdenie a výzva, vpravo dôkaz – fotografia stavu areálu
 * a zhrnutie verejných hodnotení s konkrétnym citátom.
 */
export function Hero({
  site,
  reviews,
  photos = [],
  galleryCount = 0,
  isWorstRated = false,
}: {
  site: SiteConfig;
  reviews: ReviewAnalysis | null;
  /** Fotografie do koláže – prvá je hlavná, ďalšie dve menšie. */
  photos?: GalleryItem[];
  /** Celkový počet fotografií v galérii – pre dlaždicu „+N". */
  galleryCount?: number;
  /**
   * Je kúpalisko najhoršie hodnotené z porovnávaných? Overuje sa z dát
   * na strane stránky – ak prestane platiť, hero použije neutrálny text.
   */
  isWorstRated?: boolean;
}) {
  const [main, ...rest] = photos;

  return (
    <section className="hero-wash relative overflow-hidden border-b border-ink-200">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:py-20">
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
          {/* ── Ľavý stĺpec: tvrdenie a výzva ── */}
          <div className="lg:col-span-7">
            <p className="eyebrow mb-5 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-brand-700 ring-1 ring-brand-200">
              <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-accent-500" />
              Nezávislý občiansky projekt
            </p>

            <h1 className="display text-[2.6rem] text-ink-900 sm:text-[3.4rem] lg:text-[3.75rem]">
              Zachráňme plážové kúpalisko
              <span className="mt-1 block text-brand-700">v Banskej Bystrici</span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-600">
              {reviews && isWorstRated ? (
                <>
                  Plážové kúpalisko v Banskej Bystrici je{" "}
                  <strong className="font-semibold text-ink-900">
                    najhoršie hodnotené
                  </strong>{" "}
                  zo všetkých porovnávaných kúpalísk s dostatočným počtom
                  hodnotení – {reviews.average.toFixed(1).replace(".", ",")}{" "}
                  hviezdy z {reviews.totalReviews.toLocaleString("sk-SK")}{" "}
                  hodnotení. S tým treba niečo robiť.
                </>
              ) : (
                <>
                  Areál patrí mestu, no od roku 2007 ho má v nájme súkromná
                  firma – až do roku 2037. Zhromažďujeme dokumenty, fakty
                  a dôkazy o jeho stave, aby mesto muselo konať.
                </>
              )}
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
                <figure>
                  {/* Koláž: hlavná fotografia + rad miniatúr */}
                  <div className="overflow-hidden rounded-xl bg-ink-100 shadow-lg ring-1 ring-ink-900/10">
                    <div className="relative aspect-[4/3]">
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
                  </div>

                  {rest.length > 0 && (
                    <div className="mt-2 grid grid-cols-4 gap-2">
                      {rest.slice(0, 3).map((p) => (
                        <div
                          key={p.id}
                          className="relative aspect-square overflow-hidden rounded-lg bg-ink-100 ring-1 ring-ink-900/10"
                        >
                          <Image
                            src={p.src}
                            alt={p.alt}
                            fill
                            sizes="8rem"
                            className="object-cover"
                          />
                        </div>
                      ))}

                      <Link
                        href="/galeria"
                        className="flex aspect-square flex-col items-center justify-center rounded-lg border border-ink-300 bg-white/80 text-center text-[11px] font-semibold leading-tight text-brand-800 transition-colors hover:border-brand-400 hover:bg-white"
                      >
                        <span className="display text-lg text-ink-900">
                          +{Math.max(galleryCount - 4, 0)}
                        </span>
                        <span className="px-1">fotografií</span>
                      </Link>
                    </div>
                  )}
                </figure>
              )}

              {reviews && (
                <div className="mt-3 grid grid-cols-2 gap-3">
                  {/* Google – hodnotenie s preklikom */}
                  <Link
                    href="/aktualny-stav#hodnotenia"
                    className="group flex flex-col rounded-xl border border-ink-200 bg-white p-4 shadow-sm transition-colors hover:border-brand-400"
                  >
                    <span className="flex items-center gap-2">
                      <GoogleMark />
                      <span className="text-xs font-semibold text-ink-700">
                        Google recenzie
                      </span>
                    </span>

                    <span className="mt-2 flex items-baseline gap-2">
                      <span className="display text-3xl text-ink-900">
                        {reviews.average.toFixed(1).replace(".", ",")}
                      </span>
                      <span className="text-sm text-accent-500" aria-hidden>
                        ★★★★★
                      </span>
                    </span>

                    <span className="mt-0.5 text-xs text-ink-500">
                      z {reviews.totalReviews.toLocaleString("sk-SK")} hodnotení
                    </span>

                    <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-brand-700">
                      Zobraziť rozbor
                      <span
                        aria-hidden
                        className="transition-transform group-hover:translate-x-0.5"
                      >
                        →
                      </span>
                    </span>
                  </Link>

                  {/* Facebook – recenzie na stránke nie sú */}
                  <div className="flex flex-col rounded-xl border border-ink-200 bg-white p-4 shadow-sm">
                    <span className="flex items-center gap-2">
                      <FacebookMark />
                      <span className="text-xs font-semibold text-ink-700">
                        Facebook recenzie
                      </span>
                    </span>

                    <span className="mt-2 block text-2xl font-bold leading-tight text-ink-400">
                      Vypnuté
                    </span>

                    <span className="mt-1 text-xs leading-snug text-ink-500">
                      Stránka prevádzkovateľa má 7 200 sledovateľov, sekciu
                      s hodnoteniami však nemá.
                    </span>

                    <span className="mt-auto pt-3 text-[11px] text-ink-400">
                      Stav k {formatDateSk(reviews.checkedAt)}
                    </span>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
