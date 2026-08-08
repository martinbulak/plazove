import type { Metadata } from "next";
import { Section, SectionHeading, Card } from "@/components/ui";
import { getSite } from "@/lib/content";

export const metadata: Metadata = {
  title: "O projekte a kontakt",
  description:
    "Kto a prečo prevádzkuje nezávislý informačný projekt o plážovom kúpalisku v Banskej Bystrici, ako overujeme zdroje a ako nás kontaktovať. Prevádzkovateľ aj mesto majú možnosť zaslať stanovisko.",
};

// ISR: obsah sa obnovuje z KV (ak je nastavené) každých 60 s.
export const revalidate = 60;

export default async function AboutPage() {
  const site = await getSite();

  return (
    <Section className="max-w-3xl">
      <SectionHeading
        as="h1"
        eyebrow="O projekte"
        title="Kto sme a prečo web vznikol"
        intro="Za Pláž je nezávislý občiansky informačný projekt. Nie je to oficiálny web prevádzkovateľa plážového kúpaliska ani Mesta Banská Bystrica."
      />

      <div className="prose-sk space-y-6 text-ink-700">
        <div>
          <h2 className="text-xl font-bold text-ink-900">Prečo projekt vznikol</h2>
          <p className="mt-2">
            Plážové kúpalisko je verejný majetok. Cieľom projektu je zrozumiteľne
            zhromaždiť verejne dostupné dokumenty a overiteľné fakty, vytvoriť
            transparentný archív vývoja prípadu a upozorňovať na aktuálny stav
            verejného majetku. Chceme prispieť k tomu, aby mesto situáciu aktívne
            a transparentne riešilo.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-bold text-ink-900">Kto za projektom stojí</h2>
          <p className="mt-2">
            Projekt je občianska iniciatíva dvoch ľudí z Banskej Bystrice. Nestojí
            za ním politická strana ani žiadna firma.
          </p>
          <ul className="mt-4 space-y-3 not-prose">
            <li className="rounded-[var(--radius-card)] border border-ink-200 bg-white p-4">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <p className="font-semibold text-ink-900">Martin Bulák</p>
                <FacebookLink
                  href="https://www.facebook.com/martin.bulak"
                  name="Martin Bulák"
                />
              </div>
              <p className="mt-1 text-sm leading-relaxed text-ink-600">
                Založil tento web. Zastrešuje jeho technickú stránku a
                zhromažďovanie dokumentov na jednom mieste.
              </p>
            </li>
            <li className="rounded-[var(--radius-card)] border border-ink-200 bg-white p-4">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <p className="font-semibold text-ink-900">Magdaléna Kováč Mergová</p>
                <FacebookLink
                  href="https://www.facebook.com/magdalenakovacmergova"
                  name="Magdaléna Kováč Mergová"
                />
              </div>
              <p className="mt-1 text-sm leading-relaxed text-ink-600">
                Téme plážového kúpaliska sa venuje dlhodobo. Podáva žiadosti
                o informácie podľa infozákona a osobne sa zúčastňuje kontrolných
                dní v areáli. Jej infožiadosti sú medzi{" "}
                <a href="/dokumenty" className="font-medium text-brand-700 underline">
                  zverejnenými dokumentmi
                </a>
                .
              </p>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-bold text-ink-900">Ako overujeme zdroje</h2>
          <ul className="mt-2 list-disc space-y-1.5 pl-6">
            <li>Fakty podkladáme verejne dostupnými dokumentmi a odkazmi.</li>
            <li>Odlišujeme fakty, citácie, právne výklady a názory.</li>
            <li>Používame len primerane krátke úryvky z cudzích textov s uvedením zdroja.</li>
            <li>
              Fotografie a dokumenty poslané e-mailom overujeme pred zverejnením
              – autorstvo, dátum a súvislosť s témou.
            </li>
            <li>
              Web nemá diskusiu ani formuláre, takže nezverejňujeme obsah, ktorý
              by sme predtým neprešli.
            </li>
          </ul>
        </div>

        <Card className="bg-brand-50">
          <h2 className="text-lg font-bold text-ink-900">Redakčná metodika</h2>
          <ul className="mt-2 list-disc space-y-1.5 pl-6 text-sm">
            <li>Fakty sú podložené zdrojmi.</li>
            <li>Komentáre a názory sú jasne označené.</li>
            <li>Chyby opravujeme a uvádzame, čo sa zmenilo.</li>
            <li>Dotknuté strany majú právo zaslať stanovisko, ktoré zverejníme.</li>
            <li>
              Web nezbiera žiadne osobné údaje – nemá formuláre, cookies ani
              sledovacie nástroje.
            </li>
          </ul>
        </Card>

        <div>
          <h2 className="text-xl font-bold text-ink-900">Právo na stanovisko</h2>
          <p className="mt-2">
            Prevádzkovateľ plážového kúpaliska aj Mesto Banská Bystrica majú
            možnosť zaslať svoje stanovisko. Po overení ho zverejníme pri
            súvisiacom obsahu. Rovnako uvítame upozornenie na akúkoľvek nepresnosť.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-bold text-ink-900">Ako nahlásiť chybu alebo požiadať o opravu</h2>
          <p className="mt-2">
            Ak ste našli chybu, chcete požiadať o opravu, reakciu alebo odstránenie
            obsahu, pozrite stránku{" "}
            <a href="/nahlasit" className="font-medium text-brand-700 underline">
              Nahlásiť chybu / obsah
            </a>{" "}
            alebo nám rovno napíšte na{" "}
            <a href={`mailto:${site.contactEmail}`} className="font-medium text-brand-700 underline">
              {site.contactEmail}
            </a>
            .
          </p>
        </div>

      </div>
    </Section>
  );
}

/** Odkaz na verejný facebookový profil člena iniciatívy. */
function FacebookLink({ href, name }: { href: string; name: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 rounded-md px-1.5 py-0.5 text-xs font-medium text-ink-500 hover:bg-ink-50 hover:text-brand-700"
    >
      <svg width="15" height="15" viewBox="0 0 24 24" aria-hidden className="shrink-0">
        <path
          fill="#1877F2"
          d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.68.24 2.68.24v2.96h-1.51c-1.49 0-1.96.93-1.96 1.89v2.26h3.33l-.53 3.49h-2.8V24C19.61 23.1 24 18.1 24 12.07z"
        />
      </svg>
      <span>Facebook</span>
      <span className="sr-only">– profil {name}, otvorí sa v novom okne</span>
    </a>
  );
}
