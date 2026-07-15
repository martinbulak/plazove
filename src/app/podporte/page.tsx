import type { Metadata } from "next";
import { Section, SectionHeading, Card } from "@/components/ui";
import {
  PetitionForm,
  NewsletterForm,
  SubmissionForm,
  ShareButtons,
} from "@/components/forms";
import { getSite } from "@/lib/content";

export const metadata: Metadata = {
  title: "Podporte zmenu",
  description:
    "Podpíšte verejnú výzvu mestu Banská Bystrica, prihláste sa na odber noviniek, pošlite fotografiu alebo dokument. Nezávislý občiansky informačný projekt o plážovom kúpalisku.",
};

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://aqualandbb.sk";

export default async function SupportPage() {
  const site = await getSite();

  return (
    <Section>
      <SectionHeading
        as="h1"
        eyebrow="Podporte zmenu"
        title="Ako sa môžete zapojiť"
        intro="Ide o verejný majetok – čím viac ľudí prejaví záujem, tým väčší je tlak na transparentné riešenie. Vyberte si, ako chcete pomôcť."
      />

      {/* Verejná výzva */}
      <Card id="vyzva" className="mb-8 scroll-mt-24">
        <h2 className="text-xl font-bold text-ink-900">Podpísať verejnú výzvu</h2>
        <p className="mt-2 text-sm text-ink-600">
          Toto je <strong>verejná výzva</strong>, nie formálna elektronická
          petícia podľa zákona. Formálnu petíciu s presnými právnymi a
          identifikačnými náležitosťami spustíme neskôr.
        </p>

        <blockquote className="mt-4 rounded-lg border-l-4 border-brand-400 bg-brand-50 p-4 text-sm leading-relaxed text-ink-800">
          {site.petitionText}
        </blockquote>

        <div className="mt-6">
          <PetitionForm />
        </div>
      </Card>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Newsletter */}
        <Card id="newsletter" className="scroll-mt-24">
          <h2 className="text-lg font-bold text-ink-900">Odoberať novinky</h2>
          <p className="mt-1 mb-4 text-sm text-ink-600">
            Pošleme vám e-mail, keď pribudne dôležitý dokument alebo krok mesta.
          </p>
          <NewsletterForm />
        </Card>

        {/* Zdieľať */}
        <Card id="zdielat" className="scroll-mt-24">
          <h2 className="text-lg font-bold text-ink-900">Zdieľať web</h2>
          <p className="mt-1 mb-4 text-sm text-ink-600">
            Najúčinnejšia podpora je, keď sa o probléme dozvie viac ľudí.
          </p>
          <ShareButtons url={SITE_URL} title="Aqualand BB – verejná kontrola" />
        </Card>

        {/* Poslať fotografiu */}
        <Card id="poslat-fotografiu" className="scroll-mt-24">
          <h2 className="text-lg font-bold text-ink-900">Poslať fotografiu</h2>
          <p className="mt-1 mb-4 text-sm text-ink-600">
            Máte vlastný záber areálu? Pošlite nám ho – po schválení ho môžeme
            zaradiť do galérie.
          </p>
          <SubmissionForm type="photo" submitLabel="Odoslať fotografiu" />
        </Card>

        {/* Poslať dokument / tip */}
        <Card id="poslat-tip" className="scroll-mt-24">
          <h2 className="text-lg font-bold text-ink-900">Poslať dokument alebo tip</h2>
          <p className="mt-1 mb-4 text-sm text-ink-600">
            Máte dokument, odkaz alebo informáciu, ktorá by nemala chýbať? Dajte
            nám vedieť.
          </p>
          <SubmissionForm type="tip" submitLabel="Odoslať tip" />
        </Card>
      </div>

      <div className="mt-8 rounded-lg border border-ink-200 bg-ink-50 p-4 text-xs leading-relaxed text-ink-500">
        Osobné údaje z výzvy a formulárov spracúvame v súlade so{" "}
        <a href="/ochrana-osobnych-udajov" className="underline">
          zásadami ochrany osobných údajov
        </a>
        . E-mail slúži na overenie a komunikáciu; verejne zobrazujeme nanajvýš
        meno a mesto, a to len s výslovným súhlasom.
      </div>
    </Section>
  );
}
