import type { Metadata } from "next";
import { Section, SectionHeading, SourceList, PlaceholderBadge, PlaceholderNotice } from "@/components/ui";
import { getTimeline, onlyPublished } from "@/lib/content";
import { formatDateSk } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Časová os",
  description:
    "Chronológia prípadu plážového kúpaliska v Banskej Bystrici – nájomná zmluva z roku 2007, dodatky, kontrolné zistenia, audit a právne stanovisko. Nezávislý informačný projekt.",
};

// ISR: obsah sa obnovuje z KV (ak je nastavené) každých 60 s.
export const revalidate = 60;

export default async function TimelinePage() {
  const items = onlyPublished(await getTimeline());

  return (
    <Section>
      <SectionHeading
        as="h1"
        eyebrow="Časová os"
        title="Chronológia prípadu"
        intro="Vývoj situácie okolo plážového kúpaliska v čase. Každá položka má mať doplnený zdroj alebo odkaz na príslušný dokument."
      />

      <PlaceholderNotice />

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
              {t.isPlaceholder && <PlaceholderBadge />}
            </div>
            <h2 className="mt-1 text-lg font-semibold text-ink-900">{t.title}</h2>
            <p className="mt-1 max-w-2xl text-ink-600">{t.description}</p>
            <SourceList sources={t.sources} />
          </li>
        ))}
      </ol>
    </Section>
  );
}
