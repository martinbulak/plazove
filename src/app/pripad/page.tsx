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
import { getCaseSections, getTimeline, onlyPublished } from "@/lib/content";
import { formatDateSk } from "@/lib/utils";

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
        <ol className="mb-10 max-w-3xl space-y-3">
          {[
            "Plážové kúpalisko patrí mestu. V roku 2007 ho mesto prenajalo súkromnej firme AQUALAND Slovakia s.r.o. – až do roku 2037.",
            "Firma sa v zmluve zaviazala preinvestovať do areálu minimálne 3,32 milióna € (100 miliónov Sk).",
            "Už v roku 2010 kontrolór mesta zistil, že nájomca meškal s nájomným a nepredkladal výkazy investícií.",
            "Právnici Univerzity Komenského v roku 2022 skonštatovali: zmluva sa nedá vypovedať. Mesto môže len čakať do roku 2037, dohodnúť sa, alebo odstúpiť pri podstatnom porušení – a aj to len po formálnej výzve s dodatočnou lehotou.",
            "Mesto od roku 2024 verejne hovorí, že chce zmluvu ukončiť. Zatiaľ sa tak nestalo.",
          ].map((text, i) => (
            <li key={i} className="flex gap-3">
              <span
                aria-hidden
                className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-brand-700 text-sm font-bold text-white"
              >
                {i + 1}
              </span>
              <p className="text-ink-800">{text}</p>
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

          <ol className="relative border-l-2 border-brand-200 pl-6">
            {items.map((t) => (
              <li key={t.id} className="mb-8 last:mb-0">
                <span
                  aria-hidden
                  className="absolute -left-[9px] mt-1.5 h-4 w-4 rounded-full border-2 border-white bg-brand-500 shadow"
                />
                <div className="flex flex-wrap items-center gap-2">
                  <time className="font-mono text-sm font-bold text-brand-700">
                    {formatDateSk(t.date)}
                  </time>
                  {t.tag && (
                    <span className="rounded bg-brand-50 px-2 py-0.5 text-xs font-medium text-brand-700 ring-1 ring-brand-200">
                      {t.tag}
                    </span>
                  )}
                </div>
                <h3 className="mt-1 text-lg font-semibold text-ink-900">{t.title}</h3>
                <p className="mt-1 max-w-2xl text-ink-600">{t.description}</p>
                <SourceList sources={t.sources} />
              </li>
            ))}
          </ol>
        </Section>
      </div>
    </>
  );
}
