import Link from "next/link";
import { Hero } from "@/components/Hero";
import { Section, SectionHeading, Button, StatusBadge } from "@/components/ui";
import {
  getSite,
  getTimeline,
  getCityActions,
  getOpenQuestions,
  getDocuments,
  getGallery,
  getComparison,
  getReviewAnalysis,
  onlyPublished,
} from "@/lib/content";
import { formatDateSk } from "@/lib/utils";

// ISR: obsah sa obnovuje z KV (ak je nastavené) každých 60 s.
export const revalidate = 60;

export default async function HomePage() {
  const [site, timeline, actions, questions, documents, gallery, comparison, reviews] =
    await Promise.all([
      getSite(),
      getTimeline(),
      getCityActions(),
      getOpenQuestions(),
      getDocuments(),
      getGallery(),
      getComparison(),
      getReviewAnalysis(),
    ]);

  const tl = onlyPublished(timeline);
  const qs = onlyPublished(questions);
  const docs = onlyPublished(documents);
  const photos = onlyPublished(gallery);
  const acts = onlyPublished(actions);

  const recentTimeline = tl.slice(-3).reverse();
  const unanswered = qs.filter((q) => q.actionStatus === "no_answer").length;
  const heroPhoto = photos.find((p) => p.date === "2024") ?? photos[0];

  /** Rozcestník – každá sekcia s konkrétnym číslom, nech je jasné, čo za ňou je. */
  const sections = [
    {
      href: "/pripad",
      label: "Čo sa stalo",
      desc: "Príbeh od otvorenia kúpaliska v roku 1957 cez nájomnú zmluvu až po dnešok.",
      stat: `${tl.length} udalostí v časovej osi`,
    },
    {
      href: "/zmluva",
      label: "Zmluva a dokumenty",
      desc: "Nájomná zmluva vysvetlená v otázkach a odpovediach. Archív s originálmi.",
      stat: `${docs.length} dokumentov v archíve`,
    },
    {
      href: "/aktualny-stav",
      label: "Aktuálny stav",
      desc: "Čo mesto urobilo, čo zostáva bez odpovede a ako areál hodnotia návštevníci.",
      stat: `${unanswered} otázok bez odpovede`,
    },
    {
      href: "/porovnanie",
      label: "Porovnanie",
      desc: "Kto prevádzkuje kúpaliská v iných mestách a ako sú hodnotené oproti Bystrici.",
      stat: `${comparison.ratings.items.length} kúpalísk v rebríčku`,
    },
    {
      href: "/galeria",
      label: "Galéria",
      desc: "Fotodokumentácia stavu areálu z rokov 2013 až 2024.",
      stat: `${photos.length} fotografií`,
    },
    {
      href: "/o-projekte",
      label: "O projekte",
      desc: "Kto web prevádzkuje, ako overujeme zdroje a ako nahlásiť chybu.",
      stat: "Redakčná metodika",
    },
  ];

  return (
    <>
      <Hero site={site} reviews={reviews} photo={heroPhoto} />

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

      {/* ── Rozcestník sekcií ── */}
      <Section>
        <SectionHeading
          eyebrow="Rozcestník"
          title="Kde začať"
          intro="Web je rozdelený do šiestich častí. Každá stojí na dokumentoch a uvedených zdrojoch."
        />

        <ul className="grid gap-px overflow-hidden rounded-xl bg-ink-200 sm:grid-cols-2">
          {sections.map((s, i) => (
            <li key={s.href}>
              <Link
                href={s.href}
                className="group flex h-full gap-5 bg-white p-6 transition-colors hover:bg-brand-50"
              >
                <span
                  aria-hidden
                  className="section-number shrink-0 text-3xl text-ink-300 transition-colors group-hover:text-brand-500"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="min-w-0">
                  <span className="display block text-xl text-ink-900 group-hover:text-brand-800">
                    {s.label}
                  </span>
                  <span className="mt-1.5 block text-sm leading-relaxed text-ink-600">
                    {s.desc}
                  </span>
                  <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-brand-700">
                    {s.stat}
                    <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
                      →
                    </span>
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>

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
