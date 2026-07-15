import type { Metadata } from "next";
import { Section, SectionHeading, StatusBadge, SourceList, PlaceholderNotice, PlaceholderBadge } from "@/components/ui";
import { getCityActions, onlyPublished } from "@/lib/content";
import { formatDateSk } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Čo urobilo mesto",
  description:
    "Prehľad krokov a verejných prísľubov mesta Banská Bystrica v prípade plážového kúpaliska a ich aktuálny stav. Nezávislý informačný projekt.",
};

// ISR: obsah sa obnovuje z KV (ak je nastavené) každých 60 s.
export const revalidate = 60;

export default async function CityActionsPage() {
  const actions = onlyPublished(await getCityActions());

  return (
    <Section>
      <SectionHeading
        as="h1"
        eyebrow="Čo urobilo mesto"
        title="Kroky a prísľuby mesta"
        intro="Prehľad verejne známych krokov a prísľubov mesta a ich stavu. Hodnotenia uvádzame len so zdrojom – bez zdroja ide o vzorový záznam na doplnenie."
      />

      <PlaceholderNotice />

      {/* Tabuľka na desktope, karty na mobile */}
      <div className="overflow-hidden rounded-[var(--radius-card)] border border-ink-200">
        <table className="hidden w-full text-left text-sm sm:table">
          <thead className="bg-ink-50 text-xs uppercase tracking-wide text-ink-500">
            <tr>
              <th className="px-4 py-3 font-semibold">Dátum</th>
              <th className="px-4 py-3 font-semibold">Krok / prísľub</th>
              <th className="px-4 py-3 font-semibold">Stav</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-100">
            {actions.map((a) => (
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
          {actions.map((a) => (
            <li key={a.id} className="p-4">
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-xs text-ink-500">{formatDateSk(a.date)}</span>
                <StatusBadge status={a.actionStatus} />
              </div>
              <p className="mt-1 font-medium text-ink-900">{a.step}</p>
              {a.note && <p className="mt-1 text-sm text-ink-600">{a.note}</p>}
              {a.isPlaceholder && <div className="mt-2"><PlaceholderBadge /></div>}
              <SourceList sources={a.sources} />
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
