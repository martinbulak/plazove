import Link from "next/link";
import { Button } from "@/components/ui";
import type { SiteConfig } from "@/lib/types";

export function Hero({ site }: { site: SiteConfig }) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-brand-50 to-white">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-64 opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(60rem 20rem at 50% -8rem, var(--color-brand-200), transparent)",
        }}
      />
      <div className="relative mx-auto max-w-5xl px-4 py-14 sm:px-6 sm:py-20">
        <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-700 ring-1 ring-brand-200">
          <span aria-hidden>●</span> {site.tagline}
        </p>

        <h1 className="text-balance text-4xl font-extrabold tracking-tight text-ink-900 sm:text-5xl">
          {site.heroTitle}
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-600 sm:text-xl">
          {site.heroSubtitle}
        </p>

        {/* Upozornenie o nezávislosti */}
        <div
          role="note"
          className="mt-6 max-w-2xl rounded-lg border-l-4 border-accent-500 bg-white px-4 py-3 text-sm leading-relaxed text-ink-700 shadow-sm ring-1 ring-ink-100"
        >
          {site.disclaimer}
        </div>

        {/* CTA – jedna hlavná cesta, dve vedľajšie */}
        <div className="mt-8 flex flex-wrap gap-3">
          <Button href="/pripad" variant="primary">
            Čo sa stalo →
          </Button>
          <Button href="/aktualny-stav" variant="outline">
            Aktuálny stav
          </Button>
          <Button href="/podporte" variant="accent">
            Podporiť výzvu
          </Button>
        </div>

        {/* Kľúčové fakty – jednoducho, bez odbornej terminológie */}
        {site.heroFacts.length > 0 && (
          <dl className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {site.heroFacts.map((f, i) => (
              <div
                key={i}
                className="rounded-[var(--radius-card)] border border-ink-200 bg-white p-4 shadow-sm"
              >
                <dd className="text-2xl font-bold text-brand-700">{f.value}</dd>
                <dt className="mt-1 text-sm leading-snug text-ink-600">{f.label}</dt>
              </div>
            ))}
          </dl>
        )}

        <p className="mt-5 text-xs text-ink-400">
          Každé tvrdenie na webe má uvedený zdroj – presné znenia a dokumenty
          nájdete v sekcii{" "}
          <Link href="/zmluva" className="underline">
            Zmluva a dokumenty
          </Link>
          .
        </p>
      </div>
    </section>
  );
}
