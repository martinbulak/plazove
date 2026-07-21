import type { Metadata } from "next";
import Link from "next/link";
import {
  Section,
  SectionHeading,
  Card,
  QuickNav,
  StatusBadge,
  SourceList,
} from "@/components/ui";
import {
  getCityActions,
  getOpenQuestions,
  getOpinions,
  onlyPublished,
} from "@/lib/content";
import { formatDateSk } from "@/lib/utils";
import type { OpinionPlatform, OpinionSentiment } from "@/lib/types";

export const metadata: Metadata = {
  title: "Aktuálny stav",
  description:
    "Aktuálny stav prípadu plážového kúpaliska v Banskej Bystrici – kroky mesta a ich plnenie, otvorené otázky bez odpovede a verejne publikované názory. Nezávislý informačný projekt.",
};

// ISR: obsah sa obnovuje z KV (ak je nastavené) každých 60 s.
export const revalidate = 60;

const PLATFORM_LABEL: Record<OpinionPlatform, string> = {
  facebook: "Facebook",
  google: "Google recenzie",
  instagram: "Instagram",
  x: "X (Twitter)",
  tripadvisor: "TripAdvisor",
  iny: "Iný zdroj",
};

const SENTIMENT: Record<OpinionSentiment, { label: string; cls: string }> = {
  negative: { label: "Kritický", cls: "bg-rose-50 text-rose-800 ring-rose-200" },
  neutral: { label: "Neutrálny", cls: "bg-ink-100 text-ink-700 ring-ink-300" },
  positive: { label: "Pozitívny", cls: "bg-emerald-50 text-emerald-800 ring-emerald-200" },
};

