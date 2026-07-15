import Link from "next/link";
import { Section } from "@/components/ui";

export default function NotFound() {
  return (
    <Section className="max-w-xl text-center">
      <p className="text-sm font-semibold uppercase tracking-wide text-brand-600">Chyba 404</p>
      <h1 className="mt-2 text-3xl font-bold text-ink-900">Stránka sa nenašla</h1>
      <p className="mt-3 text-ink-600">
        Požadovaná stránka neexistuje alebo bola presunutá.
      </p>
      <div className="mt-6 flex justify-center gap-3">
        <Link href="/" className="rounded-lg bg-brand-700 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-800">
          Domov
        </Link>
        <Link href="/dokumenty" className="rounded-lg border border-ink-300 px-4 py-2 text-sm font-semibold text-ink-700 hover:bg-ink-50">
          Dokumenty
        </Link>
      </div>
    </Section>
  );
}
