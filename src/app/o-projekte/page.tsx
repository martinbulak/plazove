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
              <p className="font-semibold text-ink-900">Martin Bulák</p>
              <p className="mt-1 text-sm leading-relaxed text-ink-600">
                Založil tento web. Zastrešuje jeho technickú stránku a
                zhromažďovanie dokumentov na jednom mieste.
              </p>
            </li>
            <li className="rounded-[var(--radius-card)] border border-ink-200 bg-white p-4">
              <p className="font-semibold text-ink-900">Magdaléna Kováč Mergová</p>
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
              Fotografie, dokumenty a tipy od verejnosti moderujeme pred
              zverejnením.
            </li>
            <li>
              Odkazy pripojené k podpisu výzvy sa zverejňujú automaticky po overení
              e-mailu; moderujeme ich dodatočne.
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
              Odkazy podpisujúcich sú názormi konkrétnych osôb. Zverejňujú sa po
              overení e-mailu a odstránime ich, ak porušujú zákon, urážajú
              konkrétne osoby alebo nesúvisia s témou.
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
            obsahu, použite formulár na stránke{" "}
            <a href="/nahlasit" className="font-medium text-brand-700 underline">
              Nahlásiť chybu / obsah
            </a>{" "}
            alebo nám napíšte na{" "}
            <a href={`mailto:${site.contactEmail}`} className="font-medium text-brand-700 underline">
              {site.contactEmail}
            </a>
            .
          </p>
        </div>

        <Card>
          <h2 className="text-lg font-bold text-ink-900">Kontakt</h2>
          <p className="mt-2 text-sm">
            Prevádzkovateľ webu: Martin Bulák
            <br />
            Družby 31, 974 04 Banská Bystrica
            <br />
            E-mail:{" "}
            <a href={`mailto:${site.contactEmail}`} className="font-medium text-brand-700 underline">
              {site.contactEmail}
            </a>
          </p>
        </Card>
      </div>
    </Section>
  );
}
