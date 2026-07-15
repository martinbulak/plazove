import type { Metadata } from "next";
import Link from "next/link";
import { Section, SectionHeading, Card, PlaceholderBadge, PlaceholderNotice } from "@/components/ui";
import { getOpinions, onlyPublished } from "@/lib/content";
import { formatDateSk } from "@/lib/utils";
import type { OpinionPlatform, OpinionSentiment } from "@/lib/types";

export const metadata: Metadata = {
  title: "Názory verejnosti",
  description:
    "Verejne publikované skúsenosti a hodnotenia návštevníkov plážového kúpaliska v Banskej Bystrici zo sociálnych sietí a recenzných platforiem. Nezávislý informačný projekt – ide o názory konkrétnych osôb.",
};

const PLATFORM_LABEL: Record<OpinionPlatform, string> = {
  facebook: "Facebook",
  google: "Google recenzie",
  instagram: "Instagram",
  x: "X (Twitter)",
  tripadvisor: "TripAdvisor",
  iny: "Iná platforma",
};

const SENTIMENT: Record<OpinionSentiment, { label: string; cls: string }> = {
  negative: { label: "Kritický", cls: "bg-rose-50 text-rose-800 ring-rose-200" },
  neutral: { label: "Neutrálny", cls: "bg-ink-100 text-ink-700 ring-ink-300" },
  positive: { label: "Pozitívny", cls: "bg-emerald-50 text-emerald-800 ring-emerald-200" },
};

// ISR: obsah sa obnovuje z KV (ak je nastavené) každých 60 s.
export const revalidate = 60;

export default async function OpinionsPage() {
  const items = onlyPublished(await getOpinions()).filter((o) => o.approved);

  return (
    <Section>
      <SectionHeading
        as="h1"
        eyebrow="Názory verejnosti"
        title="Verejne publikované skúsenosti"
        intro="Táto sekcia nezhromažďuje anonymné recenzie vytvorené na tomto webe. Ide o verejne publikované príspevky zo sociálnych sietí a recenzných platforiem, ktoré administrátor manuálne schválil. Každý príspevok je názorom konkrétnej osoby, nie tvrdením prevádzkovateľa webu."
      />

      <div className="mb-6 space-y-3">
        <PlaceholderNotice>
          Nižšie uvedené príspevky sú vzorové ukážky. Skutočné príspevky treba
          pridať manuálne cez administráciu vrátane odkazu na originál.
        </PlaceholderNotice>
        <div className="rounded-lg border border-ink-200 bg-ink-50 px-4 py-3 text-sm text-ink-600">
          Web nepredstiera reprezentatívny prieskum verejnej mienky. Pre
          transparentnosť sa môžu zobraziť aj neutrálne alebo pozitívne názory.
          Ak ste autorom citovaného príspevku a želáte si jeho odstránenie,{" "}
          <Link href="/nahlasit" className="font-semibold underline">
            napíšte nám
          </Link>
          .
        </div>
      </div>

      <ul className="grid gap-4 sm:grid-cols-2">
        {items.map((o) => (
          <li key={o.id}>
            <Card className="flex h-full flex-col">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="rounded bg-brand-50 px-2 py-0.5 font-medium text-brand-700 ring-1 ring-brand-200">
                  {PLATFORM_LABEL[o.platform]}
                </span>
                <span className={`rounded-full px-2 py-0.5 font-medium ring-1 ring-inset ${SENTIMENT[o.sentiment].cls}`}>
                  {SENTIMENT[o.sentiment].label}
                </span>
                {o.isPlaceholder && <PlaceholderBadge />}
              </div>

              <blockquote className="mt-3 flex-1 border-l-2 border-ink-200 pl-3 text-ink-800">
                „{o.excerpt}"
              </blockquote>

              <div className="mt-3 text-sm text-ink-600">
                <span className="font-medium">{o.profileName}</span>
                {o.postedAt && <span> · {formatDateSk(o.postedAt)}</span>}
              </div>
              <div className="mt-1 flex flex-wrap gap-x-4 text-xs text-ink-400">
                {o.archivedAt && <span>Archivované: {formatDateSk(o.archivedAt)}</span>}
                {o.originalUrl ? (
                  <a
                    href={o.originalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-brand-700 underline"
                  >
                    Pôvodný príspevok →
                  </a>
                ) : (
                  <span className="italic">Odkaz na originál nedoplnený</span>
                )}
              </div>
            </Card>
          </li>
        ))}
      </ul>
    </Section>
  );
}
