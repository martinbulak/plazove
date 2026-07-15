import type { Metadata } from "next";
import { Section, SectionHeading, Card, ClaimBadge, SourceList, PlaceholderNotice } from "@/components/ui";
import { getCaseSections } from "@/lib/content";

export const metadata: Metadata = {
  title: "Prípad v skratke",
  description:
    "Zrozumiteľné zhrnutie prípadu plážového kúpaliska v Banskej Bystrici – čo mesto prenajalo, komu a na ako dlho. Nezávislý informačný projekt. Fakty, závery dokumentov, otvorené otázky a názory sú odlíšené.",
};

// ISR: obsah sa obnovuje z KV (ak je nastavené) každých 60 s.
export const revalidate = 60;

export default async function CasePage() {
  const sections = await getCaseSections();

  return (
    <Section>
      <SectionHeading
        as="h1"
        eyebrow="Prípad v skratke"
        title="Čo sa vlastne stalo?"
        intro="Stručné a zrozumiteľné zhrnutie. Obsah je zámerne rozdelený tak, aby bolo jasné, čo je potvrdený fakt, čo vyplýva z dokumentov, čo je otvorená otázka a čo je názor autora webu."
      />

      <PlaceholderNotice />

      <div className="space-y-10">
        {sections.map((sec) => (
          <div key={sec.key} id={sec.key}>
            <h2 className="text-xl font-bold text-ink-900">{sec.title}</h2>
            {sec.intro && <p className="mt-2 max-w-3xl text-sm text-ink-600">{sec.intro}</p>}
            <ul className="mt-4 space-y-3">
              {sec.points.map((p) => (
                <li key={p.id}>
                  <Card>
                    <div className="mb-2">
                      <ClaimBadge kind={p.kind} />
                    </div>
                    <p className="text-ink-800">{p.text}</p>
                    <SourceList sources={p.sources} />
                  </Card>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-10 rounded-lg border border-ink-200 bg-ink-50 p-4 text-sm text-ink-600">
        <strong>Metodická poznámka:</strong> pri každom významnom tvrdení sa
        snažíme uviesť zdroj. Ak zdroj chýba, ide o vzorový text určený na
        doplnenie. Právne výklady a názory nie sú preukázané fakty.
      </div>
    </Section>
  );
}
