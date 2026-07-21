import type { Metadata } from "next";
import { Section, SectionHeading, Card } from "@/components/ui";
import { getComparison } from "@/lib/content";
import { OPERATOR_TYPE_LABEL, type OperatorType } from "@/lib/types";
import { cn, formatDateSk } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Porovnanie a súvislosti",
  description:
    "Porovnanie vonkajších kúpalísk na Slovensku – kto ich prevádzkuje v Žiline, Nitre, Prešove, Trenčíne, Košiciach či Martine a ako sú hodnotené na Google v porovnaní s plážovým kúpaliskom v Banskej Bystrici.",
};

// ISR: obsah sa obnovuje z KV (ak je nastavené) každých 60 s.
export const revalidate = 60;

const OP_STYLE: Record<OperatorType, string> = {
  municipal: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  private: "bg-amber-50 text-amber-900 ring-amber-200",
  none: "bg-rose-50 text-rose-800 ring-rose-200",
};

/** Hviezdičkový ukazovateľ hodnotenia. */
function Stars({ rating }: { rating: number }) {
  return (
    <span className="inline-flex items-center gap-1" aria-hidden>
      <span className="text-accent-500">★</span>
      <span className="font-bold tabular-nums text-ink-900">
        {rating.toFixed(1).replace(".", ",")}
      </span>
    </span>
  );
}

