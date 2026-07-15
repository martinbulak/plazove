import type { Metadata } from "next";
import { Section, SectionHeading } from "@/components/ui";

export const metadata: Metadata = {
  title: "Ochrana osobných údajov",
  description:
    "Zásady ochrany osobných údajov projektu Aqualand BB – verejná kontrola. Aké údaje spracúvame pri výzve, newsletteri a podaniach a aké máte práva.",
};

export default function PrivacyPage() {
  return (
    <Section className="max-w-3xl">
      <SectionHeading as="h1" eyebrow="Právne informácie" title="Ochrana osobných údajov" />

      <div className="prose-sk space-y-5 text-ink-700">
        <p className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
          <strong>Vzorový text.</strong> Toto je vzorové znenie zásad. Pred
          spustením ho dajte skontrolovať a doplňte skutočné identifikačné údaje
          prevádzkovateľa a prípadného zodpovedného subjektu.
        </p>

        <div>
          <h2 className="text-xl font-bold text-ink-900">1. Prevádzkovateľ</h2>
          <p className="mt-2">
            Prevádzkovateľom osobných údajov je občiansky informačný projekt
            „Aqualand BB – verejná kontrola" (ďalej „prevádzkovateľ"). Kontakt:
            kontakt@aqualandbb.sk. (Doplňte presné identifikačné údaje.)
          </p>
        </div>

        <div>
          <h2 className="text-xl font-bold text-ink-900">2. Aké údaje spracúvame</h2>
          <ul className="mt-2 list-disc space-y-1.5 pl-6">
            <li>
              <strong>Verejná výzva:</strong> meno, priezvisko, mesto, e-mail a
              vaše voľby (verejné zobrazenie mena a mesta, súhlas).
            </li>
            <li>
              <strong>Newsletter:</strong> e-mailová adresa.
            </li>
            <li>
              <strong>Podania (tip, fotografia, nahlásenie):</strong> nepovinné
              meno a e-mail, obsah správy a prípadné prílohy/odkazy.
            </li>
            <li>
              <strong>Technické údaje:</strong> nevyhnutné technické logy servera.
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-bold text-ink-900">3. Účel a právny základ</h2>
          <p className="mt-2">
            Údaje spracúvame na základe vášho súhlasu (čl. 6 ods. 1 písm. a GDPR)
            na účel evidencie podpisov výzvy, zasielania noviniek a spracovania
            podaní. Verejne zobrazujeme nanajvýš meno a mesto, a to len s vaším
            výslovným súhlasom. E-mail nezverejňujeme.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-bold text-ink-900">4. Doba uchovávania</h2>
          <p className="mt-2">
            Údaje uchovávame po dobu trvania účelu, resp. do odvolania súhlasu.
            (Doplňte konkrétne lehoty.)
          </p>
        </div>

        <div>
          <h2 className="text-xl font-bold text-ink-900">5. Vaše práva</h2>
          <p className="mt-2">
            Máte právo na prístup, opravu, vymazanie, obmedzenie spracúvania,
            prenosnosť údajov a právo namietať. Súhlas môžete kedykoľvek odvolať.
            Máte tiež právo podať sťažnosť dozornému orgánu (Úrad na ochranu
            osobných údajov SR). Žiadosti posielajte na kontakt@aqualandbb.sk.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-bold text-ink-900">6. Príjemcovia a spracovatelia</h2>
          <p className="mt-2">
            Na doručovanie e-mailov môžeme využívať poskytovateľa e-mailovej
            služby. Na hosting využívame poskytovateľa serverovej infraštruktúry.
            (Doplňte konkrétnych spracovateľov.)
          </p>
        </div>
      </div>
    </Section>
  );
}
