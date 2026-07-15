import Link from "next/link";
import { Hero } from "@/components/Hero";
import { Section, SectionHeading, Card, Button, StatusBadge } from "@/components/ui";
import {
  getSite,
  getTimeline,
  getCityActions,
  getOpenQuestions,
  getDocuments,
  onlyPublished,
} from "@/lib/content";
import { formatDateSk } from "@/lib/utils";
import { MAIN_NAV } from "@/lib/nav";

// ISR: obsah sa obnovuje z KV (ak je nastavené) každých 60 s.
export const revalidate = 60;

export default async function HomePage() {
  const [site, timeline, actions, questions, documents] = await Promise.all([
    getSite(),
    getTimeline(),
    getCityActions(),
    getOpenQuestions(),
    getDocuments(),
  ]);

  const recentTimeline = onlyPublished(timeline).slice(-4).reverse();
  const publishedActions = onlyPublished(actions).slice(0, 4);
  const publishedQuestions = onlyPublished(questions).slice(0, 3);
  const docCount = onlyPublished(documents).length;

  return (
    <>
      <Hero site={site} />

      {/* Rozcestník sekcií */}
      <Section aria-label="Sekcie webu">
        <SectionHeading
          eyebrow="Rozcestník"
          title="Čo na webe nájdete"
          intro="Prehľadne rozdelený obsah – od stručného zhrnutia prípadu až po dokumenty, právny rozbor a možnosti, ako sa zapojiť."
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {MAIN_NAV.filter((i) => i.href !== "/o-projekte").map((item) => (
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

      {/* Časová os – náhľad */}
      <div className="bg-ink-50">
        <Section>
          <SectionHeading
            eyebrow="Časová os"
            title="Najnovšie z chronológie"
            intro="Vzorové míľniky prípadu. Úplnú časovú os so zdrojmi nájdete na samostatnej stránke."
          />
          <ol className="space-y-4">
            {recentTimeline.map((t) => (
              <li key={t.id}>
                <Card className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-4">
                  <span className="shrink-0 font-mono text-sm font-bold text-brand-700 sm:w-24">
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
            <Button href="/casova-os" variant="outline">
              Celá časová os
            </Button>
          </div>
        </Section>
      </div>

      {/* Čo urobilo mesto + otvorené otázky */}
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
                      <p className="mt-0.5 text-xs text-ink-500">{formatDateSk(a.date)}</p>
                    </div>
                    <StatusBadge status={a.actionStatus} />
                  </Card>
                </li>
              ))}
            </ul>
            <div className="mt-5">
              <Button href="/co-urobilo-mesto" variant="ghost">
                Zobraziť všetko →
              </Button>
            </div>
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
            <div className="mt-5">
              <Button href="/otvorene-otazky" variant="ghost">
                Všetky otázky →
              </Button>
            </div>
          </div>
        </div>
      </Section>

      {/* CTA pás */}
      <div className="bg-brand-800">
        <Section className="text-center">
          <h2 className="text-balance text-2xl font-bold text-white sm:text-3xl">
            Ide o verejný majetok. Pomôžte ho ustrážiť.
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-brand-100">
            Podpíšte verejnú výzvu, prihláste sa na odber noviniek alebo pošlite
            dokument či fotografiu. K dispozícii je aj {docCount} vzorových
            dokumentov v archíve.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button href="/podporte" variant="accent">
              Podporiť výzvu
            </Button>
            <Button
              href="/dokumenty"
              variant="outline"
              className="border-white/40 text-white hover:bg-white/10"
            >
              Zobraziť dokumenty
            </Button>
          </div>
        </Section>
      </div>
    </>
  );
}