export default async function CurrentStatePage() {
  const [actions, questions, opinions] = await Promise.all([
    getCityActions(),
    getOpenQuestions(),
    getOpinions(),
  ]);
  const acts = onlyPublished(actions);
  const qs = onlyPublished(questions);
  const ops = onlyPublished(opinions).filter((o) => o.approved);

  return (
    <>
      <Section>
        <SectionHeading
          as="h1"
          eyebrow="Aktuálny stav"
          title="Kde sa prípad nachádza dnes"
          intro="Prehľad krokov mesta a ich plnenia, otázok, na ktoré nie je verejne známa odpoveď, a verejne publikovaných názorov. Stav k júlu 2026."
        />

        <QuickNav
          items={[
            { href: "#kroky", label: "Čo urobilo mesto" },
            { href: "#otvorene-otazky", label: "Otvorené otázky" },
            { href: "#nazory", label: "Názory" },
          ]}
        />

        <h2 id="kroky" className="mb-4 scroll-mt-24 text-xl font-bold text-ink-900">
          Čo urobilo mesto
        </h2>
        <div className="overflow-hidden rounded-[var(--radius-card)] border border-ink-200 bg-white">
          <table className="hidden w-full text-left text-sm sm:table">
            <thead className="bg-ink-50 text-xs uppercase tracking-wide text-ink-500">
              <tr>
                <th className="px-4 py-3 font-semibold">Dátum</th>
                <th className="px-4 py-3 font-semibold">Krok / prísľub</th>
                <th className="px-4 py-3 font-semibold">Stav</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100">
              {acts.map((a) => (
                <tr key={a.id} className="align-top">
                  <td className="whitespace-nowrap px-4 py-3 font-mono text-ink-600">
                    {formatDateSk(a.date)}
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-ink-900">{a.step}</p>
                    {a.note && <p className="mt-1 text-ink-600">{a.note}</p>}
                    <SourceList sources={a.sources} />
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={a.actionStatus} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <ul className="divide-y divide-ink-100 sm:hidden">
            {acts.map((a) => (
              <li key={a.id} className="p-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs text-ink-500">
                    {formatDateSk(a.date)}
                  </span>
                  <StatusBadge status={a.actionStatus} />
                </div>
                <p className="mt-1 font-medium text-ink-900">{a.step}</p>
                {a.note && <p className="mt-1 text-sm text-ink-600">{a.note}</p>}
                <SourceList sources={a.sources} />
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* Otvorené otázky */}
      <div className="bg-ink-50">
        <Section id="otvorene-otazky" className="scroll-mt-24">
          <SectionHeading
            eyebrow="Otvorené otázky"
            title="Na čo nie je jasná odpoveď"
            intro="Otázky, na ktoré sa z verejne dostupných zdrojov nepodarilo nájsť úplnú odpoveď. Ak mesto alebo prevádzkovateľ odpovie, odpoveď doplníme aj so zdrojom."
          />
          <ul className="space-y-4">
            {qs.map((q) => (
              <li key={q.id}>
                <Card>
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <h3 className="text-base font-semibold text-ink-900">{q.question}</h3>
                    <StatusBadge status={q.actionStatus} />
                  </div>
                  {q.cityAnswer ? (
                    <p className="mt-2 rounded-md bg-ink-50 p-3 text-sm text-ink-700">
                      <span className="font-semibold">Zistenie: </span>
                      {q.cityAnswer}
                    </p>
                  ) : (
                    <p className="mt-2 text-sm italic text-ink-400">
                      Verejná odpoveď zatiaľ nie je k dispozícii.
                    </p>
                  )}
                  {q.lastUpdated && (
                    <p className="mt-2 text-xs text-ink-500">
                      Aktualizované: {formatDateSk(q.lastUpdated)}
                    </p>
                  )}
                  <SourceList sources={q.sources} />
                </Card>
              </li>
            ))}
          </ul>
        </Section>
      </div>

      {/* Názory verejnosti */}
      <Section id="nazory" className="scroll-mt-24">
        <SectionHeading
          eyebrow="Názory verejnosti"
          title="Verejne publikované vyjadrenia"
          intro="Táto sekcia nezhromažďuje anonymné recenzie vytvorené na tomto webe. Ide o verejne publikované vyjadrenia, ktoré administrátor manuálne schválil. Každé je názorom konkrétnej osoby alebo inštitúcie, nie tvrdením prevádzkovateľa webu."
        />

        <div className="mb-6 rounded-lg border border-ink-200 bg-ink-50 px-4 py-3 text-sm text-ink-600">
          Web nepredstiera reprezentatívny prieskum verejnej mienky. Pre vyváženosť
          uvádzame aj stanovisko prevádzkovateľa kúpaliska. Pri politicky
          angažovaných zdrojoch túto skutočnosť výslovne označujeme. Ak ste autorom
          citovaného príspevku a želáte si jeho odstránenie,{" "}
          <Link href="/nahlasit" className="font-semibold underline">
            napíšte nám
          </Link>
          .
        </div>

        <ul className="grid gap-4 sm:grid-cols-2">
          {ops.map((o) => (
            <li key={o.id}>
              <Card className="flex h-full flex-col">
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="rounded bg-brand-50 px-2 py-0.5 font-medium text-brand-700 ring-1 ring-brand-200">
                    {PLATFORM_LABEL[o.platform]}
                  </span>
                  <span
                    className={`rounded-full px-2 py-0.5 font-medium ring-1 ring-inset ${SENTIMENT[o.sentiment].cls}`}
                  >
                    {SENTIMENT[o.sentiment].label}
                  </span>
                </div>

                <blockquote className="mt-3 flex-1 border-l-2 border-ink-200 pl-3 text-ink-800">
                  „{o.excerpt}"
                </blockquote>

                <div className="mt-3 text-sm text-ink-600">
                  <span className="font-medium">{o.profileName}</span>
                  {o.postedAt && <span> · {formatDateSk(o.postedAt)}</span>}
                </div>

                {o.note && (
                  <p className="mt-2 rounded bg-ink-50 p-2 text-xs text-ink-600">
                    <strong>Kontext:</strong> {o.note}
                  </p>
                )}

                <div className="mt-2 flex flex-wrap gap-x-4 text-xs text-ink-400">
                  {o.archivedAt && <span>Archivované: {formatDateSk(o.archivedAt)}</span>}
                  {o.originalUrl && (
                    <a
                      href={o.originalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-brand-700 underline"
                    >
                      Pôvodný príspevok →
                    </a>
                  )}
                </div>
              </Card>
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}
