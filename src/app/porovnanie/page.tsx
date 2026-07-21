import type { Metadata } from "next";
import { Section, SectionHeading, Card } from "@/components/ui";
import { getComparison } from "@/lib/content";
import { OPERATOR_TYPE_LABEL, type OperatorType } from "@/lib/types";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Porovnanie a súvislosti",
  description:
    "Ako prevádzkujú letné kúpaliská iné slovenské mestá – Žilina, Nitra, Prešov, Trenčín, Košice či Martin – a v akom kontexte veľkosti a rozpočtu Banskej Bystrice treba prípad plážového kúpaliska vnímať.",
};

// ISR: obsah sa obnovuje z KV (ak je nastavené) každých 60 s.
export const revalidate = 60;

const OP_STYLE: Record<OperatorType, string> = {
  municipal: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  private: "bg-amber-50 text-amber-900 ring-amber-200",
  none: "bg-rose-50 text-rose-800 ring-rose-200",
};

export default async function ComparisonPage() {
  const { cityFacts, cities } = await getComparison();

  const municipal = cities.filter((c) => c.operatorType === "municipal").length;
  const total = cities.length;

  return (
    <>
      <Section>
        <SectionHeading
          as="h1"
          eyebrow="Porovnanie a súvislosti"
          title="Ako to riešia iné mestá"
          intro="Aby sa dal prípad zasadiť do kontextu, porovnali sme, kto prevádzkuje verejné kúpaliská v ďalších slovenských mestách. Údaje sú z oficiálnych zdrojov miest a ich organizácií; pri každom meste uvádzame odkaz."
        />

        {/* Kontext mesta */}
        <h2 className="mb-4 text-xl font-bold text-ink-900">Banská Bystrica v číslach</h2>
        <dl className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cityFacts.map((f, i) => (
            <Card key={i}>
              <dt className="text-sm font-medium text-ink-500">{f.label}</dt>
              <dd className="mt-1 text-xl font-bold text-ink-900">{f.value}</dd>
              {f.note && <p className="mt-1 text-xs text-ink-600">{f.note}</p>}
              {f.sourceUrl && (
                <a
                  href={f.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-block text-xs font-medium text-brand-700 underline decoration-dotted"
                >
                  Zdroj →
                </a>
              )}
            </Card>
          ))}
        </dl>

        {/* Kľúčové zistenie */}
        <div className="mb-8 rounded-[var(--radius-card)] border-l-4 border-brand-500 bg-brand-50 p-5">
          <p className="text-sm font-semibold uppercase tracking-wide text-brand-700">
            Kľúčové zistenie
          </p>
          <p className="mt-2 text-ink-800">
            Z {total} porovnávaných miest prevádzkuje verejné kúpalisko priamo mesto
            alebo jeho organizácia v {municipal} prípadoch. Banská Bystrica patrí
            spolu s Martinom medzi výnimky, kde je mestský areál dlhodobo prenajatý
            súkromnému prevádzkovateľovi.
          </p>
          <p className="mt-2 text-xs text-ink-600">
            Ide o zhrnutie údajov v tabuľke nižšie, nie o hodnotenie kvality
            jednotlivých modelov. Porovnanie nezahŕňa všetky slovenské mestá.
          </p>
        </div>

        {/* Tabuľka porovnania */}
        <h2 className="mb-4 text-xl font-bold text-ink-900">Kto prevádzkuje kúpaliská</h2>
        <div className="overflow-x-auto rounded-[var(--radius-card)] border border-ink-200">
          <table className="w-full min-w-[46rem] text-left text-sm">
            <thead className="bg-ink-50 text-xs uppercase tracking-wide text-ink-500">
              <tr>
                <th className="px-4 py-3 font-semibold">Mesto</th>
                <th className="px-4 py-3 font-semibold">Zariadenie</th>
                <th className="px-4 py-3 font-semibold">Prevádzkovateľ</th>
                <th className="px-4 py-3 font-semibold">V prevádzke</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100 bg-white">
              {cities.map((c) => (
                <tr key={c.id} className={cn("align-top", c.highlight && "bg-brand-50")}>
                  <td className="px-4 py-3">
                    <p className={cn("font-semibold text-ink-900", c.highlight && "text-brand-800")}>
                      {c.city}
                    </p>
                    <p className="text-xs text-ink-500">{c.population} obyv.</p>
                  </td>
                  <td className="px-4 py-3 text-ink-700">{c.facility}</td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        "inline-block rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset",
                        OP_STYLE[c.operatorType],
                      )}
                    >
                      {OPERATOR_TYPE_LABEL[c.operatorType]}
                    </span>
                    <p className="mt-1 text-ink-700">{c.operator}</p>
                    {c.detail && <p className="mt-1 text-xs text-ink-600">{c.detail}</p>}
                    {c.sourceUrl && (
                      <a
                        href={c.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-1 inline-block text-xs font-medium text-brand-700 underline decoration-dotted"
                      >
                        Zdroj →
                      </a>
                    )}
                  </td>
                  <td className="px-4 py-3 text-ink-700">{c.inOperation}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-4 text-xs text-ink-500">
          Údaje boli overované v júli 2026 z oficiálnych webov miest, ich
          organizácií a Štatistického úradu SR. Počty obyvateľov sú k 1. 1. 2026,
          resp. k poslednému dostupnému dátumu.
        </p>
      </Section>
    </>
  );
}
