import type { Metadata } from "next";
import { Section, SectionHeading } from "@/components/ui";

export const metadata: Metadata = {
  title: "Podmienky používania",
  description:
    "Podmienky používania webu Za Pláž. Charakter obsahu, autorské práva, zodpovednosť a pravidlá pre obsah od verejnosti.",
};

export default function TermsPage() {
  return (
    <Section className="max-w-3xl">
      <SectionHeading as="h1" eyebrow="Právne informácie" title="Podmienky používania" />

      <div className="prose-sk space-y-5 text-ink-700">
        <div>
          <h2 className="text-xl font-bold text-ink-900">1. Prevádzkovateľ webu</h2>
          <p className="mt-2">
            Web zaplaz.sk prevádzkuje <strong>Martin Bulák</strong>, Družby 31,
            974 04 Banská Bystrica, e-mail{" "}
            <a href="mailto:info@zaplaz.sk" className="text-brand-700 underline">
              info@zaplaz.sk
            </a>
            , ako fyzická osoba. Nejde o podnikateľskú činnosť a web nepredáva
            žiadny tovar ani služby.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-bold text-ink-900">2. Charakter projektu</h2>
          <p className="mt-2">
            Web „Za Pláž" je nezávislý občiansky informačný
            projekt. Nie je oficiálnym webom prevádzkovateľa plážového kúpaliska
            ani Mesta Banská Bystrica a nevytvára dojem spojenia s nimi.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-bold text-ink-900">3. Charakter obsahu</h2>
          <p className="mt-2">
            Obsah predstavuje informačné spracovanie verejne dostupných dokumentov.
            Odlišujeme fakty, citácie, právne výklady a názory. Obsah nenahrádza
            individuálne právne poradenstvo. Nepublikujeme nepodložené obvinenia
            z trestnej činnosti, korupcie ani úmyselného konania.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-bold text-ink-900">4. Autorské práva a citácie</h2>
          <p className="mt-2">
            Pri citáciách uvádzame zdroj a odkaz a používame len primerane krátke
            úryvky. Práva k pôvodným dielam zostávajú ich autorom. Ak sa domnievate,
            že bol porušený váš obsah alebo práva, použite formulár{" "}
            <a href="/nahlasit" className="underline text-brand-700">Nahlásiť chybu / obsah</a>.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-bold text-ink-900">5. Obsah od verejnosti</h2>
          <p className="mt-2">
            Príspevky, fotografie a tipy od verejnosti podliehajú moderovaniu.
            Odoslaním fotografie potvrdzujete autorstvo alebo oprávnenie, súhlas so
            zverejnením a ohľad na súkromie iných osôb. Vyhradzujeme si právo obsah
            nezverejniť alebo odstrániť.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-bold text-ink-900">6. Zodpovednosť</h2>
          <p className="mt-2">
            Snažíme sa o presnosť, no za úplnosť a bezchybnosť obsahu neručíme.
            Chyby po nahlásení opravujeme a označujeme vykonanú zmenu.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-bold text-ink-900">7. Zmeny podmienok</h2>
          <p className="mt-2">
            Podmienky môžeme aktualizovať. Aktuálne znenie je vždy dostupné na tejto
            stránke.
          </p>
        </div>
      </div>
    </Section>
  );
}
