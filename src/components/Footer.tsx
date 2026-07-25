import Link from "next/link";
import { LEGAL_NAV, MAIN_NAV } from "@/lib/nav";
import { getSite } from "@/lib/content";

export async function Footer() {
  const site = await getSite();
  return (
    <footer className="border-t border-ink-200 bg-ink-900 text-ink-300">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <p className="display text-xl text-white">{site.siteName}</p>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-ink-400">
              {site.disclaimer}
            </p>
            <p className="mt-4 text-sm text-ink-400">
              Kontakt:{" "}
              <a
                href={`mailto:${site.contactEmail}`}
                className="font-medium text-brand-200 underline underline-offset-2 hover:text-white"
              >
                {site.contactEmail}
              </a>
            </p>
          </div>

          <nav aria-label="Sekcie">
            <p className="eyebrow mb-4 text-ink-500">Sekcie</p>
            <ul className="space-y-1.5 text-sm">
              {MAIN_NAV.map((i) => (
                <li key={i.href}>
                  <Link href={i.href} className="text-ink-300 hover:text-white">
                    {i.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Právne informácie">
            <p className="eyebrow mb-4 text-ink-500">Právne informácie</p>
            <ul className="space-y-1.5 text-sm">
              {LEGAL_NAV.map((i) => (
                <li key={i.href}>
                  <Link href={i.href} className="text-ink-300 hover:text-white">
                    {i.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/admin" className="text-ink-500 hover:text-white">
                  Administrácia
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        <div className="mt-12 border-t border-white/10 pt-6 text-xs leading-relaxed text-ink-500">
          <p>
            © {new Date().getFullYear()} {site.operator}. Nezávislý občiansky
            informačný projekt. Web nie je oficiálnym webom prevádzkovateľa
            plážového kúpaliska ani Mesta Banská Bystrica.
          </p>
          <p className="mt-2">
            Obsah predstavuje informačné spracovanie verejne dostupných dokumentov
            a nenahrádza individuálne právne poradenstvo. Fakty sú odlíšené od
            citácií, právnych výkladov a názorov.
          </p>
        </div>
      </div>
    </footer>
  );
}
