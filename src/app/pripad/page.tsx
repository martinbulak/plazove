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
      <Section>
        <SectionHeading
          as="h1"
          eyebrow="Čo sa stalo"
          title="Prípad plážového kúpaliska"
          intro="Nemáte čas čítať dokumenty? Tu je celý príbeh v piatich bodoch. Podrobnosti so zdrojmi nájdete nižšie."
        />

        {/* Zhrnutie pre ponáhľajúcich sa */}
        <ol className="mb-12 max-w-3xl divide-y divide-ink-200 border-y-2 border-ink-900">
          {[
            {
              lead: "Mestský majetok v súkromnom nájme.",
              rest: "Plážové kúpalisko patrí mestu. V roku 2007 ho prenajalo firme AQUALAND Slovakia s.r.o. – až do roku 2037.",
            },
            {
              lead: "Sľúbená investícia 3,32 mil. €.",
              rest: "Firma sa v zmluve zaviazala preinvestovať do areálu minimálne túto sumu (100 miliónov Sk).",
            },
            {
              lead: "Prvé problémy už v roku 2010.",
              rest: "Kontrolór mesta zistil, že nájomca meškal s nájomným a nepredkladal výkazy investícií.",
            },
            {
              lead: "Zmluva sa nedá vypovedať.",
              rest: "Právnici Univerzity Komenského to skonštatovali v roku 2022. Mesto môže čakať do roku 2037, dohodnúť sa, alebo odstúpiť pri podstatnom porušení – a aj to len po formálnej výzve s dodatočnou lehotou.",
            },
            {
              lead: "Mesto chce zmluvu ukončiť. Zatiaľ sa tak nestalo.",
              rest: "Verejne to deklaruje od roku 2024.",
            },
          ].map((item, i) => (
            <li key={i} className="flex gap-5 py-4">
              <span
                aria-hidden
                className="section-number shrink-0 text-2xl text-brand-400"
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="leading-relaxed text-ink-700">
                <strong className="font-semibold text-ink-900">{item.lead}</strong>{" "}
                {item.rest}
              </p>
            </li>
          ))}
        </ol>

        <QuickNav
          items={[
            { href: "#potvrdene-fakty", label: "Fakty a závery" },
            { href: "#otvorene-otazky", label: "Čo je nevyriešené" },
            { href: "#chronologia", label: "Časová os" },
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

      {/* Časová os */}
      <div className="bg-ink-50">
        <Section id="chronologia" className="scroll-mt-24">
          <SectionHeading
            eyebrow="Časová os"
            title="Chronológia prípadu"
            intro="Vývoj situácie od schválenia nájmu v roku 2007 až po súčasnosť. Každá položka má uvedený zdroj."
          />
          <Timeline items={items} />
        </Section>
      </div>
    </>
  );
}
