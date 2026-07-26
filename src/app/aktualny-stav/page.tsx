import type { Metadata } from "next";
import {
  Section,
  SectionHeading,
  Card,
  QuickNav,
  StatusBadge,
  SourceList,
} from "@/components/ui";
import { ReviewAnalysisBlock } from "@/components/ReviewAnalysisBlock";
import {
  getCityActions,
  getOpenQuestions,
  getReviewAnalysis,
  onlyPublished,
} from "@/lib/content";
import { formatDateSk } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Aktuálny stav",
  description:
    "Aktuálny stav prípadu plážového kúpaliska v Banskej Bystrici – kroky mesta a ich plnenie, otvorené otázky bez odpovede a hodnotenia návštevníkov. Nezávislý informačný projekt.",
};

// ISR: obsah sa obnovuje z KV (ak je nastavené) každých 60 s.
export const revalidate = 60;

export default async function CurrentStatePage() {
  const [actions, questions, reviews] = await Promise.all([
    getCityActions(),
    getOpenQuestions(),
    getReviewAnalysis(),
  ]);
  const acts = onlyPublished(actions);
  const qs = onlyPublished(questions);

  return (
    <>
      <Section>
        <SectionHeading
          as="h1"
          eyebrow="Aktuálny stav"
          title="Kde sa prípad nachádza dnes"
          intro="Prehľad krokov mesta a ich plnenia, otázok, na ktoré nie je verejne známa odpoveď, a hodnotení od návštevníkov kúpaliska. Stav k júlu 2026."
        />

        <QuickNav
          items={[
            { href: "#kroky", label: "Čo urobilo mesto" },
            { href: "#otvorene-otazky", label: "Otvorené otázky" },
            ...(reviews ? [{ href: "#hodnotenia", label: "Hodnotenia návštevníkov" }] : []),
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

      {/* Hodnotenia návštevníkov na Google */}
      {reviews && (
        <Section id="hodnotenia" className="scroll-mt-24">
          <SectionHeading
            eyebrow="Hodnotenia návštevníkov"
            title="Čo hovoria návštevníci kúpaliska"
            intro="Verejné hodnotenia na Mapách Google a rozbor toho, čo sa v negatívnych recenziách opakuje najčastejšie."
          />
          <ReviewAnalysisBlock data={reviews} />
        </Section>
      )}

    </>
  );
}
