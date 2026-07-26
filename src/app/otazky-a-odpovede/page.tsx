import type { Metadata } from "next";
import Link from "next/link";
import { Section, SectionHeading, ClaimBadge, ClaimLegend } from "@/components/ui";
import { getContractQA, getDocuments, onlyPublished } from "@/lib/content";

export const metadata: Metadata = {
  title: "Otázky a odpovede",
  description:
    "Najčastejšie otázky o plážovom kúpalisku v Banskej Bystrici a nájomnej zmluve č. 526/2007/EM-SM – zrozumiteľné odpovede s odkazom na konkrétny článok zmluvy a zdrojový dokument.",
};

// ISR: obsah sa obnovuje z KV (ak je nastavené) každých 60 s.
export const revalidate = 60;

export default async function FaqPage() {
  const [qa, documents] = await Promise.all([getContractQA(), getDocuments()]);
  const docs = onlyPublished(documents);
  const docById = new Map(docs.map((d) => [d.id, d]));

  return (
    <Section>
      <SectionHeading
        as="h1"
        eyebrow="Otázky a odpovede"
        title="Čo hovorí nájomná zmluva"
        intro="Najdôležitejšie otázky o prenájme plážového kúpaliska a zrozumiteľné odpovede. Pri každej uvádzame, či ide o citáciu zo zmluvy, právny výklad alebo záver dokumentu, a odkazujeme na konkrétny článok aj zdroj."
      />

      <div className="mb-6 rounded-lg border border-brand-200 bg-brand-50 px-4 py-3 text-sm text-brand-900">
        <strong>Právne upozornenie:</strong> Obsah predstavuje informačné
        spracovanie verejne dostupných dokumentov a nenahrádza individuálne
        právne poradenstvo.
      </div>

      <ClaimLegend />

      <div className="space-y-3">
        {qa.map((item, idx) => {
          const doc = item.document?.documentId
            ? docById.get(item.document.documentId)
            : undefined;

          return (
            <details
              key={item.id}
              open={idx === 0}
              className="group rounded-[var(--radius-card)] border border-ink-200 bg-white shadow-sm"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 p-5 [&::-webkit-details-marker]:hidden">
                <h2 className="text-base font-semibold text-ink-900 sm:text-lg">
                  {item.question}
                </h2>
                <span
                  aria-hidden
                  className="shrink-0 text-ink-400 transition-transform group-open:rotate-180"
                >
                  ▾
                </span>
              </summary>

              <div className="border-t border-ink-100 p-5 pt-4">
                <div className="mb-2">
                  <ClaimBadge kind={item.kind} />
                </div>
                <p className="leading-relaxed text-ink-700">{item.answer}</p>

                {/* Zdroj odpovede */}
                <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-ink-100 pt-3 text-sm">
                  {item.article && (
                    <span className="inline-flex items-center gap-1 font-medium text-ink-600">
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
                      className="inline-flex items-center gap-1.5 font-medium text-brand-700 underline decoration-dotted underline-offset-2"
                    >
                      📄 {item.document.label}
                      {item.document.page ? ` (s. ${item.document.page})` : ""}
                    </Link>
                  )}

                  {doc?.fileUrl ? (
                    <a
                      href={doc.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-md bg-brand-800 px-2.5 py-1 text-xs font-semibold text-white hover:bg-brand-900"
                    >
                      Otvoriť PDF
                    </a>
                  ) : (
                    doc && (
                      <span className="text-xs italic text-ink-400">
                        PDF zatiaľ nie je zverejnené
                      </span>
                    )
                  )}
                </div>
              </div>
            </details>
          );
        })}
      </div>

      <div className="mt-10 rounded-xl border border-ink-200 bg-white p-5">
        <p className="display text-lg text-ink-900">Chcete vidieť originály?</p>
        <p className="mt-1.5 text-sm leading-relaxed text-ink-600">
          Všetky dokumenty, o ktoré sa odpovede opierajú, sú aj so zhrnutím
          a hlavnými závermi v archíve.
        </p>
        <Link
          href="/dokumenty"
          className="mt-4 inline-flex items-center gap-2 rounded-lg bg-brand-800 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-900"
        >
          Archív dokumentov →
        </Link>
      </div>
    </Section>
  );
}
