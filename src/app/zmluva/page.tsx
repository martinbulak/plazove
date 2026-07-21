import type { Metadata } from "next";
import Link from "next/link";
import { Section, SectionHeading, Card, ClaimBadge } from "@/components/ui";
import { DocumentsBrowser } from "@/components/DocumentsBrowser";
import { getContractQA, getDocuments, onlyPublished } from "@/lib/content";

export const metadata: Metadata = {
  title: "Zmluva a dokumenty",
  description:
    "Laický rozbor nájomnej zmluvy č. 526/2007/EM-SM na plážové kúpalisko v Banskej Bystrici a archív dokumentov – právne stanovisko UK, správy kontrolóra, audity a infožiadosti. Nezávislý informačný projekt.",
};

// ISR: obsah sa obnovuje z KV (ak je nastavené) každých 60 s.
export const revalidate = 60;

export default async function ContractPage() {
  const [qa, documents] = await Promise.all([getContractQA(), getDocuments()]);
  const docs = onlyPublished(documents);

  return (
    <>
      <Section>
        <SectionHeading
          as="h1"
          eyebrow="Zmluva a dokumenty"
          title="Nájomná zmluva zrozumiteľne"
          intro="Najdôležitejšie otázky o nájomnej zmluve č. 526/2007/EM-SM a jednoduché odpovede. Pri každej odpovedi uvádzame, či ide o citáciu zo zmluvy, právny výklad alebo záver dokumentu, a odkazujeme na konkrétny článok."
        />

        <div className="mb-6 rounded-lg border border-brand-200 bg-brand-50 px-4 py-3 text-sm text-brand-900">
          <strong>Právne upozornenie:</strong> Obsah webu predstavuje informačné
          spracovanie verejne dostupných dokumentov a nenahrádza individuálne
          právne poradenstvo.
        </div>

        <div className="space-y-4">
          {qa.map((item) => (
            <Card key={item.id}>
              <div className="flex flex-wrap items-start justify-between gap-2">
                <h2 className="text-lg font-semibold text-ink-900">{item.question}</h2>
                <ClaimBadge kind={item.kind} />
              </div>
              <p className="mt-2 text-ink-700">{item.answer}</p>

              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-ink-500">
                {item.article && (
                  <span className="inline-flex items-center gap-1 font-medium">
                    <span aria-hidden>§</span> {item.article}
                  </span>
                )}
                {item.document && (
                  <Link
                    href={
                      item.document.url ??
                      (item.document.documentId
                        ? `#${item.document.documentId}`
                        : "#archiv")
                    }
                    className="inline-flex items-center gap-1 font-medium text-brand-700 underline decoration-dotted underline-offset-2"
                  >
                    📄 {item.document.label}
                    {item.document.page ? ` (s. ${item.document.page})` : ""}
                  </Link>
                )}
              </div>
            </Card>
          ))}
        </div>
      </Section>

      {/* Archív dokumentov */}
      <div className="bg-ink-50">
        <Section id="archiv">
          <SectionHeading
            eyebrow="Archív dokumentov"
            title="Dokumenty a analýzy"
            intro="Dokumenty, o ktoré sa tento web opiera. Vyhľadávajte podľa názvu alebo filtrujte podľa kategórie."
          />

          <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            <strong>Poznámka k súborom:</strong> obsah a závery dokumentov sú
            spracované z originálov, ktoré mesto sprístupnilo na infožiadosť. Samotné
            PDF súbory zatiaľ na tomto webe nezverejňujeme – niektoré obsahujú
            osobné údaje, ktoré je pred zverejnením potrebné anonymizovať.
          </div>

          <DocumentsBrowser documents={docs} />
        </Section>
      </div>
    </>
  );
}
