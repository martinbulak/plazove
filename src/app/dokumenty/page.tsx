import type { Metadata } from "next";
import { Section, SectionHeading, PlaceholderNotice } from "@/components/ui";
import { DocumentsBrowser } from "@/components/DocumentsBrowser";
import { getDocuments, onlyPublished } from "@/lib/content";

export const metadata: Metadata = {
  title: "Dokumenty a analýzy",
  description:
    "Archív verejne dostupných dokumentov k plážovému kúpalisku v Banskej Bystrici – nájomná zmluva, dodatky, právne stanoviská, správy kontrolóra, audity, uznesenia a infožiadosti. Nezávislý informačný projekt.",
};

// ISR: obsah sa obnovuje z KV (ak je nastavené) každých 60 s.
export const revalidate = 60;

export default async function DocumentsPage() {
  const documents = onlyPublished(await getDocuments());

  return (
    <Section>
      <SectionHeading
        as="h1"
        eyebrow="Dokumenty a analýzy"
        title="Archív dokumentov"
        intro="Verejne dostupné dokumenty na jednom mieste. Vyhľadávajte podľa názvu a filtrujte podľa kategórie. Pri každom dokumente je zhrnutie, hlavné závery a odkaz na zdroj."
      />

      <PlaceholderNotice>
        Nižšie uvedené dokumenty sú vzorové záznamy. Skutočné PDF súbory, zhrnutia
        a zdroje treba doplniť cez administráciu.
      </PlaceholderNotice>

      <DocumentsBrowser documents={documents} />
    </Section>
  );
}
