import type { Metadata } from "next";
import { Section, SectionHeading } from "@/components/ui";

export const metadata: Metadata = {
  title: "Zásady používania cookies",
  description:
    "Ako projekt Aqualand BB – verejná kontrola používa cookies. Nevyhnutné technické cookies vs. analytické/marketingové cookies so súhlasom.",
};

export default function CookiesPage() {
  return (
    <Section className="max-w-3xl">
      <SectionHeading as="h1" eyebrow="Právne informácie" title="Zásady používania cookies" />

      <div className="prose-sk space-y-5 text-ink-700">
        <p>
          Cookies sú malé súbory, ktoré si stránka ukladá vo vašom prehliadači.
          Tento web sa snaží o minimalizmus a súkromie.
        </p>

        <div>
          <h2 className="text-xl font-bold text-ink-900">Nevyhnutné cookies</h2>
          <p className="mt-2">
            Používame len technicky nevyhnutné cookies potrebné na fungovanie webu
            (napr. bezpečnostné a session cookies v administrácii). Tie nevyžadujú
            súhlas.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-bold text-ink-900">Analytické a marketingové cookies</h2>
          <p className="mt-2">
            Analytické alebo marketingové cookies nespúšťame bez vášho súhlasu.
            Cookie banner sa zobrazuje výlučne pre tieto nepodstatné cookies. Kým
            nesúhlasíte, žiadne také cookies ani skripty tretích strán nenačítame.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-bold text-ink-900">Ako spravovať súhlas</h2>
          <p className="mt-2">
            Voľbu môžete zmeniť vymazaním údajov stránky vo vašom prehliadači –
            banner sa následne zobrazí znova. (Voľbu ukladáme lokálne vo vašom
            prehliadači, nie v cookie.)
          </p>
        </div>

        <p className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
          <strong>Poznámka:</strong> ak neskôr pridáte konkrétny analytický nástroj,
          doplňte sem jeho názov, účel a dobu platnosti cookies.
        </p>
      </div>
    </Section>
  );
}
