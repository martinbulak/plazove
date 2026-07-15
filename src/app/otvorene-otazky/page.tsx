import type { Metadata } from "next";
import { Section, SectionHeading, Card, StatusBadge, SourceList, PlaceholderNotice } from "@/components/ui";
import { getOpenQuestions, onlyPublished } from "@/lib/content";
import { formatDateSk } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Otvorené otázky",
  description:
    "Konkrétne otázky o plážovom kúpalisku v Banskej Bystrici, na ktoré nie je verejne známa úplná odpoveď – investície, kroky mesta, výzvy nájomcovi, aktuálny plán. Nezávislý informačný projekt.",
};

// ISR: obsah sa obnovuje z KV (ak je nastavené) každých 60 s.
export const revalidate = 60;

export default async function OpenQuestionsPage() {
  const questions = onlyPublished(await getOpenQuestions());

  return (
    <Section>
      <SectionHeading
        as="h1"
        eyebrow="Otvorené otázky"
        title="Na čo nie je jasná odpoveď"
        intro="Otázky, na ktoré zatiaľ nie je verejne známa úplná a jednoznačná odpoveď. Ak mesto alebo prevádzkovateľ odpovie, odpoveď doplníme aj so zdrojom."
      />

      <PlaceholderNotice />

      <ul className="space-y-4">
        {questions.map((q) => (
          <li key={q.id}>
            <Card>
              <div className="flex flex-wrap items-start justify-between gap-2">
                <h2 className="text-lg font-semibold text-ink-900">{q.question}</h2>
                <StatusBadge status={q.actionStatus} />
              </div>
              {q.cityAnswer ? (
                <p className="mt-2 rounded-md bg-ink-50 p-3 text-sm text-ink-700">
                  <span className="font-semibold">Odpoveď mesta: </span>
                  {q.cityAnswer}
                </p>
              ) : (
                <p className="mt-2 text-sm italic text-ink-400">
                  Verejná odpoveď mesta zatiaľ nie je k dispozícii.
                </p>
              )}
              <div className="mt-2 flex flex-wrap items-center gap-x-4 text-xs text-ink-500">
                {q.lastUpdated && <span>Aktualizované: {formatDateSk(q.lastUpdated)}</span>}
              </div>
              <SourceList sources={q.sources} />
            </Card>
          </li>
        ))}
      </ul>
    </Section>
  );
}
