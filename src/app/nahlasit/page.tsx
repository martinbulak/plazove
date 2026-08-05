import type { Metadata } from "next";
import { Section, SectionHeading, Card } from "@/components/ui";
import { getSite } from "@/lib/content";

export const metadata: Metadata = {
  title: "Nahlásiť chybu alebo obsah",
  description:
    "Nahláste chybu, požiadajte o opravu, reakciu alebo o odstránenie citovaného obsahu. Nezávislý projekt o plážovom kúpalisku v Banskej Bystrici.",
};

export const revalidate = 60;

export default async function ReportPage() {
  const site = await getSite();
  const mail = (
    <a
      href={`mailto:${site.contactEmail}`}
      className="font-semibold text-brand-700 underline"
    >
      {site.contactEmail}
    </a>
  );

  return (
    <Section className="max-w-2xl">
      <SectionHeading
        as="h1"
        eyebrow="Nahlásiť"
        title="Nahlásiť chybu, porušenie práv alebo žiadosť o odstránenie"
        intro="Záleží nám na presnosti. Ak ste našli nepresnosť, chcete uplatniť právo na opravu alebo reakciu, alebo požiadať o odstránenie citovaného obsahu, napíšte nám e-mail."
      />

      <Card className="bg-brand-50">
        <p className="text-lg text-ink-900">
          Píšte na {mail}
        </p>
        <p className="mt-2 text-sm leading-relaxed text-ink-600">
          Web nemá kontaktný formulár – zámerne nezbiera žiadne osobné údaje.
          E-mail spracujeme a odpovieme naň; vašu adresu nepoužijeme na nič iné
          a nikam ju neposielame.
        </p>
      </Card>

      <div className="mt-6 space-y-4 text-sm leading-relaxed text-ink-600">
        <p>
          <strong className="text-ink-900">Nepresnosť v obsahu:</strong> uveďte,
          prosím, o ktorú stránku a tvrdenie ide, a v čom je chyba. Ak máte
          zdroj, ktorý to dokladá, priložte ho. Opravu vykonáme a zmenu
          označíme.
        </p>
        <p>
          <strong className="text-ink-900">
            Žiadosť o odstránenie citovaného obsahu:
          </strong>{" "}
          ak ste autorom verejného príspevku, hodnotenia alebo fotografie
          citovanej na tomto webe a želáte si jej odstránenie, napíšte nám
          s odkazom na pôvodný zdroj. Po overení obsah odstránime.
        </p>
        <p>
          <strong className="text-ink-900">Právo na stanovisko:</strong> dotknuté
          strany vrátane prevádzkovateľa kúpaliska a Mesta Banská Bystrica majú
          možnosť zaslať vyjadrenie, ktoré po overení zverejníme pri súvisiacom
          obsahu.
        </p>
        <p>
          <strong className="text-ink-900">Materiály pre web:</strong> ak máte
          fotografiu areálu alebo dokument, ktorý by tu mal byť, pošlite ho ako
          prílohu. Pri fotografiách potrebujeme vedieť, že ste ich autorom alebo
          máte súhlas na zverejnenie.
        </p>
      </div>
    </Section>
  );
}
