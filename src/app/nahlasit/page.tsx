import type { Metadata } from "next";
import { Section, SectionHeading, Card } from "@/components/ui";
import { SubmissionForm } from "@/components/forms";

export const metadata: Metadata = {
  title: "Nahlásiť chybu alebo obsah",
  description:
    "Nahláste chybu, požiadajte o opravu, reakciu alebo o odstránenie citovaného obsahu. Nezávislý informačný projekt o plážovom kúpalisku v Banskej Bystrici.",
};

export default function ReportPage() {
  return (
    <Section className="max-w-2xl">
      <SectionHeading
        as="h1"
        eyebrow="Nahlásiť"
        title="Nahlásiť chybu, porušenie práv alebo žiadosť o odstránenie"
        intro="Záleží nám na presnosti. Ak ste našli nepresnosť, chcete uplatniť právo na opravu/reakciu alebo požiadať o odstránenie citovaného príspevku, napíšte nám. Podanie posúdi administrátor."
      />

      <Card>
        <SubmissionForm type="correction" submitLabel="Odoslať nahlásenie" />
      </Card>

      <div className="mt-6 space-y-3 text-sm text-ink-600">
        <p>
          <strong>Žiadosť o odstránenie citovaného príspevku:</strong> ak ste
          autorom verejného príspevku citovaného v sekcii „Názory verejnosti" a
          želáte si jeho odstránenie, uveďte to v správe spolu s odkazom na
          príspevok. Po overení ho odstránime.
        </p>
        <p>
          <strong>Právo na opravu a reakciu:</strong> dotknuté strany vrátane
          prevádzkovateľa kúpaliska a mesta majú možnosť zaslať stanovisko, ktoré
          po overení zverejníme pri súvisiacom obsahu.
        </p>
      </div>
    </Section>
  );
}
