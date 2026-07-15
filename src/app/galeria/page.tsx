import type { Metadata } from "next";
import Link from "next/link";
import { Section, SectionHeading, PlaceholderNotice } from "@/components/ui";
import { Gallery } from "@/components/Gallery";
import { getGallery, onlyPublished } from "@/lib/content";

export const metadata: Metadata = {
  title: "Galéria",
  description:
    "Fotogaléria aktuálneho a historického stavu areálu plážového kúpaliska v Banskej Bystrici. Vzorové placeholder fotografie. Nezávislý informačný projekt.",
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
        title="Aktuálny a historický stav areálu"
        intro="Fotografie dokumentujúce stav verejného majetku. Po kliknutí sa fotografia otvorí vo väčšom zobrazení. Pri každej fotografii uvádzame dátum, autora/zdroj a či ide o vlastnú alebo prevzatú fotografiu."
      />

      <PlaceholderNotice>
        Zobrazené fotografie sú vzorové (placeholder) grafiky, nie skutočné zábery
        areálu. Skutočné fotografie treba nahrať cez administráciu.
      </PlaceholderNotice>

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
