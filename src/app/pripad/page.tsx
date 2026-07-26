import type { Metadata } from "next";
import {
  Section,
  SectionHeading,
  ClaimBadge,
  ClaimLegend,
  QuickNav,
  SourceList,
} from "@/components/ui";
import { Timeline } from "@/components/Timeline";
import { DisclosureList } from "@/components/DisclosureList";
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
                <p className="mb-4 mt-2 max-w-3xl text-sm text-ink-600">{sec.intro}</p>
              )}
              <DisclosureList
                headings={["Tvrdenie", "Druh"]}
                items={sec.points.map((p) => ({
                  id: p.id,
                  title: p.title ?? firstSentence(p.text),
                  badge: <ClaimBadge kind={p.kind} />,
                  detail: (
                    <>
                      <p className="text-sm leading-relaxed text-ink-700">{p.text}</p>
                      <SourceList sources={p.sources} />
                    </>
                  ),
                }))}
              />
            </div>
          ))}
        </div>
        </Section>
      </div>
    </>
  );
}

/** Záloha, ak položka nemá vlastný nadpis – prvá veta textu. */
function firstSentence(text: string): string {
  const end = text.search(/[.!?](\s|$)/);
  return end === -1 ? text : text.slice(0, end + 1);
}
