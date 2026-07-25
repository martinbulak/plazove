import type { Metadata } from "next";
import Link from "next/link";
import { Section, SectionHeading } from "@/components/ui";
import { Gallery } from "@/components/Gallery";
import { getGallery, onlyPublished } from "@/lib/content";

export const metadata: Metadata = {
  title: "Galéria",
  description:
    "Fotografie stavu areálu plážového kúpaliska v Banskej Bystrici z rokov 2013–2024 z fotodokumentácie petičného výboru. Nezávislý informačný projekt.",
};

// ISR: obsah sa obnovuje z KV (ak je nastavené) každých 60 s.
export const revalidate = 60;

export default async function GalleryPage() {
  const items = onlyPublished(await getGallery());

  return (
    <Section>
      <SectionHeading
        as="h1"
        eyebrow="Galéria"
        title="Stav areálu na fotografiách"
        intro="Fotografie dokumentujúce stav verejného majetku v rokoch 2013 – 2024. Po kliknutí sa fotografia otvorí vo väčšom zobrazení. Pri každej fotografii uvádzame dátum a zdroj."
      />

      <div className="mb-6 rounded-lg border border-ink-200 bg-ink-50 px-4 py-3 text-sm text-ink-600">
        <strong>Zdroj a kontext:</strong> fotografie pochádzajú z fotodokumentácie
        petičného výboru za záchranu plážového kúpaliska (zábery Ľubice Bučkovej
        z rokov 2013 a 2016 a petičného výboru z roku 2024), ktorá bola predložená
        aj mestskému zastupiteľstvu. Ide o výber; kompletné materiály obsahujú
        stovky záberov. Popisy pod fotografiami sú redakčne neutrálne – hodnotenia
        stavu sú vecou pisateľov pôvodných materiálov.
      </div>

      <Gallery items={items} />

      <div className="mt-8 rounded-lg border border-brand-200 bg-brand-50 p-4 text-sm text-brand-900">
        Máte vlastnú fotografiu areálu?{" "}
        <Link href="/podporte#poslat-fotografiu" className="font-semibold underline">
          Pošlite nám ju
        </Link>
        . Pri odosielaní potvrdzujete autorstvo, súhlas so zverejnením a to, že
        fotografia neprimerane nezasahuje do súkromia iných osôb.
      </div>
    </Section>
  );
}
