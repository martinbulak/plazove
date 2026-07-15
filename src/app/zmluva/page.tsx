import type { Metadata } from "next";
import Link from "next/link";
import { Section, SectionHeading, Card, ClaimBadge, PlaceholderNotice } from "@/components/ui";
import { getContractQA } from "@/lib/content";

export const metadata: Metadata = {
  title: "Zmluva a jej rozbor",
  description:
    "Laický rozbor nájomnej zmluvy mesta Banská Bystrica k plážovému kúpalisku formou otázok a odpovedí. Odlíšené citácie, právne výklady a názory. Nezávislý informačný projekt.",
};

// ISR: obsah sa obnovuje z KV (ak je nastavené) každých 60 s.
export const revalidate = 60;

export default async function ContractPage() {
  const qa = await getContractQA();

  return (
    <Section>
      <SectionHeading
        as="h1"
        eyebrow="Zmluva a jej rozbor"
        title="Nájomná zmluva zrozumiteľne"
        intro="Najčastejšie otázky o nájomnej zmluve a jednoduché odpovede. Pri každej odpovedi uvádzame, či ide o citáciu, právny výklad alebo názor, a odkazujeme na konkrétny článok a dokument."
      />

      <div className="mb-6 rounded-lg border border-brand-200 bg-brand-50 px-4 py-3 text-sm text-brand-900">
        <strong>Právne upozornenie:</strong> Obsah webu predstavuje informačné
        spracovanie verejne dostupných dokumentov a nenahrádza individuálne
        právne poradenstvo.
      </div>

      <PlaceholderNotice />

      <div className="space-y-4">
        {qa.map((item) => (
          <Card key={item.id} className="overflow-hidden">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <h2 className="text-lg font-semibold text-ink-900">{item.question}</h2>
              <ClaimBadge kind={item.kind} />
            </div>
            <p className="mt-2 text-ink-700">{item.answer}</p>

            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-ink-500">
              {item.article && (
                <span className="inline-flex items-center gap-1">
                  <span aria-hidden>§</span> {item.article}
                </span>
              )}
              {item.document && (
                <Link
                  href={
                    item.document.url ??
                    (item.document.documentId
                      ? `/dokumenty#${item.document.documentId}`
                      : "/dokumenty")
                  }
                  className="inline-flex items-center gap-1 font-medium text-brand-700 underline decoration-dotted underline-offset-2"
                >
                  📄 Otvoriť dokument
                  {item.document.page ? ` (s. ${item.document.page})` : ""}
                </Link>
              )}
            </div>
          </Card>
        ))}
      </div>
    </Section>
  );
}
