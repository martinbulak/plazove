import type { Metadata } from "next";
import {
  Section,
  SectionHeading,
  Card,
  ClaimBadge,
  ClaimLegend,
  QuickNav,
  SourceList,
} from "@/components/ui";
import { Timeline } from "@/components/Timeline";
import { getCaseSections, getTimeline, onlyPublished } from "@/lib/content";

export const metadata: Metadata = {
  title: "Prípad a chronológia",
  description:
    "Čo sa deje s plážovým kúpaliskom v Banskej Bystrici – nájomná zmluva z roku 2007 so spoločnosťou AQUALAND Slovakia, investičná povinnosť, kontrolné zistenia a chronológia prípadu. Nezávislý informačný projekt.",
};

// ISR: obsah sa obnovuje z KV (ak je nastavené) každých 60 s.
export const revalidate = 60;

export default async function CasePage() {
  const [sections, timeline] = await Promise.all([getCaseSections(), getTimeline()]);
  const items = onlyPublished(timeline);

  return (
    <>
      {/* Časová os – hlavný vstup do príbehu */}
      <Section id="chronologia" className="scroll-mt-24">
        <SectionHeading
          as="h1"
          eyebrow="Čo sa stalo"
          title="Prípad plážového kúpaliska"
          intro="Celý príbeh od podpisu nájomnej zmluvy v roku 2007 až po dnešok. Zobrazujeme kľúčové momenty, celú chronológiu si môžete rozbaliť. Pri každej udalosti uvádzame zdroj."
        />
        <Timeline items={items} />
      </Section>

      <div className="border-t border-ink-200 bg-ink-50">
        <Section>
        <SectionHeading
          eyebrow="Podrobne"
          title="Fakty, závery dokumentov a otvorené otázky"
          intro="Rozpis toho, čo je doložené dokumentmi, čo z nich vyplýva a čo zostáva bez odpovede. Pri každom tvrdení uvádzame, o aký druh tvrdenia ide."
        />

        <QuickNav
          items={[
            { href: "#chronologia", label: "Späť na časovú os" },
            { href: "#potvrdene-fakty", label: "Fakty a závery" },
            { href: "#otvorene-otazky", label: "Čo je nevyriešené" },
          ]}
        />

        <ClaimLegend />

        <div className="space-y-10">
          {sections.map((sec) => (
            <div key={sec.key} id={sec.key} className="scroll-mt-24">
              <h2 className="text-xl font-bold text-ink-900">{sec.title}</h2>
              {sec.intro && (
                <p className="mt-2 max-w-3xl text-sm text-ink-600">{sec.intro}</p>
              )}
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
        </Section>
      </div>
    </>
  );
}
