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
import { CityActionsList } from "@/components/CityActionsList";
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

        <div className="mb-4 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <h2 id="kroky" className="scroll-mt-24 text-xl font-bold text-ink-900">
            Čo urobilo mesto
          </h2>
          <p className="text-xs text-ink-500">
            Kliknutím na riadok zobrazíte podrobnosti a zdroje.
          </p>
        </div>
        <CityActionsList items={acts} />
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
