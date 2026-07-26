import type { Metadata } from "next";
import { Section, SectionHeading, QuickNav } from "@/components/ui";
import { RatingRanking } from "@/components/charts";
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

  /**
   * Najhoršie hodnotené kúpaliská: hlavné kritérium je priemerné hodnotenie
   * (vzostupne), sekundárnym je počet hodnotení ako ukazovateľ návštevnosti –
   * slúži aj ako prah, aby sa do rebríčka nedostali prevádzky s pár recenziami.
   */
  const top10 = [...ratings.items]
    .filter((i) => i.reviews >= ratings.minReviews)
    .sort((a, b) => a.rating - b.rating || b.reviews - a.reviews)
    .slice(0, 10);
  const bbVolumeRank = top10.findIndex((i) => i.highlight) + 1;
  const bbInTop10 = top10.find((i) => i.highlight);
  // Overujeme z dát, či je BB naozaj najhoršie hodnotené z porovnávaných.
  const bbWorstRated = !!bbInTop10 && bbVolumeRank === 1;

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
          eyebrow="Rebríček"
          title="Najhoršie hodnotené kúpaliská na Slovensku"
          intro="Desať najslabšie hodnotených kúpalísk z tých, ktoré sme porovnávali. Hlavným kritériom je priemerné hodnotenie na Mapách Google, druhotným počet hodnotení – ten slúži ako ukazovateľ návštevnosti."
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
              Do rebríčka púšťame len zariadenia s aspoň{" "}
              {ratings.minReviews.toLocaleString("sk-SK")} hodnoteniami, aby
              poradie nestálo na pár recenziách. Počet hodnotení zároveň
              používame ako ukazovateľ návštevnosti.
            </li>
            <li>
              Zoradili sme ich podľa priemerného hodnotenia od najnižšieho
              a zobrazujeme prvých desať. Rozlohu uvádzame tam, kde sa dala
              overiť – ako kritérium poradia ju použiť nemožno, väčšina
              prevádzkovateľov ju nezverejňuje.
            </li>
            <li>
              Vynechali sme kryté plavárne, hotelové aquaparky a prevádzky,
              ktoré sú trvalo zatvorené.
            </li>
          </ol>
        </div>

        <div className="rounded-xl border border-ink-200 bg-white p-5 sm:p-6">
          <RatingRanking
            rows={top10}
            caption="Priemerné hodnotenie na Google – čím kratší stĺpec, tým horšie hodnotenie. Vpravo je počet hodnotení a overená rozloha."
          />
        </div>

        {bbVolumeRank > 0 && (
          <div className="mt-6 rounded-[var(--radius-card)] border-l-4 border-accent-500 bg-white p-5 shadow-sm ring-1 ring-ink-100">
            <p className="eyebrow text-brand-700">Zhrnutie</p>
            <p className="mt-2 text-ink-800">
              {bbWorstRated ? (
                <>
                  Plážové kúpalisko v Banskej Bystrici je{" "}
                  <strong>najhoršie hodnotené</strong> zo všetkých porovnávaných
                  kúpalísk s dostatočným počtom hodnotení –{" "}
                  {bbInTop10.rating.toFixed(1).replace(".", ",")} hviezdy
                  z {bbInTop10.reviews.toLocaleString("sk-SK")} hodnotení.
                </>
              ) : (
                <>
                  Plážové kúpalisko v Banskej Bystrici je v tomto rebríčku na{" "}
                  <strong>{bbVolumeRank}. mieste</strong> s hodnotením{" "}
                  {bbInTop10?.rating.toFixed(1).replace(".", ",")} hviezdy.
                </>
              )}
            </p>
          </div>
        )}
      </Section>

    </>
  );
}
