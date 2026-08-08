import type { Metadata } from "next";
import Link from "next/link";
import { Section, SectionHeading } from "@/components/ui";
import { DocumentsBrowser } from "@/components/DocumentsBrowser";
import { getDocuments, onlyPublished } from "@/lib/content";

export const metadata: Metadata = {
  title: "Dokumenty a analýzy",
  description:
    "Archív dokumentov k plážovému kúpalisku v Banskej Bystrici – nájomná zmluva, dodatky, právne stanovisko UK, správy kontrolóra, audity, uznesenia a odpovede na infožiadosti. Nezávislý informačný projekt.",
};

// ISR: obsah sa obnovuje z KV (ak je nastavené) každých 60 s.
export const revalidate = 60;

export default async function DocumentsPage() {
  const docs = onlyPublished(await getDocuments());

  /**
   * Dokumenty bez zverejneného súboru. Články a vyjadrenia, ktoré majú odkaz
   * na pôvodný zdroj, medzi chýbajúce nerátame – tie sú dostupné online.
   */
  const missing = docs.filter((d) => !d.fileUrl && !d.sourceUrl);
  const withFile = docs.filter((d) => d.fileUrl).length;
  /** Položky dostupné len odkazom na cudziu stránku – nemáme z nich súbor. */
  const linkOnly = docs.filter((d) => !d.fileUrl && d.sourceUrl).length;

  return (
    <Section>
      <SectionHeading
        as="h1"
        eyebrow="Archív"
        title="Dokumenty a analýzy"
        intro="Podklady, o ktoré sa tento web opiera. Archív rozlišuje dve veci: súbory, ktoré si môžete rovno stiahnuť, a odkazy na cudzie stránky, kde je zdroj zverejnený. Pri každej položke uvádzame zhrnutie a hlavné závery."
      />

      {/* Stav zverejnenia */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="border-t-2 border-ink-900 pt-3">
          <p className="display text-2xl text-ink-900">{docs.length}</p>
          <p className="mt-1 text-sm text-ink-600">položiek v archíve</p>
        </div>
        <div className="border-t-2 border-emerald-600 pt-3">
          <p className="display text-2xl text-ink-900">{withFile}</p>
          <p className="mt-1 text-sm text-ink-600">súborov na stiahnutie</p>
        </div>
        <div className="border-t-2 border-ink-400 pt-3">
          <p className="display text-2xl text-ink-900">{linkOnly}</p>
          <p className="mt-1 text-sm text-ink-600">odkazov na web</p>
        </div>
        <div className="border-t-2 border-amber-500 pt-3">
          <p className="display text-2xl text-ink-900">{missing.length}</p>
          <p className="mt-1 text-sm text-ink-600">čaká na zverejnenie</p>
        </div>
      </div>

      {/* Sekcia o chýbajúcich dokumentoch */}
      {missing.length > 0 && (
        <div className="mb-8 rounded-xl border border-amber-200 bg-amber-50 p-5">
          <h2 className="text-base font-bold text-amber-900">
            Dokumenty, ktoré zatiaľ nie sú zverejnené
          </h2>
          <p className="mt-1.5 text-sm leading-relaxed text-amber-900">
            Obsah a závery týchto dokumentov na webe spracované máme, samotné
            súbory však ešte nie sú zverejnené – buď ich pripravujeme na
            anonymizáciu osobných údajov, alebo ich ešte nemáme k dispozícii.
          </p>
          <ul className="mt-3 space-y-1.5 border-l-2 border-amber-300 pl-4 text-sm text-amber-900">
            {missing.map((d) => (
              <li key={d.id}>
                <a href={`#${d.id}`} className="font-medium underline decoration-dotted">
                  {d.title}
                </a>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs leading-relaxed text-amber-800">
            Máte niektorý z týchto dokumentov?{" "}
            <Link href="/nahlasit" className="font-semibold underline">
              Pošlite nám ho
            </Link>
            . Pred zverejnením každý dokument prejdeme a začierníme osobné údaje.
          </p>
        </div>
      )}

      <DocumentsBrowser documents={docs} />

      <div className="mt-8 rounded-lg border border-ink-200 bg-white p-4 text-sm text-ink-600">
        Hľadáte vysvetlenie, čo zmluva znamená?{" "}
        <Link
          href="/otazky-a-odpovede"
          className="font-semibold text-brand-700 underline"
        >
          Otázky a odpovede
        </Link>{" "}
        prekladajú jej kľúčové body do bežnej reči.
      </div>
    </Section>
  );
}
