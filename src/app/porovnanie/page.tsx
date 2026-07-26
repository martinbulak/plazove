import type { Metadata } from "next";
import { Section, SectionHeading, Card, QuickNav } from "@/components/ui";
import { RatingRanking } from "@/components/charts";
import { getComparison } from "@/lib/content";
import { cn, formatDateSk } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Porovnanie a súvislosti",
  description:
    "Porovnanie vonkajších kúpalísk na Slovensku – kto ich prevádzkuje v Žiline, Nitre, Prešove, Trenčíne, Košiciach či Martine a ako sú hodnotené na Google v porovnaní s plážovým kúpaliskom v Banskej Bystrici.",
};

// ISR: obsah sa obnovuje z KV (ak je nastavené) každých 60 s.
export const revalidate = 60;

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
  const { cityFacts, ratings } = await getComparison();


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

        <QuickNav
          items={[
            { href: "#hodnotenia", label: "Hodnotenia na Google" },
            { href: "#vyznamnejsie", label: "Rebríček" },
          ]}
        />

        {/* Kontext mesta */}
        <h2 className="display mb-5 text-xl text-ink-900">Banská Bystrica v číslach</h2>
        <dl className="mb-12 grid gap-x-8 gap-y-7 sm:grid-cols-2 lg:grid-cols-3">
          {cityFacts.map((f, i) => (
            <div key={i} className="border-t-2 border-ink-900 pt-3">
              <dd className="display text-2xl text-ink-900">{f.value}</dd>
              <dt className="mt-1 text-sm font-medium leading-snug text-ink-800">
                {f.label}
              </dt>
              {f.note && (
                <p className="mt-1 text-xs leading-snug text-ink-500">{f.note}</p>
              )}
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
            </div>
          ))}
        </dl>

      </Section>

      {/* Hodnotenia na Google */}
      <div className="bg-ink-50">
        <Section id="hodnotenia" className="scroll-mt-24">
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

          {/* Celkové poradie ako graf */}
          <div className="rounded-xl border border-ink-200 bg-white p-5 sm:p-6">
            <RatingRanking rows={byRating} />
          </div>

          {/* Poznámky ku konkrétnym zariadeniam – schované pod rozbalenie */}
          {byRating.some((f) => f.note) && (
            <details className="group mt-4">
              <summary className="cursor-pointer list-none text-sm font-semibold text-brand-700 hover:underline [&::-webkit-details-marker]:hidden">
                <span className="group-open:hidden">
                  Poznámky k jednotlivým kúpaliskám ↓
                </span>
                <span className="hidden group-open:inline">Skryť poznámky ↑</span>
              </summary>
              <ul className="mt-3 space-y-2 border-l-2 border-ink-200 pl-4 text-sm leading-relaxed text-ink-600">
                {byRating
                  .filter((f) => f.note)
                  .map((f) => (
                    <li key={f.id}>
                      <strong className="font-semibold text-ink-800">{f.name}:</strong>{" "}
                      {f.note}
                    </li>
                  ))}
              </ul>
            </details>
          )}

          {ratings.footnotes && ratings.footnotes.length > 0 && (
            <ul className="mt-4 space-y-2 text-xs leading-relaxed text-ink-500">
              {ratings.footnotes.map((f, i) => (
                <li key={i} className="flex gap-2">
                  <span aria-hidden>*</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          )}
        </Section>
      </div>

      {/* Rebríček významnejších zariadení */}
      <Section id="vyznamnejsie" className="scroll-mt-24">
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
