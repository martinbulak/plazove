import Link from "next/link";
import { Hero } from "@/components/Hero";
import { Section, SectionHeading, Card, Button, StatusBadge } from "@/components/ui";
import {
  getSite,
  getTimeline,
  getCityActions,
  getOpenQuestions,
  onlyPublished,
} from "@/lib/content";
import { formatDateSk } from "@/lib/utils";
import { MAIN_NAV } from "@/lib/nav";

// ISR: obsah sa obnovuje z KV (ak je nastavené) každých 60 s.
export const revalidate = 60;

export default async function HomePage() {
  const [site, timeline, actions, questions] = await Promise.all([
    getSite(),
    getTimeline(),
    getCityActions(),
    getOpenQuestions(),
  ]);

  const recentTimeline = onlyPublished(timeline).slice(-3).reverse();
  const publishedActions = onlyPublished(actions).slice(0, 4);
  const publishedQuestions = onlyPublished(questions).slice(0, 4);

  return (
    <>
      <Hero site={site} />

      {/* O čo ide – zhrnutie */}
      <Section>
        <SectionHeading
          eyebrow="O čo ide"
          title="Tri vety na úvod"
        />
        <div className="grid gap-4 sm:grid-cols-3">
          <Card>
            <p className="text-3xl font-bold text-brand-700">2007</p>
            <p className="mt-1 text-sm text-ink-700">
              Mesto prenajalo areál plážového kúpaliska spoločnosti AQUALAND
              Slovakia s.r.o. na 30 rokov, do roku 2037.
            </p>
          </Card>
          <Card>
            <p className="text-3xl font-bold text-brand-700">100 mil. Sk</p>
            <p className="mt-1 text-sm text-ink-700">
              Toľko mal nájomca podľa zmluvy preinvestovať. Nepreukázanie tejto sumy
              zmluva označuje za podstatné porušenie.
            </p>
          </Card>
          <Card>
            <p className="text-3xl font-bold text-brand-700">Bez výpovede</p>
            <p className="mt-1 text-sm text-ink-700">
              Podľa analýzy Právnickej fakulty UK zmluvu nemožno vypovedať. Ostáva
              dohoda, odstúpenie alebo rok 2037.
            </p>
          </Card>
        </div>
        <div className="mt-6">
          <Button href="/pripad" variant="primary">
            Celý prípad a chronológia
          </Button>
        </div>
      </Section>

      {/* Rozcestník sekcií */}
      <div className="bg-ink-50">
        <Section aria-label="Sekcie webu">
          <SectionHeading
            eyebrow="Rozcestník"
            title="Čo na webe nájdete"
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {MAIN_NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group rounded-[var(--radius-card)] border border-ink-200 bg-white p-5 shadow-sm transition-colors hover:border-brand-300 hover:bg-brand-50"
              >
                <p className="text-base font-semibold text-ink-900 group-hover:text-brand-800">
                  {item.label}
                </p>
                <p className="mt-1 text-sm text-ink-600">{item.desc}</p>
                <span className="mt-3 inline-block text-sm font-medium text-brand-700">
                  Otvoriť →
                </span>
              </Link>
            ))}
          </div>
        </Section>
      </div>

      {/* Najnovšie z chronológie */}
      <Section>
        <SectionHeading
          eyebrow="Časová os"
          title="Najnovšie udalosti"
        />
        <ol className="space-y-4">
          {recentTimeline.map((t) => (
            <li key={t.id}>
              <Card className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-4">
                <span className="shrink-0 font-mono text-sm font-bold text-brand-700 sm:w-32">
                  {formatDateSk(t.date)}
                </span>
                <div>
                  <p className="font-semibold text-ink-900">{t.title}</p>
                  <p className="mt-0.5 text-sm text-ink-600">{t.description}</p>
                </div>
              </Card>
            </li>
          ))}
        </ol>
        <div className="mt-6">
          <Button href="/pripad#chronologia" variant="outline">
            Celá časová os
          </Button>
        </div>
      </Section>

      {/* Kroky mesta + otvorené otázky */}
      <div className="bg-ink-50">
        <Section>
          <div className="grid gap-8 lg:grid-cols-2">
            <div>
              <SectionHeading title="Čo urobilo mesto" as="h2" />
              <ul className="space-y-3">
                {publishedActions.map((a) => (
                  <li key={a.id}>
                    <Card className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-medium text-ink-900">{a.step}</p>
                        <p className="mt-0.5 text-xs text-ink-500">
                          {formatDateSk(a.date)}
                        </p>
                      </div>
                      <StatusBadge status={a.actionStatus} />
                    </Card>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <SectionHeading title="Otvorené otázky" as="h2" />
              <ul className="space-y-3">
                {publishedQuestions.map((q) => (
                  <li key={q.id}>
                    <Card className="flex items-start justify-between gap-3">
                      <p className="text-sm font-medium text-ink-900">{q.question}</p>
                      <StatusBadge status={q.actionStatus} />
                    </Card>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-6">
            <Button href="/aktualny-stav" variant="outline">
              Celý aktuálny stav →
            </Button>
          </div>
        </Section>
      </div>

      {/* CTA pás */}
      <div className="bg-brand-800">
        <Section className="text-center">
          <h2 className="text-balance text-2xl font-bold text-white sm:text-3xl">
            Ide o verejný majetok. Pomôžte ho ustrážiť.
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-brand-100">
            Podpíšte verejnú výzvu, prihláste sa na odber noviniek alebo pošlite
            dokument či fotografiu.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button href="/podporte" variant="accent">
              Podporiť výzvu
            </Button>
            <Button
              href="/zmluva"
              variant="outline"
              className="border-white/40 text-white hover:bg-white/10"
            >
              Zmluva a dokumenty
            </Button>
          </div>
        </Section>
      </div>
    </>
  );
}
