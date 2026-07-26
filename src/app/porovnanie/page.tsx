import type { Metadata } from "next";
import { Section, SectionHeading, QuickNav } from "@/components/ui";
import { RatingRanking, ReviewVolumeRanking } from "@/components/charts";
import { getComparison } from "@/lib/content";
import { formatDateSk } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Porovnanie a súvislosti",
  description:
    "Porovnanie vonkajších kúpalísk na Slovensku – kto ich prevádzkuje v Žiline, Nitre, Prešove, Trenčíne, Košiciach či Martine a ako sú hodnotené na Google v porovnaní s plážovým kúpaliskom v Banskej Bystrici.",
};

// ISR: obsah sa obnovuje z KV (ak je nastavené) každých 60 s.
export const revalidate = 60;

export default async function ComparisonPage() {
  const { cityFacts, ratings } = await getComparison();


  // Poradie podľa hodnotenia (zostupne), pri zhode rozhoduje počet recenzií.
  const byRating = [...ratings.items].sort(
    (a, b) => b.rating - a.rating || b.reviews - a.reviews,
  );

  // Top 10 podľa počtu hodnotení – počet recenzií berieme ako ukazovateľ návštevnosti.
  const top10 = [...ratings.items]
    .sort((a, b) => b.reviews - a.reviews)
    .slice(0, 10);
  const bbVolumeRank = top10.findIndex((i) => i.highlight) + 1;

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

      {/* Top 10 podľa návštevnosti */}
      <Section id="vyznamnejsie" className="scroll-mt-24">
        <SectionHeading
          eyebrow="Top 10 kúpalísk"
          title="Najnavštevovanejšie kúpaliská na Slovensku"
          intro="Rebríček desiatich kúpalísk s najväčším počtom hodnotení na Mapách Google. Počet hodnotení berieme ako ukazovateľ návštevnosti – tým sa z porovnania prirodzene vytratia malé obecné kúpaliská s desiatkami recenzií."
        />

        <div className="mb-6 rounded-lg border border-ink-200 bg-white px-4 py-3 text-sm leading-relaxed text-ink-600">
          <p className="font-semibold text-ink-800">Ako sme rebríček zostavili</p>
          <ol className="mt-2 list-decimal space-y-1 pl-5">
            <li>
              Na Mapách Google sme vyhľadali „kúpalisko" a „letné kúpalisko"
              vo viacerých častiach Slovenska a doplnili známe väčšie zariadenia.
            </li>
            <li>
              Pri každom sme odčítali priemerné hodnotenie a počet hodnotení
              priamo z karty miesta.
            </li>
            <li>
              Zoradili sme ich podľa počtu hodnotení a zobrazujeme prvých desať.
              Rozlohu uvádzame tam, kde sa dala overiť – ako ukazovateľ poradia
              ju použiť nemožno, väčšina prevádzkovateľov ju nezverejňuje.
            </li>
            <li>
              Vynechali sme kryté plavárne a hotelové aquaparky, ktoré majú iný
              charakter prevádzky.
            </li>
          </ol>
        </div>

        <div className="rounded-xl border border-ink-200 bg-white p-5 sm:p-6">
          <ReviewVolumeRanking rows={top10} />
        </div>

        {bbVolumeRank > 0 && (
          <div className="mt-6 rounded-[var(--radius-card)] border-l-4 border-accent-500 bg-white p-5 shadow-sm ring-1 ring-ink-100">
            <p className="eyebrow text-brand-700">Zhrnutie</p>
            <p className="mt-2 text-ink-800">
              Plážové kúpalisko v Banskej Bystrici je podľa počtu hodnotení{" "}
              <strong>{bbVolumeRank}. najnavštevovanejšie</strong> z tejto
              desiatky – patrí teda medzi najväčšie na Slovensku. Zároveň má
              v nej <strong>najnižšie hodnotenie</strong>.
            </p>
          </div>
        )}
      </Section>

    </>
  );
}
