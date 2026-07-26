import type { Metadata } from "next";
import {
  Section,
  SectionHeading,
  QuickNav,
  StatusBadge,
  SourceList,
} from "@/components/ui";
import { ReviewAnalysisBlock } from "@/components/ReviewAnalysisBlock";
import { DisclosureList } from "@/components/DisclosureList";
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
        <DisclosureList
          headings={["Dátum", "Krok / prísľub", "Stav"]}
          items={acts.map((a) => ({
            id: a.id,
            lead: formatDateSk(a.date),
            title: a.step,
            badge: <StatusBadge status={a.actionStatus} />,
            detail: (
              <>
                {a.note && (
                  <p className="text-sm leading-relaxed text-ink-700">{a.note}</p>
                )}
                <SourceList sources={a.sources} />
              </>
            ),
          }))}
        />
      </Section>

      {/* Otvorené otázky */}
      <div className="bg-ink-50">
        <Section id="otvorene-otazky" className="scroll-mt-24">
          <SectionHeading
            eyebrow="Otvorené otázky"
            title="Na čo nie je jasná odpoveď"
            intro="Otázky, na ktoré sa z verejne dostupných zdrojov nepodarilo nájsť úplnú odpoveď. Ak mesto alebo prevádzkovateľ odpovie, odpoveď doplníme aj so zdrojom."
          />
          <p className="mb-4 text-xs text-ink-500">
            Kliknutím na riadok zobrazíte zistenia a zdroje.
          </p>
          <DisclosureList
            headings={["Otázka", "Stav"]}
            items={qs.map((q) => ({
              id: q.id,
              title: q.question,
              badge: <StatusBadge status={q.actionStatus} />,
              detail: (
                <>
                  {q.cityAnswer ? (
                    <p className="text-sm leading-relaxed text-ink-700">
                      <span className="font-semibold">Zistenie: </span>
                      {q.cityAnswer}
                    </p>
                  ) : (
                    <p className="text-sm italic text-ink-500">
                      Verejná odpoveď zatiaľ nie je k dispozícii.
                    </p>
                  )}
                  {q.lastUpdated && (
                    <p className="mt-2 text-xs text-ink-500">
                      Aktualizované: {formatDateSk(q.lastUpdated)}
                    </p>
                  )}
                  <SourceList sources={q.sources} />
                </>
              ),
            }))}
          />
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