export default async function ComparisonPage() {
  const { cityFacts, cities, ratings } = await getComparison();

  const municipal = cities.filter((c) => c.operatorType === "municipal").length;
  const total = cities.length;

  // Poradie podľa hodnotenia (zostupne), pri zhode rozhoduje počet recenzií.
  const byRating = [...ratings.items].sort(
    (a, b) => b.rating - a.rating || b.reviews - a.reviews,
  );

  // Kúpaliská s výraznejšou návštevnosťou (dostatočne veľká vzorka recenzií).
  const major = [...ratings.items]
    .filter((i) => i.reviews >= ratings.minReviews)
    .sort((a, b) => b.rating - a.rating || b.reviews - a.reviews);

  const bbRank = major.findIndex((i) => i.highlight) + 1;

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

      {/* Hodnotenia na Google */}
      <div className="bg-ink-50">
        <Section id="hodnotenia">
          <SectionHeading
            eyebrow="Hodnotenia návštevníkov"
            title="Poradie podľa hodnotenia na Google"
            intro="Priemerné hodnotenie a počet recenzií na Mapách Google. Ide o verejne dostupné hodnotenia návštevníkov, nie o odborné posúdenie kvality zariadení."
          />

          {/* Metodika */}
          <div className="mb-6 rounded-lg border border-ink-200 bg-white px-4 py-3 text-sm text-ink-600">
            <p className="font-semibold text-ink-800">Ako čítať tieto čísla</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>
                Porovnávame <strong>len vonkajšie kúpaliská</strong>. Zámerne sme
                vynechali kryté plavárne a komerčné akvaparky či termálne parky
                (napr. AquaCity Poprad), pretože majú iný charakter, cenu aj
                celoročnú prevádzku, a porovnanie by bolo zavádzajúce.
              </li>
              <li>
                Údaje sme odčítali priamo z Máp Google dňa{" "}
                {formatDateSk(ratings.checkedAt)}. Hodnotenia sa v čase menia.
              </li>
              <li>
                <strong>Počet recenzií nie je údaj o návštevnosti.</strong> Skutočné
                počty návštevníkov prevádzkovatelia ani mestá nezverejňujú, preto
                používame počet recenzií ako približný ukazovateľ veľkosti a
                známosti zariadenia.
              </li>
              <li>
                Google recenzie nie sú overované a nejde o reprezentatívny prieskum.
              </li>
            </ul>
          </div>

          {/* Celkové poradie */}
          <div className="overflow-x-auto rounded-[var(--radius-card)] border border-ink-200">
            <table className="w-full min-w-[38rem] text-left text-sm">
              <thead className="bg-white text-xs uppercase tracking-wide text-ink-500">
                <tr>
                  <th className="px-4 py-3 font-semibold">#</th>
                  <th className="px-4 py-3 font-semibold">Zariadenie</th>
                  <th className="px-4 py-3 font-semibold">Hodnotenie</th>
                  <th className="px-4 py-3 font-semibold">Recenzie</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100 bg-white">
                {byRating.map((f, i) => (
                  <tr key={f.id} className={cn("align-top", f.highlight && "bg-brand-50")}>
                    <td className="px-4 py-3 font-mono text-ink-400">{i + 1}</td>
                    <td className="px-4 py-3">
                      <p
                        className={cn(
                          "font-medium text-ink-900",
                          f.highlight && "font-bold text-brand-800",
                        )}
                      >
                        {f.name}
                      </p>
                      <p className="text-xs text-ink-500">{f.place}</p>
                      {f.note && <p className="mt-1 text-xs text-ink-500">{f.note}</p>}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <Stars rating={f.rating} />
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 tabular-nums text-ink-600">
                      {f.reviews.toLocaleString("sk-SK")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>
      </div>

      {/* Rebríček významnejších zariadení */}
      <Section id="vyznamnejsie">
        <SectionHeading
          eyebrow="Kúpaliská porovnateľnej veľkosti"
          title="Poradie medzi najnavštevovanejšími kúpaliskami"
          intro={`Zúžený rebríček len na kúpaliská s aspoň ${ratings.minReviews.toLocaleString("sk-SK")} recenziami. Tým sa odfiltrujú prevádzky, ktorých hodnotenie stojí na desiatkach recenzií, a porovnávajú sa zariadenia s dostatočne veľkou vzorkou návštevníkov.`}
        />

        <ol className="space-y-3">
          {major.map((f, i) => (
            <li key={f.id}>
              <Card
                className={cn(
                  "flex flex-wrap items-center gap-4",
                  f.highlight && "border-brand-400 bg-brand-50",
                )}
              >
                <span
                  className={cn(
                    "grid h-10 w-10 shrink-0 place-items-center rounded-full font-bold",
                    f.highlight
                      ? "bg-brand-700 text-white"
                      : "bg-ink-100 text-ink-700",
                  )}
                >
                  {i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p
                    className={cn(
                      "font-semibold text-ink-900",
                      f.highlight && "text-brand-800",
                    )}
                  >
                    {f.name}
                  </p>
                  <p className="text-xs text-ink-500">
                    {f.place} · {f.reviews.toLocaleString("sk-SK")} recenzií
                  </p>
                </div>
                <div className="text-right">
                  <Stars rating={f.rating} />
                </div>
              </Card>
            </li>
          ))}
        </ol>

        {bbRank > 0 && (
          <div className="mt-6 rounded-[var(--radius-card)] border-l-4 border-accent-500 bg-white p-5 shadow-sm ring-1 ring-ink-100">
            <p className="text-sm font-semibold uppercase tracking-wide text-brand-700">
              Zhrnutie
            </p>
            <p className="mt-2 text-ink-800">
              Medzi {major.length} najnavštevovanejšími kúpaliskami skončilo
              plážové kúpalisko v Banskej Bystrici na{" "}
              <strong>
                {bbRank}. mieste z {major.length}
              </strong>{" "}
              s hodnotením{" "}
              {major.find((f) => f.highlight)?.rating.toFixed(1).replace(".", ",")}.
              Ostatné kúpaliská v tejto skupine majú hodnotenie{" "}
              {Math.min(
                ...major.filter((f) => !f.highlight).map((f) => f.rating),
              )
                .toFixed(1)
                .replace(".", ",")}{" "}
              a vyššie.
            </p>
            <p className="mt-2 text-xs text-ink-600">
              Ide o porovnanie verejných hodnotení návštevníkov k{" "}
              {formatDateSk(ratings.checkedAt)}, nie o odborné posúdenie technického
              stavu či hygieny. Hodnotenie ovplyvňuje aj typ zariadenia a cena vstupu.
            </p>
          </div>
        )}
      </Section>
    </>
  );
}
