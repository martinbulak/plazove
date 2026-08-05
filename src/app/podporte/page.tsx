import type { Metadata } from "next";
import Link from "next/link";
import { Section, SectionHeading, Card } from "@/components/ui";
import { ShareButtons } from "@/components/forms";
import { getSite } from "@/lib/content";

export const metadata: Metadata = {
  title: "Podporte zmenu",
  description:
    "Verejná výzva mestu Banská Bystrica, aby aktívne riešilo stav plážového kúpaliska. Ako ju môžete podporiť a komu napísať. Nezávislý občiansky projekt.",
};

// ISR: obsah sa obnovuje z KV (ak je nastavené) každých 60 s.
export const revalidate = 60;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://zaplaz.sk";

export default async function SupportPage() {
  const site = await getSite();

  return (
    <>
      <Section className="max-w-3xl">
        <SectionHeading
          as="h1"
          eyebrow="Podporte zmenu"
          title="Verejná výzva mestu"
          intro="Plážové kúpalisko je majetok mesta. Čím viac ľudí dá najavo, že im na ňom záleží, tým ťažšie sa dá situácia prehliadať."
        />

        <blockquote className="border-l-4 border-brand-500 bg-white py-4 pl-5 pr-4 font-display text-lg leading-relaxed text-ink-800 shadow-sm ring-1 ring-ink-100">
          {site.petitionText}
        </blockquote>

        <div className="mt-6 rounded-lg border border-ink-200 bg-ink-50 p-4 text-sm leading-relaxed text-ink-600">
          <strong>Prečo tu nie je podpisový formulár:</strong> tento web zámerne
          nezbiera žiadne osobné údaje – nemá formuláre, cookies ani sledovanie.
          Výzvu preto môžete podporiť priamo u mesta a tým, že sa o probléme
          dozvie viac ľudí.
        </div>
      </Section>

      <div className="border-t border-ink-200 bg-white">
        <Section className="max-w-3xl">
          <SectionHeading
            eyebrow="Ako pomôcť"
            title="Tri veci, ktoré má zmysel urobiť"
          />

          <ol className="space-y-4">
            <li>
              <Card>
                <div className="flex gap-4">
                  <span aria-hidden className="section-number text-2xl text-brand-400">
                    01
                  </span>
                  <div>
                    <h3 className="font-semibold text-ink-900">Napíšte mestu</h3>
                    <p className="mt-1 text-sm leading-relaxed text-ink-600">
                      Mesto zriadilo na podnety k plážovému kúpalisku samostatnú
                      adresu{" "}
                      <a
                        href="mailto:plazovekupalisko@banskabystrica.sk"
                        className="font-medium text-brand-700 underline"
                      >
                        plazovekupalisko@banskabystrica.sk
                      </a>
                      . Napíšte, čo vás v areáli trápi a čo od mesta očakávate.
                      Konkrétna skúsenosť váži viac než všeobecná sťažnosť.
                    </p>
                  </div>
                </div>
              </Card>
            </li>
            <li>
              <Card>
                <div className="flex gap-4">
                  <span aria-hidden className="section-number text-2xl text-brand-400">
                    02
                  </span>
                  <div>
                    <h3 className="font-semibold text-ink-900">
                      Oslovte svojho poslanca
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-ink-600">
                      Stav kúpaliska rieši pracovná skupina, v ktorej sú aj
                      predsedovia poslaneckých klubov. Kontakty na poslancov za
                      váš volebný obvod nájdete na{" "}
                      <a
                        href="https://www.banskabystrica.sk/samosprava/mestske-zastupitelstvo/poslanci/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-brand-700 underline"
                      >
                        webe mesta
                      </a>
                      .
                    </p>
                  </div>
                </div>
              </Card>
            </li>
            <li>
              <Card>
                <div className="flex gap-4">
                  <span aria-hidden className="section-number text-2xl text-brand-400">
                    03
                  </span>
                  <div>
                    <h3 className="font-semibold text-ink-900">
                      Pošlite tento web ďalej
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-ink-600">
                      Najúčinnejšia podpora je, keď sa o probléme dozvie viac
                      ľudí. Všetky dokumenty a fakty sú tu na jednom mieste.
                    </p>
                    <div className="mt-4">
                      <ShareButtons url={SITE_URL} title="Za Pláž" />
                    </div>
                  </div>
                </div>
              </Card>
            </li>
          </ol>

          <p className="mt-8 text-sm leading-relaxed text-ink-600">
            Máte fotografiu areálu, dokument alebo upozornenie na nepresnosť?
            Napíšte nám na{" "}
            <a
              href={`mailto:${site.contactEmail}`}
              className="font-medium text-brand-700 underline"
            >
              {site.contactEmail}
            </a>{" "}
            – viac na stránke{" "}
            <Link href="/nahlasit" className="font-medium text-brand-700 underline">
              Nahlásiť chybu / obsah
            </Link>
            .
          </p>
        </Section>
      </div>
    </>
  );
}
