import type { Metadata } from "next";
import Link from "next/link";
import { Section, SectionHeading, Card } from "@/components/ui";
import { ShareButtons } from "@/components/forms";
import { CopyMessage } from "@/components/CopyMessage";
import { getSite } from "@/lib/content";

export const metadata: Metadata = {
  title: "Napíšte mestu",
  description:
    "Mesto Banská Bystrica zriadilo na podnety k plážovému kúpalisku adresu plazovekupalisko@banskabystrica.sk. Pripravili sme text, ktorý stačí skopírovať a odoslať.",
};

// ISR: obsah sa obnovuje z KV (ak je nastavené) každých 60 s.
export const revalidate = 60;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://zaplaz.sk";
const CITY_MAIL = "plazovekupalisko@banskabystrica.sk";
const SUBJECT = "Podnet k stavu plážového kúpaliska";

export default async function SupportPage() {
  const site = await getSite();

  return (
    <>
      <Section className="max-w-3xl">
        <SectionHeading
          as="h1"
          eyebrow="Ako pomôcť"
          title="Napíšte mestu"
          intro="Plážové kúpalisko je majetok mesta. Mesto na podnety k nemu zriadilo samostatnú adresu – čím viac ľudí na ňu napíše, tým ťažšie sa dá situácia prehliadať. Text sme pripravili, stačí ho skopírovať a odoslať."
        />

        <CopyMessage text={site.petitionText} to={CITY_MAIL} subject={SUBJECT} />

        <div className="mt-4 rounded-lg border border-ink-200 bg-ink-50 p-4 text-sm leading-relaxed text-ink-600">
          <strong>Text si pokojne upravte.</strong> Vlastná skúsenosť váži viac
          než preposlaná šablóna – ak ste na kúpalisku boli a niečo vás tam
          zarazilo, napíšte to vlastnými slovami. Nezabudnite sa podpísať;
          na anonymné podnety úrad odpovedať nemusí.
        </div>

        <div className="mt-3 text-sm leading-relaxed text-ink-500">
          Tento web nič nezbiera ani neodosiela – e-mail píšete priamo mestu zo
          svojej schránky a my sa o ňom nedozvieme.
        </div>
      </Section>

      <div className="border-t border-ink-200 bg-white">
        <Section className="max-w-3xl">
          <SectionHeading
            eyebrow="Ďalšie dve možnosti"
            title="Čo ešte má zmysel urobiť"
          />

          <ol className="space-y-4">
            <li>
              <Card>
                <div className="flex gap-4">
                  <span aria-hidden className="section-number text-2xl text-brand-400">
                    01
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
                      . Poslanec sa môže na stav areálu opýtať priamo na
                      zastupiteľstve.
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
