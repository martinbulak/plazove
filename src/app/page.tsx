import Link from "next/link";
import { Hero } from "@/components/Hero";
import { Section, SectionHeading, Button, StatusBadge } from "@/components/ui";
import {
  getSite,
  getTimeline,
  getCityActions,
  getOpenQuestions,
  getGallery,
  getReviewAnalysis,
  onlyPublished,
} from "@/lib/content";
import { formatDateSk } from "@/lib/utils";

// ISR: obsah sa obnovuje z KV (ak je nastavené) každých 60 s.
export const revalidate = 60;

export default async function HomePage() {
  const [site, timeline, actions, questions, gallery, reviews] = await Promise.all([
    getSite(),
    getTimeline(),
    getCityActions(),
    getOpenQuestions(),
    getGallery(),
    getReviewAnalysis(),
  ]);

  const tl = onlyPublished(timeline);
  const qs = onlyPublished(questions);
  const photos = onlyPublished(gallery);
  const acts = onlyPublished(actions);

  const recentTimeline = tl.slice(-3).reverse();

  /**
   * Koláž do hero sekcie. Hlavná fotka je jazero so zelenými riasami –
   * sedí k citovanej recenzii, ktorá hovorí o kvalite vody.
   */
  const HERO_PHOTO_IDS = [
    "g-2026-jazero",
    "g-2026-vstup",
    "g-2026-rozvadzac",
    "g-2026-plocha",
  ];
  const HERO_QUOTE_ID = "rev-1";
  const heroPhotos = HERO_PHOTO_IDS.map((id) =>
    photos.find((p) => p.id === id),
  ).filter((p): p is NonNullable<typeof p> => Boolean(p));
  const heroCollage = heroPhotos.length ? heroPhotos : photos.slice(0, 3);

  /**
   * Tri recenzie na úvod. Zámerne volíme rôzne počty hviezd, aby výber
   * nepôsobil ako vyzobané najhoršie prípady – a vynechávame tú, ktorá je
   * už použitá v hero sekcii.
   */
  const heroQuoteId = HERO_QUOTE_ID;
  const homeReviews = (() => {
    if (!reviews) return [];
    const pool = reviews.samples.filter((s) => s.id !== heroQuoteId);
    const picked: typeof pool = [];
    for (const stars of [1, 2, 3]) {
      const hit = pool.find((s) => s.stars === stars && !picked.includes(s));
      if (hit) picked.push(hit);
    }
    for (const s of pool) {
      if (picked.length >= 3) break;
      if (!picked.includes(s)) picked.push(s);
    }
    return picked.slice(0, 3);
  })();

  const negativeShare = reviews
    ? Math.round(
        (reviews.distribution
          .filter((d) => d.stars <= 2)
          .reduce((s, d) => s + d.count, 0) /
          reviews.totalReviews) *
          100,
      )
    : 0;

  return (
    <>
      <Hero
        site={site}
        reviews={reviews}
        photos={heroCollage}
        quoteId={HERO_QUOTE_ID}
        galleryCount={photos.length}
      />

      {/* ── Kľúčové fakty ── */}
      <div className="border-b border-ink-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
          <h2 className="eyebrow mb-6 text-ink-400">V skratke</h2>
          <dl className="grid gap-x-8 gap-y-7 sm:grid-cols-2 lg:grid-cols-4">
            {site.heroFacts.map((f, i) => (
              <div key={i} className="border-t-2 border-ink-900 pt-3">
                <dd className="display text-2xl text-ink-900">{f.value}</dd>
                <dt className="mt-1.5 text-sm leading-snug text-ink-600">
                  {f.label}
                </dt>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* ── Hlasy návštevníkov ── */}
      {reviews && homeReviews.length > 0 && (
        <Section>
          <SectionHeading
            eyebrow="Hodnotenia návštevníkov"
            title="Čo píšu ľudia, ktorí tam boli"
            intro={`Kúpalisko má na Google priemer ${reviews.average
              .toFixed(1)
              .replace(".", ",")} hviezdy z ${reviews.totalReviews.toLocaleString(
              "sk-SK",
            )} hodnotení. Takmer ${negativeShare} % návštevníkov dalo jednu alebo dve hviezdy.`}
          />

          <ul className="grid gap-4 md:grid-cols-3">
            {homeReviews.map((s) => (
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
                  </figcaption>
                </figure>
              </li>
            ))}
          </ul>

          <div className="mt-6">
            <Link
              href="/aktualny-stav#hodnotenia"
              className="group inline-flex items-center gap-3 rounded-xl border border-ink-300 bg-white px-5 py-4 transition-colors hover:border-brand-400 hover:bg-brand-50"
            >
              <span>
                <span className="display block text-lg text-ink-900 group-hover:text-brand-800">
                  Čo hovoria návštevníci kúpaliska
                </span>
                <span className="mt-0.5 block text-sm text-ink-600">
                  Celkové štatistiky, rozloženie hodnotení a najčastejšie dôvody
                  nespokojnosti
                </span>
              </span>
              <span
                aria-hidden
                className="ml-auto shrink-0 text-brand-700 transition-transform group-hover:translate-x-0.5"
              >
                →
              </span>
            </Link>
          </div>

          <p className="mt-3 text-xs leading-relaxed text-ink-500">
            Ide o názory konkrétnych návštevníkov, nie o tvrdenia prevádzkovateľa
            tohto webu. Mená uvádzame skrátene, stav hodnotení k{" "}
            {formatDateSk(reviews.checkedAt)}.
          </p>
        </Section>
      )}

      {/* ── Najnovšie udalosti + stav ── */}
      <div className="border-y border-ink-200 bg-white">
        <Section>
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <h2 className="eyebrow mb-5 flex items-center gap-2.5 text-brand-600">
                <span aria-hidden className="h-px w-6 bg-brand-400" />
                Najnovšie udalosti
              </h2>
              <ol className="space-y-5">
                {recentTimeline.map((t) => (
                  <li key={t.id} className="border-l-2 border-brand-200 pl-4">
                    <time className="text-xs font-semibold uppercase tracking-wide text-brand-600">
                      {formatDateSk(t.date)}
                    </time>
                    <p className="display mt-1 text-lg text-ink-900">{t.title}</p>
                    <p className="mt-1 line-clamp-3 text-sm leading-relaxed text-ink-600">
                      {t.description}
                    </p>
                  </li>
                ))}
              </ol>
              <Button href="/pripad#chronologia" variant="ghost" className="mt-5 px-0">
                Celá časová os →
              </Button>
            </div>

            <div>
              <h2 className="eyebrow mb-5 flex items-center gap-2.5 text-brand-600">
                <span aria-hidden className="h-px w-6 bg-brand-400" />
                Kroky mesta
              </h2>
              <ul className="divide-y divide-ink-100 border-y border-ink-100">
                {acts.slice(0, 5).map((a) => (
                  <li
                    key={a.id}
                    className="flex items-start justify-between gap-4 py-3.5"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium leading-snug text-ink-900">
                        {a.step}
                      </p>
                      <p className="mt-0.5 text-xs text-ink-500">
                        {formatDateSk(a.date)}
                      </p>
                    </div>
                    <StatusBadge status={a.actionStatus} />
                  </li>
                ))}
              </ul>
              <Button href="/aktualny-stav" variant="ghost" className="mt-5 px-0">
                Celý aktuálny stav →
              </Button>
            </div>
          </div>
        </Section>
      </div>

      {/* ── Výzva ── */}
      <div className="bg-brand-900">
        <Section className="max-w-3xl text-center">
          <p className="eyebrow mb-4 text-accent-400">Podporte zmenu</p>
          <h2 className="display text-balance text-3xl text-white sm:text-4xl">
            Ide o verejný majetok. Pomôžte ho ustrážiť.
          </h2>
          <p className="mx-auto mt-4 max-w-xl leading-relaxed text-brand-100">
            Podpíšte verejnú výzvu mestu, prihláste sa na odber noviniek alebo
            pošlite vlastnú fotografiu či dokument.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button href="/podporte" variant="accent">
              Podpísať výzvu
            </Button>
            <Button
              href="/zmluva"
              variant="outline"
              className="border-white/30 bg-transparent text-white hover:border-white/60 hover:bg-white/10"
            >
              Zmluva a dokumenty
            </Button>
          </div>
        </Section>
      </div>
    </>
  );
}
