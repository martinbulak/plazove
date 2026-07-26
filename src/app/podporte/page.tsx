import type { Metadata } from "next";
import { Section, SectionHeading } from "@/components/ui";
import { PetitionForm, ShareButtons } from "@/components/forms";
import { getSite, getPublicSignatures } from "@/lib/content";
import { formatDateSk } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Podpíšte výzvu",
  description:
    "Podpíšte verejnú výzvu mestu Banská Bystrica, aby aktívne riešilo stav plážového kúpaliska. Môžete pripojiť aj vlastný odkaz. Nezávislý občiansky informačný projekt.",
};

/** Podpisy sa majú objaviť hneď po overení e-mailu, preto stránku necachujeme. */
export const dynamic = "force-dynamic";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://aqualandbb.sk";

export default async function SupportPage() {
  const [site, signatures] = await Promise.all([getSite(), getPublicSignatures()]);
  const withMessage = signatures.items.filter((s) => s.message);

  return (
    <>
      <Section className="max-w-3xl">
        <SectionHeading
          as="h1"
          eyebrow="Podporte zmenu"
          title="Podpíšte verejnú výzvu"
          intro="Plážové kúpalisko je majetok mesta. Čím viac ľudí dá najavo, že im na ňom záleží, tým ťažšie sa dá situácia prehliadať."
        />

        {/* Text výzvy */}
        <blockquote className="mb-8 border-l-4 border-brand-500 bg-white py-4 pl-5 pr-4 font-display text-lg leading-relaxed text-ink-800 shadow-sm ring-1 ring-ink-100">
          {site.petitionText}
        </blockquote>

        {/* Počítadlo */}
        <div className="mb-8 flex flex-wrap items-baseline gap-x-3 gap-y-1 border-y-2 border-ink-900 py-4">
          <span className="display text-4xl text-ink-900">{signatures.total}</span>
          <span className="text-sm font-medium text-ink-700">
            {signatures.total === 1 ? "potvrdený podpis" : "potvrdených podpisov"}
          </span>
          {withMessage.length > 0 && (
            <span className="text-sm text-ink-500">
              · {withMessage.length}{" "}
              {withMessage.length === 1 ? "odkaz" : "odkazov"} od podpisujúcich
            </span>
          )}
        </div>

        {/* Formulár */}
        <div className="rounded-xl border border-ink-200 bg-white p-5 shadow-sm sm:p-6">
          <PetitionForm />
        </div>

        <div className="mt-4 rounded-lg border border-ink-200 bg-ink-50 p-4 text-xs leading-relaxed text-ink-600">
          <strong>Ako to funguje:</strong> po odoslaní vám príde overovací e-mail.
          Kliknutím naň sa podpis započíta a váš odkaz sa <strong>ihneď zobrazí</strong>{" "}
          nižšie na tejto stránke. E-mailovú adresu nezverejňujeme a neposielame ju
          tretím stranám. Podpis aj odkaz môžete kedykoľvek nechať odstrániť –
          napíšte nám na{" "}
          <a href={`mailto:${site.contactEmail}`} className="underline">
            {site.contactEmail}
          </a>
          .
        </div>
      </Section>

      {/* Zoznam podpisov a odkazov */}
      <div className="border-t border-ink-200 bg-white">
        <Section id="podpisy" className="max-w-3xl scroll-mt-24">
          <SectionHeading
            eyebrow="Kto už podpísal"
            title="Odkazy podpisujúcich"
            intro="Zobrazujeme len podpisy s overeným e-mailom, a to v rozsahu, ktorý si každý zvolil. E-mail nezverejňujeme."
          />

          {signatures.items.length === 0 ? (
            <p className="rounded-lg border border-dashed border-ink-300 p-8 text-center text-sm text-ink-500">
              Zatiaľ tu nie je žiadny zverejnený podpis. Buďte prvý.
            </p>
          ) : (
            <ul className="space-y-3">
              {signatures.items.map((s) => (
                <li
                  key={s.id}
                  className="rounded-xl border border-ink-200 bg-paper p-4 sm:p-5"
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                    <p className="font-semibold text-ink-900">
                      {s.name}
                      <span className="font-normal text-ink-500">, {s.city}</span>
                    </p>
                    {s.confirmedAt && (
                      <time className="text-xs text-ink-400">
                        {formatDateSk(s.confirmedAt.slice(0, 10))}
                      </time>
                    )}
                  </div>
                  {s.message && (
                    <p className="mt-2 border-l-2 border-brand-200 pl-3 font-display text-[0.95rem] italic leading-relaxed text-ink-700">
                      „{s.message}"
                    </p>
                  )}
                </li>
              ))}
            </ul>
          )}

          <p className="mt-6 text-xs leading-relaxed text-ink-500">
            Odkazy sú názormi konkrétnych podpisujúcich, nie tvrdeniami
            prevádzkovateľa tohto webu. Vyhradzujeme si právo odstrániť odkaz,
            ktorý porušuje zákon, uráža konkrétne osoby alebo nesúvisí s témou.
          </p>
        </Section>
      </div>

      {/* Zdieľanie */}
      <div className="border-t border-ink-200">
        <Section className="max-w-3xl text-center">
          <h2 className="display text-2xl text-ink-900">Pomôžte výzvu rozšíriť</h2>
          <p className="mx-auto mt-2 max-w-lg text-sm leading-relaxed text-ink-600">
            Najúčinnejšia podpora je, keď sa o probléme dozvie viac ľudí.
          </p>
          <div className="mt-5 flex justify-center">
            <ShareButtons url={SITE_URL} title="Aqualand BB – verejná kontrola" />
          </div>
        </Section>
      </div>
    </>
  );
}
